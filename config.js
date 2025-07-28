// Configuration for API endpoints
// Update this file with your actual backend URL before deployment

const config = {
  // Development
  development: {
    API_URL: 'http://localhost:5001/api'
  },
  
  // Production - UPDATE THIS WITH YOUR ACTUAL BACKEND URL
  production: {
    API_URL: 'https://your-backend-domain.com/api'
  }
};

// Get current environment
const env = import.meta.env.MODE || 'development';

// Export the appropriate configuration
export const API_BASE = import.meta.env.VITE_API_URL || config[env].API_URL;

// Log the API URL being used (for debugging)
console.log('🌐 Using API URL:', API_BASE);
console.log('🔧 Environment:', env); 