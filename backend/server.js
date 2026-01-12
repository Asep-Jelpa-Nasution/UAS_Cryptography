const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

// API Routes
app.use('/api', apiRoutes);

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`╔══════════════════════════════════════╗`);
    console.log(`║    CRYPTOGRAPHY WEB APPLICATION     ║`);
    console.log(`╠══════════════════════════════════════╣`);
    console.log(`║  🚀 Server running on port ${PORT}    ║`);
    console.log(`║  📡 API: http://localhost:${PORT}/api  ║`);
    console.log(`║  🌐 Web: http://localhost:${PORT}      ║`);
    console.log(`╚══════════════════════════════════════╝`);
});