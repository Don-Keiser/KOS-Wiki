const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static('public'));

// Helper function to get all wiki pages
function getWikiPages() {
    const wikiDir = path.join(__dirname, 'public', 'wiki');
    return fs.readdirSync(wikiDir).filter(file => file.endsWith('.html')).map(file => ({
        title: path.basename(file, '.html'),
        url: `/wiki/${file}`
    }));
}

// API endpoint to search or list all pages
app.get('/search', (req, res) => {
    const query = req.query.q;
    let pages = getWikiPages();

    if (query) {
        pages = pages.filter(page => page.title.toLowerCase().includes(query.toLowerCase()));
    }

    res.json(pages);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});