// Browser checks — real Chrome against the built site. See _docs/testing.md.

import { test, expect } from '@playwright/test';

// A post with footnotes (sidenotes), a post without, and the pages that run a
// script of their own.
const POST_WITH_NOTES = '/2026/10x-is-easier-than-2x/';
const PAGES = [
  '/',
  POST_WITH_NOTES,
  '/about/',
  '/archives/',
  '/books/',
  '/cv/',
  '/search/',
  '/random/',
  '/404.html',
];

// ---- The theme: no flash, whatever the OS says (2026-11-15) -------------

// [OS scheme, saved mode, expected color-scheme on <html>, expected dark page]
const MATRIX = [
  ['light', 'dark', 'dark', true],
  ['dark', 'light', 'light', false],
  ['light', null, 'light dark', false],
  ['dark', null, 'light dark', true],
];

for (const [os, saved, scheme, dark] of MATRIX) {
  test(`theme: OS ${os}, saved ${saved ?? 'auto'} → ${scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: os });
    if (saved) await page.addInitScript((m) => localStorage.setItem('theme', m), saved);
    await page.goto('/');
    // The browser canvas, which is what shows between pages, follows the
    // used color-scheme — so that and the meta are the flash, not the body.
    const got = await page.evaluate(() => ({
      scheme: getComputedStyle(document.documentElement).colorScheme,
      meta: document.querySelector('meta[name=color-scheme]').content,
    }));
    expect(got.scheme).toBe(scheme);
    expect(got.meta).toBe(saved ?? 'light dark');
    expect(await isDark(page)).toBe(dark);
  });
}

test('theme: the toggle flips the mode and pins color-scheme at once', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Dark mode' });
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe(
    'dark'
  );
  // body fades its background over 500ms (base.scss), so poll for the end.
  await expect.poll(() => isDark(page)).toBe(true);
  await page.goto(POST_WITH_NOTES);
  expect(await isDark(page)).toBe(true);
});

test('theme: toggling back to the system forgets the choice', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Dark mode' });
  await toggle.click();
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');
  await toggle.click();
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(null);
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('auto');
  // Following the system again: it goes dark when the system does.
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => isDark(page)).toBe(true);
});

test('theme: settings from the old appearance panel are cleared', async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('seeded')) {
      sessionStorage.setItem('seeded', '1');
      ['palette', 'font', 'textsize', 'accent'].forEach((k) => localStorage.setItem(k, 'x'));
    }
  });
  await page.goto('/');
  const left = await page.evaluate(() =>
    ['palette', 'font', 'textsize', 'accent'].filter((k) => localStorage.getItem(k) !== null)
  );
  expect(left).toEqual([]);
});

// ---- JavaScript on: nothing throws ---------------------------------------

for (const path of PAGES) {
  test(`no script errors on ${path}`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto(path, { waitUntil: 'load' });
    // /random/ navigates away on purpose; anything else should just sit there.
    if (path !== '/random/') await page.waitForTimeout(200);
    expect(errors.filter((e) => !/favicon|404 \(File not found\)/.test(e))).toEqual([]);
  });
}

test('footnotes become sidenotes on a wide screen', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(POST_WITH_NOTES);
  await expect(page.locator('.sidenote').first()).toBeVisible();
});

// ---- JavaScript off: the site still works (guardrail 4) -----------------

test.describe('with JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false });

  test('/search/ says what to do instead', async ({ page }) => {
    // Pagefind cannot run without JS; the page's <noscript> routes to the content.
    await page.goto('/search/');
    await expect(page.getByRole('link', { name: 'every post by year' })).toBeVisible();
  });

  for (const path of PAGES.filter((p) => !['/random/', '/404.html', '/search/'].includes(p))) {
    test(`${path} renders its content`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('h1').first()).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      expect((await page.locator('main').innerText()).length).toBeGreaterThan(200);
      await expect(page.locator('footer').first()).toBeVisible();
    });
  }

  test('no control shows that needs a script to work', async ({ page }) => {
    // Every <button> on the site is wired by JS; links are what work without it.
    // The theme toggle is hidden without JS for this reason (chrome.scss).
    for (const path of ['/', POST_WITH_NOTES, '/archives/', '/about/']) {
      await page.goto(path);
      const visible = await page
        .locator('button')
        .evaluateAll((bs) =>
          bs
            .filter((b) => b.checkVisibility())
            .map((b) => b.getAttribute('aria-label') || b.textContent.trim())
        );
      expect(visible, path).toEqual([]);
    }
  });

  test('footnotes stay real footnotes at the article foot', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(POST_WITH_NOTES);
    await expect(page.locator('.footnotes')).toBeVisible();
    await expect(page.locator('.sidenote')).toHaveCount(0);
  });

  test('auto still follows a dark OS with no script to set it', async ({ page }) => {
    // The no-flash snippet that writes data-theme="auto" is JS too, so with
    // JS off <html> has no data-theme at all (fixed 2026-11-15, themes.scss).
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    expect(await isDark(page)).toBe(true);
  });
});

// Is the page background dark? Reads the body's computed color, which may be
// oklch() — rendered to a pixel by the browser rather than parsed here.
async function isDark(page) {
  return page.evaluate(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 1;
    const ctx = c.getContext('2d');
    ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128;
  });
}
