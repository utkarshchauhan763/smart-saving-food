#!/bin/bash

# Quick Deployment Script for Smart Saving Food

echo "🚀 Smart Saving Food - Quick Deployment Guide"
echo "=============================================="

echo ""
echo "📋 Pre-deployment Checklist:"
echo "1. MongoDB Atlas cluster created? (Y/N)"
echo "2. GitHub repository created? (Y/N)" 
echo "3. Deployment platform chosen? (Vercel/Railway/Render)"
echo ""

echo "🔧 Next Steps:"
echo ""
echo "1. Push to GitHub:"
echo "   git remote add origin https://github.com/yourusername/smart-saving-food.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""

echo "2. Deploy Frontend (Vercel):"
echo "   - Go to vercel.com"
echo "   - Import GitHub repository"
echo "   - Set VITE_API_BASE_URL environment variable"
echo "   - Deploy!"
echo ""

echo "3. Deploy Backend (Railway/Render):"
echo "   - Go to railway.app or render.com"
echo "   - Import GitHub repository"
echo "   - Set root directory to 'server'"
echo "   - Add environment variables:"
echo "     * MONGODB_URI"
echo "     * JWT_SECRET"
echo "     * NODE_ENV=production"
echo "     * FRONTEND_URL"
echo ""

echo "4. Test your deployed app:"
echo "   - Register a new admin account"
echo "   - Create some menu items"
echo "   - Test student registration and preferences"
echo ""

echo "🎉 Your Smart Saving Food app is ready for the world!"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
