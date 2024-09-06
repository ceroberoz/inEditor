import OpenAI from "npm:openai";
import dotenv from 'npm:dotenv';

dotenv.config();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: Deno.env.get("OPENROUTER_API_KEY"),
  defaultHeaders: {
    "HTTP-Referer": Deno.env.get("YOUR_SITE_URL"),
    "X-Title": Deno.env.get("YOUR_SITE_NAME"),
  }
});

/**
 * Gets a streaming completion from the Llama3 model using OpenRouter.
 * @param {string} prompt - The input prompt for the model.
 * @returns {AsyncGenerator<string>} A generator that yields chunks of the model's response.
 * @throws {Error} If the API call fails.
 */
export async function* getLlama3CompletionStream(prompt) {
  try {
    const stream = await openai.chat.completions.create({
      model: "meta-llama/llama-3-8b-instruct:free",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    for await (const chunk of stream) {
      yield chunk.choices[0]?.delta?.content || "";
    }
  } catch (error) {
    console.error('Error calling OpenRouter:', error);
    throw new Error('Failed to get Llama3 completion');
  }
}