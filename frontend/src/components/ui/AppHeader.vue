<template>
  <header class="header glass">
    <!-- Left Section -->
    <div class="header__left">
      <button v-if="showMenuButton" class="header__menu-btn" @click="$emit('toggle-menu')">
        <span class="header__menu-icon">☰</span>
      </button>

      <slot name="left"></slot>
    </div>

    <!-- Center Section -->
    <div class="header__center">
      <slot name="center"></slot>
    </div>

    <!-- Right Section -->
    <div class="header__right">
      <slot name="right">
        <!-- Search -->
        <button class="header__icon-btn" title="Search" @click="$emit('search')">
          <span>🔍</span>
        </button>

        <!-- Notifications -->
        <div class="header__notifications">
          <button class="header__icon-btn" @click="showNotifications = !showNotifications">
            <span>🔔</span>
            <span v-if="notificationCount > 0" class="header__badge">{{ notificationCount }}</span>
          </button>

          <transition name="scale">
            <div v-if="showNotifications" class="header__dropdown" @click.stop>
              <div class="header__dropdown-header">
                <h4>Notifications</h4>
                <button class="text-sm text-primary">Mark all as read</button>
              </div>
              <div class="header__dropdown-content">
                <slot name="notifications">
                  <div class="header__empty-state">
                    <p>No new notifications</p>
                  </div>
                </slot>
              </div>
            </div>
          </transition>
        </div>

        <!-- Theme Toggle -->
        <button class="header__icon-btn" @click="toggleTheme" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          <span>{{ isDark ? '☀️' : '🌙' }}</span>
        </button>

        <!-- Profile -->
        <div class="header__profile">
          <button class="header__profile-btn" @click="showProfile = !showProfile">
            <img
              v-if="user?.avatar"
              :src="user.avatar"
              :alt="user.name"
              class="header__avatar"
            />
            <div v-else class="header__avatar-placeholder">
              {{ user?.name?.charAt(0).toUpperCase() || 'U' }}
            </div>
            <span class="header__profile-arrow">▼</span>
          </button>

          <transition name="scale">
            <div v-if="showProfile" class="header__dropdown header__dropdown--right" @click.stop>
              <div class="header__profile-info">
                <div class="header__profile-name">{{ user?.name || 'User' }}</div>
                <div class="header__profile-email">{{ user?.email || 'user@example.com' }}</div>
              </div>

              <div class="header__dropdown-divider"></div>

              <nav class="header__dropdown-nav">
                <router-link to="/profile" class="header__dropdown-item" @click="showProfile = false">
                  <span>👤</span>
                  <span>Profile</span>
                </router-link>
                <router-link to="/settings" class="header__dropdown-item" @click="showProfile = false">
                  <span>⚙️</span>
                  <span>Settings</span>
                </router-link>
                <router-link to="/help" class="header__dropdown-item" @click="showProfile = false">
                  <span>❓</span>
                  <span>Help</span>
                </router-link>

                <div class="header__dropdown-divider"></div>

                <button class="header__dropdown-item header__dropdown-item--danger" @click="handleLogout">
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </transition>
        </div>
      </slot>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useTheme } from '@/composables/useTheme';

interface User {
  name?: string;
  email?: string;
  avatar?: string;
}

interface HeaderProps {
  user?: User;
  notificationCount?: number;
  showMenuButton?: boolean;
}

const props = withDefaults(defineProps<HeaderProps>(), {
  notificationCount: 0,
  showMenuButton: false,
});

const emit = defineEmits<{
  'toggle-menu': [];
  'search': [];
  'logout': [];
}>();

const { isDark, toggleTheme } = useTheme();
const showNotifications = ref(false);
const showProfile = ref(false);

const handleLogout = () => {
  showProfile.value = false;
  emit('logout');
};

// Close dropdowns when clicking outside
const closeDropdowns = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.header__notifications') && !target.closest('.header__profile')) {
    showNotifications.value = false;
    showProfile.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdowns);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns);
});
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: var(--sidebar-width);
  right: 0;
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  z-index: var(--z-sticky);
  transition: left var(--transition-base);
}

.header__left,
.header__center,
.header__right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.header__left {
  flex: 1;
}

.header__center {
  flex: 2;
  justify-content: center;
}

.header__right {
  flex: 1;
  justify-content: flex-end;
}

.header__menu-btn {
  display: none;
  background: transparent;
  border: none;
  padding: var(--spacing-sm);
  cursor: pointer;
  color: var(--text-primary);
  font-size: 1.5rem;
}

.header__menu-btn:hover {
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
}

.header__icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 1.25rem;
  transition: background var(--transition-fast);
}

.header__icon-btn:hover {
  background: var(--bg-tertiary);
}

.header__badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: var(--color-danger);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header__notifications,
.header__profile {
  position: relative;
}

.header__profile-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: transparent;
  border: none;
  padding: var(--spacing-xs);
  cursor: pointer;
  border-radius: var(--radius-lg);
  transition: background var(--transition-fast);
}

.header__profile-btn:hover {
  background: var(--bg-tertiary);
}

.header__avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  object-fit: cover;
}

.header__avatar-placeholder {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
}

.header__profile-arrow {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.header__dropdown {
  position: absolute;
  top: calc(100% + var(--spacing-sm));
  left: 0;
  min-width: 320px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  z-index: var(--z-dropdown);
}

.header__dropdown--right {
  left: auto;
  right: 0;
}

.header__dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.header__dropdown-header h4 {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.header__dropdown-content {
  max-height: 400px;
  overflow-y: auto;
}

.header__empty-state {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--text-secondary);
}

.header__profile-info {
  padding: var(--spacing-md);
  background: var(--bg-tertiary);
}

.header__profile-name {
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.header__profile-email {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.header__dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: var(--spacing-sm) 0;
}

.header__dropdown-nav {
  padding: var(--spacing-sm);
}

.header__dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  color: var(--text-primary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
  background: transparent;
  border: none;
  width: 100%;
  cursor: pointer;
  font-size: var(--font-size-base);
}

.header__dropdown-item:hover {
  background: var(--bg-tertiary);
}

.header__dropdown-item--danger {
  color: var(--color-danger);
}

.header__dropdown-item--danger:hover {
  background: var(--color-danger-50);
}

@media (max-width: 768px) {
  .header {
    left: 0;
  }

  .header__menu-btn {
    display: block;
  }

  .header__dropdown {
    min-width: 280px;
  }
}
</style>
