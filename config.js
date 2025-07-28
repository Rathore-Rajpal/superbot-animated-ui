// Configuration for API endpoints
// Always use Render backend for consistent operation

const config = {
  // Development - Use Render backend for consistency
  development: {
    API_URL: 'https://superbot-animated-ui.onrender.com/api'
  },
  
  // Production - Your Render backend URL
  production: {
    API_URL: 'https://superbot-animated-ui.onrender.com/api'
  }
};

// Get current environment
const env = import.meta.env.MODE || 'development';

// Export the appropriate configuration
export const API_BASE = import.meta.env.VITE_API_URL || config[env].API_URL;

// Log the API URL being used (for debugging)
console.log('🌐 Using API URL:', API_BASE);
console.log('🔧 Environment:', env); 