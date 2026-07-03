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
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import { activitySchema, type ActivityFormSchemaValues } from '../../utils/validationSchemas';
import type { Teacher } from '../../types/teacher';
import type { Student } from '../../types/student';
import type { Room } from '../../types/room';

interface ActivityFormDialogProps {
  open: boolean;
  teachers: Teacher[];
  rooms: Room[];
  students: Student[];
  initialValues?: ActivityFormSchemaValues;
  onSubmit: (values: ActivityFormSchemaValues) => void;
  onClose: () => void;
}

const defaultValues: ActivityFormSchemaValues = {
  name: '',
  teacherId: '',
  roomId: '',
  studentIds: [],
  status: 'ongoing',
};

export function ActivityFormDialog({
  open,
  teachers,
  rooms,
  students,
  initialValues,
  onSubmit,
  onClose,
}: ActivityFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ActivityFormSchemaValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: initialValues ?? defaultValues,
  });

  useEffect(() => {
    if (open) reset(initialValues ?? defaultValues);
  }, [open, initialValues, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialValues ? 'Sửa lớp học' : 'Thêm lớp học'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên lớp học"
                  fullWidth
                  autoFocus
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="teacherId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.teacherId}>
                  <InputLabel>Giáo viên</InputLabel>
                  <Select {...field} label="Giáo viên">
                    {teachers
                      .filter((t) => t.status === 'Active' || t.id === initialValues?.teacherId)
                      .map((t) => (
                        <MenuItem key={t.id} value={t.id} disabled={t.status === 'Inactive'}>
                          {t.name}
                          {t.status === 'Inactive' ? ' (Ngừng hoạt động)' : ''}
                        </MenuItem>
                      ))}
                  </Select>
                  {errors.teacherId && <FormHelperText>{errors.teacherId.message}</FormHelperText>}
                </FormControl>
              )}
            />
            <Controller
              name="roomId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.roomId}>
                  <InputLabel>Phòng học</InputLabel>
                  <Select {...field} label="Phòng học">
                    {rooms
                      .filter((r) => r.status === 'Active' || r.id === initialValues?.roomId)
                      .map((r) => (
                        <MenuItem key={r.id} value={r.id} disabled={r.status === 'Inactive'}>
                          {r.name} ({r.code}){r.status === 'Inactive' ? ' (Ngừng hoạt động)' : ''}
                        </MenuItem>
                      ))}
                  </Select>
                  {errors.roomId && <FormHelperText>{errors.roomId.message}</FormHelperText>}
                </FormControl>
              )}
            />
            <Controller
              name="studentIds"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.studentIds}>
                  <InputLabel>Học sinh</InputLabel>
                  <Select
                    {...field}
                    multiple
                    label="Học sinh"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((id) => {
                          const student = students.find((s) => s.id === id);
                          return <Chip key={id} label={student?.name ?? id} size="small" />;
                        })}
                      </Box>
                    )}
                  >
                    {students
                      .filter((s) => s.status === 'Active' || initialValues?.studentIds.includes(s.id))
                      .map((s) => (
                        <MenuItem key={s.id} value={s.id} disabled={s.status === 'Inactive'}>
                          {s.name}
                          {s.status === 'Inactive' ? ' (Ngừng hoạt động)' : ''}
                        </MenuItem>
                      ))}
                  </Select>
                  {errors.studentIds && <FormHelperText>{errors.studentIds.message}</FormHelperText>}
                </FormControl>
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select {...field} label="Trạng thái">
                    <MenuItem value="ongoing">Đang diễn ra</MenuItem>
                    <MenuItem value="finished">Đã kết thúc</MenuItem>
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
