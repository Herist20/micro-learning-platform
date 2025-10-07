import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { db } from '@/lib/db';
import {
  hashPassword,
  verifyPassword,
  generateAuthTokens,
  verifyRefreshToken,
  getRefreshTokenExpiration,
  generateVerificationToken,
  generateResetToken,
  hashToken,
  isTokenExpired,
} from '@/lib/auth';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from '@/lib/email';
import { validateBody } from '@/lib/validation';
import { registerSchema, loginSchema, refreshTokenSchema } from '@/lib/validation';
import { authMiddleware } from '@/middleware/auth.middleware';
import type { AuthContext } from '@/middleware/auth.middleware';

const auth = new Hono();

/**
 * POST /auth/register
 * Register a new user
 */
auth.post('/register', async (c) => {
  const body = await validateBody(registerSchema, await c.req.json());

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { email: body.email },
  });

  if (existingUser) {
    throw new HTTPException(409, { message: 'User with this email already exists' });
  }

  // Hash password
  const hashedPassword = await hashPassword(body.password);

  // Generate email verification token
  const { token: verificationToken, expiresAt } = generateVerificationToken();
  const hashedToken = hashToken(verificationToken);

  // Create user
  const user = await db.user.create({
    data: {
      email: body.email,
      password: hashedPassword,
      name: body.name,
      role: body.role,
      emailVerificationToken: hashedToken,
      emailVerificationExpires: expiresAt,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      isEmailVerified: true,
      createdAt: true,
    },
  });

  // Send verification email (don't await - send asynchronously)
  sendVerificationEmail(user.email, verificationToken, user.name).catch((error) => {
    console.error('Failed to send verification email:', error);
  });

  return c.json({
    user,
    message: 'Registration successful. Please check your email to verify your account.',
  }, 201);
});

/**
 * POST /auth/login
 * Login user
 */
auth.post('/login', async (c) => {
  const body = await validateBody(loginSchema, await c.req.json());

  // Find user
  const user = await db.user.findUnique({
    where: { email: body.email },
  });

  if (!user) {
    throw new HTTPException(401, { message: 'Invalid credentials' });
  }

  // Verify password
  const isPasswordValid = await verifyPassword(body.password, user.password);

  if (!isPasswordValid) {
    throw new HTTPException(401, { message: 'Invalid credentials' });
  }

  // Optional: Require email verification before login
  // Uncomment to enforce email verification
  // if (!user.isEmailVerified) {
  //   throw new HTTPException(403, { message: 'Please verify your email before logging in' });
  // }

  // Update last login
  await db.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Generate tokens
  const tokens = generateAuthTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  // Save refresh token
  await db.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: getRefreshTokenExpiration(),
    },
  });

  return c.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
    },
    ...tokens,
  });
});

/**
 * POST /auth/refresh
 * Refresh access token
 */
auth.post('/refresh', async (c) => {
  const body = await validateBody(refreshTokenSchema, await c.req.json());

  // Verify refresh token
  let payload;
  try {
    payload = verifyRefreshToken(body.refreshToken);
  } catch (error) {
    throw new HTTPException(401, { message: 'Invalid refresh token' });
  }

  // Check if refresh token exists in database
  const storedToken = await db.refreshToken.findUnique({
    where: { token: body.refreshToken },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new HTTPException(401, { message: 'Refresh token expired or invalid' });
  }

  // Generate new tokens
  const tokens = generateAuthTokens(payload);

  // Delete old refresh token and save new one
  await db.refreshToken.delete({
    where: { token: body.refreshToken },
  });

  await db.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: payload.userId,
      expiresAt: getRefreshTokenExpiration(),
    },
  });

  return c.json(tokens);
});

/**
 * POST /auth/logout
 * Logout user (invalidate refresh token)
 */
auth.post('/logout', authMiddleware, async (c: AuthContext) => {
  const user = c.get('user');

  // Delete all refresh tokens for this user
  await db.refreshToken.deleteMany({
    where: { userId: user.userId },
  });

  return c.json({ message: 'Logged out successfully' });
});

/**
 * GET /auth/me
 * Get current user
 */
auth.get('/me', authMiddleware, async (c: AuthContext) => {
  const tokenUser = c.get('user');

  const user = await db.user.findUnique({
    where: { id: tokenUser.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      bio: true,
      isEmailVerified: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new HTTPException(404, { message: 'User not found' });
  }

  return c.json(user);
});

/**
 * POST /auth/verify-email
 * Verify user's email with token
 */
auth.post('/verify-email', async (c) => {
  const { token } = await c.req.json();

  if (!token) {
    throw new HTTPException(400, { message: 'Verification token is required' });
  }

  const hashedToken = hashToken(token);

  // Find user with this token
  const user = await db.user.findFirst({
    where: {
      emailVerificationToken: hashedToken,
    },
  });

  if (!user) {
    throw new HTTPException(400, { message: 'Invalid verification token' });
  }

  // Check if token expired
  if (user.emailVerificationExpires && isTokenExpired(user.emailVerificationExpires)) {
    throw new HTTPException(400, { message: 'Verification token has expired' });
  }

  // Update user
  await db.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    },
  });

  // Send welcome email
  sendWelcomeEmail(user.email, user.name).catch((error) => {
    console.error('Failed to send welcome email:', error);
  });

  return c.json({
    message: 'Email verified successfully',
  });
});

/**
 * POST /auth/resend-verification
 * Resend verification email
 */
auth.post('/resend-verification', async (c) => {
  const { email } = await c.req.json();

  if (!email) {
    throw new HTTPException(400, { message: 'Email is required' });
  }

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Don't reveal if user exists for security
    return c.json({
      message: 'If your email exists, you will receive a verification email',
    });
  }

  if (user.isEmailVerified) {
    throw new HTTPException(400, { message: 'Email is already verified' });
  }

  // Generate new token
  const { token: verificationToken, expiresAt } = generateVerificationToken();
  const hashedToken = hashToken(verificationToken);

  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerificationToken: hashedToken,
      emailVerificationExpires: expiresAt,
    },
  });

  // Send email
  sendVerificationEmail(user.email, verificationToken, user.name).catch((error) => {
    console.error('Failed to send verification email:', error);
  });

  return c.json({
    message: 'If your email exists, you will receive a verification email',
  });
});

/**
 * POST /auth/forgot-password
 * Request password reset
 */
auth.post('/forgot-password', async (c) => {
  const { email } = await c.req.json();

  if (!email) {
    throw new HTTPException(400, { message: 'Email is required' });
  }

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Don't reveal if user exists for security
    return c.json({
      message: 'If your email exists, you will receive a password reset email',
    });
  }

  // Generate reset token
  const { token: resetToken, expiresAt } = generateResetToken();
  const hashedToken = hashToken(resetToken);

  await db.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: hashedToken,
      passwordResetExpires: expiresAt,
    },
  });

  // Send email
  sendPasswordResetEmail(user.email, resetToken, user.name).catch((error) => {
    console.error('Failed to send password reset email:', error);
  });

  return c.json({
    message: 'If your email exists, you will receive a password reset email',
  });
});

/**
 * POST /auth/reset-password
 * Reset password with token
 */
auth.post('/reset-password', async (c) => {
  const { token, password } = await c.req.json();

  if (!token || !password) {
    throw new HTTPException(400, { message: 'Token and password are required' });
  }

  if (password.length < 8) {
    throw new HTTPException(400, { message: 'Password must be at least 8 characters' });
  }

  const hashedToken = hashToken(token);

  // Find user with this token
  const user = await db.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
    },
  });

  if (!user) {
    throw new HTTPException(400, { message: 'Invalid reset token' });
  }

  // Check if token expired
  if (user.passwordResetExpires && isTokenExpired(user.passwordResetExpires)) {
    throw new HTTPException(400, { message: 'Reset token has expired' });
  }

  // Hash new password
  const hashedPassword = await hashPassword(password);

  // Update password and clear reset token
  await db.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  // Invalidate all refresh tokens for security
  await db.refreshToken.deleteMany({
    where: { userId: user.id },
  });

  return c.json({
    message: 'Password reset successfully',
  });
});

export default auth;
