import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { verifyAccessToken, TokenPayload } from '@/lib/auth';
import { UserRole } from '@prisma/client';

export type AuthContext = {
  Variables: {
    user: TokenPayload;
  };
};

/**
 * Authentication middleware - Verifies JWT token
 */
export async function authMiddleware(c: Context<AuthContext>, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Unauthorized - No token provided' });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    const payload = verifyAccessToken(token);
    c.set('user', payload);
    await next();
  } catch (error) {
    throw new HTTPException(401, { message: 'Unauthorized - Invalid token' });
  }
}

/**
 * Role-based authorization middleware
 */
export function requireRole(...roles: UserRole[]) {
  return async (c: Context<AuthContext>, next: Next) => {
    const user = c.get('user');

    if (!user) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }

    if (!roles.includes(user.role)) {
      throw new HTTPException(403, { message: 'Forbidden - Insufficient permissions' });
    }

    await next();
  };
}

/**
 * Optional auth middleware - Adds user to context if token is valid, but doesn't require it
 */
export async function optionalAuth(c: Context<AuthContext>, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);

    try {
      const payload = verifyAccessToken(token);
      c.set('user', payload);
    } catch (error) {
      // Ignore error for optional auth
    }
  }

  await next();
}

/**
 * Check if user is admin
 */
export function requireAdmin() {
  return requireRole(UserRole.ADMIN);
}

/**
 * Check if user is instructor or admin
 */
export function requireInstructor() {
  return requireRole(UserRole.ADMIN, UserRole.INSTRUCTOR);
}
