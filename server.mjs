/**
 * Minimal static file server for the Tumaini Community Trust site.
 *
 * Serves public/ with clean URLs (/about -> /about/index.html), correct MIME
 * types, and a friendly 404 page. Used for local development and Preview.
 */
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "public");
const PORT = Number(process.env.PORT || 3000);
const HOST = "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

async function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const safe = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const target = path.join(ROOT, safe);
  if (!target.startsWith(ROOT)) return null;

  const candidates = [target];
  if (decoded.endsWith("/")) candidates.push(path.join(target, "index.html"));
  else candidates.push(`${target}.html`, path.join(target, "index.html"));

  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return candidate;
    } catch {
      /* keep looking */
    }
  }
  return null;
}

function send(res, status, filePath, extraHeaders = {}) {
  const headers = {
    "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream",
    "Cache-Control": "no-cache",
    ...extraHeaders,
  };
  res.writeHead(status, headers);
  createReadStream(filePath).pipe(res);
}

const server = createServer(async (req, res) => {
  try {
    const filePath = await resolveFile(req.url || "/");
    if (filePath) {
      send(res, 200, filePath);
      return;
    }
    send(res, 404, path.join(ROOT, "404.html"));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(`Server error: ${error.message}`);
  }
});

server.listen(PORT, HOST, () => {
  //console.log(`Tumaini site serving at http://localhost:${PORT}`);
});
