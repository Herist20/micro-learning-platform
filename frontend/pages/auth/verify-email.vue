<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4">
          <span class="text-3xl">📧</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="verifying" class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
        <div class="flex justify-center mb-4">
          <svg class="animate-spin h-12 w-12 text-green-600" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Verifying Your Email</h2>
        <p class="text-gray-600">Please wait while we verify your email address...</p>
      </div>

      <!-- Success State -->
      <div v-else-if="verified" class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <span class="text-4xl">✅</span>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
          <p class="text-gray-600">Your email has been successfully verified.</p>
        </div>

        <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p class="text-sm text-green-700 text-center">
            Welcome to MicroLearn! You're all set to start learning.
          </p>
        </div>

        <NuxtLink
          to="/auth/login"
          class="w-full inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Continue to Login
        </NuxtLink>
      </div>

      <!-- Error State -->
      <div v-else-if="verificationError" class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <span class="text-4xl">❌</span>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
          <p class="text-gray-600 mb-4">{{ verificationError }}</p>
        </div>

        <div class="space-y-3">
          <button
            v-if="userEmail"
            @click="handleResend"
            :disabled="resending || resendSuccess"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span v-if="resending">
              <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
            <span v-else-if="resendSuccess">✅ Email Sent!</span>
            <span v-else>Resend Verification Email</span>
          </button>

          <NuxtLink
            to="/auth/login"
            class="w-full inline-flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Back to Login
          </NuxtLink>
        </div>
      </div>

      <!-- No Token State -->
      <div v-else class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <span class="text-4xl">⚠️</span>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Invalid Verification Link</h2>
          <p class="text-gray-600">This verification link is invalid or has expired.</p>
        </div>

        <div class="space-y-3">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Enter your email to resend verification
            </label>
            <input
              id="email"
              v-model="resendEmail"
              type="email"
              placeholder="you@example.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
            />
          </div>

          <button
            @click="handleResendWithEmail"
            :disabled="!resendEmail || resending || resendSuccess"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="resending">Sending...</span>
            <span v-else-if="resendSuccess">✅ Email Sent!</span>
            <span v-else>Resend Verification Email</span>
          </button>

          <NuxtLink
            to="/auth/login"
            class="w-full inline-flex items-center justify-center text-gray-600 hover:text-gray-900 font-medium py-2"
          >
            Back to Login
          </NuxtLink>
        </div>
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
const { verifyEmail, resendVerification } = useAuth();

const token = computed(() => route.query.token as string);
const userEmail = computed(() => route.query.email as string);

const verifying = ref(false);
const verified = ref(false);
const verificationError = ref('');
const resending = ref(false);
const resendSuccess = ref(false);
const resendEmail = ref('');

// Auto verify on mount if token exists
onMounted(async () => {
  if (token.value) {
    await handleVerify();
  }
});

async function handleVerify() {
  verifying.value = true;
  verificationError.value = '';

  try {
    await verifyEmail(token.value);
    verified.value = true;
  } catch (err: any) {
    verificationError.value = err.message || 'Verification failed. The link may be invalid or expired.';
  } finally {
    verifying.value = false;
  }
}

async function handleResend() {
  if (!userEmail.value) return;

  resending.value = true;
  resendSuccess.value = false;

  try {
    await resendVerification(userEmail.value);
    resendSuccess.value = true;
  } catch (err) {
    console.error('Resend error:', err);
  } finally {
    resending.value = false;
  }
}

async function handleResendWithEmail() {
  if (!resendEmail.value) return;

  resending.value = true;
  resendSuccess.value = false;

  try {
    await resendVerification(resendEmail.value);
    resendSuccess.value = true;
  } catch (err) {
    console.error('Resend error:', err);
  } finally {
    resending.value = false;
  }
}
</script>
