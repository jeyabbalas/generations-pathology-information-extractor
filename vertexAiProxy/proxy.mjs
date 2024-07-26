import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.VERTEXAI_PROXY_PORT || 3000;
const apiKey = process.env.VERTEXAI_API_KEY;

// Access-Control-Allow-Origin *
app.use(cors());
// Middleware to parse JSON request bodies
app.use(express.json());


// /chat/completions endpoint
app.post('/chat/completions', async (req, res) => {
    try {
        //const data = await response.json();
        const data = {
            "id": "chatcmpl-123",
            "object": "chat.completion",
            "created": 1677652288,
            "model": "gpt-4o-mini",
            "system_fingerprint": "fp_44709d6fcb",
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": "\n\nHello there, how may I assist you today?",
                },
                "logprobs": null,
                "finish_reason": "stop"
            }],
            "usage": {
                "prompt_tokens": 9,
                "completion_tokens": 12,
                "total_tokens": 21
            }
        };
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});


// Define the /models endpoint
app.get('/models', async (req, res) => {
    const modelsResponse = {
        data: [
            {
                id: 'meta/llama3-405b-instruct-maas'
            }
        ]
    };
    res.json(modelsResponse);
});

// /models endpoint
app.listen(PORT, () => {
    console.log(`Vertex AI proxy server is running on http://localhost:${PORT}`);
});
