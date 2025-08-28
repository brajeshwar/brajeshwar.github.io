// Pagefind Search Initialization and Customization

window.addEventListener('DOMContentLoaded', (event) => {
    // Initialize Pagefind UI
    new PagefindUI({ 
        element: "#search",
        showSubResults: true,
        excerptLength: 150,
        resetStyles: false, // Keep our custom styles
        
        // Custom result processing
        processTerm: function(term) {
            return term;
        },
        
        // Custom result rendering
        processResult: function(result) {
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
    
    // Custom styling after initialization
    setTimeout(() => {
        customizeSearchResults();
    }, 100);
});

function customizeSearchResults() {
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
}

function enhanceResult(resultElement) {
    // Add date if available in the result data
    const titleElement = resultElement.querySelector('.pagefind-ui__result-title');
    const excerptElement = resultElement.querySelector('.pagefind-ui__result-excerpt');
    
    if (titleElement && excerptElement) {
        // Try to extract date from URL or other metadata
        const linkElement = titleElement.querySelector('a');
        if (linkElement && linkElement.href) {
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
                
                // Insert date element
                const dateElement = document.createElement('div');
                dateElement.className = 'pagefind-ui__result-date';
                dateElement.textContent = formattedDate;
                titleElement.insertAdjacentElement('afterend', dateElement);
            }
        }
    }
    
    // Handle optional images (if they exist in the content)
    const imgElement = resultElement.querySelector('img');
    if (imgElement) {
        imgElement.className = 'pagefind-ui__result-image';
        // Move image to the right side
        resultElement.appendChild(imgElement);
    }
    
    // Wrap content in a container for better layout
    const contentElements = resultElement.querySelectorAll('.pagefind-ui__result-title, .pagefind-ui__result-date, .pagefind-ui__result-excerpt');
    if (contentElements.length > 0) {
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'pagefind-ui__result-content';
        
        contentElements.forEach(element => {
            contentWrapper.appendChild(element);
        });
        
        resultElement.insertBefore(contentWrapper, resultElement.firstChild);
    }
}