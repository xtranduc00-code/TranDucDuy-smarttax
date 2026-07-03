import { useEffect, useState } from 'react';
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
import type { Course } from '../../types/course';
import type { Student } from '../../types/student';

interface EnrollmentFormDialogProps {
  open: boolean;
  courses: Course[];
  students: Student[];
  onSubmit: (courseId: string, studentId: string) => void;
  onClose: () => void;
}

export function EnrollmentFormDialog({ open, courses, students, onSubmit, onClose }: EnrollmentFormDialogProps) {
  const [courseId, setCourseId] = useState('');
  const [studentId, setStudentId] = useState('');

  useEffect(() => {
    if (open) {
      setCourseId('');
      setStudentId('');
    }
  }, [open]);

  const openCourses = courses.filter((course) => course.status === 'Enrollment Open');
  const selectedCourse = openCourses.find((course) => course.id === courseId);
  const availableStudents = selectedCourse
    ? students.filter((student) => student.status === 'Active' && !selectedCourse.studentIds.includes(student.id))
    : [];

  function handleCourseChange(value: string) {
    setCourseId(value);
    setStudentId('');
  }

  function handleSubmit() {
    if (!courseId || !studentId) return;
    onSubmit(courseId, studentId);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Thêm ghi danh</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Khóa học</InputLabel>
            <Select value={courseId} label="Khóa học" onChange={(e) => handleCourseChange(e.target.value)}>
              {openCourses.length === 0 && (
                <MenuItem value="" disabled>
                  Không có khóa học đang mở đăng ký
                </MenuItem>
              )}
              {openCourses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" disabled={!courseId}>
            <InputLabel>Học viên</InputLabel>
            <Select value={studentId} label="Học viên" onChange={(e) => setStudentId(e.target.value)}>
              {availableStudents.length === 0 && (
                <MenuItem value="" disabled>
                  Không còn học viên phù hợp
                </MenuItem>
              )}
              {availableStudents.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!courseId || !studentId}>
          Ghi danh
        </Button>
      </DialogActions>
    </Dialog>
  );
}
