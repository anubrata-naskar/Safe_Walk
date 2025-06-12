// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeBtns = document.querySelectorAll('.close');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');

    // Open login modal
    loginBtn.addEventListener('click', function() {
        loginModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        // Focus on email input after modal opens
        setTimeout(() => {
            document.getElementById('login-email').focus();
        }, 100);
    });

    // Open register modal
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            registerModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            // Focus on name input after modal opens
            setTimeout(() => {
                document.getElementById('register-name').focus();
            }, 100);
        });
    }

    // Close modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });

    // Switch between modals
    if (switchToRegister) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'block';
            setTimeout(() => {
                document.getElementById('register-name').focus();
            }, 100);
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            registerModal.style.display = 'none';
            loginModal.style.display = 'block';
            setTimeout(() => {
                document.getElementById('login-email').focus();
            }, 100);
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // SIMPLIFIED LOGIN - NO AUTHENTICATION REQUIRED
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Skip all validation and authentication
        console.log('Login clicked - redirecting to safety dashboard');
        
        // Close modal
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Show success message (optional)
        alert('Welcome to Safe-Walk!');
        
        // Redirect directly to safety dashboard
        window.location.href = 'safety.html';
    });

    // ORIGINAL REGISTER FORM (if you want to keep it)
    if (document.getElementById('register-form')) {
        document.getElementById('register-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const age = document.getElementById('register-age').value;
            const email = document.getElementById('register-email').value;
            const contact = document.getElementById('register-contact').value;
            const emergencyContact = document.getElementById('register-emergency').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;

            if (!name || !age || !email || !contact || !emergencyContact || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            try {
                const response = await fetch('/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        age: parseInt(age),
                        email,
                        contact,
                        emergencyContact,
                        password
                    }),
                });

                const data = await response.json();
                
                if (response.ok) {
                    alert('Registration successful! Please log in.');
                    registerModal.style.display = 'none';
                    loginModal.style.display = 'block';
                    // Clear register form
                    document.getElementById('register-form').reset();
                    setTimeout(() => {
                        document.getElementById('login-email').focus();
                    }, 100);
                } else {
                    alert(data.message || 'Registration failed');
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('Registration failed. Please try again.');
            }
        });
    }

    // Enhanced input focus handling
    document.querySelectorAll('.input-with-icon input').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.borderColor = '#667eea';
            this.parentElement.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.borderColor = '#ddd';
            this.parentElement.style.boxShadow = 'none';
        });

        // Fix for mobile devices
        input.addEventListener('touchstart', function() {
            this.focus();
        });
    });
});

// Password toggle functionality
function togglePassword(inputId, toggleIcon) {
    const input = document.getElementById(inputId);
    const icon = toggleIcon;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    }
}

// Hamburger menu functionality
document.querySelector('.hamburger').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});