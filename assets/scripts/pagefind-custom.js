// Self-Contained Pagefind Implementation with Custom Enhancements

// Pagefind Core Implementation
class PagefindUI {
    constructor(options = {}) {
        this.options = {
            element: "#search",
            baseUrl: "/",
            bundlePath: "/assets/scripts/",
            showImages: true,
            showSubResults: false,
            excerptLength: 30,
            resetStyles: true,
            debounceTimeoutMs: 300,
            pagefindOptions: {},
            ...options
        };

        this.searchElement = null;
        this.searchInput = null;
        this.searchResults = null;
        this.searchInstance = null;
        this.debounceTimeout = null;

        this.init();
    }

    async init() {
        this.searchElement = document.querySelector(this.options.element);
        if (!this.searchElement) {
            console.error(`Pagefind UI: Element ${this.options.element} not found`);
            return;
        }

        this.render();
        await this.loadPagefind();
        this.bindEvents();
    }

    render() {
        this.searchElement.innerHTML = `
            <div class="pagefind-ui">
                <form class="pagefind-ui__form" role="search">
                    <input class="pagefind-ui__search-input" type="search" placeholder="Search..." autocomplete="off" />
                    <button class="pagefind-ui__search-clear" type="button" hidden aria-label="Clear search">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="15 9l-6 6"></path>
                            <path d="9 9l6 6"></path>
                        </svg>
                    </button>
                </form>
                <div class="pagefind-ui__results"></div>
            </div>
        `;

        this.searchInput = this.searchElement.querySelector('.pagefind-ui__search-input');
        this.searchResults = this.searchElement.querySelector('.pagefind-ui__results');
        this.searchClear = this.searchElement.querySelector('.pagefind-ui__search-clear');
    }

    async loadPagefind() {
        try {
            // Load pagefind search data from our assets folder
            const response = await fetch(`${this.options.bundlePath}pagefind.js`);
            if (!response.ok) {
                throw new Error(`Failed to load pagefind: ${response.status}`);
            }

            const pagefindCode = await response.text();
            // Execute the pagefind code
            eval(pagefindCode);

            // Initialize pagefind
            this.searchInstance = await window.pagefind.init(this.options.pagefindOptions);
        } catch (error) {
            console.error('Failed to load Pagefind:', error);
            // Fallback: show message
            this.showMessage('Search functionality is currently unavailable.');
        }
    }

    bindEvents() {
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();

            if (this.debounceTimeout) {
                clearTimeout(this.debounceTimeout);
            }

            this.debounceTimeout = setTimeout(() => {
                this.performSearch(query);
            }, this.options.debounceTimeoutMs);

            // Show/hide clear button
            this.searchClear.hidden = query.length === 0;
        });

        this.searchClear.addEventListener('click', () => {
            this.searchInput.value = '';
            this.searchClear.hidden = true;
            this.clearResults();
            this.searchInput.focus();
        });

        // Handle form submission
        this.searchElement.querySelector('.pagefind-ui__form').addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }

    async performSearch(query) {
        if (!query) {
            this.clearResults();
            return;
        }

        if (!this.searchInstance) {
            this.showMessage('Search is loading...');
            return;
        }

        try {
            const results = await this.searchInstance.search(query);
            this.displayResults(results, query);
        } catch (error) {
            console.error('Search error:', error);
            this.showMessage('An error occurred while searching.');
        }
    }

    async displayResults(results, query) {
        if (!results || results.results.length === 0) {
            this.showMessage(`No results found for "${query}".`);
            return;
        }

        const resultsHtml = await Promise.all(
            results.results.slice(0, 10).map(async (result) => {
                const data = await result.data();
                return this.renderResult(data, query);
            })
        );

        this.searchResults.innerHTML = resultsHtml.join('');

        // Apply custom enhancements
        this.enhanceResults();
    }

    renderResult(data, query) {
        const url = data.url;
        const title = this.highlightText(data.meta?.title || 'Untitled', query);
        const excerpt = this.highlightText(
            data.excerpt || data.content?.substring(0, this.options.excerptLength * 5) || '',
            query
        );

        let imageHtml = '';
        if (this.options.showImages && data.meta?.image) {
            imageHtml = `<img class="pagefind-ui__result-image" src="${data.meta.image}" alt="" loading="lazy" />`;
        }

        return `
            <div class="pagefind-ui__result">
                <div class="pagefind-ui__result-content">
                    <h3 class="pagefind-ui__result-title">
                        <a class="pagefind-ui__result-link" href="${url}">${title}</a>
                    </h3>
                    <p class="pagefind-ui__result-excerpt">${excerpt}</p>
                </div>
                ${imageHtml}
            </div>
        `;
    }

    highlightText(text, query) {
        if (!query || !text) return text;

        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    showMessage(message) {
        this.searchResults.innerHTML = `<p class="pagefind-ui__message">${message}</p>`;
    }

    clearResults() {
        this.searchResults.innerHTML = '';
    }

    enhanceResults() {
        // Apply custom enhancements to results
        const results = this.searchResults.querySelectorAll('.pagefind-ui__result');
        results.forEach(result => this.enhanceResult(result));
    }

    enhanceResult(resultElement) {
        // Add date if available in the result data
        const titleElement = resultElement.querySelector('.pagefind-ui__result-title');
        const linkElement = titleElement?.querySelector('a');

        if (linkElement && linkElement.href && !resultElement.querySelector('.pagefind-ui__result-date')) {
            const dateMatch = linkElement.href.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
            if (dateMatch) {
                const [, year, month, day] = dateMatch;
                const date = new Date(year, month - 1, day);
                const options = {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                };
                const formattedDate = date.toLocaleDateString('en-US', options);

                // Insert date element after title
                const dateElement = document.createElement('div');
                dateElement.className = 'pagefind-ui__result-date';
                dateElement.textContent = formattedDate;
                titleElement.insertAdjacentElement('afterend', dateElement);
            }
        }

        // Handle optional images (if they exist in the content)
        const imgElement = resultElement.querySelector('img');
        if (imgElement && !imgElement.classList.contains('pagefind-ui__result-image')) {
            imgElement.className = 'pagefind-ui__result-image';
        }
    }
}

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    // Initialize Pagefind UI with custom options
    new PagefindUI({
        element: "#search",
        showSubResults: true,
        excerptLength: 150,
        resetStyles: false, // Keep our custom styles

        // Custom result processing
        processTerm: function (term) {
            return term;
        },

        // Custom result rendering
        processResult: function (result) {
            // Format date if available
            if (result.meta && result.meta.date) {
                const date = new Date(result.meta.date);
                const options = {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                };
                result.formattedDate = date.toLocaleDateString('en-US', options);
            }

            return result;
        }
    });
});