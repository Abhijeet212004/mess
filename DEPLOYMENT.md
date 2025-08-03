# Free Deployment Guide

## Step 1: Database (Neon PostgreSQL - Free)
1. Go to https://neon.tech
2. Sign up and create a new project
3. Copy the connection string
4. Update your .env with the new DATABASE_URL

## Step 2: Backend (Railway - Free)
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your backend folder
5. Add environment variables:
   - DATABASE_URL (from Neon)
   - JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   - FRONTEND_URL=https://your-frontend-url.vercel.app
6. Railway will auto-deploy

## Step 3: Frontend (Vercel - Free)
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Select your frontend folder
5. Add environment variable:
   - REACT_APP_API_URL=https://your-backend-url.railway.app
6. Deploy

## Step 4: Update CORS
After deployment, update backend CORS with your actual frontend URL.

## Alternative: Render (Free)
Instead of Railway, you can use Render.com:
1. Go to https://render.com
2. Create Web Service from GitHub
3. Add same environment variables
4. Deploy

Your app will be live 24/7 with these free tiers!