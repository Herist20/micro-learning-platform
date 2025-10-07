import { ref } from 'vue';
import type { Toast, ToastOptions } from '@/types/ui';

const toasts = ref<Toast[]>([]);
let toastId = 0;

export function useToast() {
  const show = (options: ToastOptions) => {
    const id = options.id || `toast-${++toastId}`;
    const duration = options.duration ?? 3000;

    const toast: Toast = {
      ...options,
      id,
      createdAt: Date.now(),
    };

    toasts.value.push(toast);

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }

    return id;
  };

  const remove = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const clear = () => {
    toasts.value = [];
  };

  // Convenience methods
  const success = (message: string, options?: Partial<ToastOptions>) => {
    return show({ ...options, message, variant: 'success' });
  };

  const error = (message: string, options?: Partial<ToastOptions>) => {
    return show({ ...options, message, variant: 'danger' });
  };

  const warning = (message: string, options?: Partial<ToastOptions>) => {
    return show({ ...options, message, variant: 'warning' });
  };

  const info = (message: string, options?: Partial<ToastOptions>) => {
    return show({ ...options, message, variant: 'info' });
  };

  return {
    toasts,
    show,
    remove,
    clear,
    success,
    error,
    warning,
    info,
  };
}
