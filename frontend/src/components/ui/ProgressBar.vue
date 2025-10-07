<template>
  <div :class="['progress', `progress--${size}`, { 'progress--circular': circular }]">
    <!-- Linear Progress -->
    <template v-if="!circular">
      <div class="progress__track">
        <div
          :class="['progress__fill', `progress__fill--${variant}`, { 'progress__fill--indeterminate': indeterminate }]"
          :style="{ width: indeterminate ? '30%' : `${percentage}%` }"
        ></div>
      </div>

      <span v-if="showLabel && !indeterminate" class="progress__label">
        {{ percentage }}%
      </span>
    </template>

    <!-- Circular Progress -->
    <template v-else>
      <svg :class="['progress__circle', `progress__circle--${size}`]" viewBox="0 0 100 100">
        <!-- Background Circle -->
        <circle
          class="progress__circle-bg"
          cx="50"
          cy="50"
          :r="radius"
          fill="none"
          :stroke-width="strokeWidth"
        />

        <!-- Progress Circle -->
        <circle
          :class="['progress__circle-fill', `progress__circle-fill--${variant}`]"
          cx="50"
          cy="50"
          :r="radius"
          fill="none"
          :stroke-width="strokeWidth"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="indeterminate ? 0 : offset"
          :style="{ animation: indeterminate ? 'progress-circular 1.5s ease-in-out infinite' : 'none' }"
        />
      </svg>

      <span v-if="showLabel && !indeterminate" class="progress__label progress__label--circular">
        {{ percentage }}%
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ProgressProps } from '@/types/ui';

const props = withDefaults(defineProps<ProgressProps>(), {
  max: 100,
  variant: 'primary',
  size: 'md',
  showLabel: false,
  indeterminate: false,
  circular: false,
});

const percentage = computed(() => {
  return Math.min(Math.max((props.value / props.max) * 100, 0), 100);
});

const radius = computed(() => {
  const sizes = { xs: 40, sm: 42, md: 44, lg: 46, xl: 48 };
  return sizes[props.size] || sizes.md;
});

const strokeWidth = computed(() => {
  const widths = { xs: 4, sm: 5, md: 6, lg: 8, xl: 10 };
  return widths[props.size] || widths.md;
});

const circumference = computed(() => 2 * Math.PI * radius.value);

const offset = computed(() => {
  return circumference.value - (percentage.value / 100) * circumference.value;
});
</script>

<style scoped>
.progress {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.progress--circular {
  justify-content: center;
  width: fit-content;
}

/* Linear Progress */
.progress__track {
  flex: 1;
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress--xs .progress__track {
  height: 4px;
}

.progress--sm .progress__track {
  height: 6px;
}

.progress--lg .progress__track {
  height: 10px;
}

.progress--xl .progress__track {
  height: 12px;
}

.progress__fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width var(--transition-base) ease-out;
}

.progress__fill--indeterminate {
  animation: progressIndeterminate 1.5s ease-in-out infinite;
}

.progress__fill--primary {
  background: var(--gradient-primary);
}

.progress__fill--success {
  background: var(--gradient-success);
}

.progress__fill--warning {
  background: var(--gradient-warning);
}

.progress__fill--danger {
  background: var(--gradient-danger);
}

.progress__fill--info {
  background: linear-gradient(135deg, var(--color-info) 0%, var(--color-info-dark) 100%);
}

/* Circular Progress */
.progress__circle {
  transform: rotate(-90deg);
  overflow: visible;
}

.progress__circle--xs {
  width: 40px;
  height: 40px;
}

.progress__circle--sm {
  width: 60px;
  height: 60px;
}

.progress__circle--md {
  width: 80px;
  height: 80px;
}

.progress__circle--lg {
  width: 100px;
  height: 100px;
}

.progress__circle--xl {
  width: 120px;
  height: 120px;
}

.progress__circle-bg {
  stroke: var(--bg-tertiary);
}

.progress__circle-fill {
  transition: stroke-dashoffset var(--transition-base) ease-out;
  stroke-linecap: round;
}

.progress__circle-fill--primary {
  stroke: var(--color-primary);
}

.progress__circle-fill--success {
  stroke: var(--color-success);
}

.progress__circle-fill--warning {
  stroke: var(--color-warning);
}

.progress__circle-fill--danger {
  stroke: var(--color-danger);
}

.progress__circle-fill--info {
  stroke: var(--color-info);
}

/* Label */
.progress__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  white-space: nowrap;
  min-width: 3em;
  text-align: right;
}

.progress__label--circular {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: auto;
}

/* Indeterminate Circular Animation */
@keyframes progress-circular {
  0% {
    stroke-dasharray: 1, 300;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 150, 300;
    stroke-dashoffset: -100;
  }
  100% {
    stroke-dasharray: 150, 300;
    stroke-dashoffset: -260;
  }
}
</style>
