import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import OpenAI from "https://deno.land/x/openai@v4.20.1/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

// Load environment variables
await config({ export: true });

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: Deno.env.get("OPENROUTER_API_KEY"),
  defaultHeaders: {
    "HTTP-Referer": Deno.env.get("YOUR_SITE_URL"),
    "X-Title": Deno.env.get("YOUR_SITE_NAME"),
  }
});

// Define the models in order of preference
const models = [
  "google/gemma-2-9b-it:free",
  "nousresearch/hermes-3-llama-3.1-405b",
  "meta-llama/llama-3-8b-instruct:free",
  "mattshumer/reflection-70b:free"
];

// Health check function
async function healthCheck(): Promise<string> {
  for (const model of models) {
    try {
      await openai.chat.completions.create({
        model: model,
        messages: [{ role: "user", content: "Hello" }],
        max_tokens: 1
      });
      console.log(`Model ${model} is available.`);
      return model;
    } catch (error) {
      console.error(`Error with model ${model}:`, error.message);
    }
  }
  throw new Error("No models are currently available.");
}

// Retry function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let retries = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && retries < maxRetries) {
        const delay = initialDelay * Math.pow(2, retries);
        console.log(`Rate limited. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        retries++;
      } else {
        throw error;
      }
    }
  }
}

export async function handleAIAssist(ctx: Context) {
  const body = await ctx.request.body().value;
  const { prompt } = body;

  if (!prompt || typeof prompt !== 'string' || prompt.length > 1000) {
    ctx.response.status = 400;
    ctx.response.body = { error: 'Invalid prompt' };
    return;
  }

  try {
    const availableModel = await healthCheck();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const completion = await retryWithBackoff(() => openai.chat.completions.create({
            model: availableModel,
            messages: [
              { 
                role: "system", 
                content: `You are an expert LinkedIn post creator. Your task is to improve or create LinkedIn posts with the following structure:

1. Headline (1 line):
   - Attention-grabbing and relevant to the content
   - Use emojis sparingly if appropriate

2. Body (3-5 paragraphs):
   - Start with a hook or interesting fact
   - Present the main content or idea clearly
   - Use short paragraphs for readability
   - Include relevant personal experiences or insights
   - Use bullet points or numbered lists for easy scanning

3. Call to Action (1-2 lines):
   - Encourage engagement (e.g., comments, likes, shares)
   - Ask a question or prompt discussion
   - Provide a clear next step for readers

General Guidelines:
- Use simple, professional English
- Maintain a friendly and approachable tone
- Keep the total post under 1,300 characters
- Use line breaks between sections for clarity
- Include 2-3 relevant hashtags at the end

4. Add information about the AI model from parameter model: ${availableModel}, and the user's prompt at the end of the post.

Please format the improved post clearly, separating the Headline, Body, and Call to Action sections.`
              },
              { 
                role: "user", 
                content: `Please help me improve this LinkedIn post: ${prompt}` 
              }
            ],
            temperature: 0.5,
            max_tokens: 800,
            top_p: 0.9,
            frequency_penalty: 0.5,
            presence_penalty: 0.5,
            stream: true,
          }));

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
        } catch (error) {
          console.error('Error in AI assist:', error);
          controller.enqueue(new TextEncoder().encode(`Error: ${error.message}`));
        } finally {
          controller.close();
        }
      }
    });

    ctx.response.type = 'text/event-stream';
    ctx.response.headers.set('Cache-Control', 'no-cache');
    ctx.response.headers.set('Connection', 'keep-alive');
    ctx.response.body = stream;
  } catch (error) {
    console.error('Error in AI assist:', error);
    ctx.response.status = 500;
    ctx.response.body = { error: 'Error processing AI request' };
  }
}