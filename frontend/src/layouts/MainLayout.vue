<template>
  <div class="main-layout">
    <!-- Sidebar -->
    <AppSidebar
      :items="navItems"
      :collapsed="sidebarCollapsed"
      @update:collapsed="sidebarCollapsed = $event"
    >
      <template #logo>
        <div class="main-layout__logo">
          <span class="main-layout__logo-icon">📚</span>
          <span class="main-layout__logo-text">MicroLearn</span>
        </div>
      </template>

      <template #logo-icon>
        <span class="main-layout__logo-icon-only">📚</span>
      </template>
    </AppSidebar>

    <!-- Main Content Area -->
    <div :class="['main-layout__wrapper', { 'main-layout__wrapper--collapsed': sidebarCollapsed }]">
      <!-- Header -->
      <AppHeader
        :user="currentUser"
        :notificationCount="3"
        @toggle-menu="toggleMobileMenu"
        @logout="handleLogout"
      >
        <template #center>
          <!-- You can add search or other center content here -->
        </template>
      </AppHeader>

      <!-- Page Content -->
      <main class="main-layout__content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- Toast Container -->
    <ToastContainer position="top-right" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppSidebar from '@/components/ui/AppSidebar.vue';
import AppHeader from '@/components/ui/AppHeader.vue';
import ToastContainer from '@/components/ui/ToastContainer.vue';
import { useTheme } from '@/composables/useTheme';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const { initializeTheme } = useTheme();
const { info } = useToast();

const sidebarCollapsed = ref(false);
const mobileMenuOpen = ref(false);

const currentUser = ref({
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '',
});

const navItems = ref([
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: '📊',
  },
  {
    label: 'My Courses',
    to: '/courses',
    icon: '📚',
  },
  {
    label: 'Browse',
    to: '/browse',
    icon: '🔍',
  },
  {
    label: 'Calendar',
    to: '/calendar',
    icon: '📅',
  },
  { divider: true },
  {
    label: 'Messages',
    to: '/messages',
    icon: '💬',
    badge: '5',
    badgeVariant: 'danger' as const,
  },
  {
    label: 'Achievements',
    to: '/achievements',
    icon: '🏆',
  },
  { divider: true },
  {
    label: 'Settings',
    to: '/settings',
    icon: '⚙️',
  },
]);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const handleLogout = () => {
  info('Logging out...');
  // Add logout logic here
  router.push('/login');
};

onMounted(() => {
  initializeTheme();
});
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary);
}

.main-layout__logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.main-layout__logo-icon {
  font-size: 1.75rem;
}

.main-layout__logo-text {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  background: var(--gradient-primary);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.main-layout__logo-icon-only {
  font-size: 2rem;
}

.main-layout__wrapper {
  flex: 1;
  margin-left: var(--sidebar-width);
  transition: margin-left var(--transition-base);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-layout__wrapper--collapsed {
  margin-left: var(--sidebar-collapsed-width);
}

.main-layout__content {
  flex: 1;
  margin-top: var(--header-height);
  background: var(--bg-secondary);
  min-height: calc(100vh - var(--header-height));
}

@media (max-width: 768px) {
  .main-layout__wrapper {
    margin-left: 0;
  }
}
</style>
