require('dotenv').config();

const express = require('express');

const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// Built-in middleware
app.use(express.json());

// Custom middleware
app.use(logger);

// Routes
app.use('/api', routes);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;