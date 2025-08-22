# Smart Saving Food - Deployment Guide

## 🚀 Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend) + MongoDB Atlas (Recommended)

#### Step 1: Setup MongoDB Atlas (Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Get your connection string (replace `<password>` with your actual password)
5. Example: `mongodb+srv://username:password@cluster.mongodb.net/smart-saving-food?retryWrites=true&w=majority`

#### Step 2: Deploy Backend to Railway/Render

**For Railway:**
1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Select the `server` folder as root
4. Add environment variables:
   ```
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

**For Render:**
1. Go to [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set root directory to `server`
5. Build command: `npm install`
6. Start command: `npm start`
7. Add environment variables (same as above)

#### Step 3: Deploy Frontend to Vercel
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Framework preset: `Vite`
4. Root directory: `./` (project root)
5. Add environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend-domain.railway.app/api
   ```
6. Deploy!

---

### Option 2: Full Stack on Render

#### Step 1: Create Render Blueprint
1. Create `render.yaml` in project root
2. Deploy both frontend and backend together
3. Use build script to handle both

#### Step 2: Environment Setup
- Same MongoDB Atlas setup
- All environment variables in Render dashboard

---

### Option 3: Heroku (If you have access)

#### Step 1: Heroku Setup
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add MongoDB addon
heroku addons:create mongolab:sandbox
```

---

## 🔧 Pre-Deployment Checklist

### ✅ Backend Preparation
- [x] Environment variables configured
- [x] CORS setup for production
- [x] MongoDB connection string ready
- [x] JWT secret generated
- [x] All dependencies in package.json

### ✅ Frontend Preparation  
- [x] Production build successful
- [x] API URLs configured with environment variables
- [x] Error handling for API failures
- [x] Authentication flow working

### ✅ Database Preparation
- [ ] MongoDB Atlas cluster created
- [ ] Database user with proper permissions
- [ ] Connection string obtained
- [ ] IP whitelist configured (0.0.0.0/0 for production)

---

## 🌐 Domain Configuration

### Frontend Domain (Vercel)
- Your app will be available at: `https://your-app-name.vercel.app`
- Custom domain can be added in Vercel dashboard

### Backend Domain (Railway/Render)
- Backend API at: `https://your-backend-app.railway.app/api`
- Update VITE_API_BASE_URL with this URL

---

## 🔒 Security Considerations

### Environment Variables
Never commit these to Git:
- `MONGODB_URI`
- `JWT_SECRET` 
- `API_KEYS`

### Production Security
- Use HTTPS only
- Secure JWT secrets (32+ characters)
- Enable CORS only for your domain
- Rate limiting (consider adding)
- Input validation (already implemented)

---

## 🧪 Testing Deployment

### Local Testing
```bash
# Test production build locally
npm run build
npm run preview
```

### Production Testing
1. Test user registration/login
2. Test menu loading
3. Test admin dashboard
4. Test all CRUD operations
5. Test mobile responsiveness

---

## 🚨 Troubleshooting

### Common Issues:
1. **CORS Errors**: Check backend CORS configuration
2. **API Not Found**: Verify VITE_API_BASE_URL
3. **Database Connection**: Check MongoDB Atlas IP whitelist
4. **Build Failures**: Check for syntax errors and dependencies

### Debug Commands:
```bash
# Check build output
npm run build

# Preview production build
npm run preview

# Check environment variables
console.log(import.meta.env.VITE_API_BASE_URL)
```

---

## 📱 Post-Deployment Steps

1. **Test all functionality** on live site
2. **Monitor logs** for any errors
3. **Set up monitoring** (optional)
4. **Create admin account** on production
5. **Test with real users**

---

## 🔄 Continuous Deployment

### Auto-deployment setup:
- **Vercel**: Automatically deploys on Git push to main branch
- **Railway**: Automatically deploys on Git push
- **Render**: Automatically deploys on Git push

### Manual deployment:
- Push changes to GitHub
- Platforms will automatically rebuild and deploy

---

## 📞 Support

If you encounter issues:
1. Check platform-specific documentation
2. Review error logs in platform dashboards
3. Test locally first
4. Check environment variable configuration

Your Smart Saving Food app is ready for deployment! 🎉
