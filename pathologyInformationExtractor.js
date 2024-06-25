import {OpenAI} from 'https://cdn.skypack.dev/openai@4.38.5?min';

const BASE_URL = '/generations-pathology-information-extractor';


const systemPromptPath = BASE_URL + '/systemPrompt.txt';
let systemPrompt;

const queriesPath = BASE_URL + '/queries/';
const queryFiles = [
    'specimen.json', 'excision.json', 'tumourSize.json', 'breastCancerType.json',
    'lymphNodes1.json', 'ihc1.json', 'ihc2.json', 'tnmStaging.json',
    'icdo.json'
];
let queries;
let prompts;

const jsonldContextPath = BASE_URL + '/jsonldContexts/';
const jsonldContextFiles = [
    'specimen.json', 'excision.json', 'tumourSize.json', 'breastCancerType.json',
    'lymphNodes1.json', 'ihc1.json', 'ihc2.json', 'tnmStaging.json',
    'icdo.json'
];
let jsonldContexts;
let jsonldContext;

async function setup() {
    systemPrompt = await fetchTextFile(systemPromptPath);
    queries = await fetchJsonFiles(queriesPath, queryFiles);
    prompts = queries.map((query) => convertQueryToPrompt(query));
    jsonldContexts = await fetchJsonFiles(jsonldContextPath, jsonldContextFiles);
    jsonldContext = mergeJsonLdContexts(jsonldContexts);
}

setup().catch(error => {
    console.error('Error reading the system prompt and schemas:', error);
});


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


function mergeJsonLdContexts(jsonldContexts) {
    return jsonldContexts.reduce((acc, current) => {
        const currentContext = current["@context"];
        for (let key in currentContext) {
            if (acc[key]) {
                continue;
            }
            acc[key] = currentContext[key];
        }
        return acc;
    }, {});
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
                    {role: 'user', content: prompt.prompt}
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


export {
    manageOpenAIApiKey, InformationExtractor, jsonldContext
};