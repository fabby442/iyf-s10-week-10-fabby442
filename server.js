const express = require('express');
const app = express();
const PORT = 3000;

// =====================
// BASIC ROUTES
// =====================
app.get('/', (req, res) => {
    res.send('Welcome to CommunityHub API');
});

app.get('/about', (req, res) => {
    res.send('CommunityHub - A community platform');
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// =====================
// RESPONSE METHODS
// =====================
app.get('/text', (req, res) => {
    res.send('Plain text response');
});

app.get('/json', (req, res) => {
    res.json({
        message: 'JSON response',
        success: true
    });
});

app.get('/error', (req, res) => {
    res.status(400).json({
        error: 'Bad request'
    });
});

app.get('/new-page', (req, res) => {
    res.send('Welcome to the new page!');
});

app.get('/old-page', (req, res) => {
    res.redirect('/new-page');
});

// =====================
// ROUTE PARAMETERS
// =====================
app.get('/users/:id', (req, res) => {
    res.json({
        message: `Getting user ${req.params.id}`
    });
});

app.get('/posts/:postId/comments/:commentId', (req, res) => {
    const { postId, commentId } = req.params;

    res.json({ postId, commentId });
});

// =====================
// QUERY STRINGS
// =====================
app.get('/search', (req, res) => {
    const { q, limit = 10, page = 1 } = req.query;

    res.json({
        query: q,
        limit: parseInt(limit),
        page: parseInt(page)
    });
});

app.get('/posts', (req, res) => {
    const { category, sort = 'newest' } = req.query;

    res.json({
        message: 'Getting posts',
        filters: { category, sort }
    });
});

// =====================
// 404 HANDLER (MUST BE LAST)
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