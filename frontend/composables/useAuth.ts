import { useAuthStore } from '~/stores/auth';
import { computed } from 'vue';
import type { LoginCredentials, RegisterData, ForgotPasswordData, ResetPasswordData } from '~/types/auth';

export function useAuth() {
  const authStore = useAuthStore();

  return {
    // State
    user: computed(() => authStore.user),
    loading: computed(() => authStore.loading),
    error: computed(() => authStore.error),

    // Computed
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isAdmin: computed(() => authStore.isAdmin),
    isInstructor: computed(() => authStore.isInstructor),
    isLearner: computed(() => authStore.isLearner),

    // Actions
    login: (credentials: LoginCredentials) => authStore.login(credentials),
    register: (data: RegisterData) => authStore.register(data),
    logout: () => authStore.logout(),
    fetchUser: () => authStore.fetchUser(),
    verifyEmail: (token: string) => authStore.verifyEmail({ token }),
    resendVerification: (email: string) => authStore.resendVerification(email),
    forgotPassword: (data: ForgotPasswordData) => authStore.forgotPassword(data),
    resetPassword: (data: ResetPasswordData) => authStore.resetPassword(data),
  };
}
