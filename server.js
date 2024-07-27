const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static('public'));

// Handle POST request to generate embed
app.post('/api/generate-embed', (req, res) => {
    const { title, description, color, author, fields, image } = req.body;

    // Validate required fields
    if (!title || !description || !color) {
        return res.status(400).json({ error: 'Title, description, and color are required' });
    }

    // Generate a unique ID for the embed
    const id = uuid.v4();

    // Generate HTML content with meta tags for Discord
    let fieldsHtml = '';
    if (fields && Array.isArray(fields)) {
        fieldsHtml = fields.map(field => `
            <div class="embed-field">
                <div class="embed-field-title">${field.name}</div>
                <div class="embed-field-value">${field.value}</div>
            </div>
        `).join('');
    }

    let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image || 'https://example.com/default-image.png'}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://discord-embed-api-6bx7.onrender.com/${id}.html">
    <meta property="og:author" content="${author || 'Unknown'}">
    <meta property="og:color" content="#${color.toString(16)}">

    <!-- Additional Meta Tags for Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${image || 'https://example.com/default-image.png'}">
    <meta name="twitter:site" content="@your_twitter_handle">
    <meta name="twitter:creator" content="@your_twitter_handle">

    <title>${title}</title>
    <style>
        .embed {
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            background-color: #f9f9f9;
            color: #333;
            font-family: Arial, sans-serif;
            max-width: 500px;
        }
        .embed-header {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .embed-author {
            font-style: italic;
            margin-top: 5px;
        }
        .embed-image {
            max-width: 100%;
            border-radius: 5px;
            margin-top: 10px;
        }
        .embed-field {
            margin-top: 10px;
        }
        .embed-field-title {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="embed" style="border-color: #${color.toString(16)};">
        <div class="embed-header">${title}</div>
        <div class="embed-body">${description}</div>
        ${author ? `<div class="embed-author">Author: ${author}</div>` : ''}
        ${image ? `<img src="${image}" class="embed-image" alt="Embed Image"/>` : ''}
        ${fieldsHtml}
    </div>
</body>
</html>
    `;

    // Write the HTML data to a file
    const filePath = path.join(__dirname, 'public', `${id}.html`);
    fs.writeFile(filePath, htmlContent, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to save embed data' });
        }
        const fileUrl = `https://discord-embed-api-6bx7.onrender.com/${id}.html`;
        res.json({ url: fileUrl });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
