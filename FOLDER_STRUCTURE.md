# 📁 Penjelasan Detail Struktur Folder

## 🎯 Overview

Project ini menggunakan **monorepo architecture** dengan pnpm workspace untuk manage multiple packages dan applications dalam satu repository.

## 📊 Struktur Utama

```
micro-learning-platform/
├── apps/                 # Aplikasi utama
├── packages/            # Shared packages
├── .env.example        # Template environment variables
├── package.json        # Root package manager
└── pnpm-workspace.yaml # Workspace configuration
```

---

## 🌐 `/apps/web` - Frontend (Nuxt 3)

### Directory Structure
```
apps/web/
├── assets/              # Static assets yang di-process
│   └── css/            # Global CSS & Tailwind
├── components/         # Vue Components
│   └── ui/            # shadcn-vue components
├── composables/       # Vue Composables
├── layouts/           # Layout templates
├── lib/              # Library utilities
├── middleware/       # Route middlewares
├── pages/            # File-based routing
├── plugins/          # Nuxt plugins
├── public/           # Static files
├── stores/           # Pinia stores
├── types/            # TypeScript definitions
├── utils/            # Helper functions
├── app.vue          # Root component
└── nuxt.config.ts   # Nuxt configuration
```

### Penjelasan Detail

#### `/assets/css/`
- **Purpose**: Global styles dan Tailwind CSS
- **Files**:
  - `tailwind.css`: Main Tailwind file dengan custom utilities
- **Usage**: Import di `nuxt.config.ts`

#### `/components/`
- **Purpose**: Reusable Vue components
- **Organization**: Group by feature atau functionality
- **Example**:
  ```
  components/
  ├── ui/              # shadcn-vue components
  │   ├── Button.vue
  │   ├── Card.vue
  │   └── Input.vue
  ├── course/         # Course-related components
  │   ├── CourseCard.vue
  │   └── CourseList.vue
  └── layout/         # Layout components
      ├── Header.vue
      └── Footer.vue
  ```

#### `/composables/`
- **Purpose**: Reusable composition functions
- **Naming**: Prefix dengan `use` (e.g., `useAuth.ts`, `useCourse.ts`)
- **Example**:
  ```typescript
  // composables/useAuth.ts
  export const useAuth = () => {
    const user = useState('user')
    const login = async (credentials) => { ... }
    return { user, login }
  }
  ```

#### `/layouts/`
- **Purpose**: Page layout templates
- **Files**:
  - `default.vue`: Default layout
  - `auth.vue`: Layout untuk auth pages
  - `dashboard.vue`: Layout untuk dashboard
- **Usage**: Specify di pages dengan `layout` option

#### `/lib/`
- **Purpose**: Library utilities dan helpers
- **Files**:
  - `utils.ts`: Helper functions (cn, format, dll)
- **Usage**: Import di components atau composables

#### `/middleware/`
- **Purpose**: Route guards dan middleware
- **Types**:
  - Named middleware: `middleware/auth.ts`
  - Global middleware: `middleware/analytics.global.ts`
- **Example**:
  ```typescript
  // middleware/auth.ts
  export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuth()
    if (!auth.isLoggedIn) {
      return navigateTo('/login')
    }
  })
  ```

#### `/pages/`
- **Purpose**: File-based routing pages
- **Structure**:
  ```
  pages/
  ├── index.vue              # /
  ├── login.vue             # /login
  ├── courses/
  │   ├── index.vue        # /courses
  │   ├── [id].vue         # /courses/:id
  │   └── [id]/
  │       └── lessons/
  │           └── [lessonId].vue  # /courses/:id/lessons/:lessonId
  └── dashboard/
      ├── index.vue        # /dashboard
      └── profile.vue      # /dashboard/profile
  ```

#### `/plugins/`
- **Purpose**: Extend Vue app dengan plugins
- **Example**:
  ```typescript
  // plugins/api.ts
  export default defineNuxtPlugin(() => {
    const api = $fetch.create({
      baseURL: useRuntimeConfig().public.apiBase
    })
    return {
      provide: { api }
    }
  })
  ```

#### `/stores/`
- **Purpose**: Pinia state management stores
- **Organization**: One store per domain
- **Example**:
  ```typescript
  // stores/auth.ts
  export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const login = async (credentials) => { ... }
    return { user, login }
  })
  ```

#### `/utils/`
- **Purpose**: Pure utility functions
- **Example**: Date formatting, string manipulation, etc.

---

## ⚙️ `/apps/api` - Backend (Hono)

### Directory Structure
```
apps/api/
├── src/
│   ├── routes/          # API routes
│   ├── controllers/     # Route handlers
│   ├── services/        # Business logic
│   ├── middlewares/     # Middlewares
│   ├── utils/          # Utilities
│   ├── types/          # TypeScript types
│   └── index.ts        # Entry point
├── prisma/
│   ├── schema.prisma   # Database schema
│   ├── migrations/     # Database migrations
│   └── seed.ts        # Database seeding
├── package.json
└── tsconfig.json
```

### Penjelasan Detail

#### `/src/routes/`
- **Purpose**: API route definitions
- **Organization**: Group by resource
- **Example**:
  ```
  routes/
  ├── auth.routes.ts      # /api/auth/*
  ├── courses.routes.ts   # /api/courses/*
  ├── users.routes.ts     # /api/users/*
  └── index.ts           # Combine all routes
  ```

#### `/src/controllers/`
- **Purpose**: Handle requests dan responses
- **Responsibility**: Validate input, call services, return response
- **Example**:
  ```typescript
  // controllers/course.controller.ts
  export const getCourses = async (c: Context) => {
    const courses = await courseService.getAll()
    return c.json({ success: true, data: courses })
  }
  ```

#### `/src/services/`
- **Purpose**: Business logic layer
- **Responsibility**: Database operations, external API calls, business rules
- **Example**:
  ```typescript
  // services/course.service.ts
  export const courseService = {
    async getAll() {
      return await prisma.course.findMany()
    },
    async create(data) {
      return await prisma.course.create({ data })
    }
  }
  ```

#### `/src/middlewares/`
- **Purpose**: Request processing middleware
- **Types**:
  - Authentication
  - Authorization
  - Validation
  - Error handling
  - Logging
- **Example**:
  ```typescript
  // middlewares/auth.middleware.ts
  export const authMiddleware = async (c: Context, next) => {
    const token = c.req.header('Authorization')
    // Verify token...
    await next()
  }
  ```

#### `/prisma/`
- **Purpose**: Database configuration dan migrations
- **Files**:
  - `schema.prisma`: Database schema definition
  - `seed.ts`: Initial data seeding
- **Commands**:
  - `pnpm db:generate`: Generate Prisma Client
  - `pnpm db:migrate`: Run migrations
  - `pnpm db:studio`: Open Prisma Studio

---

## 📦 `/packages/shared` - Shared Code

### Directory Structure
```
packages/shared/
└── src/
    ├── types/         # Shared TypeScript types
    ├── schemas/       # Zod validation schemas
    ├── constants/     # Constants & enums
    ├── utils/         # Utility functions
    └── index.ts       # Export barrel
```

### Penjelasan Detail

#### `/src/types/`
- **Purpose**: TypeScript types/interfaces shared antara frontend & backend
- **Example**:
  ```typescript
  export interface User {
    id: string
    email: string
    username: string
  }

  export enum UserRole {
    STUDENT = 'STUDENT',
    INSTRUCTOR = 'INSTRUCTOR'
  }
  ```

#### `/src/schemas/`
- **Purpose**: Zod schemas untuk validation
- **Usage**: Digunakan untuk validate input di frontend & backend
- **Example**:
  ```typescript
  export const userRegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
  })
  ```

#### `/src/constants/`
- **Purpose**: Shared constants
- **Example**: API endpoints, limits, cache keys
- **Example**:
  ```typescript
  export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register'
    }
  }
  ```

#### `/src/utils/`
- **Purpose**: Pure utility functions
- **Example**: Slug generation, date formatting, calculations
- **Example**:
  ```typescript
  export function generateSlug(text: string): string {
    return text.toLowerCase().replace(/\s+/g, '-')
  }
  ```

---

## 🎨 `/packages/ui` - Shared UI Components

### Directory Structure
```
packages/ui/
└── src/
    ├── components/    # Reusable UI components
    └── index.ts       # Export barrel
```

### Purpose
- Komponen UI yang bisa digunakan di multiple apps
- Komponen yang tidak terikat dengan business logic
- Design system components

---

## 🔧 Configuration Files

### Root Level

#### `package.json`
- Root package manager
- Contains monorepo scripts
- DevDependencies yang shared

#### `pnpm-workspace.yaml`
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```
- Defines workspace packages

#### `.npmrc`
```
shamefully-hoist=true
strict-peer-dependencies=false
auto-install-peers=true
```
- PNPM configuration

#### `.env.example`
- Template untuk environment variables
- **NEVER** commit `.env` file

#### `.eslintrc.json`
- ESLint configuration
- Shared linting rules

#### `.prettierrc.json`
- Prettier configuration
- Code formatting rules

#### `.gitignore`
- Files/folders to ignore in git

---

## 🎯 Best Practices

### 1. **Naming Conventions**
- Components: PascalCase (`CourseCard.vue`)
- Composables: camelCase with `use` prefix (`useAuth.ts`)
- Stores: camelCase (`authStore.ts`)
- Utils: camelCase (`formatDate.ts`)
- Constants: UPPER_SNAKE_CASE (`API_ENDPOINTS`)

### 2. **File Organization**
- Group by feature, not by type
- Keep related files together
- Use barrel exports (`index.ts`)

### 3. **Import Aliases**
```typescript
// ✅ Good
import { User } from '@shared/types'
import { Button } from '@ui/components'

// ❌ Bad
import { User } from '../../../packages/shared/src/types'
```

### 4. **Component Structure**
```vue
<script setup lang="ts">
// 1. Imports
// 2. Props & Emits
// 3. Composables
// 4. Refs & Reactive
// 5. Computed
// 6. Functions
// 7. Lifecycle hooks
</script>

<template>
  <!-- Template -->
</template>

<style scoped>
/* Styles - prefer Tailwind */
</style>
```

### 5. **API Structure**
```
Route → Controller → Service → Database
```

---

## 📚 Additional Resources

- [Nuxt 3 Documentation](https://nuxt.com)
- [Hono Documentation](https://hono.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Pinia Documentation](https://pinia.vuejs.org)
- [shadcn-vue Documentation](https://www.shadcn-vue.com)
