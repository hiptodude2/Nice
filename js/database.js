// Frontend database.js for user authentication
const db = {
    apiUrl: 'https://admin.cherrysideloading.xyz/api.js',  // Your current auth API URL
    
    async makeRequest(action, data = {}) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ action, ...data })
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'API request failed');
            }
            return result;
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    },
    
    async registerUser(username, password) {
        try {
            const result = await this.makeRequest('register', { username, password });
            return result.success;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    },
    
    async loginUser(username, password) {
        try {
            const result = await this.makeRequest('login', { username, password });
            return result.success ? result.user : null;
        } catch (error) {
            console.error('Login error:', error);
            return null;
        }
    },
    
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser') || 'null');
    },
    
    setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    },
    
    logout() {
        localStorage.removeItem('currentUser');
    }
};

window.db = db;

console.log('Database.js loaded successfully!');
