# 🚀 Backend Quick Start Guide

## ⚡ Get Started in 5 Minutes

### Prerequisites

- ✅ **Node.js 18+** ([Download](https://nodejs.org))
- ✅ **PostgreSQL** ([Download](https://www.postgresql.org/download/))
- ✅ **npm** or **yarn**

---

## 📋 Step-by-Step Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Setup PostgreSQL Database

#### Option A: Local PostgreSQL

Create a new database:
```sql
CREATE DATABASE microlearning;
```

#### Option B: Docker (Recommended)

```bash
docker run --name microlearning-db \
  -e POSTGRES_PASSWORD=password123 \
  -e POSTGRES_DB=microlearning \
  -p 5432:5432 \
  -d postgres:15
```

### Step 3: Configure Environment

```bash
# Copy environment file
cp .env.example .env
```

Edit `.env` file:
```env
# Update this line with your database credentials
DATABASE_URL="postgresql://postgres:password123@localhost:5432/microlearning"

# These can stay as default for development
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
PORT=5000
```

### Step 4: Setup Database Schema

```bash
# Generate Prisma Client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database with test data
npm run db:seed
```

**Output:**
```
✅ Created 6 users
✅ Created 3 courses with modules and lessons
✅ Created enrollments
✅ Created discussions
✅ Created notifications
```

### Step 5: Start Development Server

```bash
npm run dev
```

**Server will start on:** `http://localhost:5000`

---

## ✅ Verify Installation

### Test Health Endpoint

```bash
curl http://localhost:5000/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 1.234
}
```

### Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

**Expected response:**
```json
{
  "user": {
    "id": "...",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "role": "LEARNER"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

---

## 🔐 Test Accounts

All passwords: `password123`

| Role | Email | Use Case |
|------|-------|----------|
| **Admin** | `admin@microlearn.com` | Full access |
| **Instructor** | `sarah.johnson@microlearn.com` | Create courses |
| **Learner** | `john.doe@example.com` | Take courses |

---

## 🛠️ Useful Commands

### Database

```bash
# Prisma Studio (Database GUI)
npm run db:studio

# Reset database (delete all data)
npm run db:reset

# Create new migration
npm run db:migrate

# Deploy migrations (production)
npm run db:migrate:deploy
```

### Development

```bash
# Start dev server with hot reload
npm run dev

# Build TypeScript
npm run build

# Run production server
npm start

# Type checking
npm run type-check
```

---

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Courses

- `GET /api/courses` - List courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (Instructor)
- `PATCH /api/courses/:id` - Update course (Instructor)
- `DELETE /api/courses/:id` - Delete course (Instructor)

### Enrollments

- `GET /api/enrollments` - Get user enrollments
- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments/:courseId/progress` - Get progress
- `DELETE /api/enrollments/:courseId` - Unenroll

---

## 🧪 Test the API

### 1. Login as Learner

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'

# Save the accessToken from response
export TOKEN="your_access_token_here"
```

### 2. Get All Courses

```bash
curl http://localhost:5000/api/courses \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Enroll in Course

```bash
# Get course ID from previous response, then:
curl -X POST http://localhost:5000/api/enrollments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "courseId": "COURSE_ID_HERE" }'
```

### 4. Get My Enrollments

```bash
curl http://localhost:5000/api/enrollments \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🎨 Prisma Studio

Visual database browser:

```bash
npm run db:studio
```

Opens at: `http://localhost:5555`

You can:
- ✅ Browse all tables
- ✅ View relations
- ✅ Edit data
- ✅ Run queries
- ✅ See real-time updates

---

## 🔍 Query Examples

### Filter Courses

```bash
# By category
curl "http://localhost:5000/api/courses?category=Web%20Development"

# By difficulty
curl "http://localhost:5000/api/courses?difficulty=BEGINNER"

# Free courses only
curl "http://localhost:5000/api/courses?isFree=true"

# Search
curl "http://localhost:5000/api/courses?search=vue"

# Pagination
curl "http://localhost:5000/api/courses?page=1&limit=5"

# Sort
curl "http://localhost:5000/api/courses?sortBy=createdAt&sortOrder=desc"

# Combine filters
curl "http://localhost:5000/api/courses?category=Design&difficulty=INTERMEDIATE&page=1&limit=10"
```

---

## 🐛 Troubleshooting

### Database Connection Error

```
Error: Can't reach database server
```

**Solution:**
1. Check PostgreSQL is running: `pg_isready`
2. Verify DATABASE_URL in `.env`
3. Test connection: `psql -U postgres`

### Port Already in Use

```
Error: Port 5000 is already in use
```

**Solution:**
Change port in `.env`:
```env
PORT=5001
```

### Prisma Client Not Generated

```
Error: @prisma/client did not initialize yet
```

**Solution:**
```bash
npm run db:generate
```

### Migration Failed

```
Error: Migration failed
```

**Solution:**
```bash
# Reset database
npm run db:reset

# Or manually:
npm run db:push
```

---

## 📂 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── migrations/        # Migration files
│   └── seed.ts           # Seed data
│
├── src/
│   ├── lib/
│   │   ├── db.ts         # Prisma client
│   │   ├── auth.ts       # JWT utilities
│   │   └── validation.ts # Zod schemas
│   │
│   ├── middleware/
│   │   └── auth.middleware.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── courses.routes.ts
│   │   └── enrollments.routes.ts
│   │
│   └── index.ts          # Main server
│
├── .env                  # Environment variables
├── package.json
└── tsconfig.json
```

---

## 🎯 Next Steps

### Integrate with Frontend

1. Update frontend `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

2. Use API client:
```typescript
import { useApi } from '@/lib/api-client';

const { login, getCourses } = useApi();

// Login
const response = await login('john.doe@example.com', 'password123');

// Get courses
const courses = await getCourses({ page: 1, limit: 10 });
```

### Add More Endpoints

Create new route files in `src/routes/`:
- `modules.routes.ts`
- `lessons.routes.ts`
- `quizzes.routes.ts`
- `notifications.routes.ts`

### Enable CORS for Production

Update `.env`:
```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## ✅ Success Checklist

- [ ] PostgreSQL running
- [ ] Dependencies installed
- [ ] .env configured
- [ ] Database migrated
- [ ] Database seeded
- [ ] Server running on port 5000
- [ ] Health check returns OK
- [ ] Can login with test account
- [ ] Can fetch courses
- [ ] Prisma Studio accessible

---

## 🎉 You're Ready!

Backend is now running and ready to use! 🚀

**API Base URL:** `http://localhost:5000/api`
**Prisma Studio:** `http://localhost:5555`
**Health Check:** `http://localhost:5000/health`

For more details, see:
- **[README.md](./README.md)** - Full documentation
- **[BACKEND_SUMMARY.md](./BACKEND_SUMMARY.md)** - Implementation summary
