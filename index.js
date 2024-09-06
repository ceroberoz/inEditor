import { config } from "dotenv";
import express from "express";
import { dirname, fromFileUrl, join } from "path";
import OpenAI from "openai";
import { getLlama3CompletionStream } from './aiService.js';

config();

console.log("OPENROUTER_API_KEY:", Deno.env.get("OPENROUTER_API_KEY") ? "Set" : "Not set");
console.log("YOUR_SITE_URL:", Deno.env.get("YOUR_SITE_URL"));
console.log("YOUR_SITE_NAME:", Deno.env.get("YOUR_SITE_NAME"));

const __filename = fromFileUrl(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// OpenRouter configuration
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: Deno.env.get("OPENROUTER_API_KEY"),
  defaultHeaders: {
    "HTTP-Referer": Deno.env.get("YOUR_SITE_URL"),
    "X-Title": Deno.env.get("YOUR_SITE_NAME"),
  }
});

// Set up EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Render the index page
app.get('/', (req, res) => {
  res.render('index');
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.use(express.json());

app.post('/ai-assist', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.length > 1000) {
    return res.status(400).json({ error: 'Invalid prompt' });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  try {
    for await (const chunk of getLlama3CompletionStream(prompt)) {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  } catch (error) {
    console.error('Error calling Llama3 service:', error);
    res.write(`data: ${JSON.stringify({ error: 'Failed to get AI assistance' })}\n\n`);
  } finally {
    res.end();
  }
});
