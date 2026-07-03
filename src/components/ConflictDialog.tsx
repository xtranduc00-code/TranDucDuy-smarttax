import type { ReactElement } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import PersonIcon from '@mui/icons-material/Person';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GroupIcon from '@mui/icons-material/Group';
import { formatDate } from '../utils/date';
import type { ScheduleConflict } from '../services/conflictValidation';

interface ConflictDialogProps {
  open: boolean;
  conflicts: ScheduleConflict[];
  onClose: () => void;
}

const typeMeta: Record<ScheduleConflict['type'], { label: string; icon: ReactElement; color: 'error' | 'warning' | 'info' }> = {
  teacher: { label: 'Xung đột Giáo viên', icon: <PersonIcon fontSize="small" />, color: 'error' },
  room: { label: 'Xung đột Phòng học', icon: <MeetingRoomIcon fontSize="small" />, color: 'warning' },
  student: { label: 'Xung đột Học sinh', icon: <GroupIcon fontSize="small" />, color: 'info' },
};

function conflictParts(conflict: ScheduleConflict): { subject: string; verb: string } {
  switch (conflict.type) {
    case 'teacher':
      return { subject: conflict.teacherName, verb: 'đang dạy' };
    case 'room':
      return { subject: conflict.roomName, verb: 'đang được sử dụng bởi' };
    case 'student':
      return { subject: conflict.studentName, verb: 'đã ghi danh' };
  }
}

export function ConflictDialog({ open, conflicts, onClose }: ConflictDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Phát hiện xung đột lịch học</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Không thể lưu vì lịch học bị trùng với các khóa học sau. Vui lòng điều chỉnh trước khi lưu lại.
        </Typography>
        <Stack spacing={2} divider={<Divider flexItem />}>
          {conflicts.map((conflict, index) => {
            const meta = typeMeta[conflict.type];
            const { subject, verb } = conflictParts(conflict);
            return (
              <Stack key={index} spacing={0.5}>
                <Chip
                  icon={meta.icon}
                  label={meta.label}
                  color={meta.color}
                  size="small"
                  sx={{ width: 'fit-content' }}
                />
                <Typography variant="body2">
                  <strong>{subject}</strong> {verb} <strong>{conflict.courseName}</strong> ({conflict.sessionTitle})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(conflict.date)} · {conflict.startTime} - {conflict.endTime}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Đã hiểu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
