# 🔄 Project Reorganization Plan

## Current Status

### ✅ Completed
1. **Backend Code** - Fully implemented with:
   - Argon2 password hashing
   - JWT authentication
   - Email verification system
   - Password reset flow
   - 9 API endpoints
   - Prisma ORM with PostgreSQL

2. **Frontend Auth Pages** - Created but in wrong location:
   - Login, Register, Forgot Password, Reset Password, Verify Email
   - Pinia store for state management
   - API client utility
   - Auth composables

3. **Monorepo Structure** - Partially setup:
   - `apps/` folder exists
   - `packages/` folder exists
   - `pnpm-workspace.yaml` configured
   - `apps/api/` ✅ Backend code copied

### ❌ Needs Work
1. Backend is in `backend/` folder (should be `apps/api/`) - **DONE**
2. Frontend in `frontend/` (should be `apps/web/`) - **PENDING**
3. No `packages/shared` for shared types - **PENDING**
4. Using manual JWT instead of Better Auth - **PENDING**
5. No MinIO setup - **PENDING**
6. No Redis setup - **PENDING**

---

## Reorganization Steps

### Phase 1: Clean Up Structure ✅ IN PROGRESS

**What we're doing:**
- ✅ Move backend from `backend/` to `apps/api/`
- ⏳ Setup fresh Nuxt 3 in `apps/web/`
- ⏳ Migrate auth code to `apps/web/`
- ⏳ Delete old `backend/`, `frontend/`, `frontend-nuxt/` folders

### Phase 2: Enhance Architecture

**Shared Package:**
```
packages/shared/
├── src/
│   ├── types/
│   │   ├── user.ts
│   │   ├── course.ts
│   │   └── auth.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   └── constants.ts
│   └── schemas/
│       └── zod-schemas.ts
├── package.json
└── tsconfig.json
```

**Benefits:**
- Type safety across frontend & backend
- No code duplication
- Single source of truth

### Phase 3: Better Auth Integration

**Why Better Auth?**
- Built for modern frameworks
- Supports multiple providers (Email, OAuth, etc.)
- Session management built-in
- Less boilerplate code
- Better security defaults

**Migration Path:**
1. Install Better Auth in `apps/api/`
2. Configure providers (email/password, Google, GitHub)
3. Update frontend to use Better Auth client
4. Keep existing Prisma schema (compatible)
5. Migrate existing users (optional)

### Phase 4: Add MinIO & Redis

**MinIO (S3-compatible storage):**
```yaml
# docker-compose.yml
services:
  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    command: server /data --console-address ":9001"
```

**Redis (Caching):**
```yaml
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
```

**Use Cases:**
- **MinIO**: Course thumbnails, user avatars, lesson videos, certificates
- **Redis**: Session storage, rate limiting, course list caching

---

## Final Monorepo Structure

```
micro-learning-platform/
├── apps/
│   ├── web/                    # Nuxt 3 Frontend
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── ui/            # shadcn-vue components
│   │   ├── composables/
│   │   │   └── useAuth.ts
│   │   ├── layouts/
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── guest.ts
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── login.vue
│   │   │   │   ├── register.vue
│   │   │   │   └── ...
│   │   │   ├── courses/
│   │   │   ├── dashboard/
│   │   │   └── index.vue
│   │   ├── plugins/
│   │   ├── public/
│   │   ├── stores/
│   │   │   └── auth.ts
│   │   ├── utils/
│   │   ├── nuxt.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── api/                    # Hono Backend
│       ├── src/
│       │   ├── lib/
│       │   │   ├── auth.ts
│       │   │   ├── email.ts
│       │   │   ├── db.ts
│       │   │   ├── redis.ts
│       │   │   └── minio.ts
│       │   ├── routes/
│       │   │   ├── auth.routes.ts
│       │   │   ├── courses.routes.ts
│       │   │   ├── uploads.routes.ts
│       │   │   └── ...
│       │   ├── middleware/
│       │   └── index.ts
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   └── seed.ts
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── shared/                 # Shared Types & Utils
│   │   ├── src/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   ├── schemas/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── ui/                     # Shared UI Components (future)
│       ├── src/
│       │   └── components/
│       └── package.json
│
├── .env.example
├── .gitignore
├── docker-compose.yml          # MinIO + Redis + PostgreSQL
├── package.json                # Root package.json
├── pnpm-workspace.yaml
└── README.md
```

---

## Root Package.json Scripts

```json
{
  "name": "micro-learning-platform",
  "private": true,
  "scripts": {
    "dev": "concurrently \"pnpm --filter @app/api dev\" \"pnpm --filter @app/web dev\"",
    "dev:web": "pnpm --filter @app/web dev",
    "dev:api": "pnpm --filter @app/api dev",
    "build": "pnpm --filter @app/api build && pnpm --filter @app/web build",
    "build:web": "pnpm --filter @app/web build",
    "build:api": "pnpm --filter @app/api build",
    "db:generate": "pnpm --filter @app/api db:generate",
    "db:migrate": "pnpm --filter @app/api db:migrate",
    "db:seed": "pnpm --filter @app/api db:seed",
    "db:studio": "pnpm --filter @app/api db:studio",
    "lint": "pnpm --filter \"@app/*\" lint",
    "type-check": "pnpm --filter \"@app/*\" type-check",
    "clean": "pnpm --filter \"@app/*\" exec rm -rf node_modules",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down"
  }
}
```

---

## Next Steps (Priority Order)

### High Priority
1. ✅ **Cleanup current mess** - Remove duplicate folders
2. ⏳ **Setup Nuxt 3 in apps/web/** - Fresh install with proper config
3. ⏳ **Migrate auth pages** - Move to apps/web/pages/auth/
4. ⏳ **Test monorepo** - Ensure everything works

### Medium Priority
5. **Setup Better Auth** - Replace manual JWT implementation
6. **Create packages/shared** - Move types and utilities
7. **Setup docker-compose** - PostgreSQL + MinIO + Redis
8. **Add file upload** - Using MinIO

### Low Priority
9. **Add Redis caching** - For performance
10. **Setup CI/CD** - GitHub Actions
11. **Add E2E tests** - Playwright/Cypress

---

## Commands to Run

### 1. Clean Up (After backup)
```bash
# Remove old folders
rm -rf backend frontend frontend-nuxt

# Keep only monorepo structure
```

### 2. Setup Nuxt 3 in apps/web
```bash
cd apps/web
pnpm install nuxt @nuxtjs/tailwindcss @pinia/nuxt
pnpm add @vee-validate/zod vee-validate zod @vueuse/core
```

### 3. Install Better Auth
```bash
cd apps/api
pnpm add better-auth
```

### 4. Start Docker Services
```bash
docker-compose up -d postgres minio redis
```

### 5. Run Migrations
```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

### 6. Start Dev Servers
```bash
# From root
pnpm dev

# Or individually
pnpm dev:web
pnpm dev:api
```

---

## Decision Points

### Option A: Keep Current JWT Auth (Faster)
- ✅ Already working
- ✅ Well tested
- ✅ Custom implementation
- ❌ More code to maintain
- ❌ No OAuth support

### Option B: Migrate to Better Auth (Better Long-term)
- ✅ Less boilerplate
- ✅ OAuth ready (Google, GitHub, etc.)
- ✅ Better security defaults
- ✅ Active maintenance
- ❌ Need to migrate existing code
- ❌ Learning curve

### Recommendation: **Start with Option A, migrate to B later**
- Get monorepo working first
- Add features (courses, enrollments, etc.)
- Migrate to Better Auth when ready

---

## Timeline Estimate

- **Phase 1 (Cleanup)**: 1-2 hours
- **Phase 2 (Shared Package)**: 1 hour
- **Phase 3 (Better Auth)**: 2-3 hours
- **Phase 4 (MinIO & Redis)**: 1-2 hours

**Total**: 5-8 hours of focused work

---

## Current Working Code to Preserve

✅ **Backend (apps/api/):**
- All auth routes
- Email service
- Prisma schema
- Database seed

✅ **Frontend (to migrate):**
- Auth pages (5 pages)
- Auth store (Pinia)
- API client
- Auth composables
- Middleware

---

## Questions?

1. **Keep JWT or migrate to Better Auth now?**
   - Suggest: Keep JWT, migrate later

2. **Setup MinIO & Redis now or later?**
   - Suggest: Setup docker-compose now, implement later

3. **Create packages/shared now?**
   - Suggest: Yes, for type safety

4. **Delete old folders immediately?**
   - Suggest: After confirming apps/web works

---

**Status**: Ready to proceed with Phase 1
**Next Step**: Setup Nuxt 3 in apps/web/

