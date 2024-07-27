const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = process.env.PORT || 10000;

// Middleware to parse JSON bodies
app.use(express.json());

// API endpoint to generate embeds
app.post('/api/generate-embed', (req, res) => {
    const { title, description, color, author, image } = req.body;

    // Validate required fields
    if (!title || !description || !color) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Create embed object
    const embed = {
        title: title,
        description: description,
        color: color,
        author: author ? { name: author } : undefined,
        image: image ? { url: image } : undefined
    };

    // Generate a unique identifier for the file
    const uniqueId = uuidv4();

    // Return JSON data including the URL to use with Discord
    res.json({
        url: `https://discord-embed-api-6bx7.onrender.com/api/embed/${uniqueId}`,
        embed: embed
    });
});

// Endpoint to return embed JSON for testing
app.get('/api/embed/:id', (req, res) => {
    const { id } = req.params;

    // Return sample embed data
    // You should use your own logic to fetch embed data based on ID if you store it
    res.json({
        title: "Sample Title",
        description: "Sample Description",
        color: 16711680,
        author: { name: "Sample Author" },
        image: { url: "https://example.com/image.png" }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
