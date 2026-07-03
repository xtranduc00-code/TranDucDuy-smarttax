import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DownloadIcon from '@mui/icons-material/Download';
import { useCourseStore } from '../store/courseStore';
import { useTeacherStore } from '../store/teacherStore';
import { useStudentStore } from '../store/studentStore';
import { useRoomStore } from '../store/roomStore';
import { useToast } from '../hooks/useToast';
import { exportCourseStudents, exportTeacherSchedule } from '../services/exportService';

export default function ExportPage() {
  const courses = useCourseStore((s) => s.items);
  const teachers = useTeacherStore((s) => s.items);
  const students = useStudentStore((s) => s.items);
  const rooms = useRoomStore((s) => s.items);
  const { showToast } = useToast();

  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');

  function handleExportStudents() {
    const course = courses.find((c) => c.id === selectedCourseId);
    if (!course) return;
    exportCourseStudents(course, students);
    showToast('Đã bắt đầu tải xuống danh sách học viên', 'success');
  }

  function handleExportSchedule() {
    const teacher = teachers.find((t) => t.id === selectedTeacherId);
    if (!teacher) return;
    exportTeacherSchedule(teacher, courses, rooms);
    showToast('Đã bắt đầu tải xuống lịch dạy', 'success');
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Xuất báo cáo
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Xuất dữ liệu ra file CSV, mở trực tiếp bằng Microsoft Excel.
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Danh sách học viên theo khóa học
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Xuất danh sách học viên đang ghi danh trong khóa học đã chọn.
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Chọn khóa học</InputLabel>
              <Select
                value={selectedCourseId}
                label="Chọn khóa học"
                onChange={(e) => setSelectedCourseId(e.target.value)}
              >
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
          <CardActions sx={{ px: 2, pb: 2 }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              disabled={!selectedCourseId}
              onClick={handleExportStudents}
            >
              Xuất file
            </Button>
          </CardActions>
        </Card>

        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Lịch dạy của giáo viên
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Xuất toàn bộ buổi dạy của giáo viên đã chọn, sắp xếp theo ngày.
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Chọn giáo viên</InputLabel>
              <Select
                value={selectedTeacherId}
                label="Chọn giáo viên"
                onChange={(e) => setSelectedTeacherId(e.target.value)}
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
          <CardActions sx={{ px: 2, pb: 2 }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              disabled={!selectedTeacherId}
              onClick={handleExportSchedule}
            >
              Xuất file
            </Button>
          </CardActions>
        </Card>
      </Stack>
    </Stack>
  );
}
