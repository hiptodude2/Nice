// This is the content of the old repairme-aurora.js
// delete everything after this comment
function addNoCacheToFetch() {
    const originalFetch = window.fetch;
    window.fetch = function() {
        if (arguments[0] instanceof Request) {
            arguments[0] = new Request(arguments[0], {
                cache: 'no-store',
                headers: {
                    ...arguments[0].headers,
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                }
            });
        } else {
            if (typeof arguments[1] !== 'object') {
                arguments[1] = {};
            }
            if (!arguments[1].headers) {
                arguments[1].headers = {};
            }
            arguments[1].cache = 'no-store';
            arguments[1].headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
            arguments[1].headers['Pragma'] = 'no-cache';
            arguments[1].headers['Expires'] = '0';
        }
        return originalFetch.apply(this, arguments);
    };
}

addNoCacheToFetch();

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("ASrequest");
    const cyanNameInput = document.getElementById("cyan_name");
    const cyanVersionInput = document.getElementById("cyan_version");
    const cyanBundleIdInput = document.getElementById("cyan_bundle_id");
    const cyanOverwriteCheckbox = document.getElementById("overwriteCheckbox");
    const cyanIconInput = document.getElementById("cyan_icon");
    const cyanCompressLevelSelect = document.getElementById("cyan_compress_level");
    const resultDiv = document.getElementById("result");
    const loader = document.getElementById("loader");
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");
    // const themeToggle = document.getElementById("themeToggle"); // Theme toggle removed for new site
    const signInButton = document.getElementById("signInButton");
    const authPopup = document.getElementById("authPopup");
    const authForm = document.getElementById("authForm");
    const authTitle = document.getElementById("authTitle");
    const authSubmit = document.getElementById("authSubmit");
    const authToggle = document.getElementById("authToggle");
    const userInfo = document.getElementById("userInfo");
    const usernameDisplay = document.getElementById("username-display");
    const privacyPolicyAgreement = document.getElementById("privacyPolicyAgreement");
    const agreePrivacyPolicyCheckbox = document.getElementById("agreePrivacyPolicy");
    // const viewPrivacyPolicyLink = document.getElementById("viewPrivacyPolicy"); // Not present in provided HTML
    const maxFileSizeElement = document.getElementById('maxFileSize');
    const linkDurationInfo = document.getElementById('linkDuration');

    // Theme functionality removed for consistency with new site
    // let currentTheme = "normal-mode";
    // const themes = ["normal-mode", "light-mode", "dark-mode", "christmas-mode"];
    // const themeIcons = { ... };
    // let rotation = 0;

    let isLoginMode = false;
    let currentUser = null;

    // Snowflakes function removed as theme switcher is removed

    // setTheme function removed

    // themeToggle event listener removed

    // const savedTheme = localStorage.getItem("theme") || "normal-mode"; // Default to new site theme
    // setTheme(savedTheme); // Removed

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", function () {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
            this.classList.toggle("fa-eye");
            this.classList.toggle("fa-eye-slash");
        });
    }


    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            if (!currentUser) {
                showNotification("Please log in to sign IPAs", "error");
                return;
            }

            console.log("Signing request initiated by user:", currentUser.username);
            const ipaFile = document.getElementById('ipa').files[0];
            console.log("File selected for signing:", ipaFile ? ipaFile.name : "No file selected");

            const maxSize = currentUser.premium ? 1.5 * 1024 * 1024 * 1024 : 1024 * 1024 * 1024;

            if (ipaFile && ipaFile.size > maxSize) {
                showNotification(`File size exceeds the ${currentUser.premium ? '1.5 GB' : '1 GB'} limit. ${currentUser.premium ? '' : 'Upgrade to premium for larger files.'}`, "error");
                return;
            }

            if(resultDiv) resultDiv.textContent = "";
            if(loader) loader.classList.remove("hidden");

            const formData = new FormData(form);
            formData.append("isPremium", currentUser.premium ? 'true' : 'false');
            formData.append("expiryDays", currentUser.premium ? "120" : "30"); // Example values
            formData.append("username", currentUser.username);
            
            if(cyanNameInput) formData.append("cyan_name", cyanNameInput.value);
            if(cyanVersionInput) formData.append("cyan_version", cyanVersionInput.value);
            if(cyanBundleIdInput) formData.append("cyan_bundle_id", cyanBundleIdInput.value);
            if(cyanOverwriteCheckbox) formData.append("cyan_overwrite", cyanOverwriteCheckbox.checked);
            if (cyanIconInput && cyanIconInput.files.length > 0) {
                formData.append("cyan_icon", cyanIconInput.files[0]);
            }
            if(cyanCompressLevelSelect) formData.append("cyan_compress_level", cyanCompressLevelSelect.value);

            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitButton.disabled = true;
            }

            try {
                console.log("Sending signing request to API...");
                console.log("User premium status:", currentUser.premium);
                
                const response = await fetch("https://api.cherrysideloading.xyz/sign", { // Updated to new domain
                    method: "POST",
                    body: formData
                });

                console.log("Response received from API with status:", response.status);

                if (!response.ok) {
                     const errorData = await response.json().catch(() => ({error: `HTTP error! status: ${response.status}`}));
                    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log("Signing successful. API response:", result);
                handleSigningSuccess(result);
            } catch (error) {
                console.error("Error during signing request:", error);
                handleSigningError(error);
            } finally {
                if (submitButton) {
                    submitButton.innerHTML = '<i class="fas fa-signature"></i> Sign IPA';
                    submitButton.disabled = false;
                }
                if(loader) loader.classList.add("hidden");
            }
        });
    }

    function handleSigningSuccess(data) {
        if(loader) loader.classList.add("hidden");
        console.log("Handling signing success. Data:", data);
        
        if (data.install_url) {
            const installLink = document.createElement("a");
            installLink.href = data.install_url;
            installLink.textContent = "Install App";
            installLink.className = "install-link btn"; // Use new site's button style
            if(resultDiv) {
                resultDiv.innerHTML = ''; // Clear previous results
                resultDiv.appendChild(installLink);
            }
            showNotification("IPA signed successfully!", "success");
        } else {
            const errorMsg = data.error || "Failed to obtain install link from response data.";
            console.error(errorMsg);
             if(resultDiv) resultDiv.textContent = `Error: ${errorMsg}`;
            showNotification(errorMsg, "error");
        }
    }

    function handleSigningError(error) {
        console.error("Signing process failed:", error);
        if(loader) loader.classList.add("hidden");
        const errorMessage = error.message || "An error occurred while signing. P12 password may be incorrect or files may be corrupted.";
        if(resultDiv) resultDiv.textContent = `Error: ${errorMessage}`;
        showNotification(errorMessage, "error");
    }

    function showNotification(message, type) {
        const notification = document.createElement("div");
        notification.textContent = message;
        notification.className = `notification ${type}`;
        document.body.appendChild(notification);
        
        // Trigger reflow to apply initial animation state
        notification.offsetHeight; 
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500); // Wait for fade out animation
        }, 3000);
    }

    const fileInputs = document.querySelectorAll('input[type="file"]');
    if (fileInputs.length > 0) {
        fileInputs.forEach((input) => {
            input.addEventListener("change", function (event) {
                const file = event.target.files[0];
                const associatedButton = this.nextElementSibling; // Assuming button is next sibling
                if(file && associatedButton && associatedButton.classList.contains('file-button')){
                    associatedButton.textContent = file.name;
                }
                if (file && !isValidFileType(file, input.id)) {
                    showNotification(
                        `Invalid file type for ${input.id}. Please select the correct file.`,
                        "error"
                    );
                    input.value = "";
                     if(associatedButton && associatedButton.classList.contains('file-button')){
                        associatedButton.textContent = 'Choose File'; // Reset button text
                    }
                }
            });
        });
    }
    
    // Attach click listeners to "Choose File" buttons to trigger hidden file inputs
    document.querySelectorAll('.file-button').forEach(button => {
        // Find the input associated with this button. It's usually the previous sibling.
        const fileInput = button.previousElementSibling;
        if (fileInput && fileInput.type === 'file') {
            button.addEventListener('click', () => fileInput.click());
        } else if (button.htmlFor) { // If it's a label acting as a button
             const inputById = document.getElementById(button.htmlFor);
             if (inputById && inputById.type === 'file') {
                button.addEventListener('click', () => inputById.click());
             }
        }
    });


    function isValidFileType(file, inputId) {
        const validTypes = {
            p12: [".p12"],
            mobileprovision: [".mobileprovision"],
            ipa: [".ipa"],
            cyan_icon: [".png", ".jpg", ".jpeg"]
        };
        const fileExtension = `.${file.name.split(".").pop().toLowerCase()}`;
        return validTypes[inputId] ? validTypes[inputId].includes(fileExtension) : true; // Allow if not in map
    }

    if (signInButton) {
        signInButton.addEventListener("click", (e) => {
            e.preventDefault();
            if (currentUser) {
                if (confirm("Are you sure you want to sign out?")) {
                    currentUser = null;
                    localStorage.removeItem('currentUser');
                    checkLoginStatus();
                    showNotification("Signed out successfully", "success");
                }
            } else {
                if (authPopup) {
                    authPopup.classList.remove("hidden");
                    // Reset to Sign Up mode by default when opening
                    isLoginMode = false;
                    if(authTitle) authTitle.textContent = "Sign Up";
                    if(authSubmit) authSubmit.textContent = "Sign Up";
                    if(authToggle) authToggle.innerHTML = 'Already have an account? <a href="#">Login</a>';
                    if(privacyPolicyAgreement) privacyPolicyAgreement.style.display = "flex"; // Changed from block
                    if(agreePrivacyPolicyCheckbox) agreePrivacyPolicyCheckbox.required = true;
                }
            }
        });
    }

    if (authToggle) {
        authToggle.addEventListener("click", (e) => {
            e.preventDefault();
            isLoginMode = !isLoginMode;
            if(authTitle) authTitle.textContent = isLoginMode ? "Login" : "Sign Up";
            if(authSubmit) authSubmit.textContent = isLoginMode ? "Login" : "Sign Up";
            authToggle.innerHTML = isLoginMode ? 'Don\'t have an account? <a href="#">Sign Up</a>' : 'Already have an account? <a href="#">Login</a>';
            if(privacyPolicyAgreement) privacyPolicyAgreement.style.display = isLoginMode ? "none" : "flex"; // Changed from block
            if(agreePrivacyPolicyCheckbox) agreePrivacyPolicyCheckbox.required = !isLoginMode;
        });
    }

    if (authForm) {
        authForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById("auth-username");
            const passwordInput = document.getElementById("auth-password");
            
            if (!usernameInput || !passwordInput) return;

            const username = usernameInput.value;
            const password = passwordInput.value;

            if (!isLoginMode && agreePrivacyPolicyCheckbox && !agreePrivacyPolicyCheckbox.checked) {
                showNotification("You must agree to the Privacy Policy to sign up.", "error");
                return;
            }

            try {
                if (isLoginMode) {
                    const user = await db.loginUser(username, password);
                    if (user) {
                        currentUser = {
                            id: user.id, // Store id
                            username: user.username,
                            premium: user.premium, 
                            isDev: user.isDev
                        };
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));
                        showNotification("Logged in successfully!", "success");
                        if(authPopup) authPopup.classList.add("hidden");
                        checkLoginStatus();
                    } else {
                        showNotification("Invalid username or password", "error");
                    }
                } else {
                    const success = await db.registerUser(username, password); // Use db method
                    if (success) {
                        showNotification("Account created successfully! Please log in.", "success");
                        // Switch to login mode
                        isLoginMode = true;
                        if(authTitle) authTitle.textContent = "Login";
                        if(authSubmit) authSubmit.textContent = "Login";
                        if(authToggle) authToggle.innerHTML = 'Don\'t have an account? <a href="#">Sign Up</a>';
                        if(privacyPolicyAgreement) privacyPolicyAgreement.style.display = "none";
                        if(agreePrivacyPolicyCheckbox) agreePrivacyPolicyCheckbox.required = false;
                        if(usernameInput) usernameInput.value = ''; // Clear fields for login
                        if(passwordInput) passwordInput.value = '';
                    } else {
                        // db.registerUser should handle showing notification for failure
                         showNotification("Registration failed. Username might be taken.", "error");
                    }
                }
            } catch (error) {
                 console.error("Auth error:", error);
                 showNotification("An authentication error occurred.", "error");
            }
        });
    }

    function checkLoginStatus() {
        const storedUser = localStorage.getItem('currentUser');
        currentUser = storedUser ? JSON.parse(storedUser) : null;

        if (currentUser) {
            if (signInButton) {
                signInButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sign Out';
                signInButton.classList.remove('btn-accent'); // Optional: change style when logged in
            }
            if (userInfo) userInfo.classList.remove("hidden");
            if (usernameDisplay) {
                usernameDisplay.textContent = currentUser.username;
                let badgesHTML = '';
                if (currentUser.premium) {
                    badgesHTML += ' <span class="premium-badge">Premium</span>';
                }
                if (currentUser.isDev) {
                    badgesHTML += ' <span class="dev-badge">Dev</span>';
                }
                usernameDisplay.innerHTML = currentUser.username + badgesHTML;
            }
            if (linkDurationInfo) {
                 linkDurationInfo.textContent = `Links last for ${currentUser.premium ? "120 days (Premium)" : "30 days"}.`;
            }

            const devButton = document.getElementById('devButton');
            if (currentUser.isDev && devButton) {
                devButton.classList.remove("hidden");
            } else if (devButton) {
                devButton.classList.add("hidden");
            }
        } else {
            if (signInButton) {
                signInButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
                signInButton.classList.add('btn-accent');
            }
            if (userInfo) userInfo.classList.add("hidden");
            if (usernameDisplay) usernameDisplay.textContent = "";
            if (linkDurationInfo) linkDurationInfo.textContent = "Log in to see link duration.";
            const devButton = document.getElementById('devButton');
            if (devButton) devButton.classList.add("hidden");
            const adminPanel = document.getElementById('adminPanel');
            if(adminPanel) adminPanel.classList.add('hidden'); // Hide admin panel if logged out
        }
        updateMaxFileSize();
        document.dispatchEvent(new Event('loginStatusChanged')); // For admin.js or other modules
    }
    
    // Listener for devButton to toggle Admin Panel (moved from admin.js for direct access here)
    const devButton = document.getElementById('devButton');
    if (devButton) {
        devButton.addEventListener('click', () => {
            const adminPanel = document.getElementById('adminPanel');
            if (adminPanel) {
                adminPanel.classList.toggle('hidden');
                if (!adminPanel.classList.contains('hidden') && typeof loadUsers === 'function') {
                    loadUsers(); // Assumes loadUsers is globally available from admin.js
                }
            }
        });
    }


    checkLoginStatus(); // Initial check

    // Modal close buttons
    document.querySelectorAll(".close-modal-btn").forEach((closeButton) => {
        closeButton.addEventListener("click", () => {
            // Find the closest parent modal/popup and hide it
            let parentModal = closeButton.closest(".modal");
            if (!parentModal) parentModal = closeButton.closest(".popup");
            if (!parentModal) parentModal = closeButton.closest(".admin-panel");
            
            if (parentModal) {
                parentModal.classList.add("hidden");
            }
        });
    });
    
    // Close modal on outside click
    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal") || e.target.classList.contains("popup") || e.target.classList.contains("admin-panel")) {
            e.target.classList.add("hidden");
        }
    });


    const toggleAuthPassword = document.getElementById("toggleAuthPassword");
    const authPasswordInput = document.getElementById("auth-password");
    if (toggleAuthPassword && authPasswordInput) {
        toggleAuthPassword.addEventListener("click", function() {
            const type = authPasswordInput.getAttribute("type") === "password" ? "text" : "password";
            authPasswordInput.setAttribute("type", type);
            this.classList.toggle("fa-eye");
            this.classList.toggle("fa-eye-slash");
        });
    }

    function updateMaxFileSize() {
        if (maxFileSizeElement) {
            maxFileSizeElement.textContent = (currentUser && currentUser.premium) ? '1.5 GB' : '1 GB';
        }
    }
    updateMaxFileSize();

    // Customization Menu Modal Logic
    const customizationModal = document.getElementById("customizationMenuModal");
    const customizationButton = document.getElementById("customizationMenuButton");
    
    if (customizationButton && customizationModal) {
        customizationButton.onclick = function() {
            customizationModal.classList.remove("hidden");
        }
    }
    // Close handled by universal .close-modal-btn logic now
});