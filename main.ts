import { Application, Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import { renderFileToString } from "https://deno.land/x/dejs@0.10.3/mod.ts";
import OpenAI from "https://deno.land/x/openai@v4.20.1/mod.ts";
import { join, dirname, fromFileUrl } from "https://deno.land/std@0.204.0/path/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

// Load environment variables
await config({ export: true });

// Initialize OpenAI client with OpenRouter configuration
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: Deno.env.get("OPENROUTER_API_KEY"),
  defaultHeaders: {
    "HTTP-Referer": Deno.env.get("YOUR_SITE_URL"), // Optional, for including your app on openrouter.ai rankings.
    "X-Title": Deno.env.get("YOUR_SITE_NAME"), // Optional. Shows in rankings on openrouter.ai.
  }
});

const __dirname = dirname(fromFileUrl(import.meta.url));

// Helper function to log environment variables
function logEnvironmentVariables(...variables: string[]) {
  variables.forEach(variable => {
    console.log(`${variable}:`, Deno.env.get(variable) ? "Set" : "Not set");
  });
}

logEnvironmentVariables("OPENROUTER_API_KEY", "YOUR_SITE_URL", "YOUR_SITE_NAME");

const app = new Application();
const router = new Router();

// Middleware
app.use(oakCors());
app.use(errorHandler);

// Serve static files
app.use(async (ctx, next) => {
  try {
    await ctx.send({
      root: join(__dirname, "public"),
      index: "index.html",
    });
  } catch {
    await next();
  }
});

// Route handlers
async function handleIndex(ctx: Context) {
  const content = await renderFileToString(join(__dirname, "views", "index.ejs"));
  ctx.response.body = content;
  ctx.response.type = "text/html";
}

async function handleTestPost(ctx: Context) {
  console.log("Received POST request to /test-post");
  console.log("Headers:", ctx.request.headers);
  const body = await ctx.request.body().value;
  console.log("Body:", body);
  ctx.response.body = { message: "Test POST request received" };
}

async function handleAIAssist(ctx: Context) {
  const body = await ctx.request.body().value;
  const { prompt } = body;

  if (!prompt || typeof prompt !== 'string' || prompt.length > 1000) {
    ctx.response.status = 400;
    ctx.response.body = { error: 'Invalid prompt' };
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "mattshumer/reflection-70b:free",
      messages: [{ role: "user", content: prompt }],
    });

    ctx.response.body = { 
      message: completion.choices[0].message.content,
      usage: completion.usage
    };
  } catch (error) {
    console.error('Error in AI assist:', error);
    ctx.response.status = 500;
    ctx.response.body = { error: 'Error processing AI request' };
  }
}

function handleTest(ctx: Context) {
  ctx.response.body = "Server is running!";
}

// Routes
router.get("/", handleIndex);
router.post("/test-post", handleTestPost);
router.post("/ai-assist", handleAIAssist);
router.get("/test", handleTest);

app.use(router.routes());
app.use(router.allowedMethods());

// Error handling middleware
async function errorHandler(ctx: Context, next: () => Promise<unknown>) {
  try {
    await next();
  } catch (err) {
    console.error('Unhandled error:', err);
    ctx.response.status = 500;
    ctx.response.body = { error: 'Internal server error' };
  }
}

// Start server
const port = 3000;
console.log(`Server running on http://localhost:${port}`);
try {
  await app.listen({ port });
} catch (error) {
  if (error instanceof Deno.errors.BadResource) {
    console.error("Connection error:", error.message);
  } else {
    console.error("Unexpected error:", error);
  }
}
