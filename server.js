const express = require('express');
const app = express();
const PORT = 3000;

// =====================
// MIDDLEWARE
// =====================

// Logger middleware
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
};

// Request time middleware
const addRequestTime = (req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
};

// Built-in middleware
app.use(express.json());

// Custom middleware
app.use(logger);
app.use(addRequestTime);

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
// ROUTES
// =====================

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to CommunityHub API');
});

// Time route
app.get('/api/time', (req, res) => {
    res.json({
        message: "Request received",
        requestTime: req.requestTime
    });
});

// GET all posts
app.get('/api/posts', (req, res) => {
    const { author, sort } = req.query;

    let result = [...posts];

    // Filter by author
    if (author) {
        result = result.filter(post =>
            post.author.toLowerCase().includes(author.toLowerCase())
        );
    }

    // Sort posts
    if (sort === 'newest') {
        result.sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );
    } else if (sort === 'popular') {
        result.sort((a, b) => b.likes - a.likes);
    }

    res.json(result);
});

// GET single post
app.get('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const post = posts.find(p => p.id === id);

    if (!post) {
        return res.status(404).json({
            error: 'Post not found'
        });
    }

    res.json(post);
});

// CREATE post
app.post('/api/posts', (req, res) => {
    const { title, content, author } = req.body;

    // Validation
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

// UPDATE post
app.put('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const post = posts.find(p => p.id === id);

    if (!post) {
        return res.status(404).json({
            error: 'Post not found'
        });
    }

    const { title, content } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;
    post.updatedAt = new Date().toISOString();

    res.json(post);
});

// DELETE post
app.delete('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = posts.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: 'Post not found'
        });
    }

    posts.splice(index, 1);

    res.status(204).send();
});

// LIKE post
app.patch('/api/posts/:id/like', (req, res) => {
    const id = parseInt(req.params.id);

    const post = posts.find(p => p.id === id);

    if (!post) {
        return res.status(404).json({
            error: 'Post not found'
        });
    }

    post.likes += 1;

    res.json(post);
});

// Protected route example
app.get('/api/protected', (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: 'No authorization header'
        });
    }

    res.json({
        message: 'Protected data accessed'
    });
});

// =====================
// 404 HANDLER
// =====================

app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

// =====================
// START SERVER
// =====================

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});