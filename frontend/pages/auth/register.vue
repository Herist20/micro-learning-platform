<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo & Title -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4">
          <span class="text-3xl">🎓</span>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">Create Account</h1>
        <p class="text-gray-600 mt-2">Start your learning journey today</p>
      </div>

      <!-- Success Message (after registration) -->
      <div
        v-if="registrationSuccess"
        class="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6"
      >
        <div class="flex items-start">
          <span class="text-2xl mr-3">✅</span>
          <div>
            <h3 class="font-semibold text-green-900 mb-1">Registration Successful!</h3>
            <p class="text-sm text-green-700 mb-3">
              We've sent a verification email to <strong>{{ form.email }}</strong>
            </p>
            <p class="text-sm text-green-700">
              Please check your inbox and verify your email to get started.
            </p>
          </div>
        </div>
      </div>

      <!-- Register Card -->
      <div v-else class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Name Field -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              autocomplete="name"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
              :class="{ 'border-red-500': nameError }"
              placeholder="John Doe"
              @blur="validateName"
            />
            <p v-if="nameError" class="mt-1 text-sm text-red-600">{{ nameError }}</p>
          </div>

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
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
              :class="{ 'border-red-500': emailError }"
              placeholder="you@example.com"
              @blur="validateEmail"
            />
            <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="new-password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none pr-12"
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
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              autocomplete="new-password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
              :class="{ 'border-red-500': confirmPasswordError }"
              placeholder="••••••••"
              @blur="validateConfirmPassword"
            />
            <p v-if="confirmPasswordError" class="mt-1 text-sm text-red-600">{{ confirmPasswordError }}</p>
          </div>

          <!-- Role Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              I want to
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label
                class="relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                :class="form.role === 'LEARNER' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'"
              >
                <input
                  v-model="form.role"
                  type="radio"
                  value="LEARNER"
                  class="sr-only"
                />
                <div class="flex-1">
                  <div class="text-2xl mb-1">📚</div>
                  <div class="font-medium text-gray-900">Learn</div>
                  <div class="text-xs text-gray-500">Take courses</div>
                </div>
              </label>

              <label
                class="relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
                :class="form.role === 'INSTRUCTOR' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'"
              >
                <input
                  v-model="form.role"
                  type="radio"
                  value="INSTRUCTOR"
                  class="sr-only"
                />
                <div class="flex-1">
                  <div class="text-2xl mb-1">👨‍🏫</div>
                  <div class="font-medium text-gray-900">Teach</div>
                  <div class="text-xs text-gray-500">Create courses</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Terms Checkbox -->
          <div>
            <label class="flex items-start">
              <input
                v-model="form.agreeToTerms"
                type="checkbox"
                required
                class="w-4 h-4 mt-1 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span class="ml-2 text-sm text-gray-600">
                I agree to the
                <a href="#" class="text-purple-600 hover:text-purple-700 font-medium">Terms of Service</a>
                and
                <a href="#" class="text-purple-600 hover:text-purple-700 font-medium">Privacy Policy</a>
              </span>
            </label>
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
            :disabled="loading || !form.agreeToTerms"
            class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span v-if="loading">
              <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
            <span v-else>Create Account</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500">Already have an account?</span>
          </div>
        </div>

        <!-- Login Link -->
        <div class="text-center">
          <NuxtLink
            to="/auth/login"
            class="text-purple-600 hover:text-purple-700 font-medium"
          >
            Sign in instead
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserRole } from '~/types/auth';

definePageMeta({
  middleware: 'guest',
  layout: false,
});

const { register, error, loading } = useAuth();

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: UserRole.LEARNER,
  agreeToTerms: false,
});

const showPassword = ref(false);
const registrationSuccess = ref(false);
const nameError = ref('');
const emailError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');
const passwordStrength = ref(0);

function validateName() {
  if (!form.value.name) {
    nameError.value = 'Name is required';
  } else if (form.value.name.length < 2) {
    nameError.value = 'Name must be at least 2 characters';
  } else {
    nameError.value = '';
  }
}

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

  // Re-validate confirm password if it's already filled
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

async function handleRegister() {
  // Validate all fields
  validateName();
  validateEmail();
  validatePassword();
  validateConfirmPassword();

  if (nameError.value || emailError.value || passwordError.value || confirmPasswordError.value) {
    return;
  }

  if (!form.value.agreeToTerms) {
    return;
  }

  try {
    await register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      role: form.value.role,
    });

    // Show success message
    registrationSuccess.value = true;
  } catch (err) {
    // Error is handled by the store
    console.error('Registration error:', err);
  }
}
</script>
