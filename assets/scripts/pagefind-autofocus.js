// Pagefind Autofocus Helper
// Edited: Dec 16, 2025
(function () {
    const observer = new MutationObserver(() => {
        const input = document.querySelector('.pagefind-ui__search-input');
        if (input) {
            input.focus();
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();