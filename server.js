const express = require('express');
const app = express();
const PORT = 3000;

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to CommunityHub API');
});

// About route
app.get('/about', (req, res) => {
    res.send('CommunityHub - A community platform');
});

// API health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// Send text
app.get('/text', (req, res) => {
    res.send('Plain text response');
});

// Send JSON
app.get('/json', (req, res) => {
    res.json({
        message: 'JSON response',
        success: true
    });
});

// Send with status code
app.get('/error', (req, res) => {
    res.status(400).json({
        error: 'Bad request'
    });
});

// New page
app.get('/new-page', (req, res) => {
    res.send('Welcome to the new page!');
});

// Redirect
app.get('/old-page', (req, res) => {
    res.redirect('/new-page');
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});