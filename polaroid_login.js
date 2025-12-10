const form = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Demo credentials - replace with actual authentication
    if (username === 'admin' && password === 'admin123') {
        // Successful login - redirect to admin page
        window.location.href = 'Admin Page.php';
    } else {
        // Show error message
        errorMessage.classList.add('show');
        
        // Shake the form
        document.querySelector('.login-container').style.animation = 'none';
        setTimeout(() => {
            document.querySelector('.login-container').style.animation = 'shake 0.5s ease';
        }, 10);

        // Hide error after 3 seconds
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 3000);
    }
});

// Clear error message when user starts typing
document.getElementById('username').addEventListener('input', () => {
    errorMessage.classList.remove('show');
});

document.getElementById('password').addEventListener('input', () => {
    errorMessage.classList.remove('show');
});