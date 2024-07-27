const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

// Base URL for your API
const BASE_URL = 'https://discord-embed-api-6bx7.onrender.com';

// Middleware to parse JSON bodies
app.use(express.json());

// API endpoint to generate embeds
app.post('/api/generate-embed', (req, res) => {
    const { title, description, color, author, image } = req.body;

    // Validate required fields
    if (!title || !description || !color) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Basic embed object
    const embed = {
        title: title,
        description: description,
        color: color,
        author: {
            name: author || 'Default Author',
            url: 'https://example.com', // Example URL; remove if not needed
            icon_url: 'https://example.com/icon.png' // Example icon URL; remove if not needed
        },
        image: image ? { url: image } : undefined
    };

    // Generate the URL for the embed (assuming you want to return the URL that generates the embed)
    const embedUrl = `${BASE_URL}/api/generate-embed?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&color=${color}&author=${encodeURIComponent(author || '')}&image=${encodeURIComponent(image || '')}`;

    // Return the full URL and the embed object
    res.json({
        message: 'Embed generated successfully',
        url: embedUrl,
        embed: embed
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
