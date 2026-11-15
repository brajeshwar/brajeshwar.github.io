// make test-urls — add every URL the current build publishes to _test/urls.txt.
//
// The file is the promise guardrail 2 makes: every URL on it must keep
// resolving. This script only ever ADDS lines. A URL coming off the list is a
// decision (and a redirect stub, see _redirect/), so it is made by hand.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SITE = process.argv[2] || '_site';
const LIST = '_test/urls.txt';

const sitemap = readFileSync(join(SITE, 'sitemap.xml'), 'utf8');
const built = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]);

const header = [];
const urls = new Set();
if (existsSync(LIST)) {
  for (const line of readFileSync(LIST, 'utf8').split('\n')) {
    if (line.startsWith('#') && urls.size === 0) header.push(line);
    else if (line.trim()) urls.add(line.trim());
  }
}
const before = urls.size;
for (const u of built) urls.add(u);

writeFileSync(LIST, [...header, ...[...urls].sort()].join('\n') + '\n');
console.log(`urls.txt: ${urls.size} URLs (${urls.size - before} added)`);
