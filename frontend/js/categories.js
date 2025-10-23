// Categories Page JavaScript for Review Hub

// DOM Elements
const categoryFilter = document.getElementById('category-filter');
const sortBy = document.getElementById('sort-by');
const reviewsGrid = document.getElementById('reviews-grid');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');

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
        title: "Eleven Madison Park",
        category: "restaurants",
        rating: 5,
        excerpt: "A revolutionary dining experience that redefines modern American cuisine...",
        author: "Sarah Williams",
        date: "2025-05-10"
    },
    {
        id: 8,
        title: "Samsung Galaxy Watch 6",
        category: "products",
        rating: 4,
        excerpt: "A feature-rich smartwatch with excellent health tracking capabilities...",
        author: "David Kim",
        date: "2025-05-05"
    },
    {
        id: 9,
        title: "Parasite",
        category: "movies",
        rating: 5,
        excerpt: "A brilliant social thriller that masterfully blends genres...",
        author: "Sarah Johnson",
        date: "2025-04-22"
    },
    {
        id: 10,
        title: "The Dark Knight",
        category: "movies",
        rating: 5,
        excerpt: "A dark and complex superhero film that redefined the genre...",
        author: "David Kim",
        date: "2025-04-10"
    }
];

// Pagination variables
let currentPage = 1;
const reviewsPerPage = 4;
let filteredReviews = [...sampleReviews];

// Function to create review card HTML with neon effects
function createReviewCard(review) {
    return `
        <div class="review-card review-card-enhanced neon-card neon-border">
            <div class="review-card-header">
                <h3 class="neon-glow">${review.title}</h3>
                <div class="review-meta">
                    <span class="category neon-badge neon-glow">${review.category}</span>
                </div>
            </div>
            <div class="review-card-body">
                <div class="star-rating neon-star-rating">
                    ${createStarRating(review.rating)}
                </div>
                <p>${review.excerpt}</p>
                <div class="review-footer">
                    <span class="author neon-glow">by ${review.author}</span>
                    <a href="review.html?id=${review.id}" class="read-more neon-link neon-glow">Read More →</a>
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

// Filter reviews by category
function filterReviewsByCategory(category) {
    if (category === 'all') {
        filteredReviews = [...sampleReviews];
    } else {
        filteredReviews = sampleReviews.filter(review => review.category === category);
    }
    currentPage = 1;
    displayReviews();
}

// Sort reviews
function sortReviews(sortByValue) {
    switch (sortByValue) {
        case 'newest':
            filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'rating-high':
            filteredReviews.sort((a, b) => b.rating - a.rating);
            break;
        case 'rating-low':
            filteredReviews.sort((a, b) => a.rating - b.rating);
            break;
    }
    currentPage = 1;
    displayReviews();
}

// Display reviews with pagination
function displayReviews() {
    // Calculate start and end indices
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    
    // Get reviews for current page
    const pageReviews = filteredReviews.slice(startIndex, endIndex);
    
    // Display reviews
    if (reviewsGrid) {
        reviewsGrid.innerHTML = '';
        if (pageReviews.length > 0) {
            pageReviews.forEach(review => {
                reviewsGrid.innerHTML += createReviewCard(review);
            });
        } else {
            reviewsGrid.innerHTML = '<p>No reviews found for the selected category.</p>';
        }
    }
    
    // Update pagination buttons
    updatePagination();
}

// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
    
    if (prevPageBtn) {
        prevPageBtn.disabled = currentPage === 1;
    }
    
    if (nextPageBtn) {
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
}

// Event Listeners
if (categoryFilter) {
    categoryFilter.addEventListener('change', function() {
        filterReviewsByCategory(this.value);
    });
}

if (sortBy) {
    sortBy.addEventListener('change', function() {
        sortReviews(this.value);
    });
}

if (prevPageBtn) {
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            displayReviews();
        }
    });
}

if (nextPageBtn) {
    nextPageBtn.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayReviews();
        }
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Initial display
    sortReviews('newest');
    
    // Add neon effects to page title
    const pageTitle = document.querySelector('.categories-page h1');
    if (pageTitle) pageTitle.classList.add('neon-pulse');
});