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

// 404 handler (put at the end)
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});