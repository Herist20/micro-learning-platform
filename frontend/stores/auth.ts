import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiClient } from '~/utils/api-client';
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  RegisterResponse,
  ForgotPasswordData,
  ResetPasswordData,
  VerifyEmailData,
  UserRole,
} from '~/types/auth';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_KEY = 'auth_user';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const isAuthenticated = computed(() => !!user.value && !!accessToken.value);
  const isAdmin = computed(() => user.value?.role === 'ADMIN');
  const isInstructor = computed(
    () => user.value?.role === 'INSTRUCTOR' || user.value?.role === 'ADMIN'
  );
  const isLearner = computed(() => user.value?.role === 'LEARNER');

  // Initialize from localStorage
  function initFromStorage() {
    if (import.meta.client) {
      const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedAccessToken && storedRefreshToken && storedUser) {
        accessToken.value = storedAccessToken;
        refreshToken.value = storedRefreshToken;
        user.value = JSON.parse(storedUser);
        apiClient.setAccessToken(storedAccessToken);
      }
    }
  }

  // Save to localStorage
  function saveToStorage() {
    if (import.meta.client) {
      if (accessToken.value && refreshToken.value && user.value) {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken.value);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken.value);
        localStorage.setItem(USER_KEY, JSON.stringify(user.value));
      }
    }
  }

  // Clear storage
  function clearStorage() {
    if (import.meta.client) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }

  // Set auth data
  function setAuth(data: AuthResponse) {
    user.value = data.user;
    accessToken.value = data.accessToken;
    refreshToken.value = data.refreshToken;
    apiClient.setAccessToken(data.accessToken);
    saveToStorage();
  }

  // Clear auth data
  function clearAuth() {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    apiClient.setAccessToken(null);
    clearStorage();
  }

  // Register
  async function register(data: RegisterData): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiClient.post<RegisterResponse>('/auth/register', data);

      // Registration successful, but user needs to verify email
      // Don't set auth data yet
      user.value = response.user;
      return;
    } catch (err: any) {
      error.value = err.message || 'Registration failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Login
  async function login(credentials: LoginCredentials): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      setAuth(response);
    } catch (err: any) {
      error.value = err.message || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Logout
  async function logout(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      // Call logout endpoint if authenticated
      if (isAuthenticated.value) {
        await apiClient.post('/auth/logout');
      }
    } catch (err: any) {
      console.error('Logout error:', err);
    } finally {
      clearAuth();
      loading.value = false;
    }
  }

  // Refresh access token
  async function refreshAccessToken(): Promise<boolean> {
    if (!refreshToken.value) {
      return false;
    }

    try {
      const response = await apiClient.post<AuthResponse>('/auth/refresh', {
        refreshToken: refreshToken.value,
      });

      accessToken.value = response.accessToken;
      refreshToken.value = response.refreshToken;
      apiClient.setAccessToken(response.accessToken);
      saveToStorage();

      return true;
    } catch (err) {
      clearAuth();
      return false;
    }
  }

  // Fetch current user
  async function fetchUser(): Promise<void> {
    if (!accessToken.value) {
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await apiClient.get<User>('/auth/me');
      user.value = response;
      saveToStorage();
    } catch (err: any) {
      // If 401, try to refresh token
      if (err.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          // Retry fetch user
          return fetchUser();
        } else {
          clearAuth();
        }
      }
      error.value = err.message || 'Failed to fetch user';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Verify email
  async function verifyEmail(data: VerifyEmailData): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      await apiClient.post('/auth/verify-email', data);
    } catch (err: any) {
      error.value = err.message || 'Email verification failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Resend verification email
  async function resendVerification(email: string): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      await apiClient.post('/auth/resend-verification', { email });
    } catch (err: any) {
      error.value = err.message || 'Failed to resend verification email';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Forgot password
  async function forgotPassword(data: ForgotPasswordData): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      await apiClient.post('/auth/forgot-password', data);
    } catch (err: any) {
      error.value = err.message || 'Failed to send reset email';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Reset password
  async function resetPassword(data: ResetPasswordData): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      await apiClient.post('/auth/reset-password', data);
    } catch (err: any) {
      error.value = err.message || 'Password reset failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Initialize on store creation
  initFromStorage();

  return {
    // State
    user,
    accessToken,
    refreshToken,
    loading,
    error,

    // Computed
    isAuthenticated,
    isAdmin,
    isInstructor,
    isLearner,

    // Actions
    register,
    login,
    logout,
    refreshAccessToken,
    fetchUser,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    initFromStorage,
  };
});
