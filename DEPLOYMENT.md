# 🚀 Deployment Guide - Vercel + Render + Supabase

## Architecture
- **Frontend**: Vercel (Static hosting, CDN, auto-deployments)
- **Backend**: Render (Node.js hosting, automatic deploys)
- **Database**: Supabase (PostgreSQL, free tier available)
- **Payments**: Razorpay (Test mode for development)

---

## Step 1: Supabase Database Setup

### 1.1 Create Supabase Project
1. Go to https://supabase.com
2. Sign up/login with GitHub
3. Click "New Project"
4. Name: `kiosk-suvidha-db`
5. Region: Choose closest to your users (e.g., Mumbai for India)
6. Plan: Free Tier
7. Click "Create new project"

### 1.2 Get Database Connection String
1. In your project, go to **Settings** → **Database**
2. Find **Connection string** section
3. Copy the **URI** connection string
4. It looks like: `postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres`
5. Save this for later!

### 1.3 Run Database Migrations
Once backend is deployed, SSH into your Render service or use Supabase SQL Editor:

```bash
# In your backend directory
npx prisma migrate deploy
# Or use Supabase SQL Editor to run migration SQL files
```

---

## Step 2: Backend Deployment (Render)

### 2.1 Prepare Repository
Ensure your code is pushed to GitHub with:
- `render.yaml` at root
- `backend/prisma/schema.prisma` configured
- Environment variables documented

### 2.2 Create Render Web Service
1. Go to https://render.com
2. Sign up/login
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Configure:
   - **Name**: `kiosk-suvidha-backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 2.3 Set Environment Variables
In Render Dashboard → Your Service → Environment:

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-REF].supabase.co:5432/postgres
JWT_SECRET=your-super-secret-key-min-32-characters-long
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_test_secret
CORS_ORIGIN=https://kiosk-suvidha.vercel.app
```

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Render will auto-deploy on every git push
3. Note the URL: `https://kiosk-suvidha-backend.onrender.com`

---

## Step 3: Frontend Deployment (Vercel)

### 3.1 Install Vercel CLI
```bash
npm i -g vercel
```

### 3.2 Configure Environment
Create `/frontend/.env.production`:
```env
VITE_API_BASE_URL=https://kiosk-suvidha.onrender.com
```

### 3.3 Deploy
```bash
cd /Users/meharkapoor7/kiosk-suvidha/frontend
vercel --prod
```

Or use Vercel Dashboard:
1. Go to https://vercel.com
2. Import your GitHub repo
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_BASE_URL` = `https://kiosk-suvidha-backend.onrender.com`
5. Deploy!

---

## Step 4: Verify Everything Works

### 4.1 Check Backend Health
```bash
curl https://kiosk-suvidha-backend.onrender.com/health
# Should return: {"status":"ok"}
```

### 4.2 Test Frontend
1. Visit your Vercel URL: `https://kiosk-suvidha.vercel.app`
2. Login with demo credentials: `9876543210` / `123456`
3. Test account linking
4. Test payment flow (will use Razorpay test mode)

### 4.3 Check Database
In Supabase Dashboard → Table Editor, verify:
- Tables created via Prisma migrations
- Sample data from seed file

---

## Step 5: Production Razorpay (When Ready)

### 5.1 Switch to Live Mode
1. Go to https://dashboard.razorpay.com
2. Switch from "Test Mode" to "Live Mode"
3. Generate new API keys
4. Update Render environment variables with Live keys
5. Redeploy backend

### 5.2 Add Webhook (Optional)
For production, add Razorpay webhook:
- URL: `https://kiosk-suvidha-backend.onrender.com/webhooks/razorpay`
- Events: `payment.captured`, `payment.failed`

---

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Test connection locally
psql "postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"
```

### CORS Errors
Ensure `CORS_ORIGIN` in backend matches your Vercel URL exactly.

### Payment Failures
- Verify Razorpay keys are correct (no extra spaces)
- Check backend logs in Render Dashboard
- Ensure amount is in correct format (rupees, not paise)

### Build Failures
```bash
# Local build test
cd frontend && npm run build
cd backend && npm run build
```

---

## 📊 Monitoring

### Render Dashboard
- Logs: Real-time backend logs
- Metrics: CPU, Memory usage
- Cron Jobs: For scheduled tasks

### Supabase Dashboard
- Database usage stats
- Query performance
- Real-time connections

### Vercel Dashboard
- Deployment history
- Performance analytics
- Error tracking

---

## 💰 Cost Estimation (Monthly)

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Hobby | FREE |
| Render | Free | FREE |
| Supabase | Free Tier | FREE |
| Razorpay | Transaction fees only | ~2% per transaction |
| **Total** | | **FREE** (for development/low traffic) |

---

## 📝 Next Steps

1. **Custom Domain**: Add your own domain in Vercel/Render settings
2. **SSL**: Auto-enabled by all services
3. **CDN**: Vercel provides global CDN
4. **Backups**: Supabase auto-backups daily
5. **Monitoring**: Add Sentry for error tracking

---

## 🆘 Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Razorpay Docs**: https://razorpay.com/docs
- **Prisma Docs**: https://prisma.io/docs

---

**Ready to deploy? Start with Supabase Step 1!**
