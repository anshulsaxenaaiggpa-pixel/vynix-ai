# Railway Deployment Guide for Vynix AI

## 1. Environment Variables

Configure these variables in your Railway project settings.

### Core Configuration
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `NEXT_PUBLIC_APP_URL` | Your production URL | `https://vynix.ai` |
| `NEXTAUTH_URL` | Same as APP_URL | `https://vynix.ai` |
| `NEXTAUTH_SECRET` | Secret for NextAuth | `(generate with openssl rand -base64 32)` |
| `JWT_SECRET` | Secret for JWT options | `(generate with openssl rand -base64 32)` |

### Database (Supabase)
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Connection string from Supabase (Transaction Pool) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key (for admin tasks) |

### AI Services
| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API Key |
| `RUNPOD_API_KEY` | RunPod API Key |
| `RUNPOD_ENDPOINT_KLING_I2V` | Endpoint for Kling I2V |
| `RUNPOD_ENDPOINT_WAN_T2V` | Endpoint for Wan 2.1 |
| `RUNPOD_ENDPOINT_LIPSYNC` | Endpoint for LipSync |
| `HF_API_TOKEN` | Hugging Face Token (Optional, for free tier fallbacks) |

### Payments (Razorpay)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Key ID (Live) |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret (Live) |
| `RAZORPAY_WEBHOOK_SECRET` | Secret for Webhook verification |

### Storage (Cloudflare R2)
| Variable | Description |
|----------|-------------|
| `R2_ACCOUNT_ID` | Cloudflare Account ID |
| `R2_ACCESS_KEY_ID` | R2 Access Key |
| `R2_SECRET_ACCESS_KEY` | R2 Secret Key |
| `R2_BUCKET_NAME` | Bucket Name (e.g., `vynix-artifacts`) |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | Public URL for assets (e.g., `https://artifacts.vynix.ai`) |

### Optional / Internal
| Variable | Description |
|----------|-------------|
| `VYNIX_SERVICE_SECRET` | Internal secret for bypass |
| `VYNIX_API_KEY` | Master API Key (if used) |
| `REDIS_URL` | Redis Connection (for Celery/Workers) | `redis://...` |
| `E2E_API_KEY` | Key for E2E Spot Instances |

---

## 2. Adding Variables via CLI

You can bulk upload variables using the Railway CLI if you have a local `.env` file (be careful not to upload secrets you don't want!).

```bash
# Set individual variables
railway variables set KEY=VALUE

# Or copy from local .env (Review file first!)
# railway variables set $(cat .env.production)
```

## 3. Custom Domain & DNS Setup

To connect `vynix.ai`:

1.  **Railway Dashboard**: Go to `Settings` -> `Domains`.
2.  **Add Domain**: Enter `vynix.ai`.
3.  **DNS Configuration**:
    *   Login to your Domain Registrar (Namecheap, GoDaddy, etc.).
    *   Add a **CNAME Record**:
        *   **Type**: `CNAME`
        *   **Host**: `@` (or leave blank)
        *   **Value**: `result-from-railway.up.railway.app` (Copy the domain Railway gives you)
        *   **TTL**: `Auto` or `3600`
    *   (Optional) Add `www` CNAME:
        *   **Host**: `www`
        *   **Value**: `result-from-railway.up.railway.app`

4.  **Wait**: Propagation can take 5-60 minutes.
5.  **Verify**: Railway will show a ✅ when SSL is ready.

## 4. Final Verification
- Check `/api/health` to confirm backend is running.
- Test a generation to ensure GPU/Gemini keys are valid.
- Test a payment (small amount) to verify Razorpay Live keys.
