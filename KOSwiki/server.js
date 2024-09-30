const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static('public'));

// Helper function to get the display name from a page
function getDisplayNameFromPage(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const match = fileContent.match(/<meta name="display-name" content="(.*?)"/);
    return match ? match[1] : path.basename(filePath, '.html');  // Fallback to file name if no meta tag
}

// Helper function to get the article description from a page
function getArticleDescription(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const match = fileContent.match(/<p class="article-description">(.*?)<\/p>/);
    return match ? match[1] : 'No description available';  // Fallback if no description is found
}

// Helper function to get all wiki pages
function getWikiPages() {
    const wikiDir = path.join(__dirname, 'public', 'wiki'); // Ensure this path is correct
    return fs.readdirSync(wikiDir)
        .filter(file => file.endsWith('.html'))
        .map(file => ({
            title: path.basename(file, '.html'),
            displayName: getDisplayNameFromPage(path.join(wikiDir, file)), // Read the display name from the meta tag
            description: getArticleDescription(path.join(wikiDir, file)), // Read the article description
            url: `/wiki/${file}`
        }));
}

// API endpoint to search or list all pages
app.get('/search', (req, res) => {
    const query = req.query.q;
    let pages = getWikiPages();

    if (query) {
        pages = pages.filter(page => 
            page.displayName.toLowerCase().includes(query.toLowerCase())
        );
    }

    res.json(pages);
});
// API endpoint to get the total number of pages
app.get('/page-count', (req, res) => {
    const pages = getWikiPages();
    res.json({ count: pages.length });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
