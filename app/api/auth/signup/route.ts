import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, affiliates } from '@/db/schema';
import {
  hashPassword,
  generateAffiliateCode,
  validateEmail,
  validatePassword,
  sanitizeInput,
  generateToken
} from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, referralCode } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase());
    const sanitizedName = name ? sanitizeInput(name) : undefined;

    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join(', ') },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, sanitizedEmail),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Verify referral code if provided
    let referredBy: string | undefined;
    if (referralCode) {
      const referrer = await db.query.users.findFirst({
        where: eq(users.affiliateCode, referralCode.toUpperCase()),
      });

      if (referrer) {
        referredBy = referralCode.toUpperCase();
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate unique affiliate code
    let affiliateCode = generateAffiliateCode(sanitizedEmail);

    // Ensure uniqueness
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 10) {
      const existing = await db.query.users.findFirst({
        where: eq(users.affiliateCode, affiliateCode),
      });
      if (!existing) {
        isUnique = true;
      } else {
        affiliateCode = generateAffiliateCode(sanitizedEmail);
        attempts++;
      }
    }

    // Create user
    const userResult = await db.insert(users).values({
      email: sanitizedEmail,
      passwordHash,
      name: sanitizedName,
      affiliateCode,
      referredBy,
      credits: 100, // Free tier starting credits
      plan: 'free',
    }).returning();

    const newUser = userResult[0];
    if (!newUser) {
      throw new Error('Failed to create user');
    }

    // Create affiliate record
    await db.insert(affiliates).values({
      userId: newUser.id,
      totalReferrals: 0,
      activeReferrals: 0,
      totalEarnings: '0.00',
      pendingPayout: '0.00',
    });

    // If referred, update referrer's stats
    if (referredBy) {
      const referrer = await db.query.users.findFirst({
        where: eq(users.affiliateCode, referredBy),
      });

      if (referrer) {
        const referrerAffiliate = await db.query.affiliates.findFirst({
          where: eq(affiliates.userId, referrer.id),
        });

        if (referrerAffiliate) {
          await db.update(affiliates)
            .set({
              totalReferrals: referrerAffiliate.totalReferrals + 1,
            })
            .where(eq(affiliates.userId, referrer.id));
        }
      }
    }

    // Generate JWT token
    const token = await generateToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name || undefined,
      plan: newUser.plan,
    });

    // Create response with secure cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        affiliateCode: newUser.affiliateCode,
        credits: newUser.credits,
        plan: newUser.plan,
      },
    }, { status: 201 });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Set referral tracking cookie if provided
    if (referralCode && referredBy) {
      response.cookies.set('vynix-ref', referredBy, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
    }

    return response;

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
