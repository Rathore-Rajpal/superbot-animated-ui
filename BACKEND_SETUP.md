# Backend Setup Guide

## 🚨 **CRITICAL: Database Connection Issue**

The "Failed to load tasks" error occurs because your frontend is trying to connect to `localhost:5001` but when deployed, it needs to connect to your actual backend server URL.

## 🔧 **How to Fix:**

### **Step 1: Deploy Your Backend**

First, deploy your backend to a hosting platform:

#### **Option A: Vercel (Recommended)**
1. Create a new Vercel project
2. Upload the `backend` folder
3. Set environment variables in Vercel dashboard:
   ```
   PORT=5001
   DB_HOST=sql12.freesqldatabase.com
   DB_USER=sql12791893
   DB_PASSWORD=3ALYm8PAgb
   DB_NAME=sql12791893
   ```
4. Deploy and get your backend URL (e.g., `https://your-backend.vercel.app`)



#### **Option C: Render**
1. Create a new Web Service
2. Upload the `backend` folder
3. Get your backend URL (e.g., `https://your-backend.onrender.com`)

### **Step 2: Update Frontend Configuration**

Once you have your backend URL, update the configuration:

#### **Method 1: Update config.js**
```javascript
// In config.js, update the production URL:
production: {
  API_URL: 'https://your-actual-backend-url.com/api'
}
```

#### **Method 2: Set Environment Variable**
In your hosting platform (Vercel/Netlify), set:
```
VITE_API_URL=https://your-actual-backend-url.com/api
```

#### **Method 3: Update vercel.json**
```json
{
  "env": {
    "VITE_API_URL": "https://your-actual-backend-url.com/api"
  }
}
```

### **Step 3: Test the Connection**

1. **Test Backend Health:**
   ```bash
   curl https://your-backend-url.com/api/health
   ```

2. **Test Database Connection:**
   ```bash
   curl https://your-backend-url.com/api/tasks
   ```

## 📋 **Complete Deployment Checklist:**

### **Backend Deployment:**
- [ ] Backend deployed to hosting platform
- [ ] Environment variables configured
- [ ] Database connection working
- [ ] Health endpoint responding
- [ ] API endpoints accessible

### **Frontend Configuration:**
- [ ] Backend URL updated in config.js
- [ ] Environment variable set in hosting platform
- [ ] Frontend deployed with correct configuration
- [ ] CORS properly configured on backend

### **Testing:**
- [ ] Backend health check passes
- [ ] Database queries work
- [ ] Frontend can fetch data
- [ ] No CORS errors in browser console

## 🔍 **Debugging Steps:**

1. **Check Browser Console:**
   - Look for CORS errors
   - Check network requests
   - Verify API URL being used

2. **Test Backend Directly:**
   ```bash
   curl -X GET https://your-backend-url.com/api/tasks
   ```

3. **Check Environment Variables:**
   - Verify VITE_API_URL is set correctly
   - Check if config.js is using the right URL

## 🚀 **Quick Fix Commands:**

### **For Vercel:**
```bash
# Set environment variable
vercel env add VITE_API_URL https://your-backend-url.com/api

# Redeploy
vercel --prod
```

### **For Netlify:**
```bash
# Add to netlify.toml
[context.production.environment]
  VITE_API_URL = "https://your-backend-url.com/api"
```

## 📞 **Need Help?**

If you're still having issues:
1. Share your backend URL
2. Check browser console for errors
3. Verify database credentials are correct
4. Ensure backend is actually running and accessible 