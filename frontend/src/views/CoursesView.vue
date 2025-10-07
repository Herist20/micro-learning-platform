<template>
  <div class="courses">
    <!-- Breadcrumbs -->
    <AppBreadcrumb :items="breadcrumbs" />

    <!-- Page Header -->
    <div class="courses__header">
      <div>
        <h1 class="courses__title">All Courses</h1>
        <p class="courses__subtitle">Explore our comprehensive learning library</p>
      </div>
    </div>

    <!-- Filters & Search -->
    <BaseCard variant="glass" class="courses__filters">
      <div class="courses__filters-row">
        <BaseInput
          v-model="searchQuery"
          type="search"
          placeholder="Search courses..."
          icon="🔍"
          iconPosition="left"
          clearable
          class="courses__search"
        />

        <div class="courses__filter-group">
          <BaseButton
            v-for="filter in filters"
            :key="filter.value"
            :variant="selectedFilter === filter.value ? 'primary' : 'ghost'"
            size="sm"
            @click="selectedFilter = filter.value"
          >
            {{ filter.label }}
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- Courses Grid -->
    <div v-if="!loading && filteredCourses.length > 0" class="courses__grid">
      <CourseCard
        v-for="course in filteredCourses"
        :key="course.id"
        v-bind="course"
        class="stagger-item"
        @click="goToCourse"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="courses__loading">
      <LoadingSpinner size="lg" text="Loading courses..." />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-if="!loading && filteredCourses.length === 0"
      icon="🔍"
      title="No courses found"
      description="Try adjusting your search or filters"
      actionLabel="Clear Filters"
      :onAction="clearFilters"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import CourseCard from '@/components/ui/CourseCard.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import EmptyState from '@/components/ui/EmptyState.vue';

const router = useRouter();

const breadcrumbs = [
  { label: 'Home', to: '/', icon: '🏠' },
  { label: 'Courses', to: '/courses' },
];

const searchQuery = ref('');
const selectedFilter = ref('all');
const loading = ref(false);

const filters = [
  { label: 'All', value: 'all' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Not Started', value: 'not-started' },
];

const courses = ref([
  {
    id: 1,
    title: 'Advanced Vue.js Development',
    description: 'Master Vue 3 with Composition API and modern best practices',
    thumbnail: '',
    progress: 65,
    instructor: 'Sarah Johnson',
    duration: '12 hours',
    lessons: 45,
    rating: 4.8,
    students: 12500,
    tags: ['Vue.js', 'JavaScript', 'Frontend'],
  },
  {
    id: 2,
    title: 'TypeScript for Beginners',
    description: 'Learn TypeScript from scratch and build type-safe applications',
    thumbnail: '',
    progress: 30,
    instructor: 'Mike Chen',
    duration: '8 hours',
    lessons: 32,
    rating: 4.9,
    students: 8900,
    tags: ['TypeScript', 'JavaScript'],
  },
  {
    id: 3,
    title: 'UI/UX Design Principles',
    description: 'Create beautiful and intuitive user interfaces',
    thumbnail: '',
    progress: 90,
    instructor: 'Emma Wilson',
    duration: '10 hours',
    lessons: 38,
    rating: 4.7,
    students: 15200,
    tags: ['Design', 'UI/UX'],
  },
  {
    id: 4,
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js and Express',
    thumbnail: '',
    instructor: 'David Lee',
    duration: '15 hours',
    lessons: 52,
    rating: 4.8,
    students: 9800,
    price: 49.99,
    tags: ['Node.js', 'Backend', 'JavaScript'],
  },
  {
    id: 5,
    title: 'React.js Complete Guide',
    description: 'Learn React from basics to advanced concepts',
    thumbnail: '',
    instructor: 'Lisa Anderson',
    duration: '20 hours',
    lessons: 68,
    rating: 4.9,
    students: 18500,
    price: 59.99,
    tags: ['React', 'JavaScript', 'Frontend'],
  },
  {
    id: 6,
    title: 'Python for Data Science',
    description: 'Master Python for data analysis and machine learning',
    thumbnail: '',
    instructor: 'Dr. James Wilson',
    duration: '18 hours',
    lessons: 55,
    rating: 4.8,
    students: 14200,
    isFree: true,
    tags: ['Python', 'Data Science', 'ML'],
  },
]);

const filteredCourses = computed(() => {
  let result = courses.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  // Apply status filter
  if (selectedFilter.value !== 'all') {
    result = result.filter((course) => {
      if (selectedFilter.value === 'in-progress') {
        return course.progress && course.progress > 0 && course.progress < 100;
      } else if (selectedFilter.value === 'completed') {
        return course.progress === 100;
      } else if (selectedFilter.value === 'not-started') {
        return !course.progress || course.progress === 0;
      }
      return true;
    });
  }

  return result;
});

const goToCourse = (id: string | number) => {
  router.push(`/courses/${id}`);
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedFilter.value = 'all';
};
</script>

<style scoped>
.courses {
  padding: var(--spacing-lg);
  max-width: var(--content-max-width);
  margin: 0 auto;
}

.courses__header {
  margin-bottom: var(--spacing-xl);
}

.courses__title {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-4xl);
  background: var(--gradient-primary);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.courses__subtitle {
  margin: 0;
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
}

.courses__filters {
  margin-bottom: var(--spacing-xl);
}

.courses__filters-row {
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
}

.courses__search {
  flex: 1;
  max-width: 400px;
}

.courses__filter-group {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.courses__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-lg);
}

.courses__loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

@media (max-width: 768px) {
  .courses {
    padding: var(--spacing-md);
  }

  .courses__filters-row {
    flex-direction: column;
    align-items: stretch;
  }

  .courses__search {
    max-width: 100%;
  }

  .courses__grid {
    grid-template-columns: 1fr;
  }
}
</style>
