// Review Controller for Review Hub

const db = require('../db');

// Get all reviews with optional filtering and sorting
const getReviews = async (req, res) => {
    try {
        const { category, sortBy = 'newest', limit, offset } = req.query;
        
        let query = `
            SELECT r.id, r.title, r.content, r.rating, r.created_at,
                   u.name as author,
                   c.name as category
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            JOIN categories c ON r.category_id = c.id
        `;
        
        const params = [];
        let whereClause = '';
        let paramIndex = 1;
        
        // Add category filter if specified
        if (category && category !== 'all') {
            whereClause = `WHERE c.name = $${paramIndex}`;
            params.push(category);
            paramIndex++;
        }
        
        query += whereClause;
        
        // Add sorting
        switch (sortBy) {
            case 'rating-high':
                query += ' ORDER BY r.rating DESC, r.created_at DESC';
                break;
            case 'rating-low':
                query += ' ORDER BY r.rating ASC, r.created_at DESC';
                break;
            case 'newest':
            default:
                query += ' ORDER BY r.created_at DESC';
                break;
        }
        
        // Add pagination if specified
        if (limit) {
            query += ` LIMIT $${paramIndex}`;
            params.push(parseInt(limit));
            paramIndex++;
            
            if (offset) {
                query += ` OFFSET $${paramIndex}`;
                params.push(parseInt(offset));
            }
        }
        
        const result = await db.query(query, params);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ message: 'Server error fetching reviews' });
    }
};

// Get a specific review by ID
const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
            SELECT r.id, r.title, r.content, r.rating, r.created_at,
                   u.name as author,
                   c.name as category
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            JOIN categories c ON r.category_id = c.id
            WHERE r.id = $1
        `;
        
        const result = await db.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }
        
        const review = result.rows[0];
        
        // Get comments for this review
        const commentsQuery = `
            SELECT c.id, c.content, c.created_at,
                   u.name as author,
                   COALESCE(cv.upvotes, 0) as upvotes,
                   COALESCE(cv.downvotes, 0) as downvotes
            FROM comments c
            JOIN users u ON c.user_id = u.id
            LEFT JOIN (
                SELECT comment_id,
                       SUM(CASE WHEN vote_type = 'up' THEN 1 ELSE 0 END) as upvotes,
                       SUM(CASE WHEN vote_type = 'down' THEN 1 ELSE 0 END) as downvotes
                FROM comment_votes
                GROUP BY comment_id
            ) cv ON c.id = cv.comment_id
            WHERE c.review_id = $1
            ORDER BY c.created_at DESC
        `;
        
        const commentsResult = await db.query(commentsQuery, [id]);
        const comments = commentsResult.rows;
        
        res.json({
            ...review,
            comments
        });
    } catch (error) {
        console.error('Get review error:', error);
        res.status(500).json({ message: 'Server error fetching review' });
    }
};

// Create a new review
const createReview = async (req, res) => {
    try {
        const { title, content, rating, category } = req.body;
        const userId = req.user.id;
        
        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        
        // Get category ID
        const categoryResult = await db.query(
            'SELECT id FROM categories WHERE name = $1',
            [category]
        );
        
        if (categoryResult.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid category' });
        }
        
        const categoryId = categoryResult.rows[0].id;
        
        // Insert new review
        const result = await db.query(
            `INSERT INTO reviews (title, content, rating, user_id, category_id)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, title, content, rating, created_at`,
            [title, content, rating, userId, categoryId]
        );
        
        const review = result.rows[0];
        
        res.status(201).json({
            message: 'Review created successfully',
            review
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ message: 'Server error creating review' });
    }
};

// Update a review
const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, rating, category } = req.body;
        const userId = req.user.id;
        
        // Validate rating
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        
        // Check if review exists and belongs to user
        const reviewCheck = await db.query(
            'SELECT user_id FROM reviews WHERE id = $1',
            [id]
        );
        
        if (reviewCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }
        
        if (reviewCheck.rows[0].user_id !== userId) {
            return res.status(403).json({ message: 'Not authorized to update this review' });
        }
        
        // Get category ID if category is provided
        let categoryId = null;
        if (category) {
            const categoryResult = await db.query(
                'SELECT id FROM categories WHERE name = $1',
                [category]
            );
            
            if (categoryResult.rows.length === 0) {
                return res.status(400).json({ message: 'Invalid category' });
            }
            
            categoryId = categoryResult.rows[0].id;
        }
        
        // Build update query dynamically
        const updates = [];
        const params = [];
        let paramIndex = 1;
        
        if (title) {
            updates.push(`title = $${paramIndex}`);
            params.push(title);
            paramIndex++;
        }
        
        if (content) {
            updates.push(`content = $${paramIndex}`);
            params.push(content);
            paramIndex++;
        }
        
        if (rating) {
            updates.push(`rating = $${paramIndex}`);
            params.push(rating);
            paramIndex++;
        }
        
        if (categoryId) {
            updates.push(`category_id = $${paramIndex}`);
            params.push(categoryId);
            paramIndex++;
        }
        
        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }
        
        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        
        const query = `
            UPDATE reviews 
            SET ${updates.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING id, title, content, rating, created_at
        `;
        
        params.push(id);
        
        const result = await db.query(query, params);
        
        const review = result.rows[0];
        
        res.json({
            message: 'Review updated successfully',
            review
        });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ message: 'Server error updating review' });
    }
};

// Delete a review
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        // Check if review exists and belongs to user
        const reviewCheck = await db.query(
            'SELECT user_id FROM reviews WHERE id = $1',
            [id]
        );
        
        if (reviewCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }
        
        if (reviewCheck.rows[0].user_id !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }
        
        // Delete review
        await db.query('DELETE FROM reviews WHERE id = $1', [id]);
        
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ message: 'Server error deleting review' });
    }
};

// Add a comment to a review
const addComment = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { content, parentCommentId } = req.body;
        const userId = req.user.id;
        
        // Check if review exists
        const reviewCheck = await db.query(
            'SELECT id FROM reviews WHERE id = $1',
            [reviewId]
        );
        
        if (reviewCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }
        
        // Check if parent comment exists (if provided)
        if (parentCommentId) {
            const parentCheck = await db.query(
                'SELECT id FROM comments WHERE id = $1 AND review_id = $2',
                [parentCommentId, reviewId]
            );
            
            if (parentCheck.rows.length === 0) {
                return res.status(400).json({ message: 'Invalid parent comment' });
            }
        }
        
        // Insert new comment
        const result = await db.query(
            `INSERT INTO comments (content, user_id, review_id, parent_comment_id)
             VALUES ($1, $2, $3, $4)
             RETURNING id, content, created_at`,
            [content, userId, reviewId, parentCommentId || null]
        );
        
        const comment = result.rows[0];
        
        res.status(201).json({
            message: 'Comment added successfully',
            comment
        });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ message: 'Server error adding comment' });
    }
};

// Get categories
const getCategories = async (req, res) => {
    try {
        const result = await db.query('SELECT id, name FROM categories ORDER BY name');
        res.json(result.rows);
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ message: 'Server error fetching categories' });
    }
};

// Vote on a comment
const voteOnComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { voteType } = req.body; // 'up' or 'down'
        const userId = req.user.id;
        
        // Validate vote type
        if (voteType !== 'up' && voteType !== 'down') {
            return res.status(400).json({ message: 'Invalid vote type' });
        }
        
        // Check if comment exists
        const commentCheck = await db.query(
            'SELECT id FROM comments WHERE id = $1',
            [commentId]
        );
        
        if (commentCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        
        // Check if user has already voted on this comment
        const existingVote = await db.query(
            'SELECT id, vote_type FROM comment_votes WHERE user_id = $1 AND comment_id = $2',
            [userId, commentId]
        );
        
        if (existingVote.rows.length > 0) {
            // Update existing vote
            if (existingVote.rows[0].vote_type === voteType) {
                // Remove vote if same type
                await db.query(
                    'DELETE FROM comment_votes WHERE user_id = $1 AND comment_id = $2',
                    [userId, commentId]
                );
                res.json({ message: 'Vote removed' });
            } else {
                // Change vote
                await db.query(
                    'UPDATE comment_votes SET vote_type = $1 WHERE user_id = $2 AND comment_id = $3',
                    [voteType, userId, commentId]
                );
                res.json({ message: 'Vote updated' });
            }
        } else {
            // Add new vote
            await db.query(
                'INSERT INTO comment_votes (user_id, comment_id, vote_type) VALUES ($1, $2, $3)',
                [userId, commentId, voteType]
            );
            res.json({ message: 'Vote added' });
        }
    } catch (error) {
        console.error('Vote on comment error:', error);
        res.status(500).json({ message: 'Server error voting on comment' });
    }
};

// Search reviews
const searchReviews = async (req, res) => {
    try {
        const { query, category, sortBy = 'newest' } = req.query;
        
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        
        let dbQuery = `
            SELECT r.id, r.title, r.content, r.rating, r.created_at,
                   u.name as author,
                   c.name as category
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            JOIN categories c ON r.category_id = c.id
            WHERE (r.title ILIKE $1 OR r.content ILIKE $1)
        `;
        
        const params = [`%${query}%`];
        let paramIndex = 2;
        
        // Add category filter if specified
        if (category && category !== 'all') {
            dbQuery += ` AND c.name = $${paramIndex}`;
            params.push(category);
            paramIndex++;
        }
        
        // Add sorting
        switch (sortBy) {
            case 'rating-high':
                dbQuery += ' ORDER BY r.rating DESC, r.created_at DESC';
                break;
            case 'rating-low':
                dbQuery += ' ORDER BY r.rating ASC, r.created_at DESC';
                break;
            case 'newest':
            default:
                dbQuery += ' ORDER BY r.created_at DESC';
                break;
        }
        
        const result = await db.query(dbQuery, params);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Search reviews error:', error);
        res.status(500).json({ message: 'Server error searching reviews' });
    }
};

module.exports = {
    getReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
    addComment,
    getCategories,
    voteOnComment,
    searchReviews
};