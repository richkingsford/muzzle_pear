const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const root = __dirname;
const port = Number(process.env.PORT || 4173);

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"]
]);

function resolveRequest(url) {
  const parsed = new URL(url, `http://localhost:${port}`);
  const pathname = parsed.pathname === "/" ? "/index.html" : parsed.pathname;
  const requested = path.resolve(root, `.${decodeURIComponent(pathname)}`);

  const relativePath = path.relative(root, requested);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  return requested;
}

const server = http.createServer(async (request, response) => {
  const filePath = resolveRequest(request.url);

  if (!filePath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  if (new URL(request.url, `http://localhost:${port}`).pathname === "/favicon.ico") {
    response.writeHead(204, { "Cache-Control": "no-store" });
    response.end();
    return;
  }

  try {
    const contents = await fs.readFile(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes.get(path.extname(filePath)) || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    response.end(contents);
  } catch (error) {
    response.writeHead(404);
    response.end("Not found");
  }
});

server.listen(port, () => {
  console.log(`Sudoku Hint Trainer is running at http://localhost:${port}`);
});
