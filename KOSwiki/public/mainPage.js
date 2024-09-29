const smallSearchForm = document.getElementById('small-search-form');
const smallInput = document.getElementById('small-search-input'); // Make sure this ID matches your HTML
const smallSuggestionsContainer = document.getElementById('small-suggestions');
const articleCountElement = document.getElementById('article-count'); // Element to display the count

let pages = [];

// Fetch the list of wiki pages from the server
async function loadPages() {
    try {
        const response = await fetch('/search');  // Adjusting to the same endpoint as app.js
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        pages = await response.json();
        console.log('Pages loaded:', pages);  // Log the loaded pages for debugging
    } catch (error) {
        console.error('Failed to load pages:', error);
    }
}

// Fetch the number of pages and display it
async function loadPageCount() {
    try {
        const response = await fetch('/page-count');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        articleCountElement.textContent = `${data.count} articles`;
    } catch (error) {
        console.error('Failed to load page count:', error);
        articleCountElement.textContent = 'Could not load article count'; // Handle error state
    }
}

// Call the functions to load pages and page count when the script is loaded
loadPages();
loadPageCount();

function getSmallSuggestions(query) {
    if (query.trim() === '') {
        return []; // Return empty array for empty query
    }

    // Filter suggestions based on the input
    return pages.filter(page =>
        page.title.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6); // Limit to the first 6 results
}

function displaySmallSuggestions(suggestions) {
    smallSuggestionsContainer.innerHTML = ''; // Clear previous suggestions

    if (suggestions.length === 0) {
        smallSuggestionsContainer.style.display = 'none'; // Hide if no suggestions
        return;
    }

    smallSuggestionsContainer.style.display = 'block'; // Show suggestions

    suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'small-suggestion-item';
        suggestionItem.innerText = suggestion.title;

        // Add event listener for click
        suggestionItem.addEventListener('click', () => {
            navigateToPage(suggestion.title); // Navigate to the page on click
        });

        smallSuggestionsContainer.appendChild(suggestionItem);
    });
}

// Function to navigate to the page based on title
function navigateToPage(title) {
    // Assuming that the page URLs are structured in a way that matches the titles
    const pageUrl = `/wiki/${encodeURIComponent(title)}.html`; // Adjust this path as needed
    window.location.href = pageUrl; // Redirect to the selected page
}

// Event listener for input changes to show suggestions
smallInput.addEventListener('input', () => {
    const query = smallInput.value.trim();
    const suggestions = getSmallSuggestions(query);
    displaySmallSuggestions(suggestions);
});

// Optional: Handle form submission
smallSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const query = smallInput.value.trim();
    if (query) {
        navigateToPage(query); // Navigate to the page when the form is submitted
    }
});
