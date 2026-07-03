import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useToastStore } from '../store/toastStore';

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismissToast = useToastStore((s) => s.dismissToast);

  return (
    <Stack spacing={1} sx={{ position: 'fixed', top: 16, right: 16, zIndex: 2000 }}>
      {toasts.map((toast) => (
        <Snackbar
          key={toast.id}
          open
          autoHideDuration={4000}
          onClose={() => dismissToast(toast.id)}
          sx={{ position: 'static' }}
        >
          <Alert
            onClose={() => dismissToast(toast.id)}
            severity={toast.severity}
            variant="filled"
            sx={{ minWidth: 280 }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
}
