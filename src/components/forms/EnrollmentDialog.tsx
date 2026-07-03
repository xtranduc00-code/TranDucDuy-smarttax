import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Course } from '../../types/course';
import type { Student } from '../../types/student';
import type { Room } from '../../types/room';
import type { Enrollment } from '../../types/enrollment';
import { ProgressIndicator } from '../courses/ProgressIndicator';
import { EnrollmentStatusBadge } from '../EnrollmentStatusBadge';
import { getCourseEditPermissions } from '../../services/coursePermissions';

interface EnrollmentDialogProps {
  open: boolean;
  course: Course | null;
  room: Room | undefined;
  students: Student[];
  enrollments: Enrollment[];
  onEnroll: (courseId: string, studentId: string) => void;
  onCancelEnrollment: (enrollmentId: string) => void;
  onRemoveEnrollment: (enrollmentId: string) => void;
  onClose: () => void;
}

export function EnrollmentDialog({
  open,
  course,
  room,
  students,
  enrollments,
  onEnroll,
  onCancelEnrollment,
  onRemoveEnrollment,
  onClose,
}: EnrollmentDialogProps) {
  const [selected, setSelected] = useState('');

  if (!course) return null;
  const current = course;

  const permissions = getCourseEditPermissions(current.status);
  const activeCount = current.studentIds.length;
  const remainingSeats = room ? Math.max(0, room.capacity - activeCount) : undefined;
  const availableStudents = students.filter((s) => s.status === 'Active' && !current.studentIds.includes(s.id));

  function studentName(id: string): string {
    return students.find((s) => s.id === id)?.name ?? 'Không xác định';
  }

  function handleAdd() {
    if (!selected) return;
    onEnroll(current.id, selected);
    setSelected('');
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Ghi danh học viên — {current.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <ProgressIndicator current={activeCount} minimum={current.minimumStudents} />
          {room && (
            <>
              <ProgressIndicator current={activeCount} minimum={room.capacity} unit="chỗ" mode="capacity" />
              <Typography variant="caption" color="text.secondary">
                Còn {remainingSeats} chỗ trống trong phòng {room.name} (sức chứa {room.capacity})
              </Typography>
            </>
          )}

          {!permissions.enrollment && (
            <Alert severity="info">Chỉ có thể chỉnh sửa danh sách học viên khi khóa học đang mở đăng ký.</Alert>
          )}

          {permissions.enrollment && (
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth size="small">
                <InputLabel>Thêm học viên</InputLabel>
                <Select value={selected} label="Thêm học viên" onChange={(e) => setSelected(e.target.value)}>
                  {availableStudents.length === 0 && (
                    <MenuItem value="" disabled>
                      Không còn học viên phù hợp
                    </MenuItem>
                  )}
                  {availableStudents.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" onClick={handleAdd} disabled={!selected}>
                Thêm
              </Button>
            </Stack>
          )}

          <Divider />

          <Typography variant="subtitle2">Danh sách ghi danh ({enrollments.length})</Typography>
          {enrollments.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Chưa có học viên nào.
            </Typography>
          ) : (
            <List dense disablePadding>
              {enrollments.map((enrollment) => {
                const canCancel = enrollment.status === 'Pending' || enrollment.status === 'Confirmed';
                return (
                  <ListItem
                    key={enrollment.id}
                    disablePadding
                    secondaryAction={
                      <Stack direction="row" spacing={0.5}>
                        {canCancel && (
                          <Tooltip title="Hủy ghi danh">
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={() => onCancelEnrollment(enrollment.id)}
                              aria-label="Hủy ghi danh"
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Xóa ghi danh">
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => onRemoveEnrollment(enrollment.id)}
                            aria-label="Xóa ghi danh"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    }
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <span>{studentName(enrollment.studentId)}</span>
                          <EnrollmentStatusBadge status={enrollment.status} />
                        </Stack>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
