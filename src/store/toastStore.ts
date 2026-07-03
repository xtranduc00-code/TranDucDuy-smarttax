import { create } from 'zustand';
import type { ToastMessage, ToastSeverity } from '../types/toast';
import { generateId } from '../utils/id';

interface ToastState {
  toasts: ToastMessage[];
  showToast: (message: string, severity?: ToastSeverity) => void;
  dismissToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  showToast: (message, severity = 'info') => {
    const toast: ToastMessage = { id: generateId(), message, severity };
    set((state) => ({ toasts: [...state.toasts, toast] }));
  },
  dismissToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));
