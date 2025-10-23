// Authentication middleware for Review Hub

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }
    
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Middleware for optional authentication (user may or may not be logged in)
const optionalAuth = (req, res, next) => {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        // No token, continue without user info
        req.user = null;
        return next();
    }
    
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // Invalid token, continue without user info
            req.user = null;
        } else {
            // Valid token, attach user info
            req.user = user;
        }
        next();
    });
};

module.exports = {
    authenticateToken,
    optionalAuth
};