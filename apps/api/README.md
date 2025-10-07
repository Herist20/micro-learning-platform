# 🚀 Micro Learning Platform - Backend API

RESTful API built with Hono.js, Prisma, and PostgreSQL.

## 📋 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: [Hono.js](https://hono.dev/) - Ultrafast web framework
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (Access + Refresh tokens)
- **Validation**: Zod
- **Language**: TypeScript

## 🏗️ Architecture

```
backend/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed data
├── src/
│   ├── lib/
│   │   ├── db.ts           # Prisma client
│   │   ├── auth.ts         # Auth utilities
│   │   └── validation.ts   # Zod schemas
│   ├── middleware/
│   │   └── auth.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── courses.routes.ts
│   │   └── enrollments.routes.ts
│   └── index.ts            # Main server
├── package.json
└── tsconfig.json
```

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

```bash
cp .env.example .env
```

Edit `.env` and update:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/microlearning"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
```

### 4. Setup Database

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

## 📚 Database Schema

### Core Entities

- **User** - Users (Admin, Instructor, Learner)
- **Course** - Courses with metadata
- **Module** - Course modules/sections
- **Lesson** - Individual lessons
- **Quiz** - Assessments
- **Question** - Quiz questions
- **Enrollment** - User course enrollments
- **LessonProgress** - Progress tracking
- **QuizAttempt** - Quiz submissions
- **Certificate** - Course certificates
- **Discussion** - Lesson discussions
- **Notification** - User notifications

### Relations

- User → Courses (Instructor)
- User → Enrollments
- Course → Modules → Lessons
- Lesson → Quiz → Questions
- User → LessonProgress
- User → QuizAttempts

## 🔐 Authentication

### JWT Token System

- **Access Token**: Short-lived (15min), for API access
- **Refresh Token**: Long-lived (7 days), stored in DB

### Endpoints

```bash
POST /api/auth/register   # Register new user
POST /api/auth/login      # Login
POST /api/auth/refresh    # Refresh token
POST /api/auth/logout     # Logout
GET  /api/auth/me         # Get current user
```

### Usage

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Use token
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📡 API Endpoints

### Courses

```
GET    /api/courses              # List courses (with filters)
GET    /api/courses/:id          # Get course details
POST   /api/courses              # Create course (Instructor)
PATCH  /api/courses/:id          # Update course (Instructor)
DELETE /api/courses/:id          # Delete course (Instructor)
POST   /api/courses/:id/publish  # Publish/unpublish (Instructor)
GET    /api/courses/:id/students # Get enrolled students (Instructor)
```

### Enrollments

```
GET    /api/enrollments                  # Get user enrollments
POST   /api/enrollments                  # Enroll in course
GET    /api/enrollments/:courseId/progress  # Get progress
DELETE /api/enrollments/:courseId        # Unenroll
```

### Query Parameters

```bash
# Pagination
?page=1&limit=10

# Sorting
?sortBy=createdAt&sortOrder=desc

# Filters
?category=Web Development&difficulty=BEGINNER&isFree=true

# Search
?search=vue.js
```

## 🔒 Authorization

### Roles

- **ADMIN** - Full access
- **INSTRUCTOR** - Can create/manage courses
- **LEARNER** - Can enroll and learn

### Middleware

```typescript
import { authMiddleware, requireInstructor, requireAdmin } from './middleware/auth.middleware';

// Require authentication
app.get('/protected', authMiddleware, handler);

// Require instructor role
app.post('/courses', authMiddleware, requireInstructor(), handler);

// Require admin role
app.delete('/users/:id', authMiddleware, requireAdmin(), handler);
```

## ✅ Validation (Zod)

All request bodies are validated using Zod schemas:

```typescript
import { validateBody, createCourseSchema } from '@/lib/validation';

app.post('/courses', async (c) => {
  const body = await validateBody(createCourseSchema, await c.req.json());
  // body is type-safe
});
```

## 🗄️ Database Operations

### Using Prisma Client

```typescript
import { db } from '@/lib/db';

// Find many with relations
const courses = await db.course.findMany({
  include: {
    instructor: true,
    modules: {
      include: {
        lessons: true,
      },
    },
  },
  where: {
    isPublished: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
  take: 10,
  skip: 0,
});

// Create with relation
const enrollment = await db.enrollment.create({
  data: {
    userId: user.id,
    courseId: course.id,
  },
  include: {
    course: true,
  },
});
```

### Available Commands

```bash
# Prisma Studio (Database GUI)
npm run db:studio

# Create migration
npm run db:migrate

# Reset database
npm run db:reset

# Generate Prisma Client
npm run db:generate
```

## 🌱 Seed Data

The seed script creates:

- 6 Users (1 admin, 3 instructors, 2 learners)
- 3 Courses with modules and lessons
- Sample enrollments
- Quiz with questions
- Discussions and notifications

**Test Accounts:**

```
Admin:      admin@microlearn.com / password123
Instructor: sarah.johnson@microlearn.com / password123
Learner:    john.doe@example.com / password123
```

## 🔧 Available Scripts

```bash
npm run dev              # Development server with hot reload
npm run build            # Build for production
npm start                # Start production server
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio
npm run db:reset         # Reset database and seed
npm run type-check       # TypeScript type checking
npm run lint             # ESLint
```

## 📊 Response Format

### Success Response

```json
{
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response

```json
{
  "message": "Error message",
  "status": 400,
  "errors": [...]  // For validation errors
}
```

## 🚦 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation error)
- `401` - Unauthorized (Invalid/missing token)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found
- `409` - Conflict (Duplicate resource)
- `500` - Internal Server Error

## 📝 Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

## 🔐 Security Features

- ✅ Password hashing (bcrypt)
- ✅ JWT token authentication
- ✅ Refresh token rotation
- ✅ Role-based access control (RBAC)
- ✅ Input validation (Zod)
- ✅ SQL injection protection (Prisma)
- ✅ CORS configuration
- ✅ Rate limiting (TODO)

## 📈 Performance

- Prisma query optimization
- Database indexing
- Connection pooling
- Lazy loading relations
- Efficient pagination

## 🐛 Error Handling

Global error handler catches:
- HTTP exceptions
- Validation errors (Zod)
- Database errors
- Unhandled errors

## 🧪 Testing (TODO)

```bash
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 📚 Additional Resources

- [Hono.js Docs](https://hono.dev/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Zod Docs](https://zod.dev/)

## 🚀 Deployment

### Production Checklist

- [ ] Update environment variables
- [ ] Run database migrations
- [ ] Build TypeScript
- [ ] Configure reverse proxy (nginx)
- [ ] Setup SSL certificate
- [ ] Enable rate limiting
- [ ] Configure logging
- [ ] Setup monitoring

### Deploy Commands

```bash
# Build
npm run build

# Run migrations
npm run db:migrate:deploy

# Start server
npm start
```

## 📄 License

MIT

---

Built with ❤️ using Hono.js + Prisma + PostgreSQL
