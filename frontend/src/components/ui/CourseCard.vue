<template>
  <BaseCard
    :variant="variant === 'compact' ? 'default' : 'glass'"
    hoverable
    clickable
    :class="['course-card', `course-card--${variant}`]"
    @click="handleClick"
  >
    <!-- Thumbnail -->
    <div class="course-card__thumbnail">
      <img
        v-if="thumbnail"
        :src="thumbnail"
        :alt="title"
        class="course-card__image"
      />
      <div v-else class="course-card__image-placeholder">
        <span class="course-card__placeholder-icon">📚</span>
      </div>

      <!-- Price Badge -->
      <div v-if="price !== undefined || isFree" class="course-card__price-badge">
        {{ isFree ? 'FREE' : `$${price}` }}
      </div>

      <!-- Progress Overlay (if progress exists) -->
      <div v-if="progress !== undefined" class="course-card__progress-overlay">
        <div class="course-card__progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="course-card__content">
      <!-- Tags -->
      <div v-if="tags && tags.length > 0" class="course-card__tags">
        <span v-for="tag in tags.slice(0, 3)" :key="tag" class="course-card__tag">
          {{ tag }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="course-card__title">{{ title }}</h3>

      <!-- Description (only in detailed variant) -->
      <p v-if="variant === 'detailed' && description" class="course-card__description">
        {{ description }}
      </p>

      <!-- Instructor -->
      <p v-if="instructor" class="course-card__instructor">
        <span class="course-card__instructor-icon">👨‍🏫</span>
        {{ instructor }}
      </p>

      <!-- Stats -->
      <div class="course-card__stats">
        <div v-if="duration" class="course-card__stat">
          <span class="course-card__stat-icon">⏱️</span>
          <span class="course-card__stat-value">{{ duration }}</span>
        </div>

        <div v-if="lessons" class="course-card__stat">
          <span class="course-card__stat-icon">📖</span>
          <span class="course-card__stat-value">{{ lessons }} lessons</span>
        </div>

        <div v-if="rating" class="course-card__stat">
          <span class="course-card__stat-icon">⭐</span>
          <span class="course-card__stat-value">{{ rating.toFixed(1) }}</span>
        </div>

        <div v-if="students" class="course-card__stat">
          <span class="course-card__stat-icon">👥</span>
          <span class="course-card__stat-value">{{ formatNumber(students) }}</span>
        </div>
      </div>

      <!-- Progress (if exists) -->
      <div v-if="progress !== undefined" class="course-card__progress-info">
        <span class="course-card__progress-text">{{ progress }}% Complete</span>
        <div class="course-card__progress-bar-container">
          <div
            class="course-card__progress-bar-fill"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseCard from './BaseCard.vue';
import type { CourseCardProps } from '@/types/ui';

const props = withDefaults(defineProps<CourseCardProps>(), {
  variant: 'default',
});

const emit = defineEmits<{
  click: [id: string | number];
}>();

const handleClick = () => {
  emit('click', props.id);
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};
</script>

<style scoped>
.course-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all var(--transition-base);
}

.course-card:hover {
  transform: translateY(-8px);
}

.course-card--compact {
  flex-direction: row;
}

.course-card--compact .course-card__thumbnail {
  width: 120px;
  flex-shrink: 0;
}

.course-card--compact .course-card__content {
  flex: 1;
}

/* Thumbnail */
.course-card__thumbnail {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  overflow: hidden;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  background: var(--bg-tertiary);
}

.course-card--compact .course-card__thumbnail {
  padding-top: 0;
  height: 100%;
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
}

.course-card__image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.course-card:hover .course-card__image {
  transform: scale(1.05);
}

.course-card__image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
}

.course-card__placeholder-icon {
  font-size: 3rem;
}

.course-card__price-badge {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--gradient-primary);
  color: white;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-md);
}

.course-card__progress-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(0, 0, 0, 0.3);
}

.course-card__progress-bar {
  height: 100%;
  background: var(--gradient-success);
  transition: width var(--transition-base);
}

/* Content */
.course-card__content {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  flex: 1;
}

.course-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.course-card__tag {
  padding: 0.25rem 0.5rem;
  background: var(--color-primary-50);
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-sm);
}

.course-card__title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  line-height: var(--line-height-tight);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-card__description {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-normal);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-card__instructor {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.course-card__instructor-icon {
  font-size: 1rem;
}

.course-card__stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--border-color);
  margin-top: auto;
}

.course-card__stat {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.course-card__stat-icon {
  font-size: 1rem;
}

.course-card__stat-value {
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.course-card__progress-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.course-card__progress-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-primary);
}

.course-card__progress-bar-container {
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.course-card__progress-bar-fill {
  height: 100%;
  background: var(--gradient-primary);
  transition: width var(--transition-base);
}
</style>
