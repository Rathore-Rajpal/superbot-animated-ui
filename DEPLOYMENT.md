# Deployment Guide

## 🚀 Local Development

### Frontend (React App)
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend (Node.js Server)
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start server with auto-restart
npm start
```

## 🌐 Hosting Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Install terser dependency** (already added to package.json):
   ```bash
   npm install terser --save-dev
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Deploy to your hosting platform**:
   - Upload the `dist` folder contents
   - Or connect your GitHub repository for automatic deployment

### Backend Deployment

1. **Upload backend folder** to your hosting platform
2. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **For continuous deployment**, use the provided scripts:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

## 🔧 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5001/api
```

### Backend (.env)
```
PORT=5001
DB_HOST=sql12.freesqldatabase.com
DB_USER=sql12791893
DB_PASSWORD=3ALYm8PAgb
DB_NAME=sql12791893
```

## 📊 Database Configuration

The backend automatically:
- Connects to your MySQL database
- Creates tables if they don't exist
- Inserts sample data if tables are empty
- Provides auto-restart functionality

## 🛠️ Troubleshooting

### Build Errors
- **Terser not found**: Run `npm install terser --save-dev`
- **Port conflicts**: Change PORT in backend/.env
- **Database connection**: Verify credentials in backend/server.js

### Runtime Errors
- **Server not starting**: Check if port 5001 is available
- **Database connection failed**: Verify database credentials
- **CORS issues**: Ensure frontend URL is allowed in backend CORS config

## 📱 Production Checklist

- [ ] Backend server running on hosting platform
- [ ] Frontend built and deployed
- [ ] Environment variables configured
- [ ] Database connection working
- [ ] CORS properly configured
- [ ] Auto-restart functionality enabled 