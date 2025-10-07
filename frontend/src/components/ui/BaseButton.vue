<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      {
        'btn--loading': loading,
        'btn--full-width': fullWidth,
        'btn--rounded': rounded,
        'btn--icon-only': !$slots.default && (icon || loading),
      },
    ]"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <span v-if="loading" class="btn__spinner"></span>

    <!-- Left Icon -->
    <span v-if="icon && iconPosition === 'left' && !loading" class="btn__icon btn__icon--left">
      {{ icon }}
    </span>

    <!-- Content -->
    <span v-if="$slots.default" class="btn__content">
      <slot></slot>
    </span>

    <!-- Right Icon -->
    <span v-if="icon && iconPosition === 'right' && !loading" class="btn__icon btn__icon--right">
      {{ icon }}
    </span>
  </button>
</template>

<script setup lang="ts">
import type { ButtonProps } from '@/types/ui';

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  iconPosition: 'left',
  disabled: false,
  loading: false,
  fullWidth: false,
  rounded: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<style scoped>
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  user-select: none;
}

.btn:active:not(:disabled) {
  transform: scale(0.97);
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Sizes */
.btn--xs {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
  border-radius: var(--radius-sm);
}

.btn--sm {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-md);
}

.btn--md {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-base);
  border-radius: var(--radius-md);
}

.btn--lg {
  padding: var(--spacing-lg) var(--spacing-xl);
  font-size: var(--font-size-lg);
  border-radius: var(--radius-lg);
}

.btn--xl {
  padding: var(--spacing-xl) var(--spacing-2xl);
  font-size: var(--font-size-xl);
  border-radius: var(--radius-xl);
}

/* Variants */
.btn--primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-md);
}

.btn--primary:hover:not(:disabled) {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.btn--secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.btn--secondary:hover:not(:disabled) {
  background: var(--bg-elevated);
  border-color: var(--border-color-hover);
}

.btn--success {
  background: var(--gradient-success);
  color: white;
  box-shadow: var(--shadow-md);
}

.btn--success:hover:not(:disabled) {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.btn--warning {
  background: var(--gradient-warning);
  color: white;
  box-shadow: var(--shadow-md);
}

.btn--warning:hover:not(:disabled) {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.btn--danger {
  background: var(--gradient-danger);
  color: white;
  box-shadow: var(--shadow-md);
}

.btn--danger:hover:not(:disabled) {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.btn--info {
  background: linear-gradient(135deg, var(--color-info) 0%, var(--color-info-dark) 100%);
  color: white;
  box-shadow: var(--shadow-md);
}

.btn--info:hover:not(:disabled) {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.btn--ghost {
  background: transparent;
  color: var(--text-primary);
}

.btn--ghost:hover:not(:disabled) {
  background: var(--bg-tertiary);
}

.btn--outline {
  background: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn--outline:hover:not(:disabled) {
  background: var(--color-primary);
  color: white;
}

/* States */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--loading {
  pointer-events: none;
}

/* Modifiers */
.btn--full-width {
  width: 100%;
}

.btn--rounded {
  border-radius: var(--radius-full);
}

.btn--icon-only {
  padding: var(--spacing-md);
  aspect-ratio: 1;
}

.btn--icon-only.btn--xs {
  padding: var(--spacing-xs);
}

.btn--icon-only.btn--sm {
  padding: var(--spacing-sm);
}

.btn--icon-only.btn--lg {
  padding: var(--spacing-lg);
}

.btn--icon-only.btn--xl {
  padding: var(--spacing-xl);
}

/* Elements */
.btn__spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: var(--radius-full);
  animation: spin 0.6s linear infinite;
}

.btn__icon {
  display: inline-flex;
  font-size: 1.25em;
}

.btn__content {
  display: inline-flex;
}
</style>
