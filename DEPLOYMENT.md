# 🚀 Deployment Guide - Free Platforms

This guide will help you deploy the Marketplace Savings app to free hosting platforms so you can see it live!

## Option 1: Quick Deploy (Recommended - 5 minutes)

### Backend on Render.com

1. **Go to [Render.com](https://render.com)** and sign up (free)

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository**: `rabinabdian/SoftwareSaving`

4. **Configure the service**:
   - **Name**: `marketplace-savings-api`
   - **Region**: Oregon (US West)
   - **Branch**: `claude/marketplace-savings-app-011CV3gMUbhtYJuDetRsw8pt`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Add Environment Variable**:
   - Key: `PORT`
   - Value: `3001`

6. **Click "Create Web Service"**

7. **Wait 2-3 minutes** for deployment. Copy the URL (e.g., `https://marketplace-savings-api.onrender.com`)

### Frontend on Vercel

1. **Go to [Vercel.com](https://vercel.com)** and sign up (free)

2. **Click "Add New..." → "Project"**

3. **Import your GitHub repository**: `rabinabdian/SoftwareSaving`

4. **Configure the project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com/api` (use your Render URL from step 7 above)

6. **Click "Deploy"**

7. **Wait 1-2 minutes**. Your app will be live at `https://your-project.vercel.app`

---

## Option 2: Alternative Platforms

### Backend on Railway.app

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select your repo and branch
5. Add environment variables if needed
6. Deploy!

### Frontend on Netlify

1. Go to [Netlify.com](https://netlify.com)
2. "Add new site" → "Import from Git"
3. Select your repo
4. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
5. Add environment variable: `VITE_API_URL`
6. Deploy!

---

## Option 3: Deploy via CLI (Advanced)

### Install Vercel CLI
```bash
npm i -g vercel
```

### Deploy Frontend
```bash
cd frontend
vercel --prod
```

### Deploy Backend to Render
```bash
# Render requires web interface deployment for free tier
```

---

## After Deployment

1. ✅ Backend should be running at your Render URL
2. ✅ Frontend should be running at your Vercel/Netlify URL
3. ✅ Test the app - search for products, view coupons, etc!

### Troubleshooting

**CORS Error**: Make sure your backend includes the frontend URL in CORS settings
**API Not Found**: Double-check the `VITE_API_URL` environment variable in frontend settings
**Build Failed**: Check the build logs in the platform dashboard

---

## 🎉 Your App is Live!

Share the URL with anyone to let them start saving money on groceries in Israel!

### What's Deployed:
- ✅ Price comparison across 6 Israeli stores
- ✅ Coupon aggregator
- ✅ Price alerts system
- ✅ Budget tracker
- ✅ Hebrew & English support
- ✅ Mobile responsive

Enjoy your live marketplace savings app! 🛒💰
