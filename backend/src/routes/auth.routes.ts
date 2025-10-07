import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { db } from '@/lib/db';
import {
  hashPassword,
  verifyPassword,
  generateAuthTokens,
  verifyRefreshToken,
  getRefreshTokenExpiration,
} from '@/lib/auth';
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

  // Create user
  const user = await db.user.create({
    data: {
      email: body.email,
      password: hashedPassword,
      name: body.name,
      role: body.role,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      createdAt: true,
    },
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
    user,
    ...tokens,
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
      createdAt: true,
    },
  });

  if (!user) {
    throw new HTTPException(404, { message: 'User not found' });
  }

  return c.json(user);
});

export default auth;
