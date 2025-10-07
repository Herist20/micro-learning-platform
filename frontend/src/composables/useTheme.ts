import { ref, watch, onMounted } from 'vue';

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'micro-learning-theme';

// Shared state across all components
const currentTheme = ref<Theme>('light');
const systemPrefersDark = ref(false);

export function useTheme() {
  /**
   * Initialize theme from localStorage or system preference
   */
  const initializeTheme = () => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;

    if (savedTheme) {
      currentTheme.value = savedTheme;
    } else {
      // Use system preference
      systemPrefersDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
      currentTheme.value = systemPrefersDark.value ? 'dark' : 'light';
    }

    applyTheme(currentTheme.value);
  };

  /**
   * Apply theme to document
   */
  const applyTheme = (theme: Theme) => {
    document.documentElement.setAttribute('data-theme', theme);
  };

  /**
   * Set theme manually
   */
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyTheme(theme);
  };

  /**
   * Toggle between light and dark theme
   */
  const toggleTheme = () => {
    const newTheme: Theme = currentTheme.value === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  /**
   * Check if current theme is dark
   */
  const isDark = () => currentTheme.value === 'dark';

  /**
   * Listen to system theme changes
   */
  const listenToSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', (e) => {
      systemPrefersDark.value = e.matches;

      // Only auto-switch if user hasn't set preference
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  };

  // Watch theme changes
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme);
  });

  onMounted(() => {
    initializeTheme();
    listenToSystemTheme();
  });

  return {
    theme: currentTheme,
    isDark: isDark(),
    setTheme,
    toggleTheme,
    initializeTheme,
  };
}
