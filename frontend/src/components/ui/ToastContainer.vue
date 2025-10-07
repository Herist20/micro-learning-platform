<template>
  <teleport to="body">
    <div :class="['toast-container', `toast-container--${position}`]">
      <transition-group name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast--${toast.variant || 'primary'}`]"
        >
          <!-- Icon -->
          <span class="toast__icon">
            {{ toast.icon || getDefaultIcon(toast.variant) }}
          </span>

          <!-- Content -->
          <div class="toast__content">
            <h4 v-if="toast.title" class="toast__title">{{ toast.title }}</h4>
            <p class="toast__message">{{ toast.message }}</p>
          </div>

          <!-- Close Button -->
          <button
            v-if="toast.closeable !== false"
            class="toast__close"
            @click="removeToast(toast.id)"
          >
            ✕
          </button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast';
import type { Variant, Position } from '@/types/ui';

interface ToastContainerProps {
  position?: Position;
}

const props = withDefaults(defineProps<ToastContainerProps>(), {
  position: 'top-right',
});

const { toasts, remove } = useToast();

const removeToast = (id: string) => {
  remove(id);
};

const getDefaultIcon = (variant?: Variant) => {
  const icons: Record<string, string> = {
    success: '✓',
    danger: '✕',
    warning: '⚠',
    info: 'ℹ',
    primary: '🔔',
  };
  return icons[variant || 'primary'] || '🔔';
};
</script>

<style scoped>
.toast-container {
  position: fixed;
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-width: 420px;
  width: 100%;
  pointer-events: none;
}

.toast-container--top-right {
  top: var(--spacing-lg);
  right: var(--spacing-lg);
}

.toast-container--top-left {
  top: var(--spacing-lg);
  left: var(--spacing-lg);
}

.toast-container--bottom-right {
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
}

.toast-container--bottom-left {
  bottom: var(--spacing-lg);
  left: var(--spacing-lg);
}

.toast-container--top {
  top: var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
}

.toast-container--bottom {
  bottom: var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--bg-elevated);
  border-left: 4px solid;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  pointer-events: auto;
  min-width: 300px;
}

.toast--primary {
  border-color: var(--color-primary);
}

.toast--success {
  border-color: var(--color-success);
}

.toast--danger {
  border-color: var(--color-danger);
}

.toast--warning {
  border-color: var(--color-warning);
}

.toast--info {
  border-color: var(--color-info);
}

.toast__icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.toast--primary .toast__icon {
  color: var(--color-primary);
}

.toast--success .toast__icon {
  color: var(--color-success);
}

.toast--danger .toast__icon {
  color: var(--color-danger);
}

.toast--warning .toast__icon {
  color: var(--color-warning);
}

.toast--info .toast__icon {
  color: var(--color-info);
}

.toast__content {
  flex: 1;
  min-width: 0;
}

.toast__title {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.toast__message {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-normal);
}

.toast__close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.toast__close:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

@media (max-width: 640px) {
  .toast-container {
    max-width: calc(100% - var(--spacing-md) * 2);
  }

  .toast {
    min-width: auto;
  }
}
</style>
