export type ToastSeverity = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  severity: ToastSeverity;
}
