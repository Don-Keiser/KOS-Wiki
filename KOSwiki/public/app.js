const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const suggestionsContainer = document.getElementById('suggestions');

let pages = [];

// Fetch the list of wiki pages from the server
async function loadPages() {
    try {
        const response = await fetch('/search');  // Fetching from the correct endpoint
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        pages = await response.json();
        console.log('Pages loaded:', pages);  // Log the loaded pages for debugging
    } catch (error) {
        console.error('Failed to load pages:', error);
    }
}

// Call the function to load pages when the script is loaded
loadPages();

function searchLocalWiki(query) {
    if (query.trim() === '') {
        // Redirect to the main page if the query is empty
        window.location.href = '/mainPage.html';  // Adjust the path as needed
        return [];
    }
    return pages.filter(page => 
        page.displayName.toLowerCase().includes(query.toLowerCase())
    );
}

function displayResults(results) {
    searchResults.innerHTML = '';

    results.forEach((result) => {
        const titleLink = `<a href="${result.url}" target="_blank" rel="noopener">${result.displayName}</a>`;
        const description = result.description ? `<p class="result-description">${result.description}</p>` : '';

        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <h3 class="result-title">${titleLink}</h3>
            ${description}
        `;

        searchResults.appendChild(resultItem);
    });
}

function showSuggestions(query) {
    suggestionsContainer.innerHTML = ''; // Clear previous suggestions

    if (query.trim() === '') {
        suggestionsContainer.style.display = 'none';
        return;
    }

    const suggestions = pages.filter(page =>
        page.displayName.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6); // Limit to the first 6 results

    if (suggestions.length === 0) {
        suggestionsContainer.style.display = 'none'; // Hide if no suggestions
        return;
    }

    suggestionsContainer.style.display = 'block'; // Show suggestions if there are any

    suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.innerText = suggestion.displayName;

        suggestionItem.addEventListener('click', () => {
            searchInput.value = suggestion.displayName; // Set input value to suggestion
            suggestionsContainer.innerHTML = ''; // Clear suggestions
            const results = searchLocalWiki(suggestion.displayName);
            displayResults(results);
            suggestionsContainer.style.display = 'none'; // Hide suggestions after selection
        });

        suggestionsContainer.appendChild(suggestionItem);
    });
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const query = searchInput.value.trim();

    if (!query) {
        // Redirect to the main page if the search input is blank
        window.location.href = '/mainPage.html';  // Adjust the path as needed
        return;
    }

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
