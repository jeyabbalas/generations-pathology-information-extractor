import {OpenAI} from 'https://cdn.skypack.dev/openai@4.38.5?min';


const systemPromptPath = '/systemPrompt.txt';
const systemPrompt = await fetchTextFile(systemPromptPath);
const queriesPath = '/queries/';
const queryFiles = [
    'specimen.json', 'breastCancerType.json', 'dcisGrowthPattern.json', 'invasiveCarcinomaType.json', 'tumourSize.json',
    'grading.json', 'tnmStaging.json', 'icdo.json'
];
const queries = await fetchJsonFiles(queriesPath, queryFiles);
const prompts = queries.map((query) => convertQueryToPrompt(query));


async function fetchTextFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        return response.text();
    } catch (error) {
        console.error('Failed to fetch TXT file:', error);
    }
}


async function fetchJsonFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error('Failed to fetch JSON file:', error);
    }
}


async function fetchJsonFiles(directoryPath, fileNames) {
    return await Promise.all(fileNames.map((fileName) => fetchJsonFile(directoryPath + fileName)));
}


function convertQueryToPrompt(query) {
    const prompt = {}
    prompt.default = Object.keys(query.properties).reduce((a, c) => ({...a, [c]: null}), {});
    prompt.prompt = `
QUERY:

JSON keys: 

[${Object.keys(query.properties).join(', ')}]


JSON Schema:

\`\`\`json
${JSON.stringify(query, null, 4)}
\`\`\`
`;
    return prompt;
}


const manageOpenAIApiKey = {
    async validateApiKey(baseURL, apiKey) {
        try {
            const openai = new OpenAI({
                baseURL: baseURL,
                apiKey: apiKey,
                dangerouslyAllowBrowser: true
            });
            await openai.models.list();
            return true;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('Invalid API key:', error);
                return false;
            } else {
                console.error('Error checking API key:', error);
                return false;
            }
        }
    },

    setKey(apiKey) {
        localStorage.OPENAI_API_KEY = apiKey;
    },

    getKey() {
        return localStorage.OPENAI_API_KEY;
    },

    deleteKey() {
        delete localStorage.OPENAI_API_KEY;
    }
};

class InformationExtractor {
    constructor(openai, modelsList, temperature, seed) {
        this.openai = openai;
        this.modelsList = modelsList;
        this.model = '';
        this.temperature = temperature;
        this.seed = seed;
        this.systemPrompt = systemPrompt;
        this.prompts = prompts;
    }

    static async instantiate({baseURL, apiKey, seed = 1234}) {
        const openai = new OpenAI({
            baseURL: baseURL,
            apiKey: apiKey,
            dangerouslyAllowBrowser: true
        });
        const modelsList = (await openai.models.list()).data.map((d) => d.id).sort();
        const temperature = 0.0;

        return new InformationExtractor(openai, modelsList, temperature, seed);
    }

    getModel() {
        return this.model;
    }

    async setModel(modelName) {
        if (this.modelsList.includes(modelName)) {
            this.model = modelName;
        } else {
            console.error('Invalid model name:', modelName);
        }
    }

    getModelsList() {
        return this.modelsList;
    }

    async extractInformation(report) {
        const promises = this.prompts.map(prompt => this.extractInformationForPrompt(report, prompt));
        const results = await Promise.all(promises);

        let aggregatedResult = {};
        for (const result of results) {
            Object.assign(aggregatedResult, result);
        }
        return aggregatedResult;
    }

    async extractInformationForPrompt(report, prompt) {
        const regex = /```json\n([\s\S]*?)\n```/;
        let attempt = 0;
        let response;
        let message;
        let match;

        while (attempt < 3) {
            response = await this.openai.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: `${this.systemPrompt}\n\n\nBREAST CANCER PATHOLOGY REPORT:\n\n"""\n${report}"""\n\n`
                    },
                    { role: 'user', content: prompt.prompt }
                ],
                temperature: this.temperature,
                seed: this.seed + attempt
            });

            message = response.choices[0].message.content;
            match = message.match(regex);

            if (match) {
                return JSON.parse(match[1]);
            } else {
                attempt++;
            }
        }

        console.error('Failed to extract valid JSON after 3 attempts, object with all missing values.');
        return prompt.default;
    }
}


const jsonldContext = {
    "id": {
        "@id": "http://example.org/GenerationsStudy/subjects/",
        "@container": "@id"
    },
    "side": {
        "@id": "http://snomed.info/id/384727002",
        "@type": "@id",
        "@vocab": {
            "L": "http://snomed.info/id/7771000",
            "R": "http://snomed.info/id/24028007"
        }
    },
    "screenDetected": {
        "@id": "http://snomed.info/id/171176006",
        "@type": "@id",
        "@vocab": {
            "Y": "http://snomed.info/id/373066001",
            "N": "http://snomed.info/id/373067005"
        }
    },
    "specimenType": {
        "@id": "http://snomed.info/id/122548005",
        "@type": "@id",
        "@vocab": {
            "WBB": "http://snomed.info/id/9911007",
            "WLE": "http://snomed.info/id/237371007",
            "M": "http://snomed.info/id/1231734007",
            "NBO": "http://snomed.info/id/21911005",
            "OB": "http://snomed.info/id/736615002",
            "Re-ex": "http://snomed.info/id/65854006",
            "SE": "http://snomed.info/id/237370008",
            "TMP": "http://snomed.info/id/33496007",
            "FNA": "http://snomed.info/id/387736007",
            "LB": "http://snomed.info/id/122548005"
        }
    },
    "specimenWeight": "http://snomed.info/id/371506001",
    "axillaryProcedure": {
        "@id": "http://snomed.info/id/301796003",
        "@type": "@id",
        "@vocab": {
            "ANC": "http://snomed.info/id/79544006",
            "ANS": "http://snomed.info/id/178294003",
            "NLN": "http://snomed.info/id/416237000",
            "OSNA": "http://snomed.info/id/1285485007",
            "SNB": "http://snomed.info/id/396487001"
        }
    },
    "postNeoadjuvantChemo": {
        "@id": "http://snomed.info/id/1279827005",
        "@type": "@id",
        "@vocab": {
            "C": "http://snomed.info/id/1259200004",
            "E": "http://snomed.info/id/169413002"
        }
    },
    "cis": {
        "@id": "http://snomed.info/id/189336000",
        "@type": "@id",
        "@vocab": {
            "P": "http://snomed.info/id/52101004",
            "N": "http://snomed.info/id/2667000"
        }
    },
    "dcis": {
        "@id": "http://snomed.info/id/109889007",
        "@type": "@id",
        "@vocab": {
            "P": "http://snomed.info/id/52101004",
            "N": "http://snomed.info/id/2667000"
        }
    },
    "lcis": {
        "@id": "http://snomed.info/id/109888004",
        "@type": "@id",
        "@vocab": {
            "P": "http://snomed.info/id/52101004",
            "N": "http://snomed.info/id/2667000"
        }
    },
    "pleomorphicLCIS": {
        "@id": "http://snomed.info/id/762260000",
        "@type": "@id",
        "@vocab": {
            "P": "http://snomed.info/id/52101004",
            "N": "http://snomed.info/id/2667000"
        }
    },
    "pagetsDisease": {
        "@id": "http://snomed.info/id/2985005",
        "@type": "@id",
        "@vocab": {
            "P": "http://snomed.info/id/52101004",
            "N": "http://snomed.info/id/2667000"
        }
    },
    "microinvasion": {
        "@id": "http://snomed.info/id/443933007",
        "@type": "@id",
        "@vocab": {
            "P": "http://snomed.info/id/52101004",
            "N": "http://snomed.info/id/2667000"
        }
    },
    "invasiveCarcinoma": {
        "@id": "http://snomed.info/id/713609000",
        "@type": "@id",
        "@vocab": {
            "P": "http://snomed.info/id/52101004",
            "N": "http://snomed.info/id/2667000"
        }
    }
};


export {
    manageOpenAIApiKey, InformationExtractor, jsonldContext
};