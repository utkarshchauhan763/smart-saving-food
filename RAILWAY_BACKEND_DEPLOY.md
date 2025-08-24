# Railway Backend Deployment Guide

## 🚀 Deploy Backend to Railway (Free)

### Step 1: Prepare Backend for Railway

I've configured your backend for Railway deployment:
- Port configuration: ✅ Uses `process.env.PORT`
- MongoDB: ✅ Ready for Railway's MongoDB addon
- CORS: ✅ Configured for production domains

### Step 2: Create Railway Account & Deploy

1. **Go to**: https://railway.app
2. **Sign up** with GitHub (recommended)
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose**: `utkarshchauhan763/smart-saving-food`
6. **Root Directory**: Set to `server/` (important!)

### Step 3: Configure Environment Variables

In Railway dashboard, add these environment variables:

```bash
NODE_ENV=production
JWT_SECRET=production_super_secret_jwt_key_minimum_32_characters_long_smart_food_2024
FRONTEND_URL=https://utkarshchauhan763.github.io
```

### Step 4: Add MongoDB Database

1. **In Railway dashboard**: Click "New" → "Database" → "MongoDB"
2. **Copy the connection string** from MongoDB service
3. **Add to environment variables**:
   ```bash
   MONGODB_URI=your_railway_mongodb_connection_string
   ```

### Step 5: Update GitHub Pages

Once deployed, you'll get a Railway URL like:
```
https://your-app-name.up.railway.app
```

I'll update your GitHub Pages to use this backend URL.

## 🎯 Expected Result:
- **Backend**: https://your-app.up.railway.app
- **Frontend**: https://utkarshchauhan763.github.io/smart-saving-food/
- **Database**: Railway MongoDB (cloud)
- **Full MERN stack** deployed and connected!

## 📋 Railway Advantages:
- ✅ **FREE** tier (500 hours/month)
- ✅ **Auto-deploys** from GitHub
- ✅ **Built-in databases**
- ✅ **Custom domains**
- ✅ **Environment variables**
- ✅ **Logs & monitoring**

**Start the deployment and I'll help you with the next steps!**
