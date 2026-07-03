import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import type { TeacherWorkloadInfo } from '../../types/dashboard';

interface TeacherWorkloadCardProps {
  workload: TeacherWorkloadInfo[];
}

export function TeacherWorkloadCard({ workload }: TeacherWorkloadCardProps) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Khối lượng giảng dạy
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Top 5 giáo viên bận rộn nhất trong tháng này.
        </Typography>

        {workload.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Chưa có buổi dạy nào trong tháng này.
          </Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Giáo viên</TableCell>
                  <TableCell align="right">Số buổi dạy</TableCell>
                  <TableCell align="right">Số khóa học</TableCell>
                  <TableCell align="right">Số giờ dạy</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workload.map((teacher) => (
                  <TableRow key={teacher.teacherId} hover>
                    <TableCell>{teacher.teacherName}</TableCell>
                    <TableCell align="right">{teacher.sessionCount}</TableCell>
                    <TableCell align="right">{teacher.courseCount}</TableCell>
                    <TableCell align="right">{teacher.teachingHours}</TableCell>
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
