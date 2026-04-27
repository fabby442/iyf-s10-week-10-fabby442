const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to read JSON body
app.use(express.json());

// =====================
// IN-MEMORY DATABASE
// =====================
let posts = [
    {
        id: 1,
        title: "Getting Started with Node.js",
        content: "Node.js is a JavaScript runtime...",
        author: "John Doe",
        createdAt: "2026-01-15T10:00:00Z",
        likes: 10
    },
    {
        id: 2,
        title: "Express.js Fundamentals",
        content: "Express is a web framework...",
        author: "Jane Smith",
        createdAt: "2026-01-16T14:30:00Z",
        likes: 15
    }
];

let nextId = 3;

// =====================
// GET ALL POSTS
// =====================
app.get('/api/posts', (req, res) => {
    const { author, sort } = req.query;

    let result = [...posts];

    if (author) {
        result = result.filter(p =>
            p.author.toLowerCase().includes(author.toLowerCase())
        );
    }

    if (sort === 'newest') {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'popular') {
        result.sort((a, b) => b.likes - a.likes);
    }

    res.json(result);
});

// =====================
// GET SINGLE POST
// =====================
app.get('/api/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
});

// =====================
// CREATE POST
// =====================
app.post('/api/posts', (req, res) => {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
        return res.status(400).json({
            error: 'Title, content, and author are required'
        });
    }

    const newPost = {
        id: nextId++,
        title,
        content,
        author,
        createdAt: new Date().toISOString(),
        likes: 0
    };

    posts.push(newPost);
    res.status(201).json(newPost);
});

// =====================
// UPDATE POST (PUT)
// =====================
app.put('/api/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const { title, content } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;
    post.updatedAt = new Date().toISOString();

    res.json(post);
});

// =====================
// DELETE POST
// =====================
app.delete('/api/posts/:id', (req, res) => {
    const index = posts.findIndex(p => p.id === parseInt(req.params.id));

    if (index === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }

    posts.splice(index, 1);
    res.status(204).send();
});

// =====================
// LIKE POST (PATCH)
// =====================
app.patch('/api/posts/:id/like', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    post.likes += 1;

    res.json(post);
});

// =====================
// 404 HANDLER (LAST)
// =====================
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// =====================
// START SERVER
// =====================
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});