<template>
  <div class="empty-state">
    <div class="empty-state__icon">{{ icon || '📭' }}</div>
    <h3 class="empty-state__title">{{ title }}</h3>
    <p v-if="description" class="empty-state__description">{{ description }}</p>

    <BaseButton
      v-if="actionLabel && onAction"
      variant="primary"
      @click="onAction"
      class="empty-state__action"
    >
      {{ actionLabel }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseButton from './BaseButton.vue';
import type { EmptyStateProps } from '@/types/ui';

defineProps<EmptyStateProps>();
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl);
  text-align: center;
}

.empty-state__icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
  opacity: 0.6;
}

.empty-state__title {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.empty-state__description {
  margin: 0 0 var(--spacing-xl) 0;
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  max-width: 400px;
}

.empty-state__action {
  margin-top: var(--spacing-md);
}
</style>
