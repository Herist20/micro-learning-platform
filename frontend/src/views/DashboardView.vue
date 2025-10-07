<template>
  <div class="dashboard">
    <!-- Breadcrumbs -->
    <AppBreadcrumb :items="breadcrumbs" />

    <!-- Page Header -->
    <div class="dashboard__header">
      <div>
        <h1 class="dashboard__title">Dashboard</h1>
        <p class="dashboard__subtitle">Welcome back, {{ user.name }}! Here's your learning progress.</p>
      </div>

      <BaseButton variant="primary" icon="➕" @click="showCreateModal = true">
        Create Course
      </BaseButton>
    </div>

    <!-- Stats Grid -->
    <div class="dashboard__stats">
      <StatsCard
        title="Total Courses"
        :value="stats.totalCourses"
        icon="📚"
        iconVariant="primary"
        :trend="{ value: 12, label: 'vs last month', isPositive: true }"
      />

      <StatsCard
        title="Completed"
        :value="stats.completedCourses"
        icon="✅"
        iconVariant="success"
        :trend="{ value: 8, label: 'vs last month', isPositive: true }"
      />

      <StatsCard
        title="In Progress"
        :value="stats.inProgressCourses"
        icon="📖"
        iconVariant="warning"
        :trend="{ value: 3, label: 'vs last month', isPositive: false }"
      />

      <StatsCard
        title="Study Hours"
        :value="stats.studyHours"
        icon="⏱️"
        iconVariant="info"
        :trend="{ value: 15, label: 'vs last month', isPositive: true }"
      />
    </div>

    <!-- Content Grid -->
    <div class="dashboard__content">
      <!-- Recent Courses -->
      <BaseCard variant="glass" class="dashboard__section">
        <template #header>
          <div class="dashboard__section-header">
            <h2>Continue Learning</h2>
            <router-link to="/courses" class="dashboard__section-link">View All →</router-link>
          </div>
        </template>

        <div class="dashboard__courses-grid">
          <CourseCard
            v-for="course in recentCourses"
            :key="course.id"
            v-bind="course"
            @click="goToCourse"
          />
        </div>
      </BaseCard>

      <!-- Activity Chart -->
      <BaseCard variant="glass" class="dashboard__section">
        <template #header>
          <h2>Weekly Activity</h2>
        </template>

        <div class="dashboard__chart">
          <!-- Placeholder for chart - integrate Chart.js or Apache ECharts -->
          <div class="chart-placeholder">
            <ProgressBar
              :value="75"
              variant="primary"
              :showLabel="true"
              class="mb-md"
            />
            <ProgressBar
              :value="60"
              variant="success"
              :showLabel="true"
              class="mb-md"
            />
            <ProgressBar
              :value="85"
              variant="warning"
              :showLabel="true"
            />
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Recent Activity Table -->
    <BaseCard variant="glass" class="dashboard__section">
      <template #header>
        <h2>Recent Activity</h2>
      </template>

      <DataTable
        :columns="activityColumns"
        :data="recentActivity"
        :pagination="false"
        :hoverable="true"
      />
    </BaseCard>

    <!-- Create Course Modal -->
    <BaseModal
      v-model="showCreateModal"
      title="Create New Course"
      size="lg"
    >
      <div class="dashboard__modal-content">
        <BaseInput
          v-model="newCourse.title"
          label="Course Title"
          placeholder="Enter course title"
        />

        <BaseInput
          v-model="newCourse.description"
          label="Description"
          placeholder="Enter course description"
        />

        <div class="dashboard__modal-actions">
          <BaseButton variant="ghost" @click="showCreateModal = false">
            Cancel
          </BaseButton>
          <BaseButton variant="primary" @click="createCourse">
            Create Course
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppBreadcrumb from '@/components/ui/AppBreadcrumb.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import StatsCard from '@/components/ui/StatsCard.vue';
import CourseCard from '@/components/ui/CourseCard.vue';
import DataTable from '@/components/ui/DataTable.vue';
import ProgressBar from '@/components/ui/ProgressBar.vue';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const { success } = useToast();

const breadcrumbs = [
  { label: 'Home', to: '/', icon: '🏠' },
  { label: 'Dashboard', to: '/dashboard' },
];

const user = ref({
  name: 'John Doe',
  email: 'john@example.com',
});

const stats = ref({
  totalCourses: 24,
  completedCourses: 12,
  inProgressCourses: 8,
  studyHours: 142,
});

const recentCourses = ref([
  {
    id: 1,
    title: 'Advanced Vue.js Development',
    description: 'Master Vue 3 with Composition API',
    thumbnail: '',
    progress: 65,
    instructor: 'Sarah Johnson',
    duration: '12 hours',
    lessons: 45,
    rating: 4.8,
  },
  {
    id: 2,
    title: 'TypeScript for Beginners',
    description: 'Learn TypeScript from scratch',
    thumbnail: '',
    progress: 30,
    instructor: 'Mike Chen',
    duration: '8 hours',
    lessons: 32,
    rating: 4.9,
  },
  {
    id: 3,
    title: 'UI/UX Design Principles',
    description: 'Create beautiful user interfaces',
    thumbnail: '',
    progress: 90,
    instructor: 'Emma Wilson',
    duration: '10 hours',
    lessons: 38,
    rating: 4.7,
  },
]);

const activityColumns = [
  { key: 'course', label: 'Course', sortable: true },
  { key: 'action', label: 'Action', sortable: false },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'duration', label: 'Duration', align: 'right' as const },
];

const recentActivity = ref([
  {
    course: 'Advanced Vue.js Development',
    action: 'Completed Lesson 12',
    date: '2 hours ago',
    duration: '45 min',
  },
  {
    course: 'TypeScript for Beginners',
    action: 'Started Module 3',
    date: '1 day ago',
    duration: '30 min',
  },
  {
    course: 'UI/UX Design Principles',
    action: 'Submitted Assignment',
    date: '2 days ago',
    duration: '1 hour',
  },
]);

const showCreateModal = ref(false);
const newCourse = ref({
  title: '',
  description: '',
});

const goToCourse = (id: string | number) => {
  router.push(`/courses/${id}`);
};

const createCourse = () => {
  success('Course created successfully!');
  showCreateModal.value = false;
  newCourse.value = { title: '', description: '' };
};
</script>

<style scoped>
.dashboard {
  padding: var(--spacing-lg);
  max-width: var(--content-max-width);
  margin: 0 auto;
}

.dashboard__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-xl);
}

.dashboard__title {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-4xl);
  background: var(--gradient-primary);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.dashboard__subtitle {
  margin: 0;
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
}

.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.dashboard__content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.dashboard__section {
  animation: fadeInUp var(--transition-base) ease-out;
}

.dashboard__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dashboard__section-header h2 {
  margin: 0;
  font-size: var(--font-size-xl);
  color: var(--text-primary);
}

.dashboard__section-link {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.dashboard__section-link:hover {
  color: var(--color-primary-light);
}

.dashboard__courses-grid {
  display: grid;
  gap: var(--spacing-lg);
}

.dashboard__chart {
  padding: var(--spacing-lg) 0;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.dashboard__modal-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.dashboard__modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

@media (max-width: 1024px) {
  .dashboard__content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: var(--spacing-md);
  }

  .dashboard__header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .dashboard__stats {
    grid-template-columns: 1fr;
  }
}
</style>
