document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const authButton = document.getElementById('authButton');
    const logoutButton = document.getElementById('logoutButton');
    const userNavItem = document.getElementById('userNavItem');
    const authNavItem = document.getElementById('authNavItem');
    const userGreeting = document.getElementById('userGreeting');

    const currentUser = db.getCurrentUser();
    if (currentUser) {
        updateUserNav(currentUser);
    }

    authButton.addEventListener('click', () => {
        if (authButton.textContent === 'Login') {
            openModal(loginModal);
        } else {
            openModal(signupModal);
        }
    });

    logoutButton.addEventListener('click', () => {
        db.logout();
        toggleAuthNav(false);
    });

    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });

    document.getElementById('showSignup').addEventListener('click', (e) => {
        e.preventDefault();
        closeModals();
        openModal(signupModal);
    });

    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        closeModals();
        openModal(loginModal);
    });

    window.addEventListener('click', (event) => {
        if (event.target === loginModal || event.target === signupModal) {
            closeModals();
        }
    });

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('.submit-button');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
        
        try {
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            if (!username || !password) {
                alert('Please fill in all fields.');
                return;
            }
            const user = await db.loginUser(username, password);
            if (user) {
                db.setCurrentUser(user);
                updateUserNav(user);
                closeModals();
            } else {
                alert('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('.submit-button');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Signing up...';
        submitBtn.disabled = true;
        
        try {
            const username = document.getElementById('signupUsername').value.trim();
            const password = document.getElementById('signupPassword').value;
            
            if (!username || !password) {
                alert('Please fill in all fields.');
                return;
            }
            
            if (await db.registerUser(username, password)) {
                alert('Signup successful! You may now log in.');
                closeModals();
                openModal(loginModal);
            } else {
                alert('Signup failed. Please try a different username.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('Signup failed. Please try again.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    function toggleAuthNav(isLoggedIn) {
        if (isLoggedIn) {
            authNavItem.classList.add('hidden');
            userNavItem.classList.remove('hidden');
        } else {
            authNavItem.classList.remove('hidden');
            userNavItem.classList.add('hidden');
            userGreeting.textContent = '';
        }
    }

    function updateUserNav(user) {
        userGreeting.textContent = `Welcome, ${user.username}`;
        toggleAuthNav(true);
    }

    function openModal(modal) {
        modal.classList.remove('hidden');
    }

    function closeModals() {
        loginModal.classList.add('hidden');
        signupModal.classList.add('hidden');
        // Clear form fields
        document.getElementById('loginForm').reset();
        document.getElementById('signupForm').reset();
    }
});

// Basic mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.mobile-menu').addEventListener('click', function() {
        document.querySelector('.nav-links').style.display = 
            document.querySelector('.nav-links').style.display === 'flex' ? 'none' : 'flex';
    });

    const createAuroraEffect = () => {
        const aurora = document.createElement('div');
        aurora.classList.add('aurora-effect');
        aurora.style.position = 'absolute';
        aurora.style.borderRadius = '50%';
        aurora.style.filter = 'blur(60px)';
        aurora.style.opacity = '0';
        
        const size = Math.random() * 100 + 50;
        aurora.style.width = `${size}px`;
        aurora.style.height = `${size}px`;
        
        const colors = ['#8A2BE2', '#FF1493', '#00BFFF', '#FF69B4'];
        aurora.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        aurora.style.left = `${Math.random() * 100}%`;
        aurora.style.top = `${Math.random() * 100}%`;
        
        document.querySelector('.hero').appendChild(aurora);
        
        let opacity = 0;
        const fadeIn = setInterval(() => {
            if (opacity >= 0.3) {
                clearInterval(fadeIn);
                setTimeout(() => {
                    const fadeOut = setInterval(() => {
                        if (opacity <= 0) {
                            clearInterval(fadeOut);
                            aurora.remove();
                        }
                        opacity -= 0.01;
                        aurora.style.opacity = opacity;
                    }, 50);
                }, Math.random() * 3000 + 2000);
            }
            opacity += 0.01;
            aurora.style.opacity = opacity;
        }, 50);
    };
    
    setInterval(createAuroraEffect, 1000);
}); 