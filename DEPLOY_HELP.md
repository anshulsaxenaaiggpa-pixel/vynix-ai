# Manual Deployment Guide for Vynix AI

Since the CLI deployment is experiencing network timeouts, the most reliable way to deploy is via GitHub integration on the Railway Dashboard.

## Step 1: Push Code to GitHub
1. Initialize a git repository in your project folder (`vynix-ai`).
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Create a new repository on GitHub (e.g., `vynix-ai`).
3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/vynix-ai.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy Backend on Railway
1. Go to [Railway Dashboard](https://railway.com/dashboard).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your `vynix-ai` repository.
4. Click **Add Variable** later. Just deploy for now.
5. Once project is created, click on the service card.
6. Go to **Settings** -> **Root Directory** and set it to `/backend`.
7. Go to **Variables** and add these variables (copy from `.env.local` or below):

**Backend Variables:**
```env
DATABASE_URL=postgresql://postgres:[password]@[db-host]:5432/postgres
GEMINI_API_KEY=AIzaSy[your-gemini-key]
HF_API_TOKEN=hf_[your-huggingface-token]
RUNPOD_API_KEY=[your-runpod-key]
RUNPOD_ENDPOINT_WAN21=https://api.runpod.ai/v2/[endpoint-id]
RUNPOD_ENDPOINT_F5TTS=https://api.runpod.ai/v2/[endpoint-id]
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.[your-sendgrid-key]
FROM_EMAIL=[email protected]
NODE_ENV=production
VYNIX_SERVICE_SECRET=vynix_internal_bypass_2026
```

8. Go to **Settings** -> **Networking** -> **Public Domain** and click **Generate Domain**.
   - Copy this URL (e.g., `https://backend-production.up.railway.app`).

## Step 3: Deploy Frontend on Railway
1. In the same Railway project, click **New** -> **GitHub Repo**.
2. Select the same `vynix-ai` repository again.
3. Click on the new service card.
4. Go to **Settings** -> **Root Directory** and set it to `/` (default) or check if it needs specific setting (Next.js is in root, so `/` is fine).
   - Wait, `vynix-ai` folder has `app`, `components` etc in root? Yes. So `/` is correct.
5. Go to **Variables** and add:

**Frontend Variables:**
```env
NEXT_PUBLIC_APP_URL=https://YOUR_FRONTEND_URL.up.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
JWT_SECRET=[your-jwt-secret]
NEXTAUTH_SECRET=[your-nextauth-secret]
NEXTAUTH_URL=https://YOUR_FRONTEND_URL.up.railway.app
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_[id]
RAZORPAY_KEY_ID=rzp_live_[id]
RAZORPAY_KEY_SECRET=[your-razorpay-secret]
RAZORPAY_WEBHOOK_SECRET=[your-webhook-secret]
VYNIX_BACKEND_URL=https://backend-production.up.railway.app  <-- REPLACE WITH ACTUAL BACKEND URL from Step 2
VYNIX_SERVICE_SECRET=vynix_internal_bypass_2026
NODE_ENV=production
```

6. Go to **Settings** -> **Networking** -> **Generate Domain**.
   - Copy this URL and update `NEXT_PUBLIC_APP_URL` and `NEXTAUTH_URL` with it.

## Step 4: Verify
- Visit the Frontend URL.
- Try to sign up/login.
- Try to generate content (it should call the backend).
