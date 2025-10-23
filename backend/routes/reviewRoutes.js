// Review Routes for Review Hub

const express = require('express');
const { 
    getReviews, 
    getReviewById, 
    createReview, 
    updateReview, 
    deleteReview, 
    addComment, 
    getCategories, 
    voteOnComment, 
    searchReviews 
} = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getReviews);
router.get('/search', searchReviews);
router.get('/categories', getCategories);
router.get('/:id', getReviewById);

// Protected routes
router.post('/', authenticateToken, createReview);
router.put('/:id', authenticateToken, updateReview);
router.delete('/:id', authenticateToken, deleteReview);
router.post('/:id/comments', authenticateToken, addComment);
router.post('/:id/comments/:commentId/vote', authenticateToken, voteOnComment);

module.exports = router;