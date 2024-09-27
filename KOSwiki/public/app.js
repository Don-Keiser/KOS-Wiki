const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const suggestionsContainer = document.getElementById('suggestions');

let pages = [];

// Fetch the list of wiki pages from the server
async function loadPages() {
    try {
        const response = await fetch('/api/pages');
        pages = await response.json();
    } catch (error) {
        console.error('Failed to load pages:', error);
    }
}

// Call the function to load pages when the script is loaded
loadPages();

function searchLocalWiki(query) {
    if (query.trim() === '') {
        // If the query is empty, return all pages
        return pages;
    }
    return pages.filter(page => 
        page.title.toLowerCase().includes(query.toLowerCase())
    );
}

function displayResults(results) {
    searchResults.innerHTML = '';

    results.forEach((result) => {
        const titleLink = `<a href="${result.url}" target="_blank" rel="noopener">${result.title}</a>`;
        const urlLink = `<a href="${result.url}" class="result-link" target="_blank" rel="noopener">${result.url}</a>`;

        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <h3 class="result-title">${titleLink}</h3>
            ${urlLink}
        `;

        searchResults.appendChild(resultItem);
    });
}

function showSuggestions(query) {
    suggestionsContainer.innerHTML = ''; // Clear previous suggestions

    if (query.trim() === '') {
        suggestionsContainer.style.display = 'none'; // Hide suggestions if input is empty
        return; // Don't show suggestions for empty input
    }

    const suggestions = pages.filter(page =>
        page.title.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6); // Limit to the first 6 results

    if (suggestions.length === 0) {
        suggestionsContainer.style.display = 'none'; // Hide if no suggestions
        return;
    }

    suggestionsContainer.style.display = 'block'; // Show suggestions if there are any

    suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.innerText = suggestion.title;

        suggestionItem.addEventListener('click', () => {
            searchInput.value = suggestion.title; // Set input value to suggestion
            suggestionsContainer.innerHTML = ''; // Clear suggestions
            const results = searchLocalWiki(suggestion.title);
            displayResults(results);
            suggestionsContainer.style.display = 'none'; // Hide suggestions after selection
        });

        suggestionsContainer.appendChild(suggestionItem);
    });
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const query = searchInput.value.trim();

    searchResults.innerHTML = "<div class='spinner'>Loading ...</div>";

    const results = searchLocalWiki(query);

    if (results.length === 0) {
        searchResults.innerHTML = "<p>No results found.</p>";
    } else {
        displayResults(results);
    }
});

// Event listener for input changes to show suggestions
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    showSuggestions(query);
});
