import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import { CourseStatusBadge } from '../courses/CourseStatusBadge';
import { formatDate } from '../../utils/date';
import type { RecentCourseInfo } from '../../types/dashboard';

interface RecentCoursesCardProps {
  courses: RecentCourseInfo[];
}

export function RecentCoursesCard({ courses }: RecentCoursesCardProps) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Khóa học mới tạo gần đây
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          5 khóa học mới nhất.
        </Typography>

        {courses.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Chưa có khóa học nào.
          </Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Khóa học</TableCell>
                  <TableCell>Giáo viên</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id} hover>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.teacherName}</TableCell>
                    <TableCell>
                      <CourseStatusBadge status={course.status} />
                    </TableCell>
                    <TableCell>{formatDate(course.createdAt)}</TableCell>
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
