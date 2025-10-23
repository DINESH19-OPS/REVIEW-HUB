// Home Page JavaScript for Review Hub

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');
const featuredReviewsGrid = document.getElementById('featured-reviews-grid');
const recentReviewsGrid = document.getElementById('recent-reviews-grid');
const categoryFilterButtons = document.querySelectorAll('.category-filter button');
const ratingSortSelect = document.getElementById('rating-sort');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const switchToSignup = document.getElementById('switch-to-signup');
const switchToLogin = document.getElementById('switch-to-login');
const closeButtons = document.querySelectorAll('.close');

// Sample data for demonstration
const sampleReviews = [
    {
        id: 1,
        title: "The Great Gatsby",
        category: "books",
        rating: 4,
        excerpt: "A masterpiece of American literature that captures the essence of the Jazz Age...",
        author: "Jane Smith",
        date: "2025-06-15"
    },
    {
        id: 2,
        title: "Inception",
        category: "movies",
        rating: 5,
        excerpt: "A mind-bending thriller that challenges the boundaries of reality and dreams...",
        author: "John Doe",
        date: "2025-06-10"
    },
    {
        id: 3,
        title: "Le Bernardin",
        category: "restaurants",
        rating: 5,
        excerpt: "An exquisite fine dining experience with impeccable service and extraordinary cuisine...",
        author: "Alice Johnson",
        date: "2025-06-05"
    },
    {
        id: 4,
        title: "Apple iPhone 15 Pro",
        category: "products",
        rating: 4,
        excerpt: "A premium smartphone with exceptional camera quality and performance...",
        author: "Robert Brown",
        date: "2025-05-28"
    },
    {
        id: 5,
        title: "To Kill a Mockingbird",
        category: "books",
        rating: 5,
        excerpt: "A powerful novel addressing racial injustice and moral growth in the American South...",
        author: "Emily Wilson",
        date: "2025-05-20"
    },
    {
        id: 6,
        title: "The Grand Budapest Hotel",
        category: "movies",
        rating: 4,
        excerpt: "A whimsical and visually stunning film with intricate storytelling...",
        author: "Michael Chen",
        date: "2025-05-15"
    },
    {
        id: 7,
        title: "Parasite",
        category: "movies",
        rating: 5,
        excerpt: "A brilliant social thriller that masterfully blends genres...",
        author: "Sarah Johnson",
        date: "2025-04-22"
    },
    {
        id: 8,
        title: "The Dark Knight",
        category: "movies",
        rating: 5,
        excerpt: "A dark and complex superhero film that redefined the genre...",
        author: "David Kim",
        date: "2025-04-10"
    }
];

// Current filter and sort settings
let currentCategory = 'all';
let currentSort = 'newest';

// Function to create review card HTML with neon effects
function createReviewCard(review) {
    return `
        <div class="review-card review-card-enhanced neon-card neon-border">
            <div class="review-card-header">
                <h3 class="neon-glow">${review.title}</h3>
                <div class="review-meta">
                    <span class="category neon-badge">${review.category}</span>
                </div>
            </div>
            <div class="review-card-body">
                <div class="star-rating neon-star-rating">
                    ${createStarRating(review.rating)}
                </div>
                <p>${review.excerpt}</p>
                <div class="review-footer">
                    <span class="author neon-glow">by ${review.author}</span>
                    <a href="review.html?id=${review.id}" class="read-more neon-link">Read More →</a>
                </div>
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

// Display featured reviews with filtering
function displayFeaturedReviews() {
    if (featuredReviewsGrid) {
        // Filter featured reviews by category
        let filteredFeaturedReviews = currentCategory === 'all' 
            ? sampleReviews.filter(review => review.rating === 5)
            : sampleReviews.filter(review => review.rating === 5 && review.category === currentCategory);
        
        featuredReviewsGrid.innerHTML = '';
        filteredFeaturedReviews.forEach(review => {
            featuredReviewsGrid.innerHTML += createReviewCard(review);
        });
        
        // If no featured reviews for selected category, show a message
        if (filteredFeaturedReviews.length === 0) {
            featuredReviewsGrid.innerHTML = '<p>No featured reviews for the selected category.</p>';
        }
    }
}

// Display recent reviews with filtering and sorting
function displayRecentReviews() {
    if (recentReviewsGrid) {
        // Filter reviews by category
        let filteredReviews = currentCategory === 'all' 
            ? [...sampleReviews] 
            : sampleReviews.filter(review => review.category === currentCategory);
        
        // Sort reviews
        switch (currentSort) {
            case 'rating-high':
                filteredReviews.sort((a, b) => b.rating - a.rating);
                break;
            case 'rating-low':
                filteredReviews.sort((a, b) => a.rating - b.rating);
                break;
            case 'newest':
            default:
                filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
        }
        
        recentReviewsGrid.innerHTML = '';
        filteredReviews.forEach(review => {
            recentReviewsGrid.innerHTML += createReviewCard(review);
        });
        
        // If no reviews for selected category, show a message
        if (filteredReviews.length === 0) {
            recentReviewsGrid.innerHTML = '<p>No reviews found for the selected category.</p>';
        }
    }
}

// Search functionality (simulated AJAX)
function performSearch(query) {
    if (!query.trim()) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        return;
    }
    
    // Filter reviews based on query
    const filteredReviews = sampleReviews.filter(review => 
        review.title.toLowerCase().includes(query.toLowerCase()) ||
        review.category.toLowerCase().includes(query.toLowerCase()) ||
        review.excerpt.toLowerCase().includes(query.toLowerCase())
    );
    
    // Display search results
    if (filteredReviews.length > 0) {
        let resultsHTML = '<h3 class="neon-glow">Search Results</h3>';
        filteredReviews.forEach(review => {
            resultsHTML += `
                <div class="search-result-item neon-search-result-item" onclick="window.location='review.html?id=${review.id}'">
                    <div class="search-result-title neon-search-result-title">${review.title}</div>
                    <div class="search-result-excerpt">${review.excerpt.substring(0, 100)}...</div>
                </div>
            `;
        });
        searchResults.innerHTML = resultsHTML;
        searchResults.style.display = 'block';
    } else {
        searchResults.innerHTML = '<p>No reviews found matching your search.</p>';
        searchResults.style.display = 'block';
    }
}

// Category filter functionality
function setupCategoryFilter() {
    categoryFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryFilterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update current category
            currentCategory = this.dataset.category;
            
            // Re-display both featured and recent reviews with new filter
            displayFeaturedReviews();
            displayRecentReviews();
        });
    });
}

// Rating sort functionality
function setupRatingSort() {
    ratingSortSelect.addEventListener('change', function() {
        currentSort = this.value;
        displayRecentReviews();
    });
}

// Modal functionality
function setupModals() {
    // Open login modal
    loginBtn.addEventListener('click', function() {
        loginModal.style.display = 'block';
    });
    
    // Open signup modal
    signupBtn.addEventListener('click', function() {
        signupModal.style.display = 'block';
    });
    
    // Switch to signup from login
    switchToSignup.addEventListener('click', function() {
        loginModal.style.display = 'none';
        signupModal.style.display = 'block';
    });
    
    // Switch to login from signup
    switchToLogin.addEventListener('click', function() {
        signupModal.style.display = 'none';
        loginModal.style.display = 'block';
    });
    
    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (event.target === signupModal) {
            signupModal.style.display = 'none';
        }
    });
    
    // Form submissions
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Simulate login
        alert('Login functionality would be implemented in a real application');
        loginModal.style.display = 'none';
    });
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Simulate signup
        alert('Signup functionality would be implemented in a real application');
        signupModal.style.display = 'none';
    });
}

// Event Listeners
if (searchInput) {
    searchInput.addEventListener('input', function() {
        performSearch(this.value);
    });
}

if (searchBtn) {
    searchBtn.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    displayFeaturedReviews();
    displayRecentReviews();
    setupCategoryFilter();
    setupRatingSort();
    setupModals();
    
    // Add neon pulse effect to hero elements
    const heroTitle = document.querySelector('.hero h1');
    const heroSubtitle = document.querySelector('.hero p');
    
    if (heroTitle) heroTitle.classList.add('neon-pulse');
    if (heroSubtitle) heroSubtitle.classList.add('neon-pulse');
});