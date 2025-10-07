export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // If already authenticated, redirect to home or dashboard
  if (authStore.isAuthenticated) {
    return navigateTo('/');
  }
});
