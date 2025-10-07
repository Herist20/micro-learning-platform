<template>
  <div class="course-detail">
    <!-- Breadcrumbs -->
    <AppBreadcrumb :items="breadcrumbs" />

    <!-- Hero Section -->
    <BaseCard variant="glass" class="course-detail__hero">
      <div class="course-detail__hero-content">
        <div class="course-detail__hero-info">
          <div class="course-detail__tags">
            <span v-for="tag in course.tags" :key="tag" class="course-detail__tag">
              {{ tag }}
            </span>
          </div>

          <h1 class="course-detail__title">{{ course.title }}</h1>
          <p class="course-detail__description">{{ course.description }}</p>

          <div class="course-detail__meta">
            <div class="course-detail__meta-item">
              <span class="course-detail__meta-icon">👨‍🏫</span>
              <span>{{ course.instructor }}</span>
            </div>
            <div class="course-detail__meta-item">
              <span class="course-detail__meta-icon">⭐</span>
              <span>{{ course.rating }} ({{ course.students.toLocaleString() }} students)</span>
            </div>
            <div class="course-detail__meta-item">
              <span class="course-detail__meta-icon">⏱️</span>
              <span>{{ course.duration }}</span>
            </div>
            <div class="course-detail__meta-item">
              <span class="course-detail__meta-icon">📖</span>
              <span>{{ course.lessons }} lessons</span>
            </div>
          </div>

          <div class="course-detail__actions">
            <BaseButton
              v-if="course.progress && course.progress > 0"
              variant="primary"
              size="lg"
              icon="▶️"
              @click="continueLearning"
            >
              Continue Learning
            </BaseButton>
            <BaseButton
              v-else
              variant="primary"
              size="lg"
              icon="🚀"
              @click="startCourse"
            >
              Start Course
            </BaseButton>

            <BaseButton variant="outline" size="lg" icon="❤️">
              Add to Favorites
            </BaseButton>
          </div>

          <!-- Progress -->
          <div v-if="course.progress" class="course-detail__progress">
            <div class="course-detail__progress-header">
              <span>Your Progress</span>
              <span class="course-detail__progress-value">{{ course.progress }}%</span>
            </div>
            <ProgressBar
              :value="course.progress"
              variant="success"
            />
          </div>
        </div>

        <div class="course-detail__hero-image">
          <img
            v-if="course.thumbnail"
            :src="course.thumbnail"
            :alt="course.title"
            class="course-detail__thumbnail"
          />
          <div v-else class="course-detail__thumbnail-placeholder">
            <span class="course-detail__placeholder-icon">📚</span>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Course Content Tabs -->
    <div class="course-detail__content">
      <div class="course-detail__tabs">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          :class="['course-detail__tab', { 'course-detail__tab--active': activeTab === tab.value }]"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Curriculum Tab -->
      <BaseCard v-if="activeTab === 'curriculum'" variant="glass" class="course-detail__tab-content">
        <h3 class="course-detail__section-title">Course Curriculum</h3>

        <div class="course-detail__lessons">
          <div
            v-for="(lesson, index) in lessons"
            :key="lesson.id"
            :class="['course-detail__lesson', { 'course-detail__lesson--completed': lesson.completed, 'course-detail__lesson--locked': lesson.locked }]"
          >
            <div class="course-detail__lesson-number">{{ index + 1 }}</div>

            <div class="course-detail__lesson-content">
              <div class="course-detail__lesson-header">
                <h4 class="course-detail__lesson-title">{{ lesson.title }}</h4>
                <span class="course-detail__lesson-type">{{ getLessonTypeIcon(lesson.type) }} {{ lesson.type }}</span>
              </div>
              <p class="course-detail__lesson-description">{{ lesson.description }}</p>
              <div class="course-detail__lesson-meta">
                <span>{{ lesson.duration }}</span>
              </div>
            </div>

            <div class="course-detail__lesson-status">
              <span v-if="lesson.completed" class="course-detail__lesson-check">✓</span>
              <span v-else-if="lesson.locked" class="course-detail__lesson-lock">🔒</span>
              <BaseButton v-else variant="ghost" size="sm" @click="startLesson(lesson.id)">
                Start
              </BaseButton>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Overview Tab -->
      <BaseCard v-if="activeTab === 'overview'" variant="glass" class="course-detail__tab-content">
        <h3 class="course-detail__section-title">What You'll Learn</h3>
        <ul class="course-detail__learning-list">
          <li v-for="(item, index) in learningPoints" :key="index">
            <span class="course-detail__check-icon">✓</span>
            {{ item }}
          </li>
        </ul>

        <h3 class="course-detail__section-title">Requirements</h3>
        <ul class="course-detail__requirements-list">
          <li v-for="(req, index) in requirements" :key="index">{{ req }}</li>
        </ul>
      </BaseCard>

      <!-- Reviews Tab -->
      <BaseCard v-if="activeTab === 'reviews'" variant="glass" class="course-detail__tab-content">
        <h3 class="course-detail__section-title">Student Reviews</h3>

        <div class="course-detail__reviews">
          <div v-for="review in reviews" :key="review.id" class="course-detail__review">
            <div class="course-detail__review-header">
              <div class="course-detail__review-avatar">
                {{ review.author.charAt(0) }}
              </div>
              <div class="course-detail__review-info">
                <h4 class="course-detail__review-author">{{ review.author }}</h4>
                <div class="course-detail__review-rating">
                  <span v-for="i in 5" :key="i">{{ i <= review.rating ? '⭐' : '☆' }}</span>
                </div>
              </div>
            </div>
            <p class="course-detail__review-text">{{ review.text }}</p>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import ProgressBar from '@/components/ui/ProgressBar.vue';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const route = useRoute();
const { success, info } = useToast();

const activeTab = ref('curriculum');

const tabs = [
  { label: 'Curriculum', value: 'curriculum' },
  { label: 'Overview', value: 'overview' },
  { label: 'Reviews', value: 'reviews' },
];

const course = ref({
  id: route.params.id,
  title: 'Advanced Vue.js Development',
  description: 'Master Vue 3 with Composition API, TypeScript, and modern best practices. Build production-ready applications with confidence.',
  thumbnail: '',
  progress: 65,
  instructor: 'Sarah Johnson',
  duration: '12 hours',
  lessons: 45,
  rating: 4.8,
  students: 12500,
  tags: ['Vue.js', 'JavaScript', 'Frontend', 'TypeScript'],
});

const breadcrumbs = computed(() => [
  { label: 'Home', to: '/', icon: '🏠' },
  { label: 'Courses', to: '/courses' },
  { label: course.value.title, to: `/courses/${course.value.id}` },
]);

const lessons = ref([
  {
    id: 1,
    title: 'Introduction to Vue 3',
    description: 'Learn about Vue 3 features and setup your development environment',
    duration: '15 min',
    type: 'video' as const,
    completed: true,
    locked: false,
  },
  {
    id: 2,
    title: 'Composition API Basics',
    description: 'Understanding reactive references and computed properties',
    duration: '25 min',
    type: 'video' as const,
    completed: true,
    locked: false,
  },
  {
    id: 3,
    title: 'Building Your First Component',
    description: 'Create reusable components with TypeScript',
    duration: '30 min',
    type: 'video' as const,
    completed: false,
    locked: false,
  },
  {
    id: 4,
    title: 'Quiz: Composition API',
    description: 'Test your knowledge of the Composition API',
    duration: '10 min',
    type: 'quiz' as const,
    completed: false,
    locked: false,
  },
  {
    id: 5,
    title: 'Advanced Patterns',
    description: 'Learn advanced component patterns and techniques',
    duration: '45 min',
    type: 'video' as const,
    completed: false,
    locked: true,
  },
]);

const learningPoints = [
  'Master Vue 3 Composition API and understand its advantages',
  'Build type-safe applications with TypeScript integration',
  'Create reusable and maintainable component architecture',
  'Implement state management with Pinia',
  'Optimize performance with modern Vue techniques',
  'Deploy production-ready Vue applications',
];

const requirements = [
  'Basic understanding of JavaScript (ES6+)',
  'Familiarity with HTML and CSS',
  'Node.js and npm installed on your computer',
  'A code editor (VS Code recommended)',
];

const reviews = ref([
  {
    id: 1,
    author: 'John Smith',
    rating: 5,
    text: 'Excellent course! The instructor explains complex concepts in a very clear way. Highly recommended for anyone wanting to master Vue 3.',
  },
  {
    id: 2,
    author: 'Maria Garcia',
    rating: 5,
    text: 'Best Vue course I\'ve taken. The practical examples and projects really helped solidify my understanding.',
  },
  {
    id: 3,
    author: 'Alex Chen',
    rating: 4,
    text: 'Great content and well-structured. Would love to see more advanced topics covered in future updates.',
  },
]);

const getLessonTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    video: '🎥',
    text: '📄',
    quiz: '❓',
    assignment: '📝',
  };
  return icons[type] || '📖';
};

const startCourse = () => {
  info('Starting course...');
  router.push(`/courses/${course.value.id}/lessons/1`);
};

const continueLearning = () => {
  info('Continuing where you left off...');
  router.push(`/courses/${course.value.id}/lessons/3`);
};

const startLesson = (lessonId: number) => {
  router.push(`/courses/${course.value.id}/lessons/${lessonId}`);
};
</script>

<style scoped>
.course-detail {
  padding: var(--spacing-lg);
  max-width: var(--content-max-width);
  margin: 0 auto;
}

.course-detail__hero {
  margin-bottom: var(--spacing-xl);
}

.course-detail__hero-content {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: var(--spacing-2xl);
  align-items: center;
}

.course-detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.course-detail__tag {
  padding: 0.25rem 0.75rem;
  background: var(--color-primary-50);
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-full);
}

.course-detail__title {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-4xl);
  background: var(--gradient-primary);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.course-detail__description {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
}

.course-detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.course-detail__meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.course-detail__meta-icon {
  font-size: 1.125rem;
}

.course-detail__actions {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.course-detail__progress {
  padding: var(--spacing-md);
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
}

.course-detail__progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.course-detail__progress-value {
  color: var(--color-success);
  font-weight: var(--font-weight-semibold);
}

.course-detail__hero-image {
  position: relative;
  aspect-ratio: 16/9;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--bg-tertiary);
}

.course-detail__thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-detail__thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
}

.course-detail__placeholder-icon {
  font-size: 5rem;
}

.course-detail__tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  border-bottom: 2px solid var(--border-color);
}

.course-detail__tab {
  padding: var(--spacing-md) var(--spacing-lg);
  background: transparent;
  border: none;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all var(--transition-fast);
}

.course-detail__tab:hover {
  color: var(--text-primary);
}

.course-detail__tab--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.course-detail__tab-content {
  animation: fadeIn var(--transition-base) ease-out;
}

.course-detail__section-title {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-2xl);
  color: var(--text-primary);
}

.course-detail__lessons {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.course-detail__lesson {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.course-detail__lesson:hover:not(.course-detail__lesson--locked) {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.course-detail__lesson--completed {
  background: var(--color-success-50);
  border-color: var(--color-success);
}

.course-detail__lesson--locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.course-detail__lesson-number {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.course-detail__lesson-content {
  flex: 1;
}

.course-detail__lesson-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
}

.course-detail__lesson-title {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.course-detail__lesson-type {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-transform: capitalize;
}

.course-detail__lesson-description {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.course-detail__lesson-meta {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.course-detail__lesson-status {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.course-detail__lesson-check {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-success);
  color: white;
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-bold);
}

.course-detail__lesson-lock {
  font-size: 1.5rem;
}

.course-detail__learning-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  padding: 0;
  list-style: none;
}

.course-detail__learning-list li {
  display: flex;
  gap: var(--spacing-sm);
  font-size: var(--font-size-base);
  color: var(--text-secondary);
}

.course-detail__check-icon {
  color: var(--color-success);
  font-weight: var(--font-weight-bold);
}

.course-detail__requirements-list {
  padding-left: var(--spacing-lg);
  color: var(--text-secondary);
}

.course-detail__requirements-list li {
  margin-bottom: var(--spacing-sm);
}

.course-detail__reviews {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.course-detail__review {
  padding: var(--spacing-lg);
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
}

.course-detail__review-header {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.course-detail__review-avatar {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
}

.course-detail__review-author {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.course-detail__review-rating {
  font-size: var(--font-size-sm);
}

.course-detail__review-text {
  margin: 0;
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
}

@media (max-width: 1024px) {
  .course-detail__hero-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .course-detail {
    padding: var(--spacing-md);
  }

  .course-detail__actions {
    flex-direction: column;
  }

  .course-detail__learning-list {
    grid-template-columns: 1fr;
  }
}
</style>
