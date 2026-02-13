# 🚀 Vynix AI - Production-Ready SaaS Platform

**AI Content Operating System for Creators**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Railway](https://img.shields.io/badge/Deploy-Railway-purple)](https://railway.app/)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Affiliate System](#affiliate-system)
- [Security](#security)
- [Contributing](#contributing)

---

## 🎯 Overview

Vynix AI is a complete, production-ready SaaS platform that enables creators to generate:
- **Cinematic Videos** (Wan2.1 text-to-video)
- **Studio Voiceovers** (F5-TTS multi-language)
- **Original Music** (Stable Audio)
- **Lip-Sync Videos** (SadTalker)

### Why Vynix?
- ✅ **60% cheaper** than Runway + Suno + ElevenLabs combined
- ✅ **All-in-one** platform (no tool switching)
- ✅ **Built-in affiliate program** (20% recurring commission)
- ✅ **Credit-based pricing** (transparent, flexible)
- ✅ **Enterprise-ready** security (JWT, bcrypt, SQL injection protection)

---

## ✨ Features

### 🔐 Authentication & User Management
- **Secure signup/login** with JWT tokens
- **Password hashing** with bcrypt (12 salt rounds)
- **Email verification** support
- **OAuth ready** (Google, GitHub - easy integration)
- **Session management** with HTTP-only cookies

### 💳 Payment & Subscriptions
- **Razorpay integration** for international payments
- **Three pricing tiers**: Free, Pro ($9.99), Elite ($19.99)
- **Subscription management** (upgrade, downgrade, cancel)
- **Webhook automation** for payment events
- **Invoice generation** for transactions
- **Supports 135+ currencies**

### 💰 Affiliate System
- **Unique referral codes** for every user
- **20% recurring commission** on all referrals
- **Cookie-based tracking** (30-day attribution)
- **Real-time commission dashboard**
- **Automated payout tracking**
- **Multi-tier referral support**

### 🎨 AI Generation
- **Creative Director** (Gemini-powered prompt orchestration)
- **Video generation** (Wan2.1 - up to 4K resolution)
- **Voiceover synthesis** (F5-TTS - 30+ languages)
- **Music composition** (Stable Audio - royalty-free)
- **Lip-sync** (SadTalker - realistic talking heads)

### 📊 Dashboard & Analytics
- **Credit balance tracking**
- **Generation history**
- **Affiliate performance stats**
- **Usage analytics**
- **Download management**

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.5
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 11
- **Icons**: Lucide React
- **UI Components**: Custom (glassmorphism design)

### Backend
- **Runtime**: Node.js 20+
- **API**: Next.js API Routes (serverless)
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Drizzle ORM
- **Authentication**: JWT (jose library)
- **Password Hashing**: bcrypt

### Payment & Services
- **Payment Gateway**: Razorpay (international)
- **AI Orchestration**: Google Gemini 3 Pro
- **GPU Workers**: RunPod Serverless
- **File Storage**: Cloudflare R2
- **Email**: SendGrid (optional)

### Hosting & Infrastructure
- **Hosting**: Railway (primary)
- **Database**: Supabase (managed Postgres)
- **CDN**: Cloudflare
- **Monitoring**: Railway Logs + PostHog (optional)

---

## 🚀 Quick Start

### Prerequisites
```bash
node -v  # Should be 18.x or higher
npm -v   # Should be 9.x or higher
git --version
```

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/vynix-ai.git
cd vynix-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Edit .env.local with your keys:
# - NEXT_PUBLIC_SUPABASE_URL
# - SUPABASE_SERVICE_ROLE_KEY
# - RAZORPAY_KEY_ID
# - RAZORPAY_KEY_SECRET
# - GEMINI_API_KEY
# - RUNPOD_API_KEY
# - etc.

# Generate database schema
npm run db:generate

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

Visit `http://localhost:3000` 🎉

---

## 📦 Project Structure

```
vynix-ai/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts       # User registration
│   │   │   ├── login/route.ts        # JWT authentication
│   │   │   └── logout/route.ts       # Session cleanup
│   │   ├── subscribe/route.ts        # Create Razorpay subscription
│   │   ├── webhook/route.ts          # Payment webhook handler
│   │   ├── credits/route.ts          # Credit management
│   │   └── generate/route.ts         # AI generation queue
│   ├── dashboard/
│   │   └── page.tsx                  # User dashboard
│   ├── pricing/
│   │   └── page.tsx                  # Pricing page
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Landing page
├── components/
│   ├── auth/
│   │   ├── SignupForm.tsx           # Signup with affiliate tracking
│   │   └── LoginForm.tsx            # Login form
│   ├── dashboard/
│   │   ├── CreditBalance.tsx        # Credit display
│   │   ├── AffiliateStats.tsx       # Referral dashboard
│   │   └── GenerationHistory.tsx    # Past generations
│   └── ui/
│       └── ...                       # Reusable UI components
├── db/
│   ├── schema.ts                     # Drizzle ORM schema
│   └── index.ts                      # Database connection
├── lib/
│   ├── auth.ts                       # Auth utilities (JWT, bcrypt)
│   ├── razorpay.ts                   # Payment logic
│   └── runpod.ts                     # GPU worker API calls
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── .env.example                      # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── DEPLOYMENT.md                     # Deployment guide
└── README.md                         # This file
```

---

## 🚢 Deployment

### Option 1: Railway (Recommended)

```bash
# Install Railway CLI
npm install -g railway

# Login
railway login

# Initialize project
railway init

# Link to project
railway link

# Set environment variables
railway variables set DATABASE_URL="..."
railway variables set RAZORPAY_KEY_ID="..."
# ... (set all from .env.example)

# Deploy
railway up

# Get URL
railway status
```

**Complete guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Option 3: Docker

```bash
# Build image
docker build -t vynix-ai .

# Run container
docker run -p 3000:3000 --env-file .env.local vynix-ai
```

---

## 📚 API Documentation

### Authentication Endpoints

#### `POST /api/auth/signup`
Create new user account with affiliate tracking.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "referralCode": "ABC123XYZ"  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "affiliateCode": "JOH456DEF",
    "credits": 100,
    "plan": "free"
  }
}
```

#### `POST /api/auth/login`
Authenticate user and return JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### Subscription Endpoints

#### `POST /api/subscribe`
Create Razorpay subscription.

**Request:**
```json
{
  "plan": "elite",  // "pro" or "elite"
  "affiliateCode": "ABC123XYZ"  // Optional
}
```

**Response:**
```json
{
  "subscriptionId": "sub_xxxxx",
  "status": "created",
  "checkoutUrl": "https://checkout.razorpay.com/..."
}
```

### Webhook Endpoint

#### `POST /api/webhook`
Razorpay webhook handler (automatic).

**Events Handled:**
- `subscription.charged` - Payment successful
- `subscription.activated` - Subscription active
- `subscription.cancelled` - Subscription cancelled
- `payment.failed` - Payment failed

---

## 💸 Affiliate System

### How It Works

1. **User signs up** → Gets unique affiliate code (e.g., `ABC123XYZ`)
2. **User shares code** → Friend signs up with code
3. **Friend subscribes** → Original user earns 20% commission
4. **Commission tracked** → Forever (recurring on all payments)

### Implementation Example

```typescript
// In signup form
<input
  type="text"
  name="referralCode"
  placeholder="Have a referral code? (Optional)"
  className="..."
/>

// Backend handles tracking automatically
// Commission calculated on every subscription payment
```

### Commission Rates

| Plan | Price | Commission (20%) |
|------|-------|------------------|
| Pro | $9.99/mo | $2.00/mo |
| Elite | $19.99/mo | $4.00/mo |

### Payout Methods
- PayPal
- Bank Transfer (ACH)
- UPI (India)

---

## 🔒 Security

### Authentication Security
- ✅ **JWT tokens** with 7-day expiration
- ✅ **HTTP-only cookies** (XSS protection)
- ✅ **bcrypt hashing** with 12 salt rounds
- ✅ **Password validation** (8+ chars, uppercase, number)
- ✅ **Email verification** support

### API Security
- ✅ **CORS protection** (whitelist origins)
- ✅ **Rate limiting** (via Upstash Redis)
- ✅ **SQL injection protection** (Drizzle ORM parameterized queries)
- ✅ **XSS prevention** (input sanitization)
- ✅ **CSRF tokens** on state-changing endpoints

### Payment Security
- ✅ **Webhook signature verification**
- ✅ **PCI DSS compliance** (via Razorpay)
- ✅ **Encrypted API keys** (never exposed to client)
- ✅ **Secure session storage**

### Environment Variables
```bash
# CRITICAL: Never commit these files
.env.local
.env

# Keep secrets in Railway/Vercel dashboard
# Use different keys for dev/staging/production
```

---

## 📊 Performance

### Lighthouse Scores (Target)
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### Optimization Techniques
- ✅ Server-side rendering (Next.js)
- ✅ Image optimization (Next/Image)
- ✅ Code splitting
- ✅ Lazy loading
- ✅ CDN caching (Cloudflare)
- ✅ Database indexing

---

## 🧪 Testing

```bash
# Run unit tests (when added)
npm run test

# Run E2E tests (when added)
npm run test:e2e

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for all new code
- Follow existing code style (Prettier + ESLint)
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Open-Source Models**: Wan2.1, F5-TTS, Stable Audio, SadTalker
- **Hosting**: Railway, Supabase, Cloudflare
- **Payment**: Razorpay
- **AI Orchestration**: Google Gemini

---

## 📞 Support

- **Documentation**: [docs.vynix.ai](https://docs.vynix.ai) (coming soon)
- **Email**: [email protected]
- **Discord**: [discord.gg/vynix](https://discord.gg/vynix) (coming soon)
- **Twitter**: [@vynixai](https://twitter.com/vynixai)

---

## 🗺 Roadmap

### Q1 2026
- [x] MVP launch
- [x] Razorpay integration
- [x] Affiliate system
- [ ] Mobile app (React Native)
- [ ] API v1 (for Enterprise tier)

### Q2 2026
- [ ] Team collaboration features
- [ ] White-label option
- [ ] Advanced analytics dashboard
- [ ] 10+ new AI models

---

## 💼 Business Metrics

### Estimated Performance (Month 1)
- **Signups**: 100-500 (Product Hunt boost)
- **Conversion**: 25-30% → 25-150 paying users
- **MRR**: $500-$3,000
- **Profit Margin**: 70%
- **CAC**: $25 (organic) / $40 (paid ads)
- **LTV**: $240 (12-month retention)

---

## 🦄 From $0 to Unicorn

**Phase 1: Launch** (Month 1-3)
- Goal: 500 users, $10k MRR
- Focus: Product Hunt, organic growth

**Phase 2: Scale** (Month 4-12)
- Goal: 5,000 users, $90k MRR
- Focus: Paid ads, partnerships

**Phase 3: Dominate** (Year 2+)
- Goal: 50,000 users, $900k MRR
- Focus: Enterprise tier, international expansion

---

**Built with ❤️ by creators, for creators.**

🚀 **Ready to launch? Deploy now with `railway up`**
