<template>
  <div :class="['spinner', `spinner--${size}`, `spinner--${variant}`]">
    <div class="spinner__circle"></div>
    <p v-if="text" class="spinner__text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Size, Variant } from '@/types/ui';

interface LoadingSpinnerProps {
  size?: Size;
  variant?: Variant;
  text?: string;
}

withDefaults(defineProps<LoadingSpinnerProps>(), {
  size: 'md',
  variant: 'primary',
});
</script>

<style scoped>
.spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
}

.spinner__circle {
  border-radius: var(--radius-full);
  border: 3px solid transparent;
  border-top-color: currentColor;
  animation: spin 0.8s linear infinite;
}

/* Sizes */
.spinner--xs .spinner__circle {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

.spinner--sm .spinner__circle {
  width: 24px;
  height: 24px;
  border-width: 2px;
}

.spinner--md .spinner__circle {
  width: 40px;
  height: 40px;
  border-width: 3px;
}

.spinner--lg .spinner__circle {
  width: 56px;
  height: 56px;
  border-width: 4px;
}

.spinner--xl .spinner__circle {
  width: 72px;
  height: 72px;
  border-width: 5px;
}

/* Variants */
.spinner--primary {
  color: var(--color-primary);
}

.spinner--secondary {
  color: var(--text-secondary);
}

.spinner--success {
  color: var(--color-success);
}

.spinner--warning {
  color: var(--color-warning);
}

.spinner--danger {
  color: var(--color-danger);
}

.spinner--info {
  color: var(--color-info);
}

.spinner__text {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>
