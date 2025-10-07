import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
          title: 'Dashboard',
        },
      },
      {
        path: 'courses',
        name: 'Courses',
        component: () => import('@/views/CoursesView.vue'),
        meta: {
          title: 'All Courses',
        },
      },
      {
        path: 'courses/:id',
        name: 'CourseDetail',
        component: () => import('@/views/CourseDetailView.vue'),
        meta: {
          title: 'Course Details',
        },
      },
      {
        path: 'browse',
        name: 'Browse',
        component: () => import('@/views/CoursesView.vue'),
        meta: {
          title: 'Browse Courses',
        },
      },
      {
        path: 'calendar',
        name: 'Calendar',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
          title: 'Calendar',
        },
      },
      {
        path: 'messages',
        name: 'Messages',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
          title: 'Messages',
        },
      },
      {
        path: 'achievements',
        name: 'Achievements',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
          title: 'Achievements',
        },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
          title: 'Settings',
        },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
          title: 'Profile',
        },
      },
      {
        path: 'help',
        name: 'Help',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
          title: 'Help Center',
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/DashboardView.vue'),
    meta: {
      title: 'Login',
      layout: 'auth',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/DashboardView.vue'),
    meta: {
      title: '404 Not Found',
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Update page title based on route meta
router.beforeEach((to, from, next) => {
  const title = to.meta.title as string;
  if (title) {
    document.title = `${title} | MicroLearn`;
  } else {
    document.title = 'MicroLearn - Micro Learning Platform';
  }
  next();
});

export default router;
