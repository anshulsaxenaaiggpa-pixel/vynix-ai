# Vynix AI - Complete Deployment Guide
## Production-Ready SaaS Platform with Affiliate System

**Status:** ✅ Ready for Production Launch  
**Target Launch:** Product Hunt Tomorrow  
**Stack:** Next.js 14, Supabase, Razorpay, RunPod, Cloudflare R2

---

## 🚀 Quick Start (15 Minutes to Launch)

### Prerequisites
- Node.js 18+ installed
- Git installed
- Supabase account (free tier OK)
- Razorpay account (activated for international)
- Railway account for hosting
- Domain name (optional but recommended)

---

## 📋 Step 1: Local Setup (5 minutes)

```bash
# Clone or create project
cd vynix-ai
npm install

# Copy environment template
cp .env.example .env.local

# Generate secrets
openssl rand -base64 32  # Copy to JWT_SECRET
openssl rand -base64 32  # Copy to NEXTAUTH_SECRET
```

---

## 🗄️ Step 2: Database Setup (Supabase) (3 minutes)

### 2.1 Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name: `vynix-production`
4. Database password: (save securely)
5. Region: Choose closest to target users (US East for USA)

### 2.2 Get Connection Strings
```bash
# In Supabase Dashboard → Settings → Database
# Copy "Connection string" → "URI"
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# Copy from Settings → API
NEXT_PUBLIC_SUPABASE_URL="https://[project].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."  # Keep secret!
```

### 2.3 Run Migrations
```bash
# Generate migration files
npm run db:generate

# Apply to database
npm run db:migrate

# Verify in Supabase → Table Editor
# You should see: users, subscriptions, transactions, etc.
```

---

## 💳 Step 3: Razorpay Setup (5 minutes)

### 3.1 Activate International Payments
1. Login to https://dashboard.razorpay.com
2. Settings → International Payments
3. Click "Request Activation"
4. Submit:
   - Website URL: `https://vynix.ai`
   - Business type: SaaS
   - Export code: P1001 (Computer Services)
   - Upload: GSTIN, PAN, Terms of Service page
5. Approval: 5-7 days (start with test mode meanwhile)

### 3.2 Create Subscription Plans
```bash
# In Razorpay Dashboard → Subscriptions → Plans

# Plan 1: Pro Creator
Name: Vynix Pro Monthly
Plan ID: plan_vynix_pro_monthly
Billing Amount: ₹833 (approx $9.99)
Billing Period: Monthly
Trial: 0 days

# Plan 2: Elite Studio
Name: Vynix Elite Monthly
Plan ID: plan_vynix_elite_monthly
Billing Amount: ₹1,667 (approx $19.99)
Billing Period: Monthly
Trial: 0 days
```

### 3.3 Get API Keys
```bash
# Dashboard → Settings → API Keys
RAZORPAY_KEY_ID="rzp_test_xxxxx"  # Test mode
RAZORPAY_KEY_SECRET="xxxxxx"      # NEVER expose in client!
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxx"  # Safe for frontend

# For webhooks (Settings → Webhooks → Create)
Webhook URL: https://vynix.ai/api/webhook
Events: subscription.charged, subscription.activated, subscription.cancelled
RAZORPAY_WEBHOOK_SECRET="whsec_xxxxx"
```

---

## ☁️ Step 4: Cloud Storage (Cloudflare R2) (3 minutes)

### 4.1 Create R2 Bucket
```bash
# Cloudflare Dashboard → R2
1. Create bucket: "vynix-artifacts"
2. Public access: Enabled
3. Custom domain: artifacts.vynix.ai (optional)

# Get credentials (R2 → Manage R2 API Tokens)
R2_ACCOUNT_ID="xxxxx"
R2_ACCESS_KEY_ID="xxxxx"
R2_SECRET_ACCESS_KEY="xxxxx"
R2_BUCKET_NAME="vynix-artifacts"
NEXT_PUBLIC_R2_PUBLIC_URL="https://artifacts.vynix.ai"
```

---

## 🤖 Step 5: AI Services Setup (2 minutes)

### 5.1 Gemini API (Google AI Studio)
```bash
# Get key from: https://aistudio.google.com/apikey
GEMINI_API_KEY="AIzaSyxxxxx"
```

### 5.2 RunPod GPU Endpoints
```bash
# Create serverless endpoints:
# https://www.runpod.io/console/serverless

# Endpoint 1: Wan2.1 Video
Template: Custom Docker (your Wan2.1 container)
GPU: RTX 4090
RUNPOD_ENDPOINT_WAN21="https://api.runpod.ai/v2/xxxxx"

# Endpoint 2: F5-TTS Voice
Template: Custom (your F5-TTS container)
GPU: RTX 4090
RUNPOD_ENDPOINT_F5TTS="https://api.runpod.ai/v2/xxxxx"

# Get API key
RUNPOD_API_KEY="xxxxx-xxxx-xxxx"
```

---

## 🚢 Step 6: Deploy to Railway (5 minutes)

### 6.1 Install Railway CLI
```bash
npm install -g railway
railway login
```

### 6.2 Initialize Project
```bash
cd vynix-ai
railway init

# Link to Railway project
railway link
```

### 6.3 Set Environment Variables
```bash
# Copy all variables from .env.local
railway variables set DATABASE_URL="postgresql://..."
railway variables set NEXT_PUBLIC_SUPABASE_URL="https://..."
railway variables set RAZORPAY_KEY_ID="rzp_test_..."
railway variables set RAZORPAY_KEY_SECRET="..."
railway variables set GEMINI_API_KEY="..."
railway variables set RUNPOD_API_KEY="..."
railway variables set R2_ACCOUNT_ID="..."
railway variables set JWT_SECRET="..."
railway variables set NEXTAUTH_SECRET="..."

# Production URLs
railway variables set NEXT_PUBLIC_APP_URL="https://vynix-ai-production.up.railway.app"
railway variables set NEXTAUTH_URL="https://vynix-ai-production.up.railway.app"
railway variables set NODE_ENV="production"

# Affiliate settings
railway variables set AFFILIATE_COMMISSION_RATE="0.20"
railway variables set AFFILIATE_COOKIE_DAYS="30"
```

### 6.4 Deploy
```bash
# Deploy to Railway
railway up

# Watch build logs
railway logs

# Get deployment URL
railway status
# → https://vynix-ai-production.up.railway.app
```

### 6.5 Add Custom Domain (Optional)
```bash
# Railway Dashboard → Settings → Domains
# Add: vynix.ai
# Configure DNS:
# Type: CNAME
# Name: @
# Value: vynix-ai-production.up.railway.app
```

---

## 🔐 Step 7: Security Hardening (Critical!)

### 7.1 Verify Environment Variables
```bash
# NEVER commit these to Git:
.env.local
.env

# Check .gitignore includes:
.env*
!.env.example
```

### 7.2 Enable CORS Protection
```bash
# In next.config.js:
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_APP_URL },
        { key: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
      ],
    },
  ];
}
```

### 7.3 Rate Limiting
```bash
# Install Upstash Redis (free tier):
# https://console.upstash.com

# Get credentials:
UPSTASH_REDIS_REST_URL="https://xxxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AxxxxQ=="

# Add to Railway variables
railway variables set UPSTASH_REDIS_REST_URL="..."
railway variables set UPSTASH_REDIS_REST_TOKEN="..."
```

### 7.4 Enable Security Headers
```bash
# Railway → Settings → Environment
# Add custom headers:
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

---

## 🧪 Step 8: Testing (Before Launch)

### 8.1 Local Testing
```bash
# Start development server
npm run dev

# Visit http://localhost:3000
# Test:
✓ Sign up with test email
✓ Verify affiliate code generated
✓ Test login/logout
✓ Check credit balance (100 for free tier)
✓ Test Razorpay checkout (test mode)
✓ Verify webhook receives events
```

### 8.2 Production Testing
```bash
# Visit deployed URL
https://vynix-ai-production.up.railway.app

# Test flows:
1. Sign up with real email
2. Use referral code: TESTREF123
3. Subscribe to Elite plan ($19.99)
4. Verify Razorpay payment
5. Check credits updated (2000)
6. Generate test video
7. Check affiliate earned commission
```

### 8.3 Razorpay Test Cards
```bash
# For testing in test mode:
Card Number: 4111 1111 1111 1111
Expiry: Any future date
CVV: 123
Name: Test User

# Success payment:
OTP: 1234

# Failure payment:
OTP: 0000
```

---

## 📊 Step 9: Analytics & Monitoring

### 9.1 PostHog (Optional but Recommended)
```bash
# Sign up: https://posthog.com
# Get project API key

NEXT_PUBLIC_POSTHOG_KEY="phc_xxxxx"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"

# Add to Railway variables
railway variables set NEXT_PUBLIC_POSTHOG_KEY="..."
```

### 9.2 Error Tracking
```bash
# Railway Dashboard → Deployments
# Check logs for errors:
railway logs --tail

# Set up alerts (Railway → Settings → Notifications)
```

---

## 🎨 Step 10: Branding & Final Touches

### 10.1 Update Metadata
```bash
# In app/layout.tsx:
export const metadata = {
  title: 'Vynix AI - AI Content Operating System',
  description: 'Create cinematic videos, voiceovers, and music with AI',
  openGraph: {
    title: 'Vynix AI',
    description: 'The all-in-one AI studio for creators',
    images: ['/og-image.png'],
  },
};
```

### 10.2 Add Favicon & OG Image
```bash
# Place in /public:
/public/favicon.ico
/public/og-image.png (1200x630px)
/public/logo.svg

# Generate favicon: https://realfavicongenerator.net
```

### 10.3 Legal Pages (Required for Razorpay)
```bash
# Create pages:
/app/terms/page.tsx
/app/privacy/page.tsx
/app/refund/page.tsx

# Add links in footer
```

---

## 🚀 Step 11: Go Live Checklist

### Before Product Hunt Launch:
- [ ] Switch Razorpay to LIVE mode
- [ ] Update RAZORPAY_KEY_ID to `rzp_live_xxxxx`
- [ ] Verify all webhooks working
- [ ] Test real payment with $1
- [ ] Confirm credits added after payment
- [ ] Test affiliate commission calculation
- [ ] Verify email notifications (if configured)
- [ ] Check mobile responsiveness
- [ ] Run Lighthouse audit (Target: 90+ score)
- [ ] Test on Chrome, Safari, Firefox
- [ ] Verify SSL certificate active (https://)
- [ ] Update robots.txt for SEO
- [ ] Submit sitemap to Google Search Console

---

## 💰 Step 12: Pricing & Affiliate Setup

### 12.1 Verify Pricing
```bash
# In lib/razorpay.ts:
pro: {
  price: 999,  # $9.99
  credits: 500,
}
elite: {
  price: 1999,  # $19.99
  credits: 2000,
}

# Credit costs (in lib/credits.ts):
VIDEO_GENERATION: 10 credits/min
AUDIO_GENERATION: 2 credits/track
LIPSYNC: 5 credits/video
```

### 12.2 Test Affiliate Flow
```bash
# User A signs up → Gets code: ABC123XYZ
# User B signs up with ref: ABC123XYZ
# User B subscribes to Elite ($19.99)
# User A earns: $3.998 (20% commission)
# Verify in database:
SELECT * FROM affiliate_commissions WHERE affiliate_id = 'user_a_id';
```

---

## 🎯 Step 13: Marketing Prep

### 13.1 Product Hunt Launch
```bash
# Prepare:
- Screenshot of dashboard (1200x800px)
- Demo video (30-60 seconds)
- Tagline: "Sora-killer for indie creators. Create videos, music & voiceovers with AI at $19.99/mo"
- First comment: Founder story + special offer

# Launch offer:
- First 50 users: Lifetime 50% off
- Promo code: PRODUCTHUNT50
```

### 13.2 Social Proof
```bash
# Add testimonials section
# Prepare case study:
"How I saved $150/month by replacing Runway + ElevenLabs with Vynix"
```

---

## 🔄 Step 14: Post-Launch Monitoring

### Day 1-7:
```bash
# Monitor every 2 hours:
- Railway logs for errors
- Razorpay dashboard for payments
- Supabase for DB performance
- User signups vs. conversions

# Key metrics:
- Signup rate (target: >30 on PH day)
- Free → Paid conversion (target: 25%)
- Payment success rate (target: >90%)
- Affiliate signups (track PRODUCTHUNT50 code)
```

---

## 🐛 Troubleshooting

### Issue: Payments Failing
```bash
# Check:
1. Razorpay live mode activated
2. International cards enabled
3. Webhook URL accessible (test: curl -X POST https://vynix.ai/api/webhook)
4. RAZORPAY_WEBHOOK_SECRET matches dashboard

# Debug:
railway logs --filter "webhook"
```

### Issue: Credits Not Added
```bash
# Verify webhook event received:
SELECT * FROM transactions WHERE type = 'subscription' ORDER BY created_at DESC LIMIT 10;

# Check credit_history:
SELECT * FROM credit_history WHERE user_id = 'xxx' ORDER BY created_at DESC;

# Manual fix:
UPDATE users SET credits = credits + 2000 WHERE id = 'xxx';
```

### Issue: Database Timeout
```bash
# In Supabase → Database → Settings
# Increase connection pool:
max_connections: 100
pool_size: 10

# Optimize queries (add indexes):
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_subscription_status ON subscriptions(status);
```

---

## 📈 Scaling Plan (After 1000 Users)

### Performance Optimizations:
```bash
# 1. Add Redis caching (Upstash)
# 2. Enable Cloudflare CDN
# 3. Upgrade Supabase to Pro ($25/mo)
# 4. Move to dedicated GPU pods (RunPod)
# 5. Implement queue system (BullMQ + Redis)
```

### Cost Optimization:
```bash
# At 1000 Elite users:
Revenue: $19,990/month
COGS: $6,000 (GPUs + Gemini + Storage)
Razorpay fees: $707 (3.54%)
Railway: $50/mo
Gross Profit: $13,233 (66% margin)
```

---

## 🎓 Architecture Overview

```
Frontend (Next.js 14)
    ↓
Railway Hosting → CDN (Cloudflare)
    ↓
API Routes (/api/*)
    ↓
├─ Auth → JWT + bcrypt
├─ Payments → Razorpay
├─ Database → Supabase (Postgres)
├─ Storage → Cloudflare R2
└─ AI Generation
    ↓
    ├─ Orchestration → Gemini API
    └─ Workers → RunPod Serverless
         ├─ Wan2.1 (Video)
         ├─ F5-TTS (Voice)
         └─ Stable Audio (Music)
```

---

## 🔑 Key Files Reference

```bash
vynix-ai/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts    # User registration + affiliate
│   │   │   ├── login/route.ts     # JWT authentication
│   │   │   └── logout/route.ts    # Session cleanup
│   │   ├── subscribe/route.ts     # Razorpay subscription
│   │   ├── webhook/route.ts       # Payment webhooks
│   │   ├── credits/route.ts       # Credit management
│   │   └── generate/route.ts      # AI generation queue
│   ├── dashboard/page.tsx         # User dashboard
│   ├── pricing/page.tsx           # Subscription plans
│   └── page.tsx                   # Landing page
├── components/
│   ├── auth/
│   │   ├── SignupForm.tsx
│   │   └── LoginForm.tsx
│   ├── dashboard/
│   │   ├── CreditBalance.tsx
│   │   ├── AffiliateStats.tsx
│   │   └── GenerationHistory.tsx
│   └── ui/                        # Shared components
├── db/
│   ├── schema.ts                  # Database schema
│   └── index.ts                   # DB connection
├── lib/
│   ├── auth.ts                    # Auth utilities
│   ├── razorpay.ts               # Payment logic
│   └── runpod.ts                 # GPU worker calls
└── .env.local                     # Environment variables
```

---

## 🆘 Support Resources

### Development Help
- Next.js Docs: https://nextjs.org/docs
- Drizzle ORM: https://orm.drizzle.team
- Razorpay Docs: https://razorpay.com/docs

### Deployment Issues
- Railway Docs: https://docs.railway.app
- Supabase Docs: https://supabase.com/docs

### Community
- Discord: (Create vynix.ai/discord)
- Email: [email protected]

---

## 🎉 You're Ready to Launch!

**Final Command:**
```bash
# Deploy to production
railway up --environment production

# Monitor launch
railway logs --tail

# Celebrate 🚀
echo "Vynix AI is LIVE at https://vynix.ai"
```

**Product Hunt Launch Checklist:**
- [ ] Live site accessible
- [ ] Payments working (test with real card)
- [ ] Affiliate tracking verified
- [ ] Analytics connected
- [ ] Product Hunt submission ready
- [ ] Tweet drafted (@vynixai)
- [ ] Email list ready for launch announcement

---

**Congratulations! You've built a production-ready AI SaaS platform.**

**Expected First Month:**
- Users: 100-500 (Product Hunt boost)
- Conversions: 25-30% → 25-150 paying users
- MRR: $500-$3,000
- Profit: $350-$2,100 (70% margin)

**Next Steps:**
1. Launch on Product Hunt
2. Monitor metrics daily
3. Iterate based on user feedback
4. Scale GPU capacity as needed
5. Plan Month 2 features

🦄 **Unicorn Status:** You're on the path. Keep shipping!
