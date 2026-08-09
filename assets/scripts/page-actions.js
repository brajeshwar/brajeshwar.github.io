/* Page actions — the only thing here is the print button.
 * See _includes/page-actions.html.
 *
 * Everything else in that bar is a plain link and needs no JavaScript: the two
 * AI targets are ordinary hrefs, and "View as Markdown" points at a real file.
 * This exists solely because window.print() cannot be expressed as one.
 *
 * ⚠️ THE BUTTON SHIPS `hidden` AND THIS UNHIDES IT (guardrail 4). A print
 * control that silently does nothing with JavaScript off is worse than no
 * control — the reader's own Print command still works, and the page is
 * styled for it by assets/print.css. So the affordance only appears once it
 * can actually be honoured.
 *
 * ⚠️ Ready-guard, not a bare DOMContentLoaded listener. Cloudflare Rocket
 * Loader re-executes scripts AFTER that event has fired in production, so a
 * bare listener registers for something already past — that is exactly how
 * /search/ shipped dead for months. See _docs/search.md.
 */
(function () {
  'use strict';

  function init() {
    var buttons = document.querySelectorAll('[data-page-actions-print]');
    if (!buttons.length) return;

    Array.prototype.forEach.call(buttons, function (btn) {
      btn.hidden = false;
      btn.addEventListener('click', function () { window.print(); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
