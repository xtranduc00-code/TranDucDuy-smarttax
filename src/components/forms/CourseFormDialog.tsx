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
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import { courseSchema, type CourseFormSchemaValues } from '../../utils/validationSchemas';
import { getCourseEditPermissions } from '../../services/coursePermissions';
import { SessionEditor } from '../courses/SessionEditor';
import type { Teacher } from '../../types/teacher';
import type { Room } from '../../types/room';
import type { CourseStatus } from '../../types/course';

interface CourseFormDialogProps {
  open: boolean;
  teachers: Teacher[];
  rooms: Room[];
  initialValues?: CourseFormSchemaValues;
  initialStatus?: CourseStatus;
  onSubmit: (values: CourseFormSchemaValues) => void;
  onClose: () => void;
}

const defaultValues: CourseFormSchemaValues = {
  name: '',
  teacherId: '',
  roomId: '',
  startDate: '',
  minimumStudents: 1,
  sessions: [],
};

export function CourseFormDialog({
  open,
  teachers,
  rooms,
  initialValues,
  initialStatus,
  onSubmit,
  onClose,
}: CourseFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseFormSchemaValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: initialValues ?? defaultValues,
  });

  useEffect(() => {
    if (open) reset(initialValues ?? defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValues, reset]);

  const permissions = getCourseEditPermissions(initialStatus ?? 'Draft');
  const fullyReadOnly =
    !permissions.name &&
    !permissions.teacher &&
    !permissions.room &&
    !permissions.startDate &&
    !permissions.minimumStudents &&
    !permissions.sessions;

  const sessionsRootError = errors.sessions?.message;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialValues ? 'Sửa khóa học' : 'Thêm khóa học'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên khóa học"
                  fullWidth
                  autoFocus
                  disabled={!permissions.name}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="teacherId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.teacherId} disabled={!permissions.teacher}>
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
                <FormControl fullWidth error={!!errors.roomId} disabled={!permissions.room}>
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
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    label="Ngày bắt đầu"
                    fullWidth
                    disabled={!permissions.startDate}
                    error={!!errors.startDate}
                    helperText={errors.startDate?.message}
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                )}
              />
              <Controller
                name="minimumStudents"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                    type="number"
                    label="Số học viên tối thiểu"
                    fullWidth
                    disabled={!permissions.minimumStudents}
                    error={!!errors.minimumStudents}
                    helperText={errors.minimumStudents?.message}
                  />
                )}
              />
            </Stack>

            <Divider />

            <SessionEditor control={control} readOnly={!permissions.sessions} rootError={sessionsRootError} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{fullyReadOnly ? 'Đóng' : 'Hủy'}</Button>
          {!fullyReadOnly && (
            <Button type="submit" variant="contained">
              Lưu
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}
