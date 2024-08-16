import { serve } from "https://deno.land/std@0.204.0/http/server.ts";
import { dirname, fromFileUrl, join, extname } from "https://deno.land/std@0.204.0/path/mod.ts";
import { renderFileToString } from "https://deno.land/x/dejs@0.10.3/mod.ts";

// Get the current directory and file path
const __filename = fromFileUrl(import.meta.url);
const __dirname = dirname(__filename);

// A helper function to determine the content type based on file extension
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

// Serve static files from the 'public' directory
async function serveStatic(req: Request) {
  const url = new URL(req.url);
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

// Handle root route and render EJS view
async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  
  if (url.pathname === "/") {
    // Render the EJS file as a string
    const html = await renderFileToString(join(__dirname, "views", "index.ejs"));
    return new Response(html, {
      headers: { "content-type": "text/html" },
    });
  } else {
    // Serve static files
    return serveStatic(req);
  }
}

// Start the server
console.log("Server is running on port 8000");
await serve(handleRequest, { port: 8000 });
