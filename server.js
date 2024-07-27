const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to generate an embed
app.post('/api/generate-embed', (req, res) => {
    const { title, description, color, imageUrl } = req.body;

    // Validate the request body
    if (!title || !description || !color) {
        return res.status(400).json({ error: 'Title, description, and color are required' });
    }

    // Create the embed object
    const embed = {
        title: sanitizeText(title),
        description: sanitizeText(description),
        color: parseInt(color, 10),
        ...(imageUrl && { image: { url: sanitizeText(imageUrl) } }) // Include image only if imageUrl is provided
    };

    // Generate a unique filename for the HTML file
    const fileName = `${Date.now()}.html`;
    const filePath = path.join(__dirname, 'public', fileName);

    // Create HTML content for the embed
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Discord Embed</title>
    <meta property="og:title" content="${embed.title}" />
    <meta property="og:description" content="${embed.description}" />
    <meta property="og:image" content="${embed.image ? embed.image.url : ''}" />
    <meta property="og:color" content="#${embed.color.toString(16)}" />
</head>
<body>
    <div style="border: 1px solid #${embed.color.toString(16)}; padding: 10px; border-radius: 5px; width: 300px;">
        <h3 style="margin: 0;">${embed.title}</h3>
        <p>${embed.description}</p>
        ${embed.image ? `<img src="${embed.image.url}" alt="Image" style="max-width: 100%;">` : ''}
    </div>
</body>
</html>`;

    // Write the HTML content to a file
    fs.writeFile(filePath, htmlContent, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error writing file' });
        }

        // Return the full URL to access the HTML file
        const fullUrl = `${req.protocol}://${req.get('host')}/${fileName}`;
        res.json({ url: fullUrl });
    });
});

// Sanitize text to avoid unwanted HTML or Markdown
function sanitizeText(text) {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
