// A static file server for the tests, and nothing more: /x/ serves x/index.html,
// as GitHub Pages does.
//
// Python's `http.server` did this job until 2026-11-15. It accepts only five
// waiting connections, and with several test workers loading pages at once
// macOS reset the rest, which surfaced as "Failed to load resource" in tests
// that had nothing wrong with them. Node keeps a proper queue.
//
//   node _test/serve.mjs <dir> <port>

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const [root = '_site', port = '4123'] = process.argv.slice(2);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
};

async function resolve(urlPath) {
  const path = join(root, normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, ''));
  const info = await stat(path).catch(() => null);
  if (info?.isDirectory()) return join(path, 'index.html');
  return path;
}

createServer(async (req, res) => {
  const file = await resolve(new URL(req.url, 'http://x').pathname);
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('Not found');
  }
}).listen(Number(port), '127.0.0.1');
