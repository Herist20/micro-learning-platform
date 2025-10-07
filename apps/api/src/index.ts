import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { HTTPException } from 'hono/http-exception';

// Routes
import authRoutes from './routes/auth.routes';
import coursesRoutes from './routes/courses.routes';
// Import other routes here as you create them

const app = new Hono();

// Middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  })
);

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.route('/api/auth', authRoutes);
app.route('/api/courses', coursesRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({ message: 'Not Found' }, 404);
});

// Global error handler
app.onError((err, c) => {
  console.error('Error:', err);

  if (err instanceof HTTPException) {
    return c.json(
      {
        message: err.message,
        status: err.status,
      },
      err.status
    );
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    return c.json(
      {
        message: 'Validation error',
        errors: err.issues,
      },
      400
    );
  }

  return c.json(
    {
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    },
    500
  );
});

const port = parseInt(process.env.PORT || '5000');

console.log(`🚀 Server starting on port ${port}...`);

serve({
  fetch: app.fetch,
  port,
});

console.log(`✅ Server is running on http://localhost:${port}`);
console.log(`📚 API Docs: http://localhost:${port}/api`);
console.log(`❤️  Health check: http://localhost:${port}/health`);
