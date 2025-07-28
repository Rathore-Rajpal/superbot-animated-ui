# 🚀 Render.com Deployment Guide

## 🎯 **Choose "Web Services" on Render**

From the Render dashboard, select:
- **Web Services** (globe with network symbol)
- Perfect for Node.js backend APIs

## 📋 **Step-by-Step Deployment:**

### **Step 1: Create Web Service**
1. Click **"New Web Service →"**
2. Connect your GitHub repository
3. Select your repository

### **Step 2: Configure Service Settings**
```
Name: superbot-backend
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### **Step 3: Set Environment Variables**
Add these in the Render dashboard:
```
DB_HOST=sql12.freesqldatabase.com
DB_USER=sql12791893
DB_PASSWORD=3ALYm8PAgb
DB_NAME=sql12791893
DB_PORT=3306
PORT=10000
NODE_ENV=production
```

### **Step 4: Deploy**
Click "Create Web Service" and wait for deployment.

## 🔧 **Repository Structure**

Ensure your repository has this structure:
```
your-repo/
├── backend/
│   ├── server.js          ✅ Main server file
│   ├── package.json       ✅ Dependencies
│   ├── render.yaml        ✅ Render config
│   └── start.js           ✅ Auto-restart script
├── src/                   ✅ Frontend files
├── package.json           ✅ Frontend dependencies
└── ... (other files)
```

## 🌐 **After Deployment**

### **Get Your Backend URL**
Render will provide a URL like:
```
https://superbot-backend.onrender.com
```

### **Test Your Backend**
```bash
# Test health endpoint
curl https://superbot-backend.onrender.com/api/health

# Test database connection
curl https://superbot-backend.onrender.com/api/tasks
```

## 🔗 **Update Frontend Configuration**

Once you have your Render backend URL, update `config.js`:

```javascript
const config = {
  development: {
    API_URL: 'http://localhost:5001/api'
  },
  production: {
    API_URL: 'https://superbot-backend.onrender.com/api'  // Your Render URL
  }
};
```

## 📊 **Expected Results**

### **Backend Health Check:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "database": {
    "host": "sql12.freesqldatabase.com",
    "database": "sql12791893",
    "connected": true
  }
}
```

### **Tasks API:**
```json
[
  {
    "id": 45,
    "title": "Task 30",
    "status": "completed",
    "due_date": "2025-08-29T18:30:00.000Z",
    "priority": 3,
    "assigned_to": "David"
  }
]
```

## 🛠️ **Troubleshooting**

### **If Build Fails:**
1. Check build logs in Render dashboard
2. Ensure `package.json` has correct scripts
3. Verify all dependencies are listed

### **If Database Connection Fails:**
1. Verify environment variables are set correctly
2. Check if database is accessible from Render
3. Test database credentials locally first

### **If Service Won't Start:**
1. Check start command: `npm start`
2. Verify `server.js` is the main file
3. Check Render logs for specific errors

## 🔄 **Auto-Deploy**

Render will automatically:
- ✅ Deploy when you push to main branch
- ✅ Restart service if it crashes
- ✅ Scale based on traffic (on paid plans)

## 📈 **Monitoring**

In Render dashboard, you can:
- View real-time logs
- Monitor performance
- Check deployment status
- Set up alerts

## 🎯 **Next Steps**

After backend is deployed:
1. **Test the API endpoints**
2. **Update frontend configuration**
3. **Deploy frontend to Vercel/Netlify**
4. **Test the complete application**

## ✅ **Success Checklist**

- [ ] Backend deployed to Render
- [ ] Health endpoint responding
- [ ] Database connection working
- [ ] Tasks API returning data
- [ ] Frontend configuration updated
- [ ] Complete application working 