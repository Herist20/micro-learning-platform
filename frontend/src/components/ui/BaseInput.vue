<template>
  <div :class="['input-wrapper', { 'input-wrapper--error': error, 'input-wrapper--disabled': disabled }]">
    <!-- Floating Label -->
    <div class="input-container">
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder || ' '"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :class="['input', `input--${size}`, { 'input--has-icon-left': icon && iconPosition === 'left', 'input--has-icon-right': icon && iconPosition === 'right' || clearable }]"
        @input="handleInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />

      <label v-if="label" class="input-label">{{ label }}</label>

      <!-- Left Icon -->
      <span v-if="icon && iconPosition === 'left'" class="input-icon input-icon--left">
        {{ icon }}
      </span>

      <!-- Right Icon / Clear Button -->
      <div v-if="icon && iconPosition === 'right' || clearable" class="input-icon input-icon--right">
        <button
          v-if="clearable && modelValue"
          type="button"
          class="input-clear"
          @click="handleClear"
          tabindex="-1"
        >
          ✕
        </button>
        <span v-else-if="icon">{{ icon }}</span>
      </div>
    </div>

    <!-- Hint / Error Message -->
    <transition name="fade">
      <p v-if="error" class="input-message input-message--error">{{ error }}</p>
      <p v-else-if="hint" class="input-message input-message--hint">{{ hint }}</p>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { InputProps } from '@/types/ui';

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  size: 'md',
  iconPosition: 'left',
  clearable: false,
  disabled: false,
  readonly: false,
  required: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  'clear': [];
}>();

const isFocused = ref(false);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', props.type === 'number' ? Number(target.value) : target.value);
};

const handleClear = () => {
  emit('update:modelValue', '');
  emit('clear');
};
</script>

<style scoped>
.input-wrapper {
  width: 100%;
}

.input-container {
  position: relative;
  width: 100%;
}

.input {
  width: 100%;
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
  font-family: var(--font-family-base);
  color: var(--text-primary);
  background: var(--bg-elevated);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  outline: none;
}

/* Floating Label Effect */
.input:focus ~ .input-label,
.input:not(:placeholder-shown) ~ .input-label {
  top: -10px;
  left: 12px;
  font-size: var(--font-size-xs);
  padding: 0 4px;
  background: var(--bg-elevated);
  color: var(--color-primary);
}

.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-200);
}

.input-label {
  position: absolute;
  top: 50%;
  left: var(--spacing-md);
  transform: translateY(-50%);
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  pointer-events: none;
  transition: all var(--transition-fast);
  background: transparent;
}

/* Sizes */
.input--xs {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
}

.input--sm {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
}

.input--md {
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
}

.input--lg {
  padding: var(--spacing-lg) var(--spacing-md);
  font-size: var(--font-size-lg);
}

.input--xl {
  padding: var(--spacing-xl) var(--spacing-lg);
  font-size: var(--font-size-xl);
}

/* Icon Padding */
.input--has-icon-left {
  padding-left: calc(var(--spacing-md) * 2 + 1.5rem);
}

.input--has-icon-right {
  padding-right: calc(var(--spacing-md) * 2 + 1.5rem);
}

/* Icons */
.input-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  color: var(--text-secondary);
  pointer-events: none;
}

.input-icon--left {
  left: var(--spacing-md);
}

.input-icon--right {
  right: var(--spacing-md);
}

.input-clear {
  background: transparent;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 1rem;
  pointer-events: all;
  transition: color var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-clear:hover {
  color: var(--text-primary);
}

/* States */
.input:disabled {
  background: var(--bg-secondary);
  cursor: not-allowed;
  opacity: 0.6;
}

.input-wrapper--error .input {
  border-color: var(--color-danger);
}

.input-wrapper--error .input:focus {
  box-shadow: 0 0 0 3px var(--color-danger-50);
}

.input-wrapper--error .input:focus ~ .input-label,
.input-wrapper--error .input:not(:placeholder-shown) ~ .input-label {
  color: var(--color-danger);
}

/* Messages */
.input-message {
  margin: var(--spacing-xs) 0 0;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
}

.input-message--error {
  color: var(--color-danger);
}

.input-message--hint {
  color: var(--text-secondary);
}
</style>
