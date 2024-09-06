import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import { renderFileToString } from "https://deno.land/x/dejs@0.10.3/mod.ts";
import { getLlama3CompletionStream } from './aiService.ts';
import { join, dirname, fromFileUrl } from "https://deno.land/std@0.204.0/path/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

// Load environment variables
await config({ export: true });

console.log("OPENROUTER_API_KEY:", Deno.env.get("OPENROUTER_API_KEY") ? "Set" : "Not set");
console.log("YOUR_SITE_URL:", Deno.env.get("YOUR_SITE_URL"));
console.log("YOUR_SITE_NAME:", Deno.env.get("YOUR_SITE_NAME"));

const __dirname = dirname(fromFileUrl(import.meta.url));

const app = new Application();
const router = new Router();

// Add CORS middleware
app.use(oakCors());

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

// Render the index page
router.get("/", async (ctx) => {
  const content = await renderFileToString(join(__dirname, "views", "index.ejs"));
  ctx.response.body = content;
  ctx.response.type = "text/html";
});

// AI Assist endpoint
router.post("/ai-assist", async (ctx) => {
  try {
    const body = await ctx.request.body().value;
    console.log("Received body:", body);  // Add this line
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.length > 1000) {
      ctx.response.status = 400;
      ctx.response.body = { error: 'Invalid prompt' };
      return;
    }

    ctx.response.type = "text/event-stream";
    const target = ctx.response.body = new TransformStream();
    const writer = target.writable.getWriter();

    try {
      for await (const chunk of getLlama3CompletionStream(prompt)) {
        await writer.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }
      await writer.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    } catch (error) {
      console.error('Error calling Llama3 service:', error);
      await writer.write(`data: ${JSON.stringify({ error: 'Failed to get AI assistance' })}\n\n`);
    } finally {
      await writer.close();
    }
  } catch (error) {
    console.error('Error in /ai-assist endpoint:', error);
    ctx.response.status = 500;
    ctx.response.body = { error: 'Internal server error' };
  }
});

// Test endpoint
router.get("/test", (ctx) => {
  ctx.response.body = "Server is running!";
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = 3000;
console.log(`Server running on http://localhost:${port}`);
await app.listen({ port });
