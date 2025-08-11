// 360° News Feedback Platform - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize image lazy loading
    initializeLazyLoading();
    
    // Initialize form enhancements
    initializeFormEnhancements();
    
    // Initialize search functionality
    initializeSearch();
});

/**
 * Initialize Bootstrap tooltips
 */
function initializeTooltips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize lazy loading for images
 */
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

/**
 * Enhance form functionality
 */
function initializeFormEnhancements() {
    // Auto-resize textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });

    // Form validation feedback
    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // Character counters for text inputs
    const textInputs = document.querySelectorAll('input[type="text"], textarea');
    textInputs.forEach(input => {
        const maxLength = input.getAttribute('maxlength');
        if (maxLength) {
            addCharacterCounter(input, maxLength);
        }
    });
}

/**
 * Add character counter to text inputs
 */
function addCharacterCounter(element, maxLength) {
    const counter = document.createElement('div');
    counter.className = 'character-counter text-muted small';
    counter.style.textAlign = 'right';
    element.parentNode.appendChild(counter);

    function updateCounter() {
        const remaining = maxLength - element.value.length;
        counter.textContent = `${element.value.length}/${maxLength} characters`;
        
        if (remaining < 20) {
            counter.className = 'character-counter text-warning small';
        } else if (remaining < 0) {
            counter.className = 'character-counter text-danger small';
        } else {
            counter.className = 'character-counter text-muted small';
        }
    }

    element.addEventListener('input', updateCounter);
    updateCounter();
}

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const searchForm = document.querySelector('form[method="GET"]');
    if (!searchForm) return;

    const searchInput = searchForm.querySelector('input[name="search"]');
    if (!searchInput) return;

    // Add search suggestions (mock data for demonstration)
    addSearchSuggestions(searchInput);
    
    // Live search countdown
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            // Could implement live search here
            console.log('Searching for:', this.value);
        }, 500);
    });
}

/**
 * Add search suggestions dropdown
 */
function addSearchSuggestions(input) {
    const suggestions = [
        'local politics', 'community events', 'education news', 'health updates',
        'environmental issues', 'business developments', 'sports coverage',
        'cultural events', 'crime reports', 'infrastructure projects'
    ];

    const datalist = document.createElement('datalist');
    datalist.id = 'search-suggestions';
    
    suggestions.forEach(suggestion => {
        const option = document.createElement('option');
        option.value = suggestion;
        datalist.appendChild(option);
    });

    input.setAttribute('list', 'search-suggestions');
    input.parentNode.appendChild(datalist);
}

/**
 * Show loading state for buttons
 */
function showButtonLoading(button, text = 'Loading...') {
    button.disabled = true;
    button.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status"></span>
        ${text}
    `;
}

/**
 * Hide loading state for buttons
 */
function hideButtonLoading(button, originalText) {
    button.disabled = false;
    button.innerHTML = originalText;
}

/**
 * Show notification toast
 */
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }

    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();

    // Remove toast element after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

/**
 * Format date for display
 */
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Debounce function for search and other rapid events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Scroll to top functionality
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button if page is long enough
window.addEventListener('scroll', function() {
    let scrollTopBtn = document.getElementById('scrollTopBtn');
    
    if (window.pageYOffset > 300) {
        if (!scrollTopBtn) {
            scrollTopBtn = document.createElement('button');
            scrollTopBtn.id = 'scrollTopBtn';
            scrollTopBtn.className = 'btn btn-primary rounded-circle position-fixed';
            scrollTopBtn.style.cssText = 'bottom: 20px; right: 20px; z-index: 1000; width: 50px; height: 50px;';
            scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            scrollTopBtn.onclick = scrollToTop;
            document.body.appendChild(scrollTopBtn);
        }
        scrollTopBtn.style.display = 'block';
    } else if (scrollTopBtn) {
        scrollTopBtn.style.display = 'none';
    }
});

// Export functions for use in other scripts
window.NewsApp = {
    showButtonLoading,
    hideButtonLoading,
    showNotification,
    formatDate,
    isValidEmail,
    debounce,
    scrollToTop
};
