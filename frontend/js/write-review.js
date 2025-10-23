// Write Review Page JavaScript for Review Hub

// DOM Elements
const starRating = document.getElementById('star-rating');
const ratingValue = document.getElementById('rating-value');
const reviewForm = document.getElementById('review-form');
const stars = document.querySelectorAll('.star');

// Set up star rating functionality
if (stars.length > 0) {
    stars.forEach(star => {
        // Hover effect
        star.addEventListener('mouseover', function() {
            const rating = this.getAttribute('data-rating');
            highlightStars(rating);
        });
        
        // Click to set rating
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            setRating(rating);
        });
    });
    
    // Remove highlight when leaving star rating area
    starRating.addEventListener('mouseleave', function() {
        highlightStars(ratingValue.value);
    });
}

// Highlight stars up to the specified rating
function highlightStars(rating) {
    stars.forEach(star => {
        const starRating = star.getAttribute('data-rating');
        if (starRating <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Set the rating value
function setRating(rating) {
    ratingValue.value = rating;
    highlightStars(rating);
    
    // Remove invalid class if rating is selected
    if (rating > 0) {
        starRating.classList.remove('invalid');
    }
}

// Form validation
function validateForm() {
    let isValid = true;
    
    // Get form elements
    const title = document.getElementById('review-title');
    const category = document.getElementById('review-category');
    const rating = document.getElementById('rating-value');
    const body = document.getElementById('review-body');
    
    // Validate title
    if (!title.value.trim()) {
        title.classList.add('invalid');
        isValid = false;
    } else {
        title.classList.remove('invalid');
    }
    
    // Validate category
    if (!category.value) {
        category.classList.add('invalid');
        isValid = false;
    } else {
        category.classList.remove('invalid');
    }
    
    // Validate rating
    if (rating.value == 0) {
        starRating.classList.add('invalid');
        isValid = false;
    } else {
        starRating.classList.remove('invalid');
    }
    
    // Validate body
    if (!body.value.trim()) {
        body.classList.add('invalid');
        isValid = false;
    } else {
        body.classList.remove('invalid');
    }
    
    return isValid;
}

// Handle form submission
if (reviewForm) {
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (validateForm()) {
            // In a real app, this would send data to the backend
            console.log('Review submitted');
            
            // Add neon effect to submit button
            const submitBtn = reviewForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.classList.add('neon-glow-pulse');
                setTimeout(() => {
                    submitBtn.classList.remove('neon-glow-pulse');
                    alert('Review submitted successfully!');
                }, 1000);
            }
            
            reviewForm.reset();
            setRating(0);
        } else {
            alert('Please fill in all required fields.');
        }
    });
}

// Add validation listeners for real-time feedback
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() || (this.tagName === 'SELECT' && this.value)) {
                this.classList.remove('invalid');
            }
        });
    });
    
    // Add neon effects to page title
    const pageTitle = document.querySelector('.write-review-page h1');
    if (pageTitle) pageTitle.classList.add('neon-pulse');
});