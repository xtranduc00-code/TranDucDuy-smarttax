import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import EventIcon from '@mui/icons-material/Event';
import { ProgressIndicator } from '../courses/ProgressIndicator';
import { formatDate } from '../../utils/date';
import type { UpcomingCourseInfo } from '../../types/dashboard';

interface UpcomingCoursesCardProps {
  courses: UpcomingCourseInfo[];
}

export function UpcomingCoursesCard({ courses }: UpcomingCoursesCardProps) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Khóa học sắp khai giảng
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Trong 7 ngày tới.
        </Typography>

        {courses.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon fontSize="small" /> Không có khóa học nào sắp khai giảng.
          </Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Khóa học</TableCell>
                  <TableCell>Giáo viên</TableCell>
                  <TableCell>Phòng học</TableCell>
                  <TableCell>Ngày bắt đầu</TableCell>
                  <TableCell>Học viên</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id} hover>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.teacherName}</TableCell>
                    <TableCell>{course.roomName}</TableCell>
                    <TableCell>{formatDate(course.startDate)}</TableCell>
                    <TableCell>
                      <ProgressIndicator current={course.currentStudents} minimum={course.minimumStudents} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}
