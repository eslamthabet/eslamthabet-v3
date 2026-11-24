import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 8181;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

const server = http.createServer((req, res) => {
  const rawUrl = req.url || "/";
  const [pathname, query] = rawUrl.split("?");
  const urlPath = decodeURIComponent(pathname);
  const relPath = urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
  let filePath = path.resolve(__dirname, relPath);

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      if (!urlPath.endsWith("/")) {
        const redirectUrl = `${urlPath}/${query ? `?${query}` : ""}`;
        res.writeHead(301, { Location: redirectUrl });
        res.end();
        return;
      }
      filePath = path.join(filePath, "index.html");
    }
  } catch {
    // Fall through to readFile
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "no-cache"
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
