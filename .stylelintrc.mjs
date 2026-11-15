// Stylelint — correctness rules for the Sass partials; layout is Prettier's job.
// A dotfile, so Jekyll never copies it. See _docs/testing.md.

export default {
  extends: 'stylelint-config-recommended-scss',
  // Opens with Jekyll front matter (load-bearing, see the file), which is not
  // Sass. It holds nothing but @use lines.
  ignoreFiles: ['assets/styles/site.scss'],
  rules: {
    // A bare `//` line is a paragraph break in the long prose comments.
    'scss/comment-no-empty': null,
    // These fire on plain CSS calc(), which the browser evaluates — not on
    // Sass math. Spacing inside calc() is Prettier's call.
    'scss/operator-no-unspaced': null,
    'scss/operator-no-newline-after': null,
  },
};
