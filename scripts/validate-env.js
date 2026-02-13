/**
 * Environment Variable Validation
 * Run this before deployment to catch missing/invalid environment variables
 */

const requiredEnvVars = {
  // Database
  DATABASE_URL: {
    required: true,
    description: 'PostgreSQL connection string from Supabase',
    example: 'postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres',
  },
  NEXT_PUBLIC_SUPABASE_URL: {
    required: true,
    description: 'Supabase project URL',
    example: 'https://[project].supabase.co',
  },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: {
    required: true,
    description: 'Supabase anonymous key',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  },
  SUPABASE_SERVICE_ROLE_KEY: {
    required: true,
    description: 'Supabase service role key (NEVER expose to client!)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  },

  // Authentication
  JWT_SECRET: {
    required: true,
    description: 'Secret for JWT token signing (generate with: openssl rand -base64 32)',
    minLength: 32,
  },
  NEXTAUTH_SECRET: {
    required: true,
    description: 'NextAuth secret (generate with: openssl rand -base64 32)',
    minLength: 32,
  },

  // Razorpay
  RAZORPAY_KEY_ID: {
    required: true,
    description: 'Razorpay API key ID',
    example: 'rzp_test_xxxxx or rzp_live_xxxxx',
  },
  RAZORPAY_KEY_SECRET: {
    required: true,
    description: 'Razorpay API secret (NEVER expose to client!)',
  },
  RAZORPAY_WEBHOOK_SECRET: {
    required: true,
    description: 'Razorpay webhook secret for signature verification',
    example: 'whsec_xxxxx',
  },
  NEXT_PUBLIC_RAZORPAY_KEY_ID: {
    required: true,
    description: 'Razorpay key ID (safe for client-side)',
  },

  // AI Services
  GEMINI_API_KEY: {
    required: true,
    description: 'Google Gemini API key for AI orchestration',
    example: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXX',
  },

  // GPU Workers
  RUNPOD_API_KEY: {
    required: true,
    description: 'RunPod API key for GPU workers',
  },
  RUNPOD_ENDPOINT_WAN21: {
    required: false,
    description: 'RunPod endpoint for Wan2.1 video generation',
    example: 'https://api.runpod.ai/v2/xxxxx',
  },
  RUNPOD_ENDPOINT_F5TTS: {
    required: false,
    description: 'RunPod endpoint for F5-TTS voice generation',
  },

  // Storage
  R2_ACCOUNT_ID: {
    required: true,
    description: 'Cloudflare R2 account ID',
  },
  R2_ACCESS_KEY_ID: {
    required: true,
    description: 'Cloudflare R2 access key',
  },
  R2_SECRET_ACCESS_KEY: {
    required: true,
    description: 'Cloudflare R2 secret key',
  },
  R2_BUCKET_NAME: {
    required: true,
    description: 'Cloudflare R2 bucket name',
    example: 'vynix-artifacts',
  },
  NEXT_PUBLIC_R2_PUBLIC_URL: {
    required: true,
    description: 'Public URL for R2 artifacts',
    example: 'https://artifacts.vynix.ai',
  },

  // Application
  NEXT_PUBLIC_APP_URL: {
    required: true,
    description: 'Application URL',
    example: 'https://vynix.ai',
  },
  NODE_ENV: {
    required: true,
    description: 'Environment',
    validValues: ['development', 'production', 'test'],
  },

  // Affiliate
  AFFILIATE_COMMISSION_RATE: {
    required: false,
    description: 'Affiliate commission rate (decimal)',
    example: '0.20',
    default: '0.20',
  },
  AFFILIATE_COOKIE_DAYS: {
    required: false,
    description: 'Days to track affiliate referrals',
    example: '30',
    default: '30',
  },
};

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function validateEnvironment() {
  console.log(`${colors.cyan}🔍 Validating environment variables...${colors.reset}\n`);

  const errors = [];
  const warnings = [];
  let validCount = 0;

  for (const [key, config] of Object.entries(requiredEnvVars)) {
    const value = process.env[key];

    // Check if required variable exists
    if (config.required && !value) {
      errors.push({
        key,
        message: `Missing required variable: ${key}`,
        hint: config.description,
        example: config.example,
      });
      continue;
    }

    // If not required but has default, use default
    if (!value && config.default) {
      warnings.push({
        key,
        message: `Using default value for ${key}: ${config.default}`,
      });
      validCount++;
      continue;
    }

    // If optional and not set, skip
    if (!config.required && !value) {
      warnings.push({
        key,
        message: `Optional variable not set: ${key}`,
        hint: config.description,
      });
      continue;
    }

    // Validate minimum length
    if (config.minLength && value.length < config.minLength) {
      errors.push({
        key,
        message: `${key} is too short (minimum ${config.minLength} characters)`,
        hint: config.description,
      });
      continue;
    }

    // Validate against allowed values
    if (config.validValues && !config.validValues.includes(value)) {
      errors.push({
        key,
        message: `${key} has invalid value: ${value}`,
        hint: `Must be one of: ${config.validValues.join(', ')}`,
      });
      continue;
    }

    // Variable is valid
    validCount++;
    console.log(`${colors.green}✓ ${key}${colors.reset}`);
  }

  // Print warnings
  if (warnings.length > 0) {
    console.log(`\n${colors.yellow}⚠️  Warnings:${colors.reset}\n`);
    warnings.forEach((warning) => {
      console.log(`${colors.yellow}  • ${warning.message}${colors.reset}`);
      if (warning.hint) {
        console.log(`    ${colors.blue}${warning.hint}${colors.reset}`);
      }
    });
  }

  // Print errors
  if (errors.length > 0) {
    console.log(`\n${colors.red}❌ Errors:${colors.reset}\n`);
    errors.forEach((error) => {
      console.log(`${colors.red}  • ${error.message}${colors.reset}`);
      if (error.hint) {
        console.log(`    ${colors.blue}Hint: ${error.hint}${colors.reset}`);
      }
      if (error.example) {
        console.log(`    ${colors.magenta}Example: ${error.example}${colors.reset}`);
      }
    });
    console.log(`\n${colors.red}Fix these errors before deploying!${colors.reset}\n`);
    process.exit(1);
  }

  // Success message
  console.log(`\n${colors.green}✅ All required environment variables are set!${colors.reset}`);
  console.log(`${colors.cyan}📊 Summary: ${validCount} valid, ${warnings.length} warnings, ${errors.length} errors${colors.reset}\n`);

  // Security reminders
  console.log(`${colors.yellow}🔒 Security Reminders:${colors.reset}`);
  console.log(`  • Never commit .env.local to Git`);
  console.log(`  • Use different keys for development and production`);
  console.log(`  • Store production secrets in Railway/Vercel dashboard`);
  console.log(`  • Rotate API keys regularly`);
  console.log(`  • Keep service role keys server-side only\n`);
}

// Run validation
try {
  validateEnvironment();
} catch (error) {
  console.error(`${colors.red}❌ Validation failed with error:${colors.reset}`, error);
  process.exit(1);
}
