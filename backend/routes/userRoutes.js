// User Routes for Review Hub

const express = require('express');
const { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    updateUserProfile, 
    changePassword, 
    getUserReviews, 
    getUserComments 
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);
router.put('/change-password', authenticateToken, changePassword);
router.get('/reviews', authenticateToken, getUserReviews);
router.get('/comments', authenticateToken, getUserComments);

module.exports = router;