<template>
  <aside
    :class="['sidebar', { 'sidebar--collapsed': collapsed }]"
    :style="{ width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)' }"
  >
    <!-- Logo Section -->
    <div class="sidebar__logo">
      <transition name="fade" mode="out-in">
        <div v-if="!collapsed" class="sidebar__logo-full">
          <slot name="logo">
            <h2 class="gradient-primary" style="background-clip: text; -webkit-background-clip: text; color: transparent;">
              MicroLearn
            </h2>
          </slot>
        </div>
        <div v-else class="sidebar__logo-icon">
          <slot name="logo-icon">
            <span class="text-2xl">📚</span>
          </slot>
        </div>
      </transition>
    </div>

    <!-- Navigation Items -->
    <nav class="sidebar__nav">
      <ul class="sidebar__nav-list">
        <template v-for="(item, index) in items" :key="index">
          <!-- Divider -->
          <li v-if="item.divider" class="sidebar__divider"></li>

          <!-- Nav Item -->
          <li v-else class="sidebar__nav-item">
            <router-link
              v-if="item.to"
              :to="item.to"
              :class="['sidebar__nav-link', { 'sidebar__nav-link--disabled': item.disabled }]"
              @click="handleItemClick(item)"
            >
              <span v-if="item.icon" class="sidebar__nav-icon">{{ item.icon }}</span>

              <transition name="fade">
                <span v-if="!collapsed" class="sidebar__nav-label">{{ item.label }}</span>
              </transition>

              <transition name="fade">
                <span v-if="!collapsed && item.badge" :class="['sidebar__nav-badge', `badge--${item.badgeVariant || 'primary'}`]">
                  {{ item.badge }}
                </span>
              </transition>
            </router-link>

            <!-- Item with children -->
            <div v-else>
              <button
                :class="['sidebar__nav-link', 'sidebar__nav-link--parent', { 'sidebar__nav-link--expanded': expandedItems.includes(index) }]"
                @click="toggleExpand(index)"
              >
                <span v-if="item.icon" class="sidebar__nav-icon">{{ item.icon }}</span>

                <transition name="fade">
                  <span v-if="!collapsed" class="sidebar__nav-label">{{ item.label }}</span>
                </transition>

                <transition name="fade">
                  <span v-if="!collapsed" class="sidebar__nav-arrow">
                    {{ expandedItems.includes(index) ? '▼' : '▶' }}
                  </span>
                </transition>
              </button>

              <!-- Children -->
              <transition name="collapse">
                <ul v-if="!collapsed && expandedItems.includes(index)" class="sidebar__nav-children">
                  <li v-for="(child, childIndex) in item.children" :key="childIndex" class="sidebar__nav-item">
                    <router-link
                      :to="child.to!"
                      class="sidebar__nav-link sidebar__nav-link--child"
                    >
                      <span v-if="child.icon" class="sidebar__nav-icon">{{ child.icon }}</span>
                      <span class="sidebar__nav-label">{{ child.label }}</span>
                    </router-link>
                  </li>
                </ul>
              </transition>
            </div>
          </li>
        </template>
      </ul>
    </nav>

    <!-- Toggle Button -->
    <button
      v-if="collapsible"
      class="sidebar__toggle"
      @click="toggleCollapse"
      :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
    >
      <span class="sidebar__toggle-icon">{{ collapsed ? '▶' : '◀' }}</span>
    </button>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { SidebarProps, NavItem } from '@/types/ui';

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsed: false,
  collapsible: true,
  width: 'var(--sidebar-width)',
  mobileBreakpoint: 768,
});

const emit = defineEmits<{
  'update:collapsed': [value: boolean];
  'item-click': [item: NavItem];
}>();

const collapsed = ref(props.collapsed);
const expandedItems = ref<number[]>([]);

const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
  emit('update:collapsed', collapsed.value);
};

const toggleExpand = (index: number) => {
  const idx = expandedItems.value.indexOf(index);
  if (idx > -1) {
    expandedItems.value.splice(idx, 1);
  } else {
    expandedItems.value.push(index);
  }
};

const handleItemClick = (item: NavItem) => {
  emit('item-click', item);
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  background: var(--bg-elevated);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: width var(--transition-base);
  z-index: var(--z-fixed);
  overflow: hidden;
}

.sidebar--collapsed {
  width: var(--sidebar-collapsed-width);
}

.sidebar__logo {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.sidebar__logo-full {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.sidebar__nav {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md) 0;
}

.sidebar__nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar__nav-item {
  margin-bottom: var(--spacing-xs);
}

.sidebar__nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  color: var(--text-secondary);
  text-decoration: none;
  border: none;
  background: transparent;
  width: 100%;
  transition: all var(--transition-fast);
  cursor: pointer;
  border-radius: var(--radius-md);
  margin: 0 var(--spacing-sm);
  width: calc(100% - var(--spacing-md));
}

.sidebar__nav-link:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.sidebar__nav-link.router-link-active {
  background: var(--gradient-primary);
  color: white;
  font-weight: var(--font-weight-semibold);
}

.sidebar__nav-link--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.sidebar__nav-link--parent {
  justify-content: space-between;
}

.sidebar__nav-link--child {
  padding-left: calc(var(--spacing-md) * 2 + var(--spacing-sm));
  font-size: var(--font-size-sm);
}

.sidebar__nav-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  width: 1.5rem;
  text-align: center;
}

.sidebar__nav-label {
  flex: 1;
  text-align: left;
  white-space: nowrap;
}

.sidebar__nav-badge {
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  background: var(--color-primary);
  color: white;
}

.badge--success {
  background: var(--color-success);
}

.badge--warning {
  background: var(--color-warning);
}

.badge--danger {
  background: var(--color-danger);
}

.sidebar__nav-arrow {
  font-size: 0.75rem;
  transition: transform var(--transition-fast);
}

.sidebar__nav-children {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar__divider {
  height: 1px;
  background: var(--border-color);
  margin: var(--spacing-md) var(--spacing-md);
}

.sidebar__toggle {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--text-secondary);
}

.sidebar__toggle:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.sidebar__toggle-icon {
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar--mobile-open {
    transform: translateX(0);
  }
}
</style>
