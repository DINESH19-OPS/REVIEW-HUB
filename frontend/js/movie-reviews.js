// Movie Reviews Page JavaScript for Review Hub

// DOM Elements
const ratingFilter = document.getElementById('rating-filter');
const sortBy = document.getElementById('sort-by');
const reviewsGrid = document.getElementById('reviews-grid');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const currentPageSpan = document.getElementById('current-page');
const totalPagesSpan = document.getElementById('total-pages');

// Sample movie review data
const movieReviews = [
    {
        id: 101,
        title: "Inception",
        category: "movies",
        rating: 5,
        excerpt: "A mind-bending thriller that challenges the boundaries of reality and dreams. Christopher Nolan's masterpiece keeps you on the edge of your seat.",
        author: "John Doe",
        date: "2025-06-10",
        imageUrl: "https://via.placeholder.com/300x450/333/fff?text=Inception"
    },
    {
        id: 102,
        title: "The Grand Budapest Hotel",
        category: "movies",
        rating: 4,
        excerpt: "A whimsical and visually stunning film with intricate storytelling. Wes Anderson's unique style shines through in every frame.",
        author: "Michael Chen",
        date: "2025-05-15",
        imageUrl: "https://via.placeholder.com/300x450/333/fff?text=Grand+Budapest"
    },
    {
        id: 103,
        title: "Parasite",
        category: "movies",
        rating: 5,
        excerpt: "A brilliant social thriller that masterfully blends genres. Bong Joon-ho creates a masterpiece that's both entertaining and thought-provoking.",
        author: "Sarah Johnson",
        date: "2025-04-22",
        imageUrl: "https://via.placeholder.com/300x450/333/fff?text=Parasite"
    },
    {
        id: 104,
        title: "Avengers: Endgame",
        category: "movies",
        rating: 4,
        excerpt: "An epic conclusion to the Marvel saga. Emotional, action-packed, and satisfying for long-time fans of the franchise.",
        author: "Robert Brown",
        date: "2025-04-10",
        imageUrl: "https://via.placeholder.com/300x450/333/fff?text=Avengers"
    },
    {
        id: 105,
        title: "La La Land",
        category: "movies",
        rating: 4,
        excerpt: "A beautiful modern musical that captures the magic of Hollywood. Emma Stone and Ryan Gosling have incredible chemistry.",
        author: "Emily Wilson",
        date: "2025-03-18",
        imageUrl: "https://via.placeholder.com/300x450/333/fff?text=La+La+Land"
    },
    {
        id: 106,
        title: "The Dark Knight",
        category: "movies",
        rating: 5,
        excerpt: "A dark and complex superhero film that redefined the genre. Heath Ledger's Joker is one of the greatest performances in cinema history.",
        author: "David Kim",
        date: "2025-02-25",
        imageUrl: "https://via.placeholder.com/300x450/333/fff?text=Dark+Knight"
    },
    {
        id: 107,
        title: "Mad Max: Fury Road",
        category: "movies",
        rating: 4,
        excerpt: "A breathtaking action spectacle with incredible practical effects. George Miller proves that modern action films can be both thrilling and meaningful.",
        author: "Alice Thompson",
        date: "2025-01-30",
        imageUrl: "https://via.placeholder.com/300x450/333/fff?text=Mad+Max"
    },
    {
        id: 108,
        title: "Get Out",
        category: "movies",
        rating: 5,
        excerpt: "A brilliant horror-thriller that uses genre conventions to explore social issues. Jordan Peele announces himself as a major filmmaking talent.",
        author: "Marcus Williams",
        date: "2025-01-15",
        imageUrl: "https://via.placeholder.com/300x450/333/fff?text=Get+Out"
    }
];

// Pagination variables
let currentPage = 1;
const reviewsPerPage = 4;
let filteredReviews = [...movieReviews];

// Function to create movie review card HTML with neon effects
function createMovieReviewCard(review) {
    return `
        <div class="review-card review-card-enhanced neon-card neon-border">
            <div class="review-card-header">
                <h3 class="neon-glow">${review.title}</h3>
                <div class="review-meta">
                    <span class="category neon-badge neon-glow">Movie</span>
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

// Filter reviews by minimum rating
function filterReviewsByRating(minRating) {
    if (minRating === '0') {
        filteredReviews = [...movieReviews];
    } else {
        filteredReviews = movieReviews.filter(review => review.rating >= parseInt(minRating));
    }
    currentPage = 1;
    sortReviews(sortBy.value);
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
        case 'title':
            filteredReviews.sort((a, b) => a.title.localeCompare(b.title));
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
                reviewsGrid.innerHTML += createMovieReviewCard(review);
            });
        } else {
            reviewsGrid.innerHTML = '<p>No movie reviews found for the selected filters.</p>';
        }
    }
    
    // Update pagination info
    updatePagination();
}

// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
    
    // Update page info display
    if (currentPageSpan) currentPageSpan.textContent = currentPage;
    if (totalPagesSpan) totalPagesSpan.textContent = totalPages || 1;
    
    // Enable/disable pagination buttons
    if (prevPageBtn) {
        prevPageBtn.disabled = currentPage === 1;
    }
    
    if (nextPageBtn) {
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
}

// Event Listeners
if (ratingFilter) {
    ratingFilter.addEventListener('change', function() {
        filterReviewsByRating(this.value);
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