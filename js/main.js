document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu toggle
    const menuIcon = document.querySelector('.menu-icon');
    const navMenu = document.querySelector('.nav-menu');

    if (menuIcon && navMenu) {
        menuIcon.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Optional: Toggle icon between bars and an X
            const icon = menuIcon.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // Close mobile menu when a nav link is clicked
    document.querySelectorAll('.nav-links').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = menuIcon.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
    });

    // Custom file input button
    document.querySelectorAll('.file-input-wrapper input[type="file"]').forEach(input => {
        const wrapper = input.parentElement;
        const button = wrapper.querySelector('.file-button');
        const fileNameDisplay = wrapper.querySelector('.file-name-display');

        if (button) {
            button.addEventListener('click', () => {
                input.click();
            });
        }

        input.addEventListener('change', () => {
            if (input.files.length > 0) {
                if (fileNameDisplay) {
                    fileNameDisplay.textContent = input.files[0].name;
                }
            } else {
                if (fileNameDisplay) {
                    fileNameDisplay.textContent = '';
                }
            }
        });
    });

    // Password visibility toggle
    const togglePassword = document.querySelector('#togglePassword');
    const passwordInput = document.querySelector('#password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.classList.toggle('fa-eye');
            togglePassword.classList.toggle('fa-eye-slash');
        });
    }

    // Form submission logic (assuming you have a form with id="ASrequest")
    const form = document.getElementById('ASrequest');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            // Implement your form submission, loader, and progress bar logic here
            // This part is left for you to connect to your backend API
            console.log('Form submitted');
        });
    }
}); 