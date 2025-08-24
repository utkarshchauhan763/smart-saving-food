# 🚀 RAILWAY BACKEND DEPLOYMENT - STEP BY STEP

## 📋 Quick Setup (5 minutes):

### Step 1: Create Railway Account
1. Go to: **https://railway.app**
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway to access your GitHub

### Step 2: Deploy Backend
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: **`utkarshchauhan763/smart-saving-food`**
4. **IMPORTANT**: Set **Root Directory** to `server`
5. Click **"Deploy"**

### Step 3: Add Database
1. In your project dashboard, click **"New"** → **"Database"** → **"MongoDB"**
2. Wait for MongoDB to deploy (2-3 minutes)
3. Copy the connection string from the MongoDB service

### Step 4: Set Environment Variables
In Railway dashboard → Your backend service → **"Variables"** tab:

```bash
NODE_ENV=production
JWT_SECRET=production_super_secret_jwt_key_minimum_32_characters_long_smart_food_2024
FRONTEND_URL=https://utkarshchauhan763.github.io
CLIENT_URL=https://utkarshchauhan763.github.io
MONGODB_URI=mongodb://mongo:password@monorail.proxy.rlwy.net:port/railway
```

### Step 5: Get Your Backend URL
After deployment, Railway will give you a URL like:
```
https://your-backend-name.up.railway.app
```

## 🔄 Next: Update Frontend

Once backend is deployed, I'll update your GitHub Pages to use the live backend!

## 💰 Railway Pricing:
- **FREE**: $5 credit monthly (enough for small apps)
- **Pro**: $20/month for production apps
- **Perfect for portfolio projects**

**Start the deployment and tell me your Railway backend URL!** 🚀
