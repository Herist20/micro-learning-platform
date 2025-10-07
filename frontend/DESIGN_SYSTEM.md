# 🎨 Micro Learning Platform - Design System

## Overview

Modern design system following 2025 trends with glassmorphism, smooth micro-animations, and comprehensive UI components.

## 🎯 Design Principles

### Visual Trends 2025
- **Glassmorphism** - Frosted glass effects for cards and modals
- **Smooth Micro-animations** - Subtle transitions and hover effects
- **Neumorphism** (Subtle) - Soft shadows for elevated elements
- **Dark Mode** - True black (#000000) with deep navy accents
- **Gradient Accents** - Vibrant gradients for CTAs and highlights
- **Large Typography** - 16px minimum for readability
- **Generous Spacing** - Breathable layouts with whitespace
- **Floating Actions** - Quick access buttons

## 🎨 Color Palette

### Primary Colors
```css
--color-primary: #6366F1      /* Indigo */
--color-primary-start: #6366F1
--color-primary-end: #8B5CF6   /* Purple */
```

### Semantic Colors
```css
--color-success: #10B981       /* Emerald Green */
--color-warning: #F59E0B       /* Amber */
--color-danger: #EF4444        /* Red */
--color-info: #3B82F6          /* Blue */
```

### Neutral Colors
```css
--color-gray-50 to --color-gray-900
--color-white: #FFFFFF
--color-black: #000000
```

### Dark Mode Theme
Dark mode uses true black backgrounds with adjusted colors for optimal contrast.

## 📐 Typography

### Font Stack
- **Base**: Inter, system fonts
- **Display**: Inter
- **Monospace**: JetBrains Mono, Fira Code

### Font Sizes
```css
--font-size-xs: 0.75rem     /* 12px */
--font-size-sm: 0.875rem    /* 14px */
--font-size-base: 1rem      /* 16px */
--font-size-lg: 1.125rem    /* 18px */
--font-size-xl: 1.25rem     /* 20px */
--font-size-2xl: 1.5rem     /* 24px */
--font-size-3xl: 1.875rem   /* 30px */
--font-size-4xl: 2.25rem    /* 36px */
--font-size-5xl: 3rem       /* 48px */
```

## 🧩 Components

### Navigation Components

#### AppSidebar
Responsive sidebar with collapse animation.

**Props:**
- `items: NavItem[]` - Navigation items
- `collapsed?: boolean` - Collapsed state
- `collapsible?: boolean` - Enable collapse toggle

**Features:**
- Hierarchical navigation with children
- Badge support
- Icon support
- Smooth collapse animation

#### AppHeader
Top header with glassmorphism effect.

**Props:**
- `user?: User` - Current user info
- `notificationCount?: number` - Notification badge count
- `showMenuButton?: boolean` - Show mobile menu button

**Slots:**
- `left` - Left section content
- `center` - Center section content
- `right` - Right section content

#### AppBreadcrumb
Navigation breadcrumb trail.

**Props:**
- `items: BreadcrumbItem[]` - Breadcrumb items
- `separator?: string` - Separator character (default: '/')

### Card Components

#### BaseCard
Flexible card with multiple variants.

**Props:**
- `variant?: 'default' | 'glass' | 'neumorphic' | 'elevated'`
- `padding?: Size`
- `hoverable?: boolean`
- `clickable?: boolean`
- `loading?: boolean`

**Slots:**
- `header` - Card header
- `default` - Card body
- `footer` - Card footer

#### CourseCard
Specialized card for courses.

**Props:**
- `id: string | number`
- `title: string`
- `description?: string`
- `thumbnail?: string`
- `progress?: number`
- `instructor?: string`
- `duration?: string`
- `lessons?: number`
- `rating?: number`
- `students?: number`
- `price?: number`
- `isFree?: boolean`
- `tags?: string[]`
- `variant?: 'default' | 'compact' | 'detailed'`

#### StatsCard
Card for displaying statistics with trend indicators.

**Props:**
- `title: string`
- `value: string | number`
- `icon?: string`
- `iconVariant?: Variant`
- `trend?: { value: number; label: string; isPositive?: boolean }`
- `loading?: boolean`

### Form Components

#### BaseInput
Input field with floating label.

**Props:**
- `modelValue?: string | number`
- `type?: InputType`
- `label?: string`
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `required?: boolean`
- `error?: string`
- `hint?: string`
- `icon?: string`
- `iconPosition?: 'left' | 'right'`
- `size?: Size`
- `clearable?: boolean`

**Features:**
- Floating label animation
- Icon support (left/right)
- Clear button
- Error/hint messages
- Accessibility support

#### BaseButton
Versatile button component.

**Props:**
- `variant?: Variant`
- `size?: Size`
- `type?: ButtonType`
- `disabled?: boolean`
- `loading?: boolean`
- `icon?: string`
- `iconPosition?: 'left' | 'right'`
- `fullWidth?: boolean`
- `rounded?: boolean`

**Variants:**
- `primary` - Gradient primary button
- `secondary` - Secondary style
- `success` - Success gradient
- `warning` - Warning gradient
- `danger` - Danger gradient
- `info` - Info gradient
- `ghost` - Transparent button
- `outline` - Outlined button

### Data Display Components

#### ProgressBar
Linear or circular progress indicator.

**Props:**
- `value: number`
- `max?: number`
- `variant?: Variant`
- `size?: Size`
- `showLabel?: boolean`
- `indeterminate?: boolean`
- `circular?: boolean`

#### DataTable
Feature-rich data table.

**Props:**
- `columns: TableColumn[]`
- `data: any[]`
- `loading?: boolean`
- `selectable?: boolean`
- `hoverable?: boolean`
- `striped?: boolean`
- `bordered?: boolean`
- `pagination?: boolean`
- `pageSize?: number`

**Features:**
- Sorting
- Selection (single/multi)
- Pagination
- Loading states
- Empty states
- Custom formatters

### Feedback Components

#### BaseModal
Modal dialog with glassmorphism.

**Props:**
- `modelValue: boolean`
- `title?: string`
- `size?: Size`
- `persistent?: boolean`
- `closeOnEscape?: boolean`
- `closeOnBackdrop?: boolean`
- `showClose?: boolean`
- `fullscreen?: boolean`

**Slots:**
- `header` - Modal header
- `default` - Modal body
- `footer` - Modal footer

#### ToastContainer
Toast notification system.

**Usage:**
```typescript
import { useToast } from '@/composables/useToast';

const { success, error, warning, info } = useToast();

success('Operation completed!');
error('Something went wrong!');
warning('Please check your input');
info('Here's some information');
```

#### LoadingSpinner
Animated loading spinner.

**Props:**
- `size?: Size`
- `variant?: Variant`
- `text?: string`

#### EmptyState
Empty state placeholder.

**Props:**
- `icon?: string`
- `title: string`
- `description?: string`
- `actionLabel?: string`
- `onAction?: () => void`

## 🎭 Animations

### CSS Classes

**Fade Animations:**
- `.animate-fade-in`
- `.animate-fade-out`
- `.animate-fade-in-up`
- `.animate-fade-in-down`

**Slide Animations:**
- `.animate-slide-in-left`
- `.animate-slide-in-right`
- `.animate-slide-out-left`
- `.animate-slide-out-right`

**Scale Animations:**
- `.animate-scale-in`
- `.animate-scale-out`
- `.animate-bounce`
- `.animate-pulse`

**Rotate Animations:**
- `.animate-spin`
- `.animate-spin-slow`
- `.animate-spin-reverse`

**Other:**
- `.animate-shake`
- `.animate-shimmer`
- `.animate-glow`

### Hover Effects
- `.hover-lift` - Lift on hover
- `.hover-scale` - Scale on hover
- `.hover-glow` - Glow effect on hover
- `.hover-brightness` - Brightness increase on hover

### Transitions
- `.transition-fast` - 150ms transition
- `.transition-base` - 250ms transition
- `.transition-slow` - 350ms transition
- `.transition-bounce` - Bounce easing

### Vue Transitions
- `fade` - Simple fade
- `slide-fade` - Slide with fade
- `scale` - Scale animation
- `modal-backdrop` - Modal backdrop fade
- `modal-content` - Modal content animation
- `toast` - Toast slide in/out
- `collapse` - Collapse animation

### Stagger Animations
Use `.stagger-item` class on list items for sequential animation:
```vue
<div v-for="(item, i) in items" :key="i" class="stagger-item">
  {{ item }}
</div>
```

## 🌓 Dark Mode

### Usage
```typescript
import { useTheme } from '@/composables/useTheme';

const { theme, isDark, toggleTheme, setTheme } = useTheme();

// Toggle theme
toggleTheme();

// Set specific theme
setTheme('dark');
setTheme('light');
```

### Features
- Auto-detects system preference
- Persists to localStorage
- Smooth transitions
- Shared state across components

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Layout Variables
```css
--sidebar-width: 280px
--sidebar-collapsed-width: 80px
--header-height: 64px
--content-max-width: 1400px
```

## 🎨 Utility Classes

### Glassmorphism
```vue
<div class="glass">
  <!-- Glassmorphic element -->
</div>
```

### Neumorphism
```vue
<div class="neumorphic">
  <!-- Neumorphic element -->
</div>
```

### Gradients
- `.gradient-primary`
- `.gradient-success`
- `.gradient-warning`
- `.gradient-danger`
- `.gradient-rainbow`

### Text Colors
- `.text-primary`
- `.text-secondary`
- `.text-tertiary`
- `.text-success`
- `.text-warning`
- `.text-danger`
- `.text-info`

### Spacing
- `.m-0`, `.m-auto`
- `.mt-sm`, `.mt-md`, `.mt-lg`
- `.mb-sm`, `.mb-md`, `.mb-lg`
- `.p-sm`, `.p-md`, `.p-lg`

### Flexbox
- `.flex`, `.inline-flex`
- `.flex-row`, `.flex-col`
- `.items-center`, `.items-start`, `.items-end`
- `.justify-center`, `.justify-between`, `.justify-start`, `.justify-end`
- `.gap-xs`, `.gap-sm`, `.gap-md`, `.gap-lg`, `.gap-xl`

## 📦 File Structure

```
frontend/src/
├── assets/
│   └── styles/
│       ├── variables.css      # CSS variables & theme
│       ├── global.css         # Global styles & utilities
│       └── animations.css     # Animation utilities
├── components/
│   └── ui/
│       ├── AppSidebar.vue
│       ├── AppHeader.vue
│       ├── AppBreadcrumb.vue
│       ├── BaseCard.vue
│       ├── CourseCard.vue
│       ├── StatsCard.vue
│       ├── BaseInput.vue
│       ├── BaseButton.vue
│       ├── ProgressBar.vue
│       ├── DataTable.vue
│       ├── BaseModal.vue
│       ├── ToastContainer.vue
│       ├── LoadingSpinner.vue
│       └── EmptyState.vue
├── composables/
│   ├── useTheme.ts           # Dark mode composable
│   └── useToast.ts           # Toast notifications
├── layouts/
│   └── MainLayout.vue        # Main app layout
├── types/
│   └── ui.ts                 # TypeScript type definitions
└── views/
    ├── DashboardView.vue
    ├── CoursesView.vue
    └── CourseDetailView.vue
```

## 🚀 Usage Examples

### Basic Page Setup
```vue
<template>
  <div class="page">
    <AppBreadcrumb :items="breadcrumbs" />

    <div class="page__header">
      <h1 class="page__title">Page Title</h1>
      <BaseButton variant="primary" @click="handleAction">
        Action
      </BaseButton>
    </div>

    <BaseCard variant="glass">
      <!-- Your content -->
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

const breadcrumbs = ref([
  { label: 'Home', to: '/', icon: '🏠' },
  { label: 'Current Page', to: '/current' },
]);
</script>

<style scoped>
.page {
  padding: var(--spacing-lg);
  max-width: var(--content-max-width);
  margin: 0 auto;
}

.page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}
</style>
```

### Using Toast Notifications
```typescript
import { useToast } from '@/composables/useToast';

const toast = useToast();

// Simple messages
toast.success('Operation successful!');
toast.error('An error occurred');
toast.warning('Warning message');
toast.info('Information message');

// Advanced options
toast.show({
  title: 'Success',
  message: 'Your changes have been saved',
  variant: 'success',
  duration: 5000,
  closeable: true,
  icon: '✅',
});
```

### Using Modals
```vue
<template>
  <BaseButton @click="showModal = true">
    Open Modal
  </BaseButton>

  <BaseModal
    v-model="showModal"
    title="Modal Title"
    size="md"
  >
    <p>Modal content goes here</p>

    <template #footer>
      <BaseButton variant="ghost" @click="showModal = false">
        Cancel
      </BaseButton>
      <BaseButton variant="primary" @click="handleConfirm">
        Confirm
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showModal = ref(false);
</script>
```

## 🎯 Best Practices

1. **Use Design Tokens**: Always use CSS variables instead of hardcoded values
2. **Component Composition**: Build complex UIs by composing base components
3. **Accessibility**: All components include ARIA attributes and keyboard navigation
4. **Performance**: Components use CSS transforms for animations (GPU-accelerated)
5. **Responsive**: Mobile-first approach with responsive utilities
6. **Type Safety**: All components have TypeScript definitions
7. **Dark Mode**: Test all designs in both light and dark modes

## 📝 Notes

- All animations use `will-change` for better performance
- Glassmorphism requires `backdrop-filter` support (modern browsers)
- Components are tree-shakeable for optimal bundle size
- All colors meet WCAG contrast requirements
- Icons are emoji-based (can be replaced with icon libraries)

## 🔄 Next Steps

To integrate chart libraries:

1. **Chart.js**
```bash
npm install chart.js vue-chartjs
```

2. **Apache ECharts**
```bash
npm install echarts vue-echarts
```

Add rich text editor:
```bash
npm install @tiptap/vue-3 @tiptap/starter-kit
```

Add file upload with preview:
```bash
npm install vue-dropzone
```
