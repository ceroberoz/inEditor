import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import OpenAI from "https://deno.land/x/openai@v4.20.1/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import { OpenAIError } from "https://deno.land/x/openai@v4.20.1/mod.ts";

// Load environment variables
await config({ export: true });

const REQUIRED_ENV_VARS = ['OPENROUTER_API_KEY', 'YOUR_SITE_URL', 'YOUR_SITE_NAME'];
for (const envVar of REQUIRED_ENV_VARS) {
  if (!Deno.env.get(envVar)) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: Deno.env.get("OPENROUTER_API_KEY"),
  defaultHeaders: {
    "HTTP-Referer": Deno.env.get("YOUR_SITE_URL"),
    "X-Title": Deno.env.get("YOUR_SITE_NAME"),
  },
  timeout: 30000, // 30 seconds
});

// Define the models in order of preference
const models = [
  "google/gemini-pro-1.5-exp", // Likely the best overall for quality and contextual understanding, ideal for engaging LinkedIn posts.
  "meta-llama/llama-3-8b-instruct:free", // Strong instruction-following and balanced performance, good for coherent content.
  "mistralai/mistral-7b-instruct:free", // Reliable and accessible with good instruction-following capabilities.
  "mattshumer/reflection-70b:free", // Large model that can generate detailed content but may overcomplicate posts.
  "google/gemma-2-9b-it:free", // A smaller variant within the Google family, still strong but not as prioritized as the pro version.
  "microsoft/phi-3-medium-128k-instruct:free", // Good for straightforward and structured posts, solid performance.
  "openchat/openchat-7b:free", // More general-purpose and smaller, suitable for less demanding content tasks.
  "nousresearch/hermes-3-llama-3.1-405b" // Potentially powerful but less tailored for LinkedIn content, needs testing.
];

// System message template for LinkedIn post creation
const SYSTEM_MESSAGE = `You are an expert LinkedIn post creator. Your task is to improve or create LinkedIn posts with the following structure:

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

4. Add information about the AI model used: {model}, and the user's prompt at the end of the post.

Please format the improved post clearly, separating the Headline, Body, and Call to Action sections.`;

// Prompt for the user
const USER_PROMPT = `Please help me improve this LinkedIn post: 

Topic: {prompt}

Can you help me create an engaging post with this concept?
`;

// Health check function to find an available model
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

// Cache expiration time (24 hours)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

// Initialize Deno KV (if available)
let kv;
if (typeof Deno.openKv === "function") {
  try {
    kv = await Deno.openKv();
    console.log("Deno KV is available and initialized.");
  } catch (error) {
    console.error("Error initializing Deno KV:", error);
  }
} else {
  console.warn("Deno KV is not available in this environment.");
}

// Function to get cached response
async function getCachedResponse(prompt: string): Promise<string | null> {
  if (!kv) return null;

  const cacheKey = ["ai_assist", prompt];
  try {
    const cachedResult = await kv.get(cacheKey);
    if (cachedResult.value) {
      const { response, timestamp } = cachedResult.value;
      if (Date.now() - timestamp < CACHE_EXPIRATION) {
        console.log("Cache hit for prompt:", prompt);
        return response;
      }
    }
  } catch (error) {
    console.error("Error reading from cache:", error);
  }
  return null;
}

// Function to set cached response
async function setCachedResponse(prompt: string, response: string): Promise<void> {
  if (!kv) return;

  const cacheKey = ["ai_assist", prompt];
  try {
    const result = await kv.atomic()
      .set(cacheKey, { response, timestamp: Date.now() }, { expireIn: CACHE_EXPIRATION })
      .commit();

    if (!result.ok) {
      console.warn('Cache update failed');
    }
  } catch (error) {
    console.error("Error writing to cache:", error);
  }
}

// Main handler for AI assistance
export async function handleAIAssist(ctx: Context) {
  if (ctx.request.headers.get("content-type") !== "application/json") {
    ctx.response.status = 415;
    ctx.response.body = { error: "Unsupported Media Type" };
    return;
  }

  const body = await ctx.request.body().value;
  const { prompt } = body;

  if (!prompt || typeof prompt !== 'string' || prompt.length > 1000) {
    ctx.response.status = 400;
    ctx.response.body = { error: 'Invalid prompt' };
    return;
  }

  try {
    // Check cache first
    const cachedResponse = await getCachedResponse(prompt);
    if (cachedResponse) {
      ctx.response.body = cachedResponse;
      return;
    }

    // Get an available model
    const availableModel = await healthCheck();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const completion = await retryWithBackoff(() => openai.chat.completions.create({
            model: availableModel,
            messages: [
              { 
                role: "system", 
                content: SYSTEM_MESSAGE.replace("{model}", availableModel)
              },
              { 
                role: "user", 
                content: USER_PROMPT.replace("{prompt}", prompt)
              }
            ],
            temperature: 0.5,
            max_tokens: 800,
            top_p: 0.9,
            frequency_penalty: 0.5,
            presence_penalty: 0.5,
            stream: true,
          }));

          let fullResponse = '';

          // Stream the response
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullResponse += content;
              controller.enqueue(new TextEncoder().encode(content));
            }
          }

          // Cache the full response
          await setCachedResponse(prompt, fullResponse);

        } catch (error) {
          console.error('Error in AI assist:', error);
          handleError(ctx, error);
        } finally {
          controller.close();
        }
      },
      cancel() {
        // Handle client disconnection
        console.log('Client disconnected');
      }
    });

    // Set response headers for streaming
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

// Helper function to handle errors
function handleError(ctx: Context, error: any) {
  if (error instanceof OpenAIError) {
    ctx.response.status = error.status || 500;
    ctx.response.body = { error: error.message };
  } else {
    ctx.response.status = 500;
    ctx.response.body = { error: 'Unexpected error occurred' };
  }
}