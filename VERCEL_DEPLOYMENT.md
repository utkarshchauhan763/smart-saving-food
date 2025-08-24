# 🚀 Vercel Deployment Guide - Smart Saving Food

## Step-by-Step Vercel Deployment Instructions

### Prerequisites ✅
- [x] GitHub account
- [x] Vercel account (free)
- [x] MongoDB Atlas account (free)
- [x] Your code ready

---

## 🗂️ STEP 1: Push Code to GitHub

### 1.1 Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click **"New repository"**
3. Name: `smart-saving-food`
4. Make it **Public**
5. **DON'T** initialize with README (we already have one)
6. Click **"Create repository"**

### 1.2 Push Your Code
```bash
# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/smart-saving-food.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🍃 STEP 2: Setup MongoDB Atlas (Database)

### 2.1 Create MongoDB Atlas Account
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Click **"Try Free"**
3. Sign up with email/Google
4. Choose **"I'm learning MongoDB"**

### 2.2 Create Database Cluster
1. Click **"Create"** for free M0 cluster
2. Choose **Cloud Provider**: AWS
3. Choose **Region**: Closest to you
4. Cluster Name: `smart-saving-food`
5. Click **"Create Cluster"** (takes 3-5 minutes)

### 2.3 Setup Database Access
1. Go to **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `admin`
5. Password: Click **"Autogenerate Secure Password"** (SAVE THIS!)
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### 2.4 Setup Network Access
1. Go to **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 2.5 Get Connection String
1. Go to **"Clusters"** in left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **4.1 or later**
5. Copy the connection string
6. Replace `<password>` with your actual password
7. **SAVE THIS CONNECTION STRING!**

Example:
```
mongodb+srv://admin:YOUR_PASSWORD@smart-saving-food.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## 🚀 STEP 3: Deploy to Vercel

### 3.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

### 3.2 Import Your Project
1. Click **"New Project"**
2. Find your `smart-saving-food` repository
3. Click **"Import"**

### 3.3 Configure Project Settings
1. **Framework Preset**: `Vite` (should auto-detect)
2. **Root Directory**: `./` (leave as default)
3. **Build Command**: `npm run build` (should auto-detect)
4. **Output Directory**: `dist` (should auto-detect)
5. **Install Command**: `npm install` (should auto-detect)

### 3.4 Add Environment Variables
Click **"Environment Variables"** and add these:

**Required Environment Variables:**
```
Name: MONGODB_URI
Value: mongodb+srv://admin:YOUR_PASSWORD@smart-saving-food.xxxxx.mongodb.net/smart-saving-food?retryWrites=true&w=majority

Name: JWT_SECRET  
Value: your-super-secret-jwt-key-minimum-32-characters-long

Name: NODE_ENV
Value: production

Name: VITE_API_BASE_URL
Value: https://YOUR_APP_NAME.vercel.app/api
```

⚠️ **Important**: Replace `YOUR_APP_NAME` with your actual Vercel app name (you'll see this after deployment)

### 3.5 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. 🎉 Your app is live!

---

## 🔧 STEP 4: Post-Deployment Configuration

### 4.1 Get Your App URL
After deployment, you'll see:
- **Your app URL**: `https://smart-saving-food-abc123.vercel.app`

### 4.2 Update API URL Environment Variable
1. Go to Vercel dashboard
2. Click on your project
3. Go to **"Settings"** → **"Environment Variables"**
4. Edit `VITE_API_BASE_URL`:
   ```
   https://your-actual-app-url.vercel.app/api
   ```
5. Click **"Save"**
6. Go to **"Deployments"** tab
7. Click **"Redeploy"** → **"Use existing Build Cache"**

---

## 🧪 STEP 5: Test Your Deployment

### 5.1 Test Frontend
1. Visit your Vercel URL
2. You should see the login page
3. Try registering a new admin account

### 5.2 Test Backend API
Visit: `https://your-app-url.vercel.app/api/auth/test`
Should return: `{"message": "API is working!"}`

### 5.3 Test Database Connection
1. Register a new admin user
2. Login successfully
3. Go to Admin Dashboard
4. Check if data loads correctly

---

## 🎯 STEP 6: Set Custom Domain (Optional)

### 6.1 Add Custom Domain
1. Go to Vercel dashboard
2. Click your project
3. Go to **"Settings"** → **"Domains"**
4. Add your custom domain
5. Follow DNS configuration instructions

---

## ⚡ Automatic Deployments

✅ **Auto-deployment is now setup!**
- Every push to `main` branch will auto-deploy
- Pull requests get preview deployments
- Build logs available in Vercel dashboard

---

## 🔍 Troubleshooting

### Common Issues:

**1. Build Fails**
- Check build logs in Vercel dashboard
- Ensure all dependencies in package.json
- Check for syntax errors

**2. API Doesn't Work**
- Verify MONGODB_URI is correct
- Check JWT_SECRET is set
- Ensure VITE_API_BASE_URL matches your domain

**3. CORS Errors**
- Check server/server.js CORS configuration
- Ensure frontend URL is whitelisted

**4. Database Connection Issues**
- Verify MongoDB Atlas IP whitelist (0.0.0.0/0)
- Check username/password in connection string
- Ensure database user has proper permissions

### Debug Commands:
```bash
# Test local build
npm run build
npm run preview

# Check environment variables (in browser console)
console.log(import.meta.env.VITE_API_BASE_URL)
```

---

## 📱 Your Live App Features

After successful deployment, your app will have:

✅ **User Authentication** (Students & Admins)
✅ **Menu Management** (Admin can create/edit menus)
✅ **Meal Preferences** (Students can select food quantities)
✅ **Dashboard Analytics** (Admin can view statistics)
✅ **User Management** (Admin can manage users)
✅ **Real-time Notifications**
✅ **Mobile Responsive Design**

---

## 🎉 Congratulations!

Your Smart Saving Food app is now live on Vercel! 

**Share your app**: `https://your-app-name.vercel.app`

**Next Steps**:
1. Create admin account on live site
2. Add some menu items
3. Test with real users
4. Monitor usage in Vercel analytics

---

## 📞 Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Atlas Docs**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Check build logs** in Vercel dashboard
- **Monitor API requests** in Vercel Functions tab
