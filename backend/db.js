// Database connection setup for Review Hub

const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create a new pool instance
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Database connected successfully');
    }
});

// Export the pool
module.exports = {
    query: (text, params) => pool.query(text, params),
};