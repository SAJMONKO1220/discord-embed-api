const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

app.post('/api/generate-embed', (req, res) => {
    const { title, description, color, author, image } = req.body;

    if (!title || !description || !color) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Generate a unique ID for the embed
    const id = uuid.v4();

    // Create the JSON content
    const embedData = {
        title,
        description,
        color,
        author: author || null,
        image: image || null
    };

    // Write the JSON data to a file
    const filePath = path.join(__dirname, 'public', `${id}.json`);
    fs.writeFile(filePath, JSON.stringify(embedData, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to save embed data' });
        }
        const fileUrl = `https://discord-embed-api-6bx7.onrender.com/${id}.json`;
        res.json({ url: fileUrl });
    });
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
