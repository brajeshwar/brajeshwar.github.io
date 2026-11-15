// ESLint — correctness rules only; layout is Prettier's job. See _docs/testing.md.
// Excluded from the Jekyll build in _config.yml, like package.json.

import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['_site/**', '_test/site/**', '_test/results/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    rules: {
      // `try { localStorage… } catch (e) {}` is deliberate everywhere it
      // appears: storage can throw (private mode, blocked site data) and the
      // right response is to carry on without it.
      'no-unused-vars': ['error', { caughtErrors: 'none' }],
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
  {
    // The site's own scripts: classic <script defer>, browser globals, no modules.
    files: ['assets/scripts/**/*.js'],
    languageOptions: { sourceType: 'script', globals: globals.browser },
  },
  {
    // A one-off under misc/ may split its script into native modules.
    files: ['misc/**/*.js'],
    languageOptions: { sourceType: 'module', globals: globals.browser },
  },
  {
    // Build scripts and tests run in Node.
    files: ['scripts/**/*.mjs', '_test/**/*.mjs', '*.mjs'],
    languageOptions: { sourceType: 'module', globals: globals.node },
  },
  {
    // page.evaluate() callbacks run in the browser, not in Node.
    files: ['_test/browser.spec.mjs'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
];
