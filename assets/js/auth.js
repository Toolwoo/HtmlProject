// Shared Authentication Functions for All Pages
// This file handles login/logout functionality across the entire website

// Initialize authentication on page load
window.addEventListener('load', async () => {
    await waitForSupabase();
    initializeAuth();
});

// Wait for Supabase to be available
async function waitForSupabase() {
    return new Promise(resolve => {
        if (window.authFunctions) {
            resolve();
        } else {
            const checkAuth = setInterval(() => {
                if (window.authFunctions) {
                    clearInterval(checkAuth);
                    resolve();
                }
            }, 100);
        }
    });
}

// Initialize authentication system
async function initializeAuth() {
    // Check current authentication status
    await window.authFunctions.checkAuth();
    
    // Set up all event listeners
    setupGlobalEventListeners();
}

// Set up event listeners for authentication
function setupGlobalEventListeners() {
    // Login form submission (if form exists)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }

    // Signup form submission (if form exists)
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmit);
    }

    // Authentication button events
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginBtn) loginBtn.addEventListener('click', openLoginModal);
    if (signupBtn) signupBtn.addEventListener('click', openSignupModal);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    // Modal close events
    setupModalCloseEvents();
}

// Handle login form submission
async function handleLoginSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const result = await window.authFunctions.signIn(email, password);
    
    if (result.success) {
        closeLoginModal();
        document.getElementById('login-form').reset();
        
        // Redirect to comment page if login was successful and we're not already there
        if (!window.location.pathname.includes('comment.html')) {
            // Optional: You can redirect to comment page or just stay on current page
            // window.location.href = getCorrectPath('pages/comment.html');
        }
    }
}

// Handle signup form submission
async function handleSignupSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const result = await window.authFunctions.signUp(email, password, name);
    
    if (result.success) {
        closeSignupModal();
        document.getElementById('signup-form').reset();
    }
}

// Handle logout
async function handleLogout() {
    const result = await window.authFunctions.signOut();
    if (result.success) {
        // Optionally redirect to home page after logout
        // window.location.href = getCorrectPath('index.html');
    }
}

// Modal functions
function openLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function openSignupModal() {
    const modal = document.getElementById('signup-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeSignupModal() {
    const modal = document.getElementById('signup-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Set up modal close events
function setupModalCloseEvents() {
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        const loginModal = document.getElementById('login-modal');
        const signupModal = document.getElementById('signup-modal');
        
        if (e.target === loginModal) {
            closeLoginModal();
        }
        if (e.target === signupModal) {
            closeSignupModal();
        }
    });

    // ESC key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLoginModal();
            closeSignupModal();
        }
    });
}

// Helper function to get correct paths based on current location
function getCorrectPath(targetPath) {
    const currentPath = window.location.pathname;
    
    // If we're in a fruit page (pages/fruits/), we need to go up two levels
    if (currentPath.includes('/fruits/')) {
        if (targetPath.startsWith('pages/')) {
            return '../' + targetPath;
        } else if (targetPath === 'index.html') {
            return '../../index.html';
        }
    }
    // If we're in pages/ directory, we need to go up one level for index
    else if (currentPath.includes('/pages/') && !currentPath.includes('/fruits/')) {
        if (targetPath === 'index.html') {
            return '../index.html';
        } else if (targetPath.startsWith('pages/')) {
            return targetPath.substring(6); // Remove 'pages/' prefix
        }
    }
    
    return targetPath;
}

// Export functions to global scope for easy access
window.globalAuth = {
    openLoginModal,
    closeLoginModal,
    openSignupModal,
    closeSignupModal,
    handleLogout
};

// Make modal functions available globally for onclick handlers
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.openSignupModal = openSignupModal;
window.closeSignupModal = closeSignupModal;