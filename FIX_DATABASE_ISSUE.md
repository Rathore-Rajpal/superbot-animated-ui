# 🔧 Fix "Failed to load tasks" Issue

## 🚨 **Current Status:**
- ✅ Backend server is running on port 5001
- ✅ Database connection is working
- ✅ API endpoints are responding correctly
- ❌ Frontend still shows "Failed to load tasks"

## 🔍 **Root Cause Analysis:**

The issue is likely one of these:
1. **Frontend not running** - React dev server not started
2. **CORS issues** - Browser blocking cross-origin requests
3. **Network connectivity** - Frontend can't reach backend
4. **Configuration mismatch** - Wrong API URL in frontend

## 🚀 **Step-by-Step Fix:**

### **Step 1: Verify Both Servers Are Running**

#### **Backend Server (Port 5001):**
```bash
# Check if backend is running
netstat -ano | findstr :5001

# If not running, start it:
cd backend
node server.js
```

**Expected Output:**
```
✅ Database connected successfully
✅ Database tables initialized
🚀 Server running on port 5001
📊 API available at http://localhost:5001/api
```

#### **Frontend Server (Port 8081):**
```bash
# Check if frontend is running
netstat -ano | findstr :8081

# If not running, start it:
npm run dev
```

**Expected Output:**
```
VITE v5.4.10  ready in 650 ms
➜  Local:   http://localhost:8081/
```

### **Step 2: Test API Connection**

Open this test page in your browser:
```
http://localhost:8081/test-api.html
```

Or manually test:
```bash
# Test health endpoint
curl http://localhost:5001/api/health

# Test tasks endpoint
curl http://localhost:5001/api/tasks
```

### **Step 3: Check Browser Console**

1. Open your React app: `http://localhost:8081`
2. Open browser developer tools (F12)
3. Go to Console tab
4. Click "View Database" button
5. Look for error messages

**Common Errors:**
- `Failed to fetch` = Network/CORS issue
- `CORS error` = Backend CORS not configured
- `404 Not Found` = Wrong API URL

### **Step 4: Fix Configuration Issues**

#### **If API URL is wrong:**
Check `config.js`:
```javascript
const config = {
  development: {
    API_URL: 'http://localhost:5001/api'  // ✅ Correct
  }
};
```

#### **If CORS is blocking:**
The backend already has CORS configured, but if issues persist:
```javascript
// In backend/server.js (already configured)
app.use(cors());
```

### **Step 5: Manual Database Test**

Test the database connection directly:
```bash
# Test health
curl http://localhost:5001/api/health

# Test tasks
curl http://localhost:5001/api/tasks

# Test finances
curl http://localhost:5001/api/finances
```

## 🔧 **Quick Fix Commands:**

### **Start Both Servers:**
```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
npm run dev
```

### **Test Everything:**
```bash
# Test backend
curl http://localhost:5001/api/health

# Open frontend
# http://localhost:8081
```

## 🎯 **Expected Results:**

### **Backend Test:**
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

### **Frontend Test:**
- ✅ Page loads without errors
- ✅ "View Database" button works
- ✅ Tasks and finances display correctly
- ✅ No console errors

## 🚨 **If Still Not Working:**

### **Check 1: Network Issues**
```bash
# Test if backend is accessible
ping localhost
telnet localhost 5001
```

### **Check 2: Firewall/Antivirus**
- Temporarily disable firewall
- Check if antivirus is blocking connections

### **Check 3: Port Conflicts**
```bash
# Check what's using port 5001
netstat -ano | findstr :5001

# Check what's using port 8081
netstat -ano | findstr :8081
```

### **Check 4: Browser Issues**
- Try different browser
- Clear browser cache
- Disable browser extensions

## 📞 **Debugging Steps:**

1. **Open browser console** (F12)
2. **Click "View Database"**
3. **Look for these messages:**
   - `🌐 Using API URL: http://localhost:5001/api`
   - `🔗 Fetching tasks from: http://localhost:5001/api/tasks`
   - Any error messages

4. **Check Network tab** in dev tools:
   - Look for failed requests to `/api/tasks`
   - Check response status codes

## ✅ **Success Indicators:**

When working correctly, you should see:
- ✅ Backend running on port 5001
- ✅ Frontend running on port 8081
- ✅ Database data loading in frontend
- ✅ No console errors
- ✅ Network requests returning 200 status

## 🆘 **Still Having Issues?**

If the problem persists:
1. Share browser console errors
2. Share network tab details
3. Confirm both servers are running
4. Test with the provided test page 