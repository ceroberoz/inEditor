import { dirname, fromFileUrl, join, extname } from "https://deno.land/std@0.204.0/path/mod.ts";
import { renderFileToString } from "https://deno.land/x/dejs@0.10.3/mod.ts";
import { getLlama3CompletionStream } from './aiService.ts';

const __filename = fromFileUrl(import.meta.url);
const __dirname = dirname(__filename);

function getContentType(filePath: string): string {
  const extension = extname(filePath);
  switch (extension) {
    case ".js":
      return "application/javascript";
    case ".css":
      return "text/css";
    case ".html":
      return "text/html";
    case ".json":
      return "application/json";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

async function serveStatic(url: URL) {
  const filePath = join(__dirname, "public", url.pathname);
  
  try {
    const file = await Deno.readFile(filePath);
    const contentType = getContentType(filePath);

    return new Response(file, {
      headers: { "content-type": contentType },
    });
  } catch {
    return new Response("404 - Not Found", { status: 404 });
  }
}

async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  
  if (url.pathname === "/") {
    const html = await renderFileToString(join(__dirname, "views", "index.ejs"));
    return new Response(html, {
      headers: { "content-type": "text/html" },
    });
  } else if (url.pathname === "/ai-assist") {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }
    const body = await req.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.length > 1000) {
      return new Response(JSON.stringify({ error: 'Invalid prompt' }), { 
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of getLlama3CompletionStream(prompt)) {
            controller.enqueue(`data: ${JSON.stringify({ chunk })}\n\n`);
          }
          controller.enqueue(`data: ${JSON.stringify({ done: true })}\n\n`);
        } catch (error) {
          console.error('Error calling Llama3 service:', error);
          controller.enqueue(`data: ${JSON.stringify({ error: 'Failed to get AI assistance' })}\n\n`);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });
  } else {
    return serveStatic(url);
  }
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
