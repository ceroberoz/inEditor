import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from "openai";
import axios from 'axios';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is in your .env file
  // organization: "org-NCbXbk3Z0zVLiKb3UZFSbncu",
});

async function getOllamaCompletion(prompt) {
  try {
    const response = await axios.post('http://localhost:11434/api/generate', { model: "llama3", prompt: prompt, stream: false });
    return response.data.response;
  } catch (error) {
    console.error('Error calling Ollama:', error);
    throw new Error('Failed to get Ollama completion');
  }
}

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

  try {
    const completion = await getOllamaCompletion(prompt);
    console.log('Ollama service response:', completion);

    res.json({ result: completion.trim() });
  } catch (error) {
    console.error('Error calling Ollama service:', error);
    res.status(500).json({ error: 'Failed to get AI assistance', details: error.message });
  }
});
