// Main application functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    checkAuth();

    // Initialize mobile menu
    initMobileMenu();

    // Initialize form validation
    initFormValidation();

    // Initialize notifications
    initNotifications();
});

function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const protectedPages = ['report.html', 'profile.html', 'history.html'];
    const currentPage = window.location.pathname.split('/').pop();

    // Redirect to login if trying to access protected pages while not logged in
    if (protectedPages.includes(currentPage) && !isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // Update UI based on auth status
    updateAuthUI(isLoggedIn, currentUser);
}

function updateAuthUI(isLoggedIn, currentUser) {
    const loginBtn = document.querySelector('a[href="login.html"]');
    const registerBtn = document.querySelector('a[href="register.html"]');
    const logoutBtn = document.getElementById('logoutBtn');
    const reportBtn = document.querySelector('a[href="report.html"]');
    const profileBtn = document.querySelector('a[href="profile.html"]');
    const historyBtn = document.querySelector('a[href="history.html"]');

    if (isLoggedIn) {
        // Hide login/register buttons
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        
        // Show authenticated user buttons
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (reportBtn) reportBtn.style.display = 'block';
        if (profileBtn) profileBtn.style.display = 'block';
        if (historyBtn) historyBtn.style.display = 'block';

        // Update user info in profile page
        if (currentUser) {
            const userName = document.getElementById('userName');
            const userEmail = document.getElementById('userEmail');
            const userPhone = document.getElementById('userPhone');
            
            if (userName) userName.textContent = currentUser.name;
            if (userEmail) userEmail.textContent = currentUser.email;
            if (userPhone) userPhone.textContent = currentUser.phone;
        }
    } else {
        // Show login/register buttons
        if (loginBtn) loginBtn.style.display = 'block';
        if (registerBtn) registerBtn.style.display = 'block';
        
        // Hide authenticated user buttons
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (reportBtn) reportBtn.style.display = 'none';
        if (profileBtn) profileBtn.style.display = 'none';
        if (historyBtn) historyBtn.style.display = 'none';
    }
}

function initMobileMenu() {
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'md:hidden fixed top-4 right-4 z-50 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    
    const nav = document.querySelector('nav');
    if (nav) {
        nav.appendChild(mobileMenuBtn);
    }

    mobileMenuBtn.addEventListener('click', function() {
        const menuItems = document.querySelector('nav .hidden');
        if (menuItems) {
            menuItems.classList.toggle('hidden');
        }
    });
}

function initFormValidation() {
    // Add form validation to all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
}

function initNotifications() {
    // Create notification container
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.className = 'fixed top-4 right-4 z-50 space-y-4';
    document.body.appendChild(container);
}

function showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white transform transition-all duration-300 ease-in-out`;
    notification.textContent = message;
    
    container.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.add('translate-x-0');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Utility functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Error handling
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo + '\nColumn: ' + columnNo + '\nError object: ' + JSON.stringify(error));
    showNotification('An error occurred. Please try again.', 'error');
    return false;
};

// Offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }).catch(function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
} 