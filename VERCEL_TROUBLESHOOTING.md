# 🔧 Vercel Deployment Troubleshooting Guide

## 🚨 **Common Errors & Solutions**

### **1. Mixed Routing Properties Error**
**Error:** `Mixed routing properties`

**Solution:** ✅ **FIXED** - Updated `vercel.json` to use modern format
```json
{
  "rewrites": [...],
  "headers": [...]
}
```
Instead of the legacy `routes` property.

### **2. Missing Build Script Error**
**Error:** `Missing build script`

**Solution:** ✅ **FIXED** - Your `package.json` already has:
```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

### **3. Missing Public Directory Error**
**Error:** `Missing public directory`

**Solution:** ✅ **FIXED** - Vite builds to `dist` directory, configured in `vercel.json`:
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ]
}
```

### **4. Terser Not Found Error**
**Error:** `terser not found`

**Solution:** ✅ **FIXED** - Added terser to `package.json`:
```json
{
  "devDependencies": {
    "terser": "^5.28.1"
  }
}
```

### **5. Conflicting Configuration Files**
**Error:** `Conflicting configuration files`

**Solution:** ✅ **CHECKED** - No conflicting files found:
- ✅ No `now.json` file
- ✅ No `.now` directory
- ✅ Only `vercel.json` present

## 🚀 **Quick Fix Commands**

### **For Windows (PowerShell):**
```powershell
# Run the deployment script
.\deploy-vercel.ps1

# Or manually:
npm install
npm run build
vercel --prod
```

### **For Mac/Linux:**
```bash
# Run the deployment script
chmod +x deploy-vercel.sh
./deploy-vercel.sh

# Or manually:
npm install
npm run build
vercel --prod
```

## 🔍 **Pre-Deployment Checklist**

### **Configuration Files:**
- [x] `vercel.json` - ✅ Fixed (modern format)
- [x] `package.json` - ✅ Has build script
- [x] No `now.json` - ✅ Confirmed
- [x] No `.now` directory - ✅ Confirmed

### **Dependencies:**
- [x] `terser` - ✅ Added to devDependencies
- [x] All required packages - ✅ Installed

### **Build Process:**
- [x] `npm run build` - ✅ Works locally
- [x] `dist` directory - ✅ Generated correctly
- [x] Static assets - ✅ Properly configured

## 🛠️ **Manual Deployment Steps**

### **Step 1: Clean & Build**
```bash
# Clean previous builds
rm -rf dist
rm -rf .vercel

# Install dependencies
npm install

# Build project
npm run build
```

### **Step 2: Verify Build**
```bash
# Check if dist directory exists
ls -la dist/

# Should contain:
# - index.html
# - assets/ (with JS/CSS files)
```

### **Step 3: Deploy**
```bash
# Deploy to Vercel
vercel --prod
```

## 🔧 **Advanced Troubleshooting**

### **If Build Still Fails:**
1. **Check Node.js version:**
   ```bash
   node --version
   # Should be 16+ for Vite
   ```

2. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

3. **Delete node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### **If Deployment Still Fails:**
1. **Check Vercel logs:**
   ```bash
   vercel logs
   ```

2. **Test locally:**
   ```bash
   npm run preview
   ```

3. **Verify environment variables:**
   - Check if any required env vars are missing
   - Ensure database URLs are correct

## 📞 **Common Issues & Solutions**

### **Issue: "Cannot load project settings"**
**Solution:**
```bash
rm -rf .vercel
vercel
```

### **Issue: "Repository connection limitation"**
**Solution:**
- Disconnect existing projects from the same repository
- Or upgrade to Pro plan for more connections

### **Issue: "Invalid route source pattern"**
**Solution:** ✅ **FIXED** - Updated to modern syntax in `vercel.json`

### **Issue: "Failed to install builder dependencies"**
**Solution:**
```bash
npm install
npm install terser --save-dev
```

## 🎯 **Expected Result**

After fixing these issues, your deployment should:
- ✅ Build successfully without errors
- ✅ Deploy to Vercel without configuration conflicts
- ✅ Serve your React app with proper routing
- ✅ Connect to your backend API
- ✅ Display database data correctly

## 📋 **Final Verification**

After deployment, test:
1. **Frontend loads:** `https://your-app.vercel.app`
2. **API connects:** Check browser console for no CORS errors
3. **Database works:** View Database button shows data
4. **Routing works:** All pages load correctly

If any issues persist, check the Vercel deployment logs for specific error messages. 