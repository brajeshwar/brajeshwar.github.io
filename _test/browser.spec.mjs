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
    // Script errors only. A missing image is the browser reporting a failed
    // load, which belongs to the page's content, not to its scripts.
    expect(errors.filter((e) => !e.startsWith('Failed to load resource'))).toEqual([]);
  });
}

test('the logo keeps its size before the stylesheet arrives', async ({ page }) => {
  // Safari can paint before a slow stylesheet lands. The logo SVG once said
  // width="100%", and in that moment it filled the page (2026-11-15).
  await page.route('**/*.css', (route) => route.abort());
  await page.goto('/');
  const box = await page.locator('.logo__img').boundingBox();
  expect(box.width).toBeLessThanOrEqual(40);
});

test('footnotes become sidenotes on a wide screen', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(POST_WITH_NOTES);
  await expect(page.locator('.sidenote').first()).toBeVisible();
});

// ---- /misc/london-southbank/: the model, or the picture ------------------

const WALK = '/misc/london-southbank/';

test('the walk settles as the model or the picture, with no errors', async ({ page }) => {
  // Not every Chrome has WebGL2 (CI's may not). Either end is right; hanging
  // between them, or throwing on the way, is not.
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(WALK);
  const stage = page.locator('.stage');
  await expect(stage).toHaveClass(/is-live|is-still/, { timeout: 20000 });
  if (await stage.evaluate((el) => el.classList.contains('is-live'))) {
    await page.getByRole('button', { name: 'Next stop' }).click();
    await expect(page.locator('#waterloo')).toHaveClass(/is-active/);
    await expect(page.locator('.caption')).toContainText('Waterloo Station');
    // Flying in, the landmarks round the stop are named.
    await expect(page.locator('.place.is-near').first()).toBeVisible({ timeout: 10000 });
  }
  expect(errors.filter((e) => !e.startsWith('Failed to load resource'))).toEqual([]);
});

test('the walk without WebGL is the picture, its pins and no dead control', async ({ page }) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  await page.goto(WALK);
  await expect(page.locator('.stage')).toHaveClass(/is-still/);
  await expectStill(page);
});

// The walk with no model: the picture has loaded, every pin shows and leads
// to a stop in the list, and no button is on show that could do nothing.
async function expectStill(page) {
  const picture = page.locator('.stage img');
  await expect(picture).toBeVisible();
  await expect
    .poll(() => picture.evaluate((img) => img.complete && img.naturalWidth > 0))
    .toBe(true);
  const pins = await page.locator('.stage .pin').all();
  expect(pins.length).toBeGreaterThan(10);
  for (const pin of pins) {
    await expect(pin).toBeVisible();
    await expect(page.locator(await pin.getAttribute('href'))).toBeVisible();
  }
  const buttons = await page
    .locator('button')
    .evaluateAll((bs) => bs.filter((b) => b.checkVisibility()).length);
  expect(buttons).toBe(0);
}

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

  test('the walk is a picture whose pins lead to the list', async ({ page }) => {
    await page.goto(WALK);
    await expectStill(page);
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
