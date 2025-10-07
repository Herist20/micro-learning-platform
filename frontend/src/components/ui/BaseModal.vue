<template>
  <teleport to="body">
    <transition name="modal-backdrop">
      <div
        v-if="modelValue"
        class="modal-backdrop"
        @click="handleBackdropClick"
      ></div>
    </transition>

    <transition name="modal-content">
      <div
        v-if="modelValue"
        :class="['modal', `modal--${size}`, { 'modal--fullscreen': fullscreen }]"
        role="dialog"
        aria-modal="true"
        @keydown.esc="handleEscape"
      >
        <div class="modal__container glass">
          <!-- Header -->
          <div v-if="title || showClose || $slots.header" class="modal__header">
            <slot name="header">
              <h3 class="modal__title">{{ title }}</h3>
            </slot>

            <button
              v-if="showClose"
              class="modal__close"
              @click="close"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <!-- Body -->
          <div class="modal__body">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="modal__footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue';
import type { ModalProps } from '@/types/ui';

const props = withDefaults(defineProps<ModalProps>(), {
  size: 'md',
  persistent: false,
  closeOnEscape: true,
  closeOnBackdrop: true,
  showClose: true,
  fullscreen: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'close': [];
}>();

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

const handleBackdropClick = () => {
  if (props.closeOnBackdrop && !props.persistent) {
    close();
  }
};

const handleEscape = (event: KeyboardEvent) => {
  if (props.closeOnEscape && !props.persistent) {
    close();
  }
};

// Prevent body scroll when modal is open
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: var(--bg-overlay);
  backdrop-filter: blur(4px);
  z-index: var(--z-modal-backdrop);
}

.modal {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  overflow-y: auto;
}

.modal__container {
  width: 100%;
  max-height: 90vh;
  background: var(--bg-elevated);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Sizes */
.modal--xs .modal__container {
  max-width: 400px;
}

.modal--sm .modal__container {
  max-width: 500px;
}

.modal--md .modal__container {
  max-width: 600px;
}

.modal--lg .modal__container {
  max-width: 800px;
}

.modal--xl .modal__container {
  max-width: 1000px;
}

.modal--fullscreen .modal__container {
  max-width: 100%;
  max-height: 100%;
  height: 100%;
  border-radius: 0;
}

/* Header */
.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.modal__title {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.modal__close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.modal__close:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

/* Body */
.modal__body {
  flex: 1;
  padding: var(--spacing-lg);
  overflow-y: auto;
}

/* Footer */
.modal__footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

@media (max-width: 768px) {
  .modal {
    padding: var(--spacing-md);
  }

  .modal__container {
    max-height: 95vh;
  }

  .modal--xs .modal__container,
  .modal--sm .modal__container,
  .modal--md .modal__container,
  .modal--lg .modal__container,
  .modal--xl .modal__container {
    max-width: 100%;
  }
}
</style>
