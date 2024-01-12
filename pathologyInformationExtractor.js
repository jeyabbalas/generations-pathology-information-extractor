import { OpenAI } from 'https://cdn.skypack.dev/openai@4.24.3?min';


const manageOpenAIApiKey = {
    async checkValidity(apiKey) {
        const endpoint = 'https://api.openai.com/v1/engines';
        try {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            });

            return response.status === 200;
        } catch (error) {
            console.error('Error while checking API key validity:', error);
            return false;
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
    constructor(apiKey) {
        this.openai = new OpenAI({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true
        });
        this.model = 'gpt-3.5-turbo-1106';
        this.temperature = 0.0;
        this.seed = 1234;

        this.systemPrompt = `You are a helpful assistant with an expertise in breast cancer pathology. Your task is to extract structured information from the breast cancer pathology report, shown below delimited by triple quotes. You will eventually return a JSON only containing the keys listed by the user. The user will also provide a JSON, which is a metadata for each listed key, its data type, and the description of the information that you must extract from the pathology report below.

For each user request, work through the solution step-by-step, as follows—
1. For each key requested by the user, extract relevant snippets in the report that will help you determine the correct value to return in your JSON. Title this section in your response as: "RELEVANT INFORMATION:". Create one subheading for each key in the JSON. Under the key, list all the relevant snippets you extracted from the report to help you determine the correct value for the key. Only list snippets that you extracted from the report. Do not add any information on your own. If there was no relevant information for a key, just write "No relevant information in the report" under it.
2. Finally, return the JSON with the correct assigned value for each key. Title this section in your response as: "RESULT:". Then, return the JSON under this title.


BREAST CANCER PATHOLOGY REPORT:`;
        this.prompt = `JSON keys = ["Side", "ScreenDetected", "SpecimenType", "SpecimenWeight", "AxillaryProcedure", "PostNeoadjuvantChemo"]

{
\t"Side": {
\t\t"type": "enum",
\t\t"values": ["L", "R", "U"],
\t\t"description": "The side or laterality of the breast that the pathology report is referring to. Assign 'L' if left, 'R' if right, or 'U' if it is unknown or cannot be determined"
\t},
\t"ScreenDetected": {
\t\t"type": "enum",
\t\t"values": ["Y", "N", "NK", null],
\t\t"description": "Determine if the report mentions if the breast cancer was detected through screening. Assign 'Y': if the report clearly mentions the cancer detection method, and the method is screening. Assign 'N': if the report clearly mentions the cancer detection method, and the method is not screening. Assign 'NK': if the report specifically mentions that the method of detection is not known. Assign null: if there is no information in the report regarding the cancer detection method."
\t},
\t"SpecimenType": {
\t\t"type": "enum",
\t\t"values": ["WBB", "WLE", "M", "NBO", "OB", "Re-ex", "SE", "TMP", "FNA", "LB", null],
\t\t"description": "Identify the procedure used to obtain the tissue specimen. Assign 'WBB': if Wide Bore Needle Biopsy (Core Biopsy) was performed. Assign 'WLE': if Wide Local Excision was performed. Assign 'M': if Mastectomy was performed. Assign 'NBO': if only Node Biopsy was performed. Assign 'OB': if Open Biopsy was performed. Assign 'Re-ex': if re-excision was performed. Assign 'SE': if Segmental Excision was performed. Assign 'TMP': if Theraputic Mammoplasty was performed. Assign 'FNA': if Fine Needle Aspiration was performed. Assign 'LB': if Local Biopsy was performed. Assign null: if the information is missing or ambiguous."
\t},
\t"SpecimenWeight": {
\t\t"type": "float",
\t\t"description": "The weight (in grams) of the tissue specimen described in the report. If this information is missing in the report, assign null."
\t},
\t"AxillaryProcedure": {
\t\t"type": "enum",
\t\t"values": ["ANC", "ANS", "NLN", "OSNA", "SNB", null],
\t\t"description": "Identify the surgical procedure performed to either remove or sample the axillary lymph nodes, as mentioned in the report. Assign 'ANC': for Axillary Node Clearance, 'ANS': for Axillary Node Sample, 'NLN': if no Lymph node procedure was done, 'OSNA' if OSNA assessment was performed, 'SNB': for Sentinel Node Biopsy, null: if not applicable or if no information is present in the report."
\t},
\t"PostNeoadjuvantChemo": {
\t\t"type": "enum",
\t\t"values": ["C", "E", "PC", "PE", null],
\t\t"description": "If the report mentions that the patient received a type of neoadjuvant treatment prior to the specimen being taken, extract the type of treatment the patient received. Assign 'C': if the report explicitly mentions that the patient received chemotherapy. Assign 'E': if the report explicitly mentions that the patient received endocrine therapy. Assign 'PC': if the report suggests the patient may have received chemotherapy (e.g., mentions of drugs typically used in chemotherapy, but without clear confirmation). Assign 'PE': if the report suggests the patient may have received endocrine therapy (e.g., mentions of hormone receptor positivity or drugs typically used in endocrine therapy, but without clear confirmation). Assign null: if the report does not indicate any neoadjuvant therapy, or if the information is missing."
\t}
}`;
    }

    async extractInformation(report) {
        const response = await this.openai.chat.completions.create({
            model: this.model,
            messages: [
                {
                    role: 'system',
                    content: `${this.systemPrompt}\n\n\nBREAST CANCER PATHOLOGY REPORT:\n"""${report}"""`
                },
                { role: 'user', content: this.prompt }
            ],
            temperature: this.temperature,
            seed: this.seed
        });

        const regex = /```json\n([\s\S]*?)\n```/;
        const message = response.choices[0].message.content;

        return message.match(regex)?.[1] ? JSON.parse(message.match(regex)[1]) : {};
    }
}


const jsonlnContext = {
    "id": {
        "@id": "http://example.org/subjects/",
        "@container": "@id"
    },
    "Side": {
        "@id": "http://snomed.info/id/182353008",
        "@type": "@id",
        "@vocab": {
            "L": "http://snomed.info/id/7771000",
            "R": "http://snomed.info/id/24028007",
            "U": "http://snomed.info/id/261665006"
        }
    },
    "ScreenDetected": {
        "@id": "http://snomed.info/id/268547008",
        "@type": "@id",
        "@vocab": {
            "Y": "http://snomed.info/id/373066001",
            "N": "http://snomed.info/id/373067005",
            "NK": "http://snomed.info/id/373068000",
            "null": "http://snomed.info/id/276727009"
        }
    },
    "SpecimenType": {
        "@id": "http://snomed.info/id/122548005",
        "@type": "@id",
        "@vocab": {
            "WBB": "http://snomed.info/id/9911007",
            "WLE": "http://snomed.info/id/237371007",
            "M": "http://snomed.info/id/1231734007",
            "NBO": "http://snomed.info/id/116676008",
            "OB": "http://snomed.info/id/736615002",
            "Re-ex": "http://snomed.info/id/116676008",
            "SE": "http://snomed.info/id/237370008",
            "TMP": "http://snomed.info/id/33496007",
            "FNA": "http://snomed.info/id/387736007",
            "LB": "http://snomed.info/id/116676008",
            "null": "http://snomed.info/id/276727009"
        }
    },
    "SpecimenWeight": "http://snomed.info/id/371506001",
    "AxillaryProcedure": {
        "@id": "http://snomed.info/id/301796003",
        "@type": "@id",
        "@vocab": {
            "ANC": "http://snomed.info/id/79544006",
            "ANS": "http://snomed.info/id/178294003",
            "NLN": "http://snomed.info/id/416237000",
            "OSNA": "http://snomed.info/id/1285485007",
            "SNB": "http://snomed.info/id/396487001",
            "null": "http://snomed.info/id/276727009"
        }
    },
    "PostNeoadjuvantChemo": {
        "@id": "http://snomed.info/id/400001000004103",
        "@type": "@id",
        "@vocab": {
            "C": "http://snomed.info/id/1259200004",
            "E": "http://snomed.info/id/169413002",
            "PC": "http://snomed.info/id/1259200004",
            "PE": "http://snomed.info/id/169413002",
            "null": "http://snomed.info/id/276727009"
        }
    }
};


export {
    manageOpenAIApiKey, InformationExtractor, jsonlnContext
};