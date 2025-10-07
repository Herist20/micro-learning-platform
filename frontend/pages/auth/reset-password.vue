<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo & Title -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
          <span class="text-3xl">🔑</span>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">Reset Password</h1>
        <p class="text-gray-600 mt-2">Enter your new password below</p>
      </div>

      <!-- Success Message -->
      <div
        v-if="resetSuccess"
        class="bg-green-50 border border-green-200 rounded-2xl p-6"
      >
        <div class="flex items-start">
          <span class="text-2xl mr-3">✅</span>
          <div>
            <h3 class="font-semibold text-green-900 mb-1">Password Reset Successfully!</h3>
            <p class="text-sm text-green-700 mb-4">
              Your password has been updated. You can now sign in with your new password.
            </p>
            <NuxtLink
              to="/auth/login"
              class="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Go to Login
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Form Card -->
      <div v-else class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="new-password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none pr-12"
                :class="{ 'border-red-500': passwordError }"
                placeholder="••••••••"
                @input="validatePassword"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <span v-if="showPassword">👁️</span>
                <span v-else>👁️‍🗨️</span>
              </button>
            </div>
            <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>

            <!-- Password Strength -->
            <div v-if="form.password" class="mt-2">
              <div class="flex gap-1 mb-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="h-1 flex-1 rounded-full transition-colors"
                  :class="i <= passwordStrength ? getStrengthColor() : 'bg-gray-200'"
                ></div>
              </div>
              <p class="text-xs" :class="getStrengthTextClass()">
                {{ getStrengthText() }}
              </p>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              autocomplete="new-password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              :class="{ 'border-red-500': confirmPasswordError }"
              placeholder="••••••••"
              @blur="validateConfirmPassword"
            />
            <p v-if="confirmPasswordError" class="mt-1 text-sm text-red-600">{{ confirmPasswordError }}</p>
          </div>

          <!-- Password Requirements -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm font-medium text-blue-900 mb-2">Password requirements:</p>
            <ul class="text-sm text-blue-700 space-y-1">
              <li class="flex items-center">
                <span class="mr-2">{{ form.password.length >= 8 ? '✅' : '⭕' }}</span>
                At least 8 characters
              </li>
              <li class="flex items-center">
                <span class="mr-2">{{ /[A-Z]/.test(form.password) && /[a-z]/.test(form.password) ? '✅' : '⭕' }}</span>
                Mix of uppercase and lowercase
              </li>
              <li class="flex items-center">
                <span class="mr-2">{{ /\d/.test(form.password) ? '✅' : '⭕' }}</span>
                At least one number
              </li>
            </ul>
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
              Resetting...
            </span>
            <span v-else>Reset Password</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
  layout: false,
});

const route = useRoute();
const { resetPassword, error, loading } = useAuth();

const token = computed(() => route.query.token as string);

const form = ref({
  password: '',
  confirmPassword: '',
});

const showPassword = ref(false);
const resetSuccess = ref(false);
const passwordError = ref('');
const confirmPasswordError = ref('');
const passwordStrength = ref(0);

// Redirect if no token
onMounted(() => {
  if (!token.value) {
    navigateTo('/auth/forgot-password');
  }
});

function calculatePasswordStrength(password: string): number {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;

  return Math.min(4, strength);
}

function validatePassword() {
  if (!form.value.password) {
    passwordError.value = 'Password is required';
    passwordStrength.value = 0;
  } else if (form.value.password.length < 8) {
    passwordError.value = 'Password must be at least 8 characters';
    passwordStrength.value = 1;
  } else {
    passwordError.value = '';
    passwordStrength.value = calculatePasswordStrength(form.value.password);
  }

  if (form.value.confirmPassword) {
    validateConfirmPassword();
  }
}

function validateConfirmPassword() {
  if (!form.value.confirmPassword) {
    confirmPasswordError.value = 'Please confirm your password';
  } else if (form.value.password !== form.value.confirmPassword) {
    confirmPasswordError.value = 'Passwords do not match';
  } else {
    confirmPasswordError.value = '';
  }
}

function getStrengthColor(): string {
  if (passwordStrength.value <= 1) return 'bg-red-500';
  if (passwordStrength.value === 2) return 'bg-orange-500';
  if (passwordStrength.value === 3) return 'bg-yellow-500';
  return 'bg-green-500';
}

function getStrengthTextClass(): string {
  if (passwordStrength.value <= 1) return 'text-red-600';
  if (passwordStrength.value === 2) return 'text-orange-600';
  if (passwordStrength.value === 3) return 'text-yellow-600';
  return 'text-green-600';
}

function getStrengthText(): string {
  if (passwordStrength.value <= 1) return 'Weak password';
  if (passwordStrength.value === 2) return 'Fair password';
  if (passwordStrength.value === 3) return 'Good password';
  return 'Strong password';
}

async function handleSubmit() {
  validatePassword();
  validateConfirmPassword();

  if (passwordError.value || confirmPasswordError.value) {
    return;
  }

  if (!token.value) {
    return;
  }

  try {
    await resetPassword({
      token: token.value,
      password: form.value.password,
    });

    resetSuccess.value = true;
  } catch (err) {
    console.error('Reset password error:', err);
  }
}
</script>
