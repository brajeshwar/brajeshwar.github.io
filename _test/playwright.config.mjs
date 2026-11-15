// Playwright runs both tiers: build.spec.mjs (files only, no browser) and
// browser.spec.mjs (real Chrome). See _docs/testing.md.

import { defineConfig } from '@playwright/test';

const PORT = 4123;
const SITE = process.env.SITE || '_site';

export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.mjs',
  outputDir: 'results',
  // Paths in the specs are relative to the repo root, where `make test` and CI
  // both run from. CI fails a stray test.only rather than shipping on it.
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['list'], ['github']] : 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    // The installed Google Chrome, not a downloaded Playwright build: CI's
    // runner already has it, so the daily cron downloads no browser.
    channel: 'chrome',
  },
  // A static host and nothing more, like GitHub Pages: /x/ serves x/index.html.
  webServer: {
    command: `node _test/serve.mjs ${SITE} ${PORT}`,
    url: `http://127.0.0.1:${PORT}/`,
    // Relative to the repo root, like SITE; Playwright would default to _test/.
    cwd: process.cwd(),
    reuseExistingServer: false,
    stdout: 'ignore',
  },
});
