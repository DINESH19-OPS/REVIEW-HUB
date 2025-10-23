// Profile Page JavaScript for Review Hub

// DOM Elements
const userReviewsList = document.getElementById('user-reviews-list');

// Sample user data for demonstration
const userData = {
    name: "John Doe",
    bio: "A passionate reviewer who loves sharing honest opinions about books, movies, and more.",
    reviewsCount: 24,
    commentsCount: 128
};

// Sample user reviews for demonstration
const userReviews = [
    {
        id: 1,
        title: "The Great Gatsby",
        category: "books",
        rating: 4,
        excerpt: "A masterpiece of American literature that captures the essence of the Jazz Age...",
        date: "2025-06-15"
    },
    {
        id: 2,
        title: "Inception",
        category: "movies",
        rating: 5,
        excerpt: "A mind-bending thriller that challenges the boundaries of reality and dreams...",
        date: "2025-06-10"
    },
    {
        id: 3,
        title: "Le Bernardin",
        category: "restaurants",
        rating: 5,
        excerpt: "An exquisite fine dining experience with impeccable service and extraordinary cuisine...",
        date: "2025-06-05"
    }
];

// Function to create user review item HTML with neon effects
function createUserReviewItem(review) {
    return `
        <div class="user-review-item neon-card">
            <div class="user-review-header">
                <h3 class="user-review-title neon-glow">${review.title}</h3>
                <div class="user-review-meta">
                    <span class="category neon-glow">${review.category}</span> • 
                    <span class="date neon-glow">${formatDate(review.date)}</span>
                </div>
            </div>
            <div class="star-rating neon-star-rating">
                ${createStarRating(review.rating)}
            </div>
            <p>${review.excerpt}</p>
            <div class="user-review-actions">
                <button class="btn btn-outline edit-btn neon-button" data-id="${review.id}">Edit</button>
                <button class="btn delete-btn neon-button neon-border" data-id="${review.id}">Delete</button>
            </div>
        </div>
    `;
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
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Display user info
function displayUserInfo() {
    const userName = document.getElementById('user-name');
    const userBio = document.getElementById('user-bio');
    const reviewsCount = document.getElementById('reviews-count');
    const commentsCount = document.getElementById('comments-count');
    
    if (userName) userName.textContent = userData.name;
    if (userBio) userBio.textContent = userData.bio;
    if (reviewsCount) reviewsCount.textContent = userData.reviewsCount;
    if (commentsCount) commentsCount.textContent = userData.commentsCount;
}

// Display user reviews
function displayUserReviews() {
    if (userReviewsList) {
        userReviewsList.innerHTML = '';
        if (userReviews.length > 0) {
            userReviews.forEach(review => {
                userReviewsList.innerHTML += createUserReviewItem(review);
            });
            
            // Add event listeners to edit and delete buttons
            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const reviewId = this.getAttribute('data-id');
                    editReview(reviewId);
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const reviewId = this.getAttribute('data-id');
                    deleteReview(reviewId);
                });
            });
        } else {
            userReviewsList.innerHTML = '<p>You haven\'t written any reviews yet.</p>';
        }
    }
}

// Edit review function
function editReview(reviewId) {
    alert(`Edit review with ID: ${reviewId}`);
    // In a real app, this would redirect to an edit page or open an edit modal
}

// Delete review function
function deleteReview(reviewId) {
    if (confirm('Are you sure you want to delete this review?')) {
        alert(`Delete review with ID: ${reviewId}`);
        // In a real app, this would send a delete request to the backend
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    displayUserInfo();
    displayUserReviews();
    
    // Add neon effects to page title
    const pageTitle = document.querySelector('.profile-page h1');
    if (pageTitle) pageTitle.classList.add('neon-pulse');
    
    // Add neon pulse to stats
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => stat.classList.add('neon-pulse'));
});