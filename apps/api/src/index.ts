import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', prettyJSON())
app.use(
  '*',
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  })
)

// Health check
app.get('/health', c => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  })
})

// API Routes
app.get('/api', c => {
  return c.json({
    message: 'Micro-Learning Platform API',
    version: '1.0.0'
  })
})

// 404 Handler
app.notFound(c => {
  return c.json(
    {
      error: 'Not Found',
      message: 'The requested resource was not found'
    },
    404
  )
})

// Error Handler
app.onError((err, c) => {
  console.error(err)
  return c.json(
    {
      error: 'Internal Server Error',
      message: err.message
    },
    500
  )
})

const port = Number(process.env.PORT) || 3001

console.log(`🚀 Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
