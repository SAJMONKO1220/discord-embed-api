// server.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Endpoint to create an embed and return a URL
app.post('/api/generate-embed', (req, res) => {
    const { title, description, color } = req.body;
    if (!title || !description || !color) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Generate a unique filename
    const filename = `${Date.now()}.html`;
    const filePath = path.join(__dirname, 'public', filename);

    // Create HTML with OpenGraph metadata
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://example.com/image.png" /> <!-- Add a relevant image URL -->
        <meta property="og:url" content="https://yourdomain.com/${filename}" />
    </head>
    <body>
        <h1>${title}</h1>
        <p>${description}</p>
    </body>
    </html>
    `;

    // Save the HTML file
    fs.writeFile(filePath, htmlContent, (err) => {
        if (err) {
            console.error('Error writing file', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Return the URL to the generated page
        res.json({ url: `https://yourdomain.com/${filename}` });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
