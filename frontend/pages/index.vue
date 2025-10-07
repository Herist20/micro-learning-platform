<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
    <div class="container mx-auto px-4 py-16">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-6">
          <span class="text-4xl">🎓</span>
        </div>
        <h1 class="text-5xl font-bold text-gray-900 mb-4">
          Welcome to MicroLearn
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your journey to knowledge starts here. Learn at your own pace with bite-sized lessons.
        </p>

        <!-- CTA Buttons -->
        <div class="flex gap-4 justify-center flex-wrap">
          <NuxtLink
            v-if="!isAuthenticated"
            to="/auth/register"
            class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started Free
          </NuxtLink>
          <NuxtLink
            v-if="!isAuthenticated"
            to="/auth/login"
            class="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl border border-gray-200"
          >
            Sign In
          </NuxtLink>
          <NuxtLink
            v-if="isAuthenticated"
            to="/dashboard"
            class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            Go to Dashboard
          </NuxtLink>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
        <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
          <div class="text-4xl mb-4">📚</div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Micro-Learning</h3>
          <p class="text-gray-600">
            Bite-sized lessons designed for busy schedules. Learn anytime, anywhere.
          </p>
        </div>

        <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
          <div class="text-4xl mb-4">🏆</div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Earn Certificates</h3>
          <p class="text-gray-600">
            Complete courses and earn certificates to showcase your achievements.
          </p>
        </div>

        <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
          <div class="text-4xl mb-4">👥</div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Expert Instructors</h3>
          <p class="text-gray-600">
            Learn from industry professionals and experienced educators.
          </p>
        </div>
      </div>

      <!-- Stats -->
      <div class="bg-white rounded-3xl shadow-xl p-12 max-w-4xl mx-auto">
        <div class="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div class="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div class="text-gray-600">Active Courses</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-purple-600 mb-2">10k+</div>
            <div class="text-gray-600">Students</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-green-600 mb-2">50+</div>
            <div class="text-gray-600">Expert Instructors</div>
          </div>
        </div>
      </div>

      <!-- User Info (if authenticated) -->
      <div v-if="isAuthenticated && user" class="mt-12 text-center">
        <div class="bg-blue-50 border border-blue-200 rounded-2xl p-6 max-w-md mx-auto">
          <p class="text-blue-900 font-medium mb-2">
            Welcome back, {{ user.name }}! 👋
          </p>
          <p class="text-blue-700 text-sm mb-4">
            Role: <span class="font-semibold">{{ user.role }}</span>
          </p>
          <button
            @click="handleLogout"
            class="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated, user, logout } = useAuth();
const router = useRouter();

async function handleLogout() {
  await logout();
  router.push('/auth/login');
}
</script>
