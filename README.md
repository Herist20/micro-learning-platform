# Micro-Learning Platform

Platform pembelajaran mikro modern yang dibangun dengan Nuxt 3, Hono, dan PostgreSQL.

## 🚀 Tech Stack

### Frontend
- **Nuxt 3** - Framework Vue.js yang powerful
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Pinia** - State management
- **shadcn-vue** - Reusable component library
- **TailwindCSS** - Utility-first CSS framework

### Backend
- **Node.js** - JavaScript runtime
- **Hono** - Ultrafast web framework
- **PostgreSQL** - Relational database
- **Prisma ORM** - Next-generation ORM
- **Better Auth** - Modern authentication
- **Redis** - In-memory data store untuk caching
- **MinIO** - S3-compatible object storage

## 📁 Struktur Folder

```
micro-learning-platform/
├── apps/
│   ├── web/                    # Nuxt 3 Frontend Application
│   │   ├── assets/
│   │   │   └── css/           # Global styles & Tailwind
│   │   ├── components/        # Vue components
│   │   │   └── ui/           # shadcn-vue components
│   │   ├── composables/       # Vue composables
│   │   ├── layouts/           # Nuxt layouts
│   │   ├── lib/              # Library utilities
│   │   ├── middleware/        # Route middlewares
│   │   ├── pages/            # File-based routing
│   │   ├── plugins/          # Nuxt plugins
│   │   ├── public/           # Static assets
│   │   ├── stores/           # Pinia stores
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Utility functions
│   │   ├── app.vue           # Root component
│   │   ├── nuxt.config.ts    # Nuxt configuration
│   │   ├── tailwind.config.ts # Tailwind configuration
│   │   └── tsconfig.json     # TypeScript config
│   │
│   └── api/                   # Hono Backend API
│       ├── src/
│       │   ├── routes/       # API routes
│       │   ├── controllers/  # Route controllers
│       │   ├── services/     # Business logic
│       │   ├── middlewares/  # API middlewares
│       │   ├── utils/        # Utility functions
│       │   ├── types/        # TypeScript types
│       │   └── index.ts      # Entry point
│       ├── prisma/
│       │   ├── schema.prisma # Database schema
│       │   └── seed.ts       # Database seeding
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── shared/               # Shared code between apps
│   │   └── src/
│   │       ├── types/        # Shared TypeScript types
│   │       ├── schemas/      # Zod validation schemas
│   │       ├── constants/    # Shared constants
│   │       ├── utils/        # Shared utilities
│   │       └── index.ts
│   │
│   └── ui/                   # Shared UI components
│       └── src/
│           ├── components/   # Reusable components
│           └── index.ts
│
├── .env.example              # Environment variables template
├── .eslintrc.json           # ESLint configuration
├── .gitignore               # Git ignore rules
├── .npmrc                   # NPM configuration
├── .prettierrc.json         # Prettier configuration
├── package.json             # Root package.json
├── pnpm-workspace.yaml      # PNPM workspace config
└── README.md                # This file
```

## 🎯 Penjelasan Struktur

### `/apps/web` - Frontend Application
- **assets/css**: Global CSS dan konfigurasi Tailwind
- **components**: Komponen Vue yang reusable
- **components/ui**: Komponen dari shadcn-vue
- **composables**: Vue composables untuk logic yang reusable
- **layouts**: Layout templates untuk pages
- **lib**: Library utilities (seperti utils.ts untuk cn function)
- **middleware**: Route guards dan middleware
- **pages**: File-based routing pages
- **plugins**: Nuxt plugins untuk extend functionality
- **stores**: Pinia stores untuk state management
- **utils**: Helper functions

### `/apps/api` - Backend API
- **routes**: Definisi API routes
- **controllers**: Handler untuk routes
- **services**: Business logic layer
- **middlewares**: Authentication, validation, dll
- **utils**: Helper functions
- **prisma**: Database schema dan migrations

### `/packages/shared` - Shared Code
- **types**: TypeScript types/interfaces yang digunakan di frontend & backend
- **schemas**: Zod schemas untuk validasi
- **constants**: Konstanta seperti API endpoints, limits, dll
- **utils**: Utility functions yang shared

### `/packages/ui` - Shared UI Components
- **components**: Komponen UI yang bisa digunakan di berbagai apps

## 🛠️ Installation

1. **Clone repository**
   ```bash
   cd micro-learning-platform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env dengan konfigurasi Anda
   ```

4. **Setup database**
   ```bash
   # Generate Prisma client
   pnpm db:generate

   # Run migrations
   pnpm db:migrate

   # (Optional) Seed database
   pnpm db:seed
   ```

## 🚀 Development

### Run all services
```bash
pnpm dev
```

### Run specific service
```bash
# Frontend only
pnpm dev:web

# Backend only
pnpm dev:api
```

### Database commands
```bash
# Generate Prisma client
pnpm db:generate

# Create migration
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio

# Seed database
pnpm db:seed
```

## 🏗️ Build

```bash
# Build all apps
pnpm build

# Build specific app
pnpm build:web
pnpm build:api
```

## 📝 Code Quality

```bash
# Lint all code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check

# Type check
pnpm type-check
```

## 🎨 Design System

Project ini menggunakan design system modern dengan:
- **Color palette**: Primary (Blue), Secondary (Purple), Success, Warning, Destructive
- **Typography**: Inter font untuk UI, JetBrains Mono untuk code
- **Spacing**: Consistent spacing scale dari Tailwind
- **Dark mode**: Full dark mode support dengan CSS variables

## 🔑 Environment Variables

Lihat `.env.example` untuk daftar lengkap environment variables yang diperlukan.

### Required Variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key untuk JWT
- `REDIS_HOST`: Redis host
- `MINIO_*`: MinIO configuration
- `NUXT_PUBLIC_API_BASE`: Backend API URL

## 📚 Database Schema

Database schema mencakup:
- **Users**: User management dengan roles
- **Courses**: Course information
- **Modules & Lessons**: Course content structure
- **Enrollments**: User course enrollments
- **Progress**: Learning progress tracking
- **Quizzes & Questions**: Assessment system
- **Reviews**: Course reviews
- **Certificates**: Course completion certificates

## 🔐 Authentication

Menggunakan Better Auth dengan fitur:
- Email/Password authentication
- JWT-based sessions
- Role-based access control (RBAC)
- Email verification
- Password reset

## 📦 Scripts Reference

| Script | Description |
|--------|-------------|
| `pnpm dev` | Run all services in development mode |
| `pnpm dev:web` | Run frontend only |
| `pnpm dev:api` | Run backend only |
| `pnpm build` | Build all apps for production |
| `pnpm lint` | Lint all code |
| `pnpm lint:fix` | Fix linting issues |
| `pnpm format` | Format code with Prettier |
| `pnpm type-check` | Check TypeScript types |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm db:seed` | Seed database |
| `pnpm clean` | Clean all node_modules |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🎓 Next Steps

Setelah setup awal selesai, Anda bisa:
1. Menambahkan komponen shadcn-vue: `npx shadcn-vue@latest add button`
2. Membuat pages baru di `apps/web/pages/`
3. Menambahkan API routes di `apps/api/src/routes/`
4. Membuat shared types di `packages/shared/src/types/`
5. Setup MinIO dan Redis untuk storage dan caching

## 💡 Tips

- Gunakan `pnpm` untuk package management (lebih cepat dan efisien)
- Selalu run `pnpm type-check` sebelum commit
- Gunakan ESLint dan Prettier untuk code consistency
- Manfaatkan shared packages untuk avoid code duplication
- Ikuti naming conventions yang sudah ada
