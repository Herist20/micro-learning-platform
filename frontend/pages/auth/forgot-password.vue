<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo & Title -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
          <span class="text-3xl">🔐</span>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">Forgot Password?</h1>
        <p class="text-gray-600 mt-2">No worries, we'll send you reset instructions</p>
      </div>

      <!-- Success Message -->
      <div
        v-if="emailSent"
        class="bg-green-50 border border-green-200 rounded-2xl p-6"
      >
        <div class="flex items-start">
          <span class="text-2xl mr-3">📧</span>
          <div>
            <h3 class="font-semibold text-green-900 mb-1">Check Your Email</h3>
            <p class="text-sm text-green-700 mb-3">
              If an account exists for <strong>{{ form.email }}</strong>, we've sent password reset instructions.
            </p>
            <p class="text-sm text-green-700 mb-4">
              Check your inbox and spam folder. The link will expire in 1 hour.
            </p>
            <div class="flex gap-3">
              <button
                @click="emailSent = false"
                class="text-sm text-green-700 hover:text-green-800 font-medium"
              >
                Try another email
              </button>
              <NuxtLink
                to="/auth/login"
                class="text-sm text-green-700 hover:text-green-800 font-medium"
              >
                Back to login
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Card -->
      <div v-else class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              :class="{ 'border-red-500': emailError }"
              placeholder="you@example.com"
              @blur="validateEmail"
            />
            <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
          </div>

          <!-- Error Message -->
          <div
            v-if="error"
            class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
          >
            {{ error }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span v-if="loading">
              <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
            <span v-else>Send Reset Link</span>
          </button>

          <!-- Back to Login -->
          <div class="text-center pt-4">
            <NuxtLink
              to="/auth/login"
              class="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center"
            >
              <span class="mr-2">←</span>
              Back to login
            </NuxtLink>
          </div>
        </form>
      </div>

      <!-- Help Text -->
      <div class="mt-6 text-center text-sm text-gray-500">
        <p>Having trouble? <a href="#" class="text-indigo-600 hover:text-indigo-700 font-medium">Contact support</a></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
  layout: false,
});

const { forgotPassword, error, loading } = useAuth();

const form = ref({
  email: '',
});

const emailError = ref('');
const emailSent = ref(false);

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.value.email) {
    emailError.value = 'Email is required';
  } else if (!emailRegex.test(form.value.email)) {
    emailError.value = 'Please enter a valid email';
  } else {
    emailError.value = '';
  }
}

async function handleSubmit() {
  validateEmail();

  if (emailError.value) {
    return;
  }

  try {
    await forgotPassword({ email: form.value.email });
    emailSent.value = true;
  } catch (err) {
    // Error is handled by the store
    console.error('Forgot password error:', err);
  }
}
</script>
