# 📚 Micro Learning Platform - Frontend

Modern Vue 3 + TypeScript frontend with professional design system.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Run development server:**
```bash
npm run dev
```

3. **Open browser:**
Navigate to `http://localhost:3000`

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Type Checking
npm run type-check   # Run TypeScript type checking
```

## 🎨 Design System

Comprehensive design system with:
- ✨ Glassmorphism effects
- 🎬 30+ smooth animations
- 🌓 Dark mode support
- 📱 Fully responsive
- ♿ Accessible (WCAG compliant)

See **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** for complete documentation.

## 🧩 Components

30+ ready-to-use components:

**Navigation:**
- AppSidebar, AppHeader, AppBreadcrumb

**Cards:**
- BaseCard, CourseCard, StatsCard

**Forms:**
- BaseInput, BaseButton

**Data Display:**
- ProgressBar, DataTable

**Feedback:**
- BaseModal, ToastContainer, LoadingSpinner, EmptyState

## 📁 Project Structure

```
frontend/
├── src/
│   ├── assets/
│   │   └── styles/        # Global styles, variables, animations
│   ├── components/
│   │   └── ui/            # 14 UI components
│   ├── composables/       # Vue composables (useTheme, useToast)
│   ├── layouts/           # Layout components
│   ├── router/            # Vue Router config
│   ├── types/             # TypeScript type definitions
│   ├── views/             # Page components
│   ├── App.vue
│   └── main.ts
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 🎯 Features

### Design Trends 2025
- **Glassmorphism** - Frosted glass effects
- **Smooth Animations** - 60fps micro-animations
- **Dark Mode** - Auto-detect system preference
- **Gradient Accents** - Modern gradients
- **Large Typography** - Readable, accessible
- **Generous Spacing** - Clean layouts

### Developer Experience
- ✅ Full TypeScript support
- ✅ Auto-import components
- ✅ Hot Module Replacement
- ✅ Type-safe routing
- ✅ Composable utilities

### Performance
- ⚡ Vite for lightning-fast builds
- 📦 Optimized bundle size
- 🎨 GPU-accelerated animations
- 🔄 Lazy-loaded routes
- 🌲 Tree-shakeable components

## 🎨 Usage Examples

### Using Components
```vue
<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
</script>

<template>
  <BaseCard variant="glass">
    <h2>Welcome</h2>
    <BaseButton variant="primary">Get Started</BaseButton>
  </BaseCard>
</template>
```

### Dark Mode
```typescript
import { useTheme } from '@/composables/useTheme';

const { toggleTheme, isDark } = useTheme();
```

### Toast Notifications
```typescript
import { useToast } from '@/composables/useToast';

const { success, error } = useToast();

success('Operation successful!');
error('Something went wrong');
```

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

### Vite Config
Edit `vite.config.ts` for build and dev server settings.

### TypeScript
See `tsconfig.json` and `tsconfig.app.json` for TypeScript configuration.

## 📚 Documentation

- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Complete design system guide
- **[README_DESIGN_IMPLEMENTATION.md](./README_DESIGN_IMPLEMENTATION.md)** - Implementation summary

## 🛠️ Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type safety
- **Vite** - Next-generation frontend tooling
- **Vue Router** - Official routing
- **Pinia** - State management
- **CSS3** - Modern styling with variables

## 🎯 Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## 📝 License

This project is part of the Micro Learning Platform.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📧 Support

For questions and support, please open an issue.

---

Made with ❤️ using Vue 3 + TypeScript
