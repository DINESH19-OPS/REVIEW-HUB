// Main JavaScript file for Review Hub

// Import Hyperspeed effect
import { HyperspeedEffect } from './hyperspeedEffect.js';

// DOM Elements
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');

// Theme Toggle Functionality
function toggleTheme() {
    const body = document.body;
    const isNeonTheme = body.classList.contains('neon-theme');
    
    if (isNeonTheme) {
        body.classList.remove('neon-theme');
        localStorage.setItem('theme', 'default');
    } else {
        body.classList.add('neon-theme');
        localStorage.setItem('theme', 'neon');
    }
}

// Apply saved theme on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'neon') {
        document.body.classList.add('neon-theme');
    }
    
    // Add theme toggle button if it doesn't exist
    let themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) {
        themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '⚡';
        themeToggle.setAttribute('aria-label', 'Toggle neon theme');
        document.body.appendChild(themeToggle);
        
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Initialize Hyperspeed background
    initHyperspeed();
});

// Initialize Hyperspeed background
function initHyperspeed() {
    const hyperspeedContainer = document.getElementById('hyperspeed-background');
    if (hyperspeedContainer) {
        // Clear any existing content
        hyperspeedContainer.innerHTML = '';
        
        // Initialize the Hyperspeed effect
        new HyperspeedEffect(hyperspeedContainer, {
            speed: 1.5,
            roadColor: 0x080808,
            carColors: [0xd856bf, 0x6750a2, 0xc247ac, 0x03b3c3, 0x0e5ea5, 0x324555]
        });
    }
}

// API Functions
const API_BASE_URL = '/api';

async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

// Authentication Functions
function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

function getAuthToken() {
    return localStorage.getItem('authToken');
}

function removeAuthToken() {
    localStorage.removeItem('authToken');
}

function isAuthenticated() {
    return !!getAuthToken();
}

// Login/Signup Modal Functions
function showLoginModal() {
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="login-modal">
            <div class="modal">
                <div class="modal-header">
                    <h2>Login</h2>
                    <button class="close-btn" id="close-login">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="login-form">
                        <div class="form-group">
                            <label for="login-email">Email</label>
                            <input type="email" id="login-email" required>
                        </div>
                        <div class="form-group">
                            <label for="login-password">Password</label>
                            <input type="password" id="login-password" required>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Login</button>
                        </div>
                        <div class="form-footer">
                            <p>Don't have an account? <a href="#" id="switch-to-signup">Sign up</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    document.getElementById('close-login').addEventListener('click', hideModal);
    document.getElementById('switch-to-signup').addEventListener('click', function(e) {
        e.preventDefault();
        hideModal();
        showSignupModal();
    });
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.querySelector('.modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) hideModal();
    });
}

function showSignupModal() {
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="signup-modal">
            <div class="modal">
                <div class="modal-header">
                    <h2>Sign Up</h2>
                    <button class="close-btn" id="close-signup">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="signup-form">
                        <div class="form-group">
                            <label for="signup-name">Name</label>
                            <input type="text" id="signup-name" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-email">Email</label>
                            <input type="email" id="signup-email" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-password">Password</label>
                            <input type="password" id="signup-password" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-confirm-password">Confirm Password</label>
                            <input type="password" id="signup-confirm-password" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-bio">Bio (Optional)</label>
                            <textarea id="signup-bio" rows="3"></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Sign Up</button>
                        </div>
                        <div class="form-footer">
                            <p>Already have an account? <a href="#" id="switch-to-login">Login</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    document.getElementById('close-signup').addEventListener('click', hideModal);
    document.getElementById('switch-to-login').addEventListener('click', function(e) {
        e.preventDefault();
        hideModal();
        showLoginModal();
    });
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    document.querySelector('.modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) hideModal();
    });
}

function hideModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Form Handlers
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const data = await apiRequest('/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        setAuthToken(data.token);
        hideModal();
        location.reload();
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const bio = document.getElementById('signup-bio').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    try {
        const data = await apiRequest('/users/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, bio })
        });
        
        setAuthToken(data.token);
        hideModal();
        location.reload();
    } catch (error) {
        alert('Signup failed: ' + error.message);
    }
}

// Logout function
function logout() {
    removeAuthToken();
    location.reload();
}

// Event Listeners
if (loginBtn) {
    loginBtn.addEventListener('click', showLoginModal);
}

if (signupBtn) {
    signupBtn.addEventListener('click', showSignupModal);
}

// Utility Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

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

// Modal CSS (dynamically added)
const modalCSS = `
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .modal {
        background: var(--card-bg);
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        width: 100%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid var(--border-color);
    }
    
    .modal-header h2 {
        margin: 0;
        border: none;
        padding: 0;
        color: var(--text-color);
    }
    
    .close-btn {
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: var(--text-secondary);
    }
    
    .close-btn:hover {
        color: var(--text-color);
    }
    
    .modal-body {
        padding: 1.5rem;
    }
    
    .form-footer {
        text-align: center;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color);
    }
    
    .form-footer a {
        color: var(--button-primary);
        font-weight: bold;
    }
    
    .form-footer a:hover {
        text-decoration: underline;
    }
    
    /* Neon Modal Styles */
    body.neon-theme .modal {
        box-shadow: 0 0 20px var(--neon-primary);
    }
    
    body.neon-theme .modal-header {
        border-bottom: 1px solid var(--neon-primary);
    }
    
    body.neon-theme .modal-header h2 {
        color: var(--neon-primary);
        text-shadow: 0 0 5px var(--neon-primary);
    }
    
    body.neon-theme .close-btn {
        color: var(--dark-secondary);
    }
    
    body.neon-theme .close-btn:hover {
        color: var(--neon-primary);
        text-shadow: 0 0 5px var(--neon-primary);
    }
    
    body.neon-theme .form-footer a {
        color: var(--neon-primary);
        text-shadow: 0 0 3px var(--neon-primary);
    }
`;

// Add modal styles to head
const style = document.createElement('style');
style.textContent = modalCSS;
document.head.appendChild(style);

// Initialize auth state
document.addEventListener('DOMContentLoaded', function() {
    // Update UI based on auth state
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        if (isAuthenticated()) {
            authButtons.innerHTML = `
                <button id="profile-btn" class="btn btn-outline">Profile</button>
                <button id="logout-btn" class="btn btn-primary">Logout</button>
            `;
            
            document.getElementById('profile-btn').addEventListener('click', function() {
                window.location.href = 'profile.html';
            });
            
            document.getElementById('logout-btn').addEventListener('click', logout);
        }
    }
});