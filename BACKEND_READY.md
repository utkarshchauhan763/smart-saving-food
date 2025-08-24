# 🚀 Backend Setup & Running Guide

## ✅ Backend Status: READY TO RUN!

Your Smart Saving Food backend is fully configured and tested. Here's how to run it:

## 🏃 Quick Start Options:

### Option 1: PowerShell Script (Recommended)
```powershell
# Start backend only
.\start-backend.ps1

# Start full stack (frontend + backend)
.\start-fullstack.ps1
```

### Option 2: Manual Commands
```powershell
# Start backend
cd server
node server.js

# Start frontend (in another terminal)
npm run dev
```

### Option 3: Batch File (Windows)
```batch
# Double-click the file or run:
start-backend.bat
```

## 📡 Server Information:
- **Backend URL**: http://localhost:5000
- **Frontend URL**: http://localhost:5173
- **Database**: MongoDB (localhost:27017)
- **API Endpoints**: http://localhost:5000/api/

## 🔧 Prerequisites:
1. **Node.js** (v18+) ✅ Installed
2. **MongoDB** - Options:
   - MongoDB Compass (GUI) ✅ You have this
   - Local MongoDB server
   - Cloud MongoDB Atlas

## 📋 API Endpoints:
- `GET  /` - API information
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET  /api/menu/today` - Today's menu
- `POST /api/menu` - Create menu (admin)
- `GET  /api/admin/dashboard` - Admin stats

## 🧪 Testing:
```powershell
# Test if backend is working
.\test-api.ps1

# Or manually visit:
http://localhost:5000
```

## 🔄 Development Workflow:
1. **Start Backend**: `.\start-backend.ps1`
2. **Start Frontend**: `.\start-frontend.ps1`
3. **Open Browser**: http://localhost:5173
4. **Test API**: http://localhost:5000

## 🐛 Troubleshooting:
- **Port 5000 busy**: Change PORT in `server/.env`
- **MongoDB not connected**: Start MongoDB Compass
- **CORS errors**: Check CLIENT_URL in `server/.env`
- **Dependencies**: Run `npm install` in server directory

## 🌐 Production Deployment:
Your backend is ready for deployment on:
- Railway (configured)
- Heroku
- Render
- Vercel (serverless)

**Your backend is 100% functional and ready to run!** 🎉
