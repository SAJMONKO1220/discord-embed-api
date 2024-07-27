const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // To generate unique identifiers
const app = express();
const port = process.env.PORT || 10000;

// Directory to save HTML files
const publicDir = path.join(__dirname, 'public');

// Ensure the public directory exists
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static(publicDir));

// API endpoint to generate embeds
app.post('/api/generate-embed', (req, res) => {
    const { title, description, color, author, image } = req.body;

    // Validate required fields
    if (!title || !description || !color) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Generate a unique identifier for the file
    const uniqueId = uuidv4();
    const filePath = path.join(publicDir, `${uniqueId}.html`);

    // Create HTML content
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Embed</title>
        </head>
        <body>
            <div>
                <h1>${title}</h1>
                <p>${description}</p>
                <p style="color:#${color.toString(16)}">Color</p>
                ${author ? `<p>Author: ${author}</p>` : ''}
                ${image ? `<img src="${image}" alt="Embed Image" />` : ''}
            </div>
        </body>
        </html>
    `;

    // Save the HTML file
    fs.writeFile(filePath, htmlContent, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Return the URL of the generated HTML file
        const fileUrl = `${req.protocol}://${req.get('host')}/${uniqueId}.html`;
        res.json({ url: fileUrl });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
