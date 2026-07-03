import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import type { RiskCourseInfo } from '../../types/dashboard';

interface RiskCoursesCardProps {
  courses: RiskCourseInfo[];
}

export function RiskCoursesCard({ courses }: RiskCoursesCardProps) {
  return (
    <Card variant="outlined" sx={{ height: '100%', borderColor: courses.length > 0 ? 'warning.main' : undefined }}>
      <CardContent>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
          <WarningAmberIcon color="warning" fontSize="small" />
          <Typography variant="h6">Nguy cơ bị hủy</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Đang mở đăng ký, khai giảng trong 7 ngày tới nhưng chưa đủ học viên tối thiểu.
        </Typography>

        {courses.length === 0 ? (
          <Alert severity="success" variant="outlined">
            Không có khóa học nào có nguy cơ bị hủy.
          </Alert>
        ) : (
          <Stack spacing={1.5}>
            {courses.map((course) => (
              <Alert key={course.id} severity="warning" variant="outlined" icon={false}>
                <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="subtitle2">{course.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Khai giảng trong {course.daysRemaining} ngày · {course.currentStudents} / {course.minimumStudents} học
                      viên
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    color="warning"
                    label={`Cần thêm ${course.missingStudents} học viên`}
                  />
                </Stack>
              </Alert>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
