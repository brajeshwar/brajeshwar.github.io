// Pagefind Custom Enhancements

window.addEventListener('DOMContentLoaded', () => {
    // Wait for PagefindUI to be available
    function initializePagefind() {
        if (typeof PagefindUI === 'undefined') {
            console.log('PagefindUI not yet available, retrying...');
            setTimeout(initializePagefind, 100);
            return;
        }
        
        try {
            console.log('Initializing PagefindUI...');
            
            // Initialize standard Pagefind UI with minimal options first
            new PagefindUI({
                element: "#search",
                showSubResults: true,
                excerptLength: 150
            });
            
            console.log('PagefindUI initialized successfully');
            
            // Apply custom enhancements after Pagefind loads
            setTimeout(() => {
                enhanceSearchInterface();
                
                // Debug: Check if search interface is rendered
                const searchInput = document.querySelector('.pagefind-ui__search-input');
                const searchForm = document.querySelector('.pagefind-ui__form');
                
                console.log('Search input found:', !!searchInput);
                console.log('Search form found:', !!searchForm);
                
                if (!searchInput || !searchForm) {
                    console.error('Pagefind UI elements not found - check CSS or initialization');
                }
            }, 500);
            
        } catch (error) {
            console.error('Failed to initialize PagefindUI:', error);
            // Show fallback message
            const searchElement = document.querySelector('#search');
            if (searchElement) {
                searchElement.innerHTML = '<p class="pagefind-ui__message">Search functionality is currently unavailable. Please try again later.</p>';
            }
        }
    }
    
    // Start initialization
    initializePagefind();
});

function enhanceSearchInterface() {
    // Add custom date formatting to results
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.classList && node.classList.contains('pagefind-ui__result')) {
                        enhanceResult(node);
                    }
                });
            }
        });
    });
    
    const resultsContainer = document.querySelector('.pagefind-ui__results');
    if (resultsContainer) {
        observer.observe(resultsContainer, { childList: true, subtree: true });
    }
    
    // Enhance existing results
    const existingResults = document.querySelectorAll('.pagefind-ui__result');
    existingResults.forEach(result => enhanceResult(result));
}

function enhanceResult(resultElement) {
    // Add date if available and not already added
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
            
            console.log('Added date:', formattedDate, 'to result');
        }
    }
    
    // Handle optional images (if they exist in the content)
    const imgElement = resultElement.querySelector('img');
    if (imgElement && !imgElement.classList.contains('pagefind-ui__result-image')) {
        imgElement.className = 'pagefind-ui__result-image';
        console.log('Enhanced image for result');
    }
}