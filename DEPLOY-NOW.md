# 🚀 Deploy to Free Platforms - 5 Minute Guide

## ✅ What You'll Get

A **live, public URL** where anyone can access your marketplace savings app!

Example: `https://marketplace-savings.vercel.app`

---

## 📋 Step-by-Step Instructions

### STEP 1: Deploy Backend to Render (2 minutes)

1. Open **[render.com](https://render.com)** in your browser
2. Click **"Get Started"** and sign up (free, use GitHub)
3. Click **"New +"** → **"Web Service"**
4. Click **"Connect GitHub"** → Select your repository: **`rabinabdian/SoftwareSaving`**
5. Fill in these settings:
   ```
   Name: marketplace-savings-api
   Region: Oregon (US West)
   Branch: claude/marketplace-savings-app-011CV3gMUbhtYJuDetRsw8pt
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

6. Click **"Create Web Service"**
7. ⏰ Wait 2-3 minutes for it to deploy
8. 📋 **COPY YOUR URL** (looks like: `https://marketplace-savings-api.onrender.com`)

**✅ Backend is LIVE!** You can test it by visiting: `https://your-url.onrender.com/health`

---

### STEP 2: Deploy Frontend to Vercel (2 minutes)

1. Open **[vercel.com](https://vercel.com)** in your browser
2. Click **"Start Deploying"** and sign up (free, use GitHub)
3. Click **"Add New..."** → **"Project"**
4. Click **"Import"** next to your repository: **`rabinabdian/SoftwareSaving`**
5. Configure these settings:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build  (auto-detected)
   Output Directory: dist  (auto-detected)
   ```

6. Click **"Environment Variables"** and add:
   ```
   Name: VITE_API_URL
   Value: https://your-backend-url.onrender.com/api
   ```
   ⚠️ Replace `your-backend-url` with YOUR Render URL from Step 1!

7. Click **"Deploy"**
8. ⏰ Wait 1-2 minutes for it to deploy
9. 🎉 Click **"Visit"** to see your live app!

**✅ DONE!** Your app is now live at a URL like: `https://marketplace-savings-abc123.vercel.app`

---

## 🎯 Testing Your Deployed App

Once both are deployed, visit your Vercel URL and try:

1. ✅ **Search for products** - Try searching "milk" or "bread"
2. ✅ **Compare prices** - Click on a product to see prices across stores
3. ✅ **View coupons** - Check the Coupons tab
4. ✅ **Switch language** - Toggle between English and Hebrew (עב / EN button)
5. ✅ **Set price alert** - Create an alert for a product
6. ✅ **Track budget** - Add a monthly budget and record purchases

---

## 🔧 Troubleshooting

### "API Error" or "Cannot connect"
- Check that `VITE_API_URL` environment variable is set correctly in Vercel
- Make sure it ends with `/api` (e.g., `https://my-api.onrender.com/api`)
- Redeploy the frontend after fixing

### Backend won't start on Render
- Check the logs in Render dashboard
- Make sure "Start Command" is `npm start`
- Make sure "Root Directory" is `backend`

### Frontend won't build on Vercel
- Check the build logs in Vercel dashboard
- Make sure "Root Directory" is `frontend`
- Make sure Framework is set to "Vite"

---

## 🌟 Share Your App!

Once deployed, you can:
- Share the URL with friends and family
- Use it on your phone
- Add it to your resume/portfolio
- Customize it further

The free tiers provide:
- ✅ Custom domain support (both platforms)
- ✅ Automatic HTTPS/SSL
- ✅ Global CDN
- ✅ Automatic deployments from GitHub

---

## 💡 Next Steps

Want to customize your deployment?

- **Custom Domain**: Both Vercel and Render support custom domains (e.g., `savings.yourdomain.com`)
- **Auto-Deploy**: Push to GitHub and it auto-deploys!
- **Analytics**: Add Vercel Analytics to track usage
- **Database**: Upgrade to PostgreSQL on Render for production use

---

## ⚡ Alternative: Deploy with One Command

If you prefer CLI deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod

# Backend needs to be deployed via Render web interface
```

---

## 🎊 Congratulations!

You now have a **live, production-ready** marketplace savings app running on free cloud platforms!

**Time invested**: ~5 minutes
**Cost**: $0.00
**Result**: Professional web app accessible worldwide 🌍

Enjoy your deployed app! 🚀
