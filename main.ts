import { Application, Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import { renderFileToString } from "https://deno.land/x/dejs@0.10.3/mod.ts";
import { join, dirname, fromFileUrl } from "https://deno.land/std@0.204.0/path/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { handleAIAssist } from "./aiAssist.ts";

// Load environment variables
await config({ export: true });

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

// Routes
router.get("/", handleIndex);
router.post("/ai-assist", handleAIAssist);

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