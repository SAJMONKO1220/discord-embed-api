const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/api/generate-embed', (req, res) => {
    const { title, description, color } = req.body;

    if (!title || !description || !color) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const embed = {
        title: title,
        description: description,
        color: color
    };

    res.json(embed);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
