<template>
  <BaseCard variant="glass" hoverable class="stats-card">
    <div v-if="loading" class="stats-card__skeleton">
      <div class="skeleton skeleton-avatar"></div>
      <div class="stats-card__skeleton-content">
        <div class="skeleton skeleton-text" style="width: 60%"></div>
        <div class="skeleton skeleton-text" style="width: 40%"></div>
      </div>
    </div>

    <div v-else class="stats-card__content">
      <!-- Icon -->
      <div :class="['stats-card__icon', `stats-card__icon--${iconVariant}`]">
        <span>{{ icon || '📊' }}</span>
      </div>

      <!-- Info -->
      <div class="stats-card__info">
        <h4 class="stats-card__title">{{ title }}</h4>
        <div class="stats-card__value">{{ formatValue(value) }}</div>

        <!-- Trend -->
        <div v-if="trend" :class="['stats-card__trend', trend.isPositive ? 'stats-card__trend--up' : 'stats-card__trend--down']">
          <span class="stats-card__trend-icon">{{ trend.isPositive ? '↑' : '↓' }}</span>
          <span class="stats-card__trend-value">{{ Math.abs(trend.value) }}%</span>
          <span class="stats-card__trend-label">{{ trend.label }}</span>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from './BaseCard.vue';
import type { StatsCardProps } from '@/types/ui';

const props = withDefaults(defineProps<StatsCardProps>(), {
  iconVariant: 'primary',
  loading: false,
});

const formatValue = (val: string | number): string => {
  if (typeof val === 'number') {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`;
    } else if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}K`;
    }
    return val.toLocaleString();
  }
  return val;
};
</script>

<style scoped>
.stats-card {
  padding: var(--spacing-lg);
}

.stats-card__content {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.stats-card__icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  flex-shrink: 0;
  transition: transform var(--transition-base);
}

.stats-card:hover .stats-card__icon {
  transform: scale(1.1);
}

.stats-card__icon--primary {
  background: var(--gradient-primary);
}

.stats-card__icon--success {
  background: var(--gradient-success);
}

.stats-card__icon--warning {
  background: var(--gradient-warning);
}

.stats-card__icon--danger {
  background: var(--gradient-danger);
}

.stats-card__icon--info {
  background: linear-gradient(135deg, var(--color-info) 0%, var(--color-info-dark) 100%);
}

.stats-card__info {
  flex: 1;
  min-width: 0;
}

.stats-card__title {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stats-card__value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: var(--spacing-sm);
}

.stats-card__trend {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
}

.stats-card__trend--up {
  background: var(--color-success-50);
  color: var(--color-success-dark);
}

.stats-card__trend--down {
  background: var(--color-danger-50);
  color: var(--color-danger-dark);
}

.stats-card__trend-icon {
  font-size: 1rem;
  font-weight: var(--font-weight-bold);
}

.stats-card__trend-value {
  font-weight: var(--font-weight-semibold);
}

.stats-card__trend-label {
  color: var(--text-secondary);
}

/* Skeleton */
.stats-card__skeleton {
  display: flex;
  gap: var(--spacing-md);
}

.stats-card__skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>
