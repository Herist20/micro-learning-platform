<template>
  <div
    :class="[
      'card',
      `card--${variant}`,
      `card--padding-${padding}`,
      {
        'card--hoverable': hoverable,
        'card--clickable': clickable,
        'card--loading': loading,
      },
    ]"
    @click="handleClick"
  >
    <div v-if="loading" class="card__loading-overlay">
      <div class="card__spinner"></div>
    </div>

    <div v-if="$slots.header" class="card__header">
      <slot name="header"></slot>
    </div>

    <div class="card__body">
      <slot></slot>
    </div>

    <div v-if="$slots.footer" class="card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CardProps } from '@/types/ui';

const props = withDefaults(defineProps<CardProps>(), {
  variant: 'default',
  padding: 'md',
  hoverable: false,
  clickable: false,
  loading: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  if (props.clickable && !props.loading) {
    emit('click', event);
  }
};
</script>

<style scoped>
.card {
  position: relative;
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  overflow: hidden;
}

/* Variants */
.card--default {
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.card--glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px 0 var(--glass-shadow);
}

.card--neumorphic {
  background: var(--bg-elevated);
  box-shadow: var(--neu-shadow-light), var(--neu-shadow-dark);
  border: none;
}

.card--elevated {
  background: var(--bg-elevated);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
}

/* Padding */
.card--padding-xs { padding: var(--spacing-xs); }
.card--padding-sm { padding: var(--spacing-sm); }
.card--padding-md { padding: var(--spacing-md); }
.card--padding-lg { padding: var(--spacing-lg); }
.card--padding-xl { padding: var(--spacing-xl); }

/* States */
.card--hoverable:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.card--clickable {
  cursor: pointer;
}

.card--clickable:active {
  transform: scale(0.98);
}

.card--loading {
  pointer-events: none;
}

/* Sections */
.card__header {
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: var(--spacing-md);
}

.card__body {
  flex: 1;
}

.card__footer {
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
  margin-top: var(--spacing-md);
}

/* Loading */
.card__loading-overlay {
  position: absolute;
  inset: 0;
  background: var(--bg-overlay);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.card__spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-primary-200);
  border-top-color: var(--color-primary);
  border-radius: var(--radius-full);
  animation: spin 0.8s linear infinite;
}
</style>
