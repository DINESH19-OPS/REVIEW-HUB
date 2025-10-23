// User Controller for Review Hub

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../db');

// Load environment variables
dotenv.config();

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, bio } = req.body;
        
        // Check if user already exists
        const userExists = await db.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );
        
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Insert new user
        const result = await db.query(
            'INSERT INTO users (name, email, password_hash, bio) VALUES ($1, $2, $3, $4) RETURNING id, name, email, bio',
            [name, email, hashedPassword, bio || null]
        );
        
        const user = result.rows[0];
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user exists
        const result = await db.query(
            'SELECT id, name, email, password_hash, bio FROM users WHERE email = $1',
            [email]
        );
        
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const user = result.rows[0];
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        
        // Remove password_hash from user object
        delete user.password_hash;
        
        res.json({
            message: 'Login successful',
            token,
            user
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get user data
        const result = await db.query(
            `SELECT u.id, u.name, u.email, u.bio, u.created_at, 
                    COUNT(r.id) as reviews_count,
                    COUNT(c.id) as comments_count
             FROM users u
             LEFT JOIN reviews r ON u.id = r.user_id
             LEFT JOIN comments c ON u.id = c.user_id
             WHERE u.id = $1
             GROUP BY u.id`,
            [userId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const user = result.rows[0];
        
        res.json({
            user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, bio } = req.body;
        
        // Check if email is already taken by another user
        if (email) {
            const emailCheck = await db.query(
                'SELECT id FROM users WHERE email = $1 AND id != $2',
                [email, userId]
            );
            
            if (emailCheck.rows.length > 0) {
                return res.status(400).json({ message: 'Email is already taken' });
            }
        }
        
        // Build update query dynamically
        const updates = [];
        const params = [];
        let paramIndex = 1;
        
        if (name) {
            updates.push(`name = $${paramIndex}`);
            params.push(name);
            paramIndex++;
        }
        
        if (email) {
            updates.push(`email = $${paramIndex}`);
            params.push(email);
            paramIndex++;
        }
        
        if (bio !== undefined) {
            updates.push(`bio = $${paramIndex}`);
            params.push(bio);
            paramIndex++;
        }
        
        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }
        
        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        
        const query = `
            UPDATE users 
            SET ${updates.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING id, name, email, bio, created_at
        `;
        
        params.push(userId);
        
        const result = await db.query(query, params);
        
        const user = result.rows[0];
        
        res.json({
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
};

// Change user password
const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        
        // Get current password hash
        const result = await db.query(
            'SELECT password_hash FROM users WHERE id = $1',
            [userId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const user = result.rows[0];
        
        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        
        // Hash new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        
        // Update password
        await db.query(
            'UPDATE users SET password_hash = $1 WHERE id = $2',
            [hashedPassword, userId]
        );
        
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error changing password' });
    }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 10, offset = 0 } = req.query;
        
        const result = await db.query(
            `SELECT r.id, r.title, r.content, r.rating, r.created_at,
                    c.name as category
             FROM reviews r
             JOIN categories c ON r.category_id = c.id
             WHERE r.user_id = $1
             ORDER BY r.created_at DESC
             LIMIT $2 OFFSET $3`,
            [userId, parseInt(limit), parseInt(offset)]
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error('Get user reviews error:', error);
        res.status(500).json({ message: 'Server error fetching user reviews' });
    }
};

// Get user's comments
const getUserComments = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 10, offset = 0 } = req.query;
        
        const result = await db.query(
            `SELECT c.id, c.content, c.created_at,
                    r.title as review_title,
                    r.id as review_id
             FROM comments c
             JOIN reviews r ON c.review_id = r.id
             WHERE c.user_id = $1
             ORDER BY c.created_at DESC
             LIMIT $2 OFFSET $3`,
            [userId, parseInt(limit), parseInt(offset)]
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error('Get user comments error:', error);
        res.status(500).json({ message: 'Server error fetching user comments' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    changePassword,
    getUserReviews,
    getUserComments
};