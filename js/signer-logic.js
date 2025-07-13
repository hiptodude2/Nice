document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('ASrequest');
    const resultDiv = document.getElementById('result');
    const loader = document.getElementById('loader');
    const submitButton = document.querySelector('button[type="submit"]');
    
    // File input handlers
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        const button = input.nextElementSibling;
        const fileNameDisplay = button.nextElementSibling;
        
        // Make the button trigger file input
        button.addEventListener('click', (e) => {
            e.preventDefault();
            input.click();
        });
        
        // Update button text when file is selected
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                button.textContent = file.name;
                if (fileNameDisplay) {
                    fileNameDisplay.textContent = file.name;
                }
            } else {
                button.textContent = getDefaultButtonText(input.id);
                if (fileNameDisplay) {
                    fileNameDisplay.textContent = '';
                }
            }
        });
    });
    
    function getDefaultButtonText(inputId) {
        const defaults = {
            'p12': 'Choose P12 File',
            'mobileprovision': 'Choose Mobile Provision',
            'ipa': 'Choose IPA File'
        };
        return defaults[inputId] || 'Choose File';
    }
    
    // Password visibility toggle
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
    
    // Form submission
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Clear previous results
            if (resultDiv) resultDiv.innerHTML = '';
            if (loader) loader.classList.remove('hidden');
            
            // Update submit button
            if (submitButton) {
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing...';
                submitButton.disabled = true;
            }
            
            try {
                // Prepare form data
                const formData = new FormData(form);
                
                // Add default values for premium status (can be enhanced later)
                formData.append('isPremium', 'false');
                formData.append('expiryDays', '7');
                
                // Make API request
                const response = await fetch('https://api.cherrysideloading.xyz/sign', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    handleSuccess(result);
                } else {
                    handleError(result.error || 'An error occurred during signing');
                }
                
            } catch (error) {
                console.error('Error:', error);
                handleError('Network error or server unavailable');
            } finally {
                // Reset submit button
                if (submitButton) {
                    submitButton.innerHTML = 'Sign IPA';
                    submitButton.disabled = false;
                }
                if (loader) loader.classList.add('hidden');
            }
        });
    }
    
    function handleSuccess(result) {
        if (result.install_url) {
            const installButton = document.createElement('a');
            installButton.href = result.install_url;
            installButton.textContent = 'Install App';
            installButton.className = 'install-button';
            installButton.style.cssText = `
                display: inline-block;
                background-color: #4CAF50;
                color: white;
                padding: 15px 25px;
                text-decoration: none;
                border-radius: 10px;
                font-size: 1.1em;
                text-align: center;
                margin-top: 10px;
                transition: background-color 0.3s;
            `;
            
            installButton.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#45a049';
            });
            
            installButton.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '#4CAF50';
            });
            
            if (resultDiv) {
                resultDiv.appendChild(installButton);
            }
            
            showNotification('IPA signed successfully!', 'success');
        } else {
            handleError('No install URL received');
        }
    }
    
    function handleError(message) {
        if (resultDiv) {
            resultDiv.innerHTML = `<div style="color: #ff6b6b; padding: 10px; background-color: rgba(255, 107, 107, 0.1); border-radius: 5px; margin-top: 10px;">${message}</div>`;
        }
        showNotification(message, 'error');
    }
    
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        if (type === 'success') {
            notification.style.backgroundColor = '#4CAF50';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#f44336';
        }
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
});
