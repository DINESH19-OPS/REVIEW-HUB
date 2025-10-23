// Review Page JavaScript for Review Hub

// DOM Elements
const commentForm = document.getElementById('comment-form');
const commentText = document.getElementById('comment-text');
const commentsList = document.getElementById('comments-list');

// Sample review data for demonstration
const reviewData = {
    id: 1,
    title: "The Great Gatsby",
    author: "Jane Smith",
    date: "2025-06-15",
    rating: 4,
    content: `"The Great Gatsby" is a masterpiece of American literature that captures the essence of the Jazz Age with remarkable precision and artistry. F. Scott Fitzgerald's prose is both lyrical and incisive, painting a vivid portrait of the American Dream's corruption and ultimate emptiness.

The character development is exceptional, particularly Jay Gatsby himself, whose tragic pursuit of the unattainable Daisy Buchanan serves as the novel's central theme. Fitzgerald's symbolism is rich and layered, from the green light at the end of Daisy's dock to the eyes of Doctor T.J. Eckleburg overlooking the Valley of Ashes.

While the novel's critique of 1920s American society remains relevant today, some readers may find the pacing slow compared to contemporary fiction. The themes of wealth, love, and disillusionment are explored with sophistication, but the moral ambiguity of the characters may be challenging for some readers.

Overall, "The Great Gatsby" is essential reading for anyone interested in American literature. Its exploration of the American Dream's dark underbelly is as relevant today as it was nearly a century ago.`
};

// Sample comments data for demonstration
const commentsData = [
    {
        id: 1,
        author: "John Doe",
        date: "2025-06-16",
        content: "Great review! I completely agree with your assessment of the symbolism in the novel.",
        upvotes: 5,
        downvotes: 1,
        userVote: null,
        replies: [
            {
                id: 101,
                author: "Jane Smith",
                date: "2025-06-17",
                content: "Thank you! I'm glad you found the analysis insightful.",
                upvotes: 3,
                downvotes: 0,
                userVote: null
            }
        ]
    },
    {
        id: 2,
        author: "Alice Johnson",
        date: "2025-06-18",
        content: "I've always struggled with this book. Your review helped me appreciate it more.",
        upvotes: 8,
        downvotes: 0,
        userVote: null,
        replies: []
    }
];

// Display review data
function displayReview() {
    const reviewTitle = document.getElementById('review-title');
    const reviewAuthor = document.getElementById('review-author');
    const reviewDate = document.getElementById('review-date');
    const reviewRating = document.getElementById('review-rating');
    const reviewContent = document.getElementById('review-content');
    
    if (reviewTitle) reviewTitle.textContent = reviewData.title;
    if (reviewAuthor) reviewAuthor.textContent = reviewData.author;
    if (reviewDate) reviewDate.textContent = formatDate(reviewData.date);
    if (reviewRating) reviewRating.innerHTML = createStarRating(reviewData.rating);
    if (reviewContent) reviewContent.textContent = reviewData.content;
}

// Function to create star rating HTML
function createStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<span class="star filled">★</span>';
        } else {
            stars += '<span class="star">★</span>';
        }
    }
    return stars;
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Display comments
function displayComments() {
    if (commentsList) {
        commentsList.innerHTML = '';
        if (commentsData.length > 0) {
            commentsData.forEach(comment => {
                commentsList.innerHTML += createCommentHTML(comment);
            });
            
            // Add event listeners to vote buttons
            document.querySelectorAll('.vote-button').forEach(button => {
                button.addEventListener('click', function() {
                    const commentId = this.getAttribute('data-comment-id');
                    const voteType = this.getAttribute('data-vote-type');
                    voteComment(commentId, voteType);
                });
            });
            
            // Add event listeners to reply buttons
            document.querySelectorAll('.reply-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const commentId = this.getAttribute('data-comment-id');
                    toggleReplyForm(commentId);
                });
            });
        } else {
            commentsList.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
        }
    }
}

// Create comment HTML with neon effects
function createCommentHTML(comment) {
    let commentHTML = `
        <div class="comment neon-card" data-comment-id="${comment.id}">
            <div class="comment-header">
                <div class="comment-author neon-glow">${comment.author}</div>
                <div class="comment-date neon-glow">${formatDate(comment.date)}</div>
            </div>
            <div class="comment-body">
                ${comment.content}
            </div>
            <div class="comment-actions">
                <button class="vote-button upvote-btn neon-button ${comment.userVote === 'up' ? 'upvoted neon-glow' : ''}" 
                        data-comment-id="${comment.id}" 
                        data-vote-type="up">
                    ↑ ${comment.upvotes}
                </button>
                <button class="vote-button downvote-btn neon-button ${comment.userVote === 'down' ? 'downvoted neon-glow' : ''}" 
                        data-comment-id="${comment.id}" 
                        data-vote-type="down">
                    ↓ ${comment.downvotes}
                </button>
                <button class="reply-btn neon-button" data-comment-id="${comment.id}">Reply</button>
            </div>
    `;
    
    // Add reply form
    commentHTML += `
            <div class="reply-form neon-border" id="reply-form-${comment.id}">
                <textarea class="neon-border" placeholder="Write your reply..."></textarea>
                <button class="btn btn-primary neon-button neon-shadow submit-reply-btn" data-comment-id="${comment.id}">Submit Reply</button>
            </div>
    `;
    
    // Add nested comments if they exist
    if (comment.replies && comment.replies.length > 0) {
        commentHTML += '<div class="nested-comments neon-border">';
        comment.replies.forEach(reply => {
            commentHTML += createCommentHTML(reply);
        });
        commentHTML += '</div>';
    }
    
    commentHTML += '</div>';
    
    return commentHTML;
}

// Vote on a comment
function voteComment(commentId, voteType) {
    // In a real app, this would send data to the backend
    console.log(`Voted ${voteType} on comment ${commentId}`);
    
    // Update UI to reflect vote
    const upvoteBtn = document.querySelector(`.upvote-btn[data-comment-id="${commentId}"]`);
    const downvoteBtn = document.querySelector(`.downvote-btn[data-comment-id="${commentId}"]`);
    
    if (upvoteBtn && downvoteBtn) {
        // Remove any existing vote classes
        upvoteBtn.classList.remove('upvoted', 'neon-glow');
        downvoteBtn.classList.remove('downvoted', 'neon-glow');
        
        // Add the appropriate vote class
        if (voteType === 'up') {
            upvoteBtn.classList.add('upvoted', 'neon-glow');
        } else if (voteType === 'down') {
            downvoteBtn.classList.add('downvoted', 'neon-glow');
        }
    }
}

// Toggle reply form visibility
function toggleReplyForm(commentId) {
    const replyForm = document.getElementById(`reply-form-${commentId}`);
    if (replyForm) {
        replyForm.classList.toggle('active');
    }
}

// Handle comment submission
if (commentForm) {
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (commentText && commentText.value.trim()) {
            // In a real app, this would send data to the backend
            console.log('Comment submitted:', commentText.value);
            
            // Add neon effect to submit button
            const submitBtn = commentForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.classList.add('neon-glow-pulse');
                setTimeout(() => {
                    submitBtn.classList.remove('neon-glow-pulse');
                    alert('Comment submitted successfully!');
                }, 1000);
            }
            
            commentText.value = '';
        } else {
            alert('Please enter a comment.');
        }
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    displayReview();
    displayComments();
    
    // Add neon effects to page title
    const pageTitle = document.querySelector('.review-page h1');
    if (pageTitle) pageTitle.classList.add('neon-pulse');
});