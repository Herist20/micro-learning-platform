# 🚀 Next Session Quick-Start Checklist

## 📍 WHERE WE ARE NOW

**Progress**: 60% Complete ✅
**Last Checkpoint**: Nuxt 3 setup complete, ready to copy auth files

---

## 🎯 FIRST THING TO DO IN NEXT SESSION

**Tell Claude**:
> "Baca file IMPLEMENTATION_STATUS.md, REORGANIZATION_PLAN.md, dan NEXT_SESSION_CHECKLIST.md, lalu lanjutkan implementation dari checkpoint terakhir"

---

## ✅ WHAT'S ALREADY DONE (DON'T REDO!)

### Backend (apps/api/) - 100% Complete ✅
- All auth code implemented
- Argon2 + JWT working
- Email service ready
- 9 API endpoints functional
- Database migrated & seeded

**Location**: `apps/api/src/`
**Don't touch**: It's production ready!

### Database - 100% Complete ✅
- PostgreSQL running on port 5432
- Migrations applied
- Test data seeded
- 6 users created (admin, instructors, learners)

**Test Accounts**:
```
admin@microlearn.com / password123
sarah.johnson@microlearn.com / password123
john.doe@example.com / password123
```

### Frontend Setup - 80% Complete ✅
- Nuxt 3 installed at `apps/web/`
- Tailwind configured
- Pinia ready
- All dependencies installed

**What's Missing**: Auth pages need to be copied

### Monorepo - 100% Complete ✅
- pnpm workspace working
- apps/api/ setup
- apps/web/ setup
- packages/ folder ready

---

## 📋 TODO CHECKLIST (In Priority Order)

### ⚡ IMMEDIATE (Must Do First - 1 hour)

#### 1. Copy Auth Files to apps/web/ (15 mins)
```bash
# Copy auth pages
cp -r frontend/pages/auth apps/web/pages/

# Copy stores
mkdir -p apps/web/stores
cp frontend/stores/auth.ts apps/web/stores/

# Copy composables
cp frontend/composables/useAuth.ts apps/web/composables/

# Copy middleware
cp frontend/middleware/auth.ts apps/web/middleware/
cp frontend/middleware/guest.ts apps/web/middleware/

# Copy types
mkdir -p apps/web/types
cp frontend/types/auth.ts apps/web/types/

# Copy utils
cp frontend/utils/api-client.ts apps/web/utils/

# Copy index page
cp frontend/pages/index.vue apps/web/pages/
```

**Verification**:
```bash
ls apps/web/pages/auth/
# Should show: login.vue, register.vue, forgot-password.vue, reset-password.vue, verify-email.vue
```

#### 2. Test apps/web/ (5 mins)
```bash
cd apps/web
pnpm dev
# Should run on http://localhost:3000
# Open browser, check /auth/login works
```

**Expected**: Login page appears with modern design

#### 3. Update .env in apps/web/ (5 mins)
```bash
cd apps/web
cp ../api/.env.example .env
```

Edit `apps/web/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_TITLE=MicroLearn
```

#### 4. Install Better Auth in apps/api/ (30 mins)
```bash
cd apps/api
pnpm add better-auth
pnpm add @better-auth/prisma-adapter
```

**Create**: `apps/api/src/lib/better-auth.ts`
```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { db } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
});
```

**Update**: `apps/api/src/index.ts` to use Better Auth

---

### 🔥 HIGH PRIORITY (Next 2 hours)

#### 5. Create packages/shared/ (30 mins)
```bash
mkdir -p packages/shared/src/{types,utils,schemas}
```

**Create**: `packages/shared/package.json`
```json
{
  "name": "@micro-learning/shared",
  "version": "1.0.0",
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  }
}
```

**Move shared types**:
- Copy user types
- Copy auth types
- Copy course types

#### 6. Setup docker-compose.yml (30 mins)
**Create**: `docker-compose.yml` in root
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: microlearning-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password123
      POSTGRES_DB: microlearning
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  minio:
    image: minio/minio
    container_name: microlearning-minio
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin123
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"

  redis:
    image: redis:alpine
    container_name: microlearning-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  minio_data:
  redis_data:
```

**Start services**:
```bash
docker-compose up -d
```

#### 7. Integrate MinIO (45 mins)
```bash
cd apps/api
pnpm add minio
pnpm add @types/minio -D
```

**Create**: `apps/api/src/lib/minio.ts`
**Create**: `apps/api/src/routes/upload.routes.ts`

#### 8. Integrate Redis (30 mins)
```bash
cd apps/api
pnpm add redis
```

**Create**: `apps/api/src/lib/redis.ts`
**Add**: Caching middleware

---

### 🎨 MEDIUM PRIORITY (1 hour)

#### 9. Update Root package.json (15 mins)
**Edit**: Root `package.json`
```json
{
  "scripts": {
    "dev": "concurrently \"pnpm --filter @app/api dev\" \"pnpm --filter @app/web dev\"",
    "dev:web": "pnpm --filter @app/web dev",
    "dev:api": "pnpm --filter @app/api dev",
    "build": "pnpm --filter @app/api build && pnpm --filter @app/web build",
    "db:generate": "pnpm --filter @app/api db:generate",
    "db:migrate": "pnpm --filter @app/api db:migrate",
    "db:seed": "pnpm --filter @app/api db:seed",
    "db:studio": "pnpm --filter @app/api db:studio",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down"
  }
}
```

**Install**:
```bash
pnpm add -D concurrently -w
```

#### 10. Update apps/api/package.json (5 mins)
Add name: `"name": "@app/api"`

#### 11. Update apps/web/package.json (5 mins)
Add name: `"name": "@app/web"`

---

### 🧹 LOW PRIORITY (Cleanup - 30 mins)

#### 12. Delete Old Folders
```bash
# BACKUP FIRST! (Optional)
# mv backend backend-old
# mv frontend frontend-old
# mv frontend-nuxt frontend-nuxt-old

# Then delete
rm -rf backend
rm -rf frontend
rm -rf frontend-nuxt
```

#### 13. Test Everything
```bash
# Start all services
pnpm docker:up

# Run migrations
pnpm db:migrate

# Start dev servers
pnpm dev

# Test in browser:
# - http://localhost:3000 (Frontend)
# - http://localhost:5000/health (Backend)
# - http://localhost:9001 (MinIO Console)
```

---

## 🎯 SUCCESS CRITERIA

### ✅ When You're Done, You Should Have:

1. **Working Frontend** at http://localhost:3000
   - Login page works
   - Register page works
   - Can authenticate

2. **Working Backend** at http://localhost:5000
   - Health check returns OK
   - Auth endpoints work
   - Better Auth integrated

3. **Docker Services Running**
   - PostgreSQL (5432)
   - MinIO (9000, 9001)
   - Redis (6379)

4. **Monorepo Scripts**
   - `pnpm dev` runs both frontend & backend
   - `pnpm db:migrate` works from root
   - `pnpm docker:up` starts all services

5. **File Upload Works**
   - Can upload files to MinIO
   - Files are accessible

6. **Caching Works**
   - Redis connected
   - Common queries cached

---

## 📚 REFERENCE FILES

Read these in order:
1. `IMPLEMENTATION_STATUS.md` - Current status
2. `REORGANIZATION_PLAN.md` - Overall plan
3. `AUTHENTICATION_IMPLEMENTATION.md` - Auth details

---

## 🚨 COMMON ISSUES & SOLUTIONS

### Issue: "pnpm not found"
```bash
npm install -g pnpm
```

### Issue: "Port 5432 already in use"
```bash
# Stop old postgres
docker stop microlearning-db
docker rm microlearning-db

# Or use docker-compose
docker-compose down
docker-compose up -d
```

### Issue: "Prisma Client not generated"
```bash
cd apps/api
pnpm db:generate
```

### Issue: "Module not found" in apps/web
```bash
cd apps/web
pnpm install
```

### Issue: Better Auth errors
Check:
1. Database connection in .env
2. Prisma schema has Better Auth tables
3. Migration applied

---

## ⏱️ TIME ESTIMATE

| Task | Time | Priority |
|------|------|----------|
| Copy auth files | 15 mins | ⚡ IMMEDIATE |
| Test apps/web | 5 mins | ⚡ IMMEDIATE |
| Update .env | 5 mins | ⚡ IMMEDIATE |
| Install Better Auth | 30 mins | ⚡ IMMEDIATE |
| Create shared package | 30 mins | 🔥 HIGH |
| Docker-compose | 30 mins | 🔥 HIGH |
| MinIO integration | 45 mins | 🔥 HIGH |
| Redis integration | 30 mins | 🔥 HIGH |
| Update scripts | 15 mins | 🎨 MEDIUM |
| Cleanup | 30 mins | 🧹 LOW |
| **TOTAL** | **~4 hours** | |

---

## 🎉 FINAL DELIVERABLE

When everything is done:
```
✅ Monorepo working
✅ Frontend at apps/web/
✅ Backend at apps/api/
✅ Shared types at packages/shared/
✅ Better Auth integrated
✅ MinIO for file storage
✅ Redis for caching
✅ Docker-compose for all services
✅ All tests passing
```

---

## 📞 WHAT TO TELL CLAUDE IN NEXT SESSION

> "Hi Claude! Baca file IMPLEMENTATION_STATUS.md, REORGANIZATION_PLAN.md, dan NEXT_SESSION_CHECKLIST.md. Kita sudah setup monorepo dengan Nuxt 3 di apps/web/ dan backend di apps/api/. Sekarang lanjutkan dari TODO CHECKLIST - mulai dari step 1: Copy auth files. Lakukan semua step sampai selesai."

---

**Created**: Now
**Ready for**: Next session
**Confidence**: 100% - All documented clearly

🚀 Good luck with next session!
