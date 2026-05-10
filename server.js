const express = require('express');
const app = express();
const PORT = 3000;

// =====================
// BUILT-IN MIDDLEWARE
// =====================

app.use(express.json());

// =====================
// CUSTOM MIDDLEWARE
// =====================

// Logger middleware
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
};

app.use(logger);

// Request time middleware
const addRequestTime = (req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
};

app.use(addRequestTime);

// Auth middleware
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: 'No authorization header'
        });
    }

    next();
};

// Validation middleware
const validatePost = (req, res, next) => {
    const { title, content, author } = req.body;

    const errors = [];

    if (!title || title.length < 3) {
        errors.push('Title must be at least 3 characters');
    }

    if (!content || content.length < 10) {
        errors.push('Content must be at least 10 characters');
    }

    if (!author) {
        errors.push('Author is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

// =====================
// CUSTOM ERROR CLASS
// =====================

class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// =====================
// DATA
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

// Home
app.get('/', (req, res) => {
    res.send('Welcome to CommunityHub API');
});

// Time route
app.get('/api/time', (req, res) => {
    res.json({
        requestTime: req.requestTime
    });
});

// Protected route
app.get('/api/protected', requireAuth, (req, res) => {
    res.json({
        message: 'Protected data accessed'
    });
});

// Error test route
app.get('/api/error-test', (req, res, next) => {
    try {
        throw new ApiError('Something went wrong', 500);
    } catch (error) {
        next(error);
    }
});

// GET all posts
app.get('/api/posts', (req, res) => {
    const { author, sort } = req.query;

    let result = [...posts];

    if (author) {
        result = result.filter(post =>
            post.author.toLowerCase().includes(author.toLowerCase())
        );
    }

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
app.get('/api/posts/:id', (req, res, next) => {
    const id = parseInt(req.params.id);

    const post = posts.find(p => p.id === id);

    if (!post) {
        return next(new ApiError('Post not found', 404));
    }

    res.json(post);
});

// CREATE post
app.post('/api/posts', validatePost, (req, res) => {
    const { title, content, author } = req.body;

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
app.put('/api/posts/:id', (req, res, next) => {
    const id = parseInt(req.params.id);

    const post = posts.find(p => p.id === id);

    if (!post) {
        return next(new ApiError('Post not found', 404));
    }

    const { title, content } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;
    post.updatedAt = new Date().toISOString();

    res.json(post);
});

// DELETE post
app.delete('/api/posts/:id', (req, res, next) => {
    const id = parseInt(req.params.id);

    const index = posts.findIndex(p => p.id === id);

    if (index === -1) {
        return next(new ApiError('Post not found', 404));
    }

    posts.splice(index, 1);

    res.status(204).send();
});

// LIKE post
app.patch('/api/posts/:id/like', (req, res, next) => {
    const id = parseInt(req.params.id);

    const post = posts.find(p => p.id === id);

    if (!post) {
        return next(new ApiError('Post not found', 404));
    }

    post.likes += 1;

    res.json(post);
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
// ERROR HANDLER
// MUST BE LAST
// =====================

app.use((err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: {
            message,
            status: statusCode
        }
    });
});

// =====================
// START SERVER
// =====================

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});