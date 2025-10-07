<template>
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <ol class="breadcrumb__list">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="breadcrumb__item"
      >
        <router-link
          v-if="item.to && !item.disabled"
          :to="item.to"
          :class="['breadcrumb__link', { 'breadcrumb__link--active': index === items.length - 1 }]"
        >
          <span v-if="item.icon" class="breadcrumb__icon">{{ item.icon }}</span>
          <span class="breadcrumb__label">{{ item.label }}</span>
        </router-link>

        <span
          v-else
          :class="['breadcrumb__text', { 'breadcrumb__text--disabled': item.disabled }]"
        >
          <span v-if="item.icon" class="breadcrumb__icon">{{ item.icon }}</span>
          <span class="breadcrumb__label">{{ item.label }}</span>
        </span>

        <span
          v-if="index < items.length - 1"
          class="breadcrumb__separator"
        >
          {{ separator }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import type { BreadcrumbProps } from '@/types/ui';

withDefaults(defineProps<BreadcrumbProps>(), {
  separator: '/',
});
</script>

<style scoped>
.breadcrumb {
  padding: var(--spacing-md) 0;
}

.breadcrumb__list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  list-style: none;
  padding: 0;
  margin: 0;
}

.breadcrumb__item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.breadcrumb__link,
.breadcrumb__text {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.breadcrumb__link {
  color: var(--text-secondary);
}

.breadcrumb__link:hover {
  color: var(--color-primary);
}

.breadcrumb__link--active {
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
  pointer-events: none;
}

.breadcrumb__text {
  color: var(--text-primary);
}

.breadcrumb__text--disabled {
  color: var(--text-tertiary);
  opacity: 0.6;
}

.breadcrumb__icon {
  font-size: 1rem;
}

.breadcrumb__separator {
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
  user-select: none;
}
</style>
