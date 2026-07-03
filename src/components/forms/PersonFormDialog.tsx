import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { personSchema, type PersonFormValues } from '../../utils/validationSchemas';

interface PersonFormDialogProps {
  open: boolean;
  entityLabel: string;
  initialValues?: PersonFormValues;
  onSubmit: (values: PersonFormValues) => void;
  onClose: () => void;
}

const defaultValues: PersonFormValues = { name: '', status: 'Active' };

export function PersonFormDialog({
  open,
  entityLabel,
  initialValues,
  onSubmit,
  onClose,
}: PersonFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonFormValues>({
    resolver: zodResolver(personSchema),
    defaultValues: initialValues ?? defaultValues,
  });

  useEffect(() => {
    if (open) reset(initialValues ?? defaultValues);
  }, [open, initialValues, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{initialValues ? `Sửa ${entityLabel}` : `Thêm ${entityLabel}`}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên"
                  fullWidth
                  autoFocus
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select {...field} label="Trạng thái">
                    <MenuItem value="Active">Hoạt động</MenuItem>
                    <MenuItem value="Inactive">Ngừng hoạt động</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
