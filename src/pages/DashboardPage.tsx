import { useMemo } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useCourseStore } from '../store/courseStore';
import { useTeacherStore } from '../store/teacherStore';
import { useStudentStore } from '../store/studentStore';
import { useRoomStore } from '../store/roomStore';
import { StatCard } from '../components/dashboard/StatCard';
import { QuickStatsRow } from '../components/dashboard/QuickStatsRow';
import { UpcomingCoursesCard } from '../components/dashboard/UpcomingCoursesCard';
import { RiskCoursesCard } from '../components/dashboard/RiskCoursesCard';
import { TeacherWorkloadCard } from '../components/dashboard/TeacherWorkloadCard';
import { RecentCoursesCard } from '../components/dashboard/RecentCoursesCard';
import {
  getCourseSummary,
  getUpcomingCourses,
  getRiskCourses,
  getTeacherWorkload,
  getQuickStatistics,
  getRecentCourses,
} from '../services/dashboardService';

export default function DashboardPage() {
  // Every card below is derived purely from these four store slices — any
  // create/edit/delete/enroll/status-change action mutates one of these
  // arrays, which recomputes the memoized values and re-renders the page.
  // No extra "refresh" wiring is needed.
  const courses = useCourseStore((s) => s.items);
  const teachers = useTeacherStore((s) => s.items);
  const students = useStudentStore((s) => s.items);
  const rooms = useRoomStore((s) => s.items);

  const summary = useMemo(() => getCourseSummary(courses), [courses]);
  const upcomingCourses = useMemo(() => getUpcomingCourses(courses, teachers, rooms), [courses, teachers, rooms]);
  const riskCourses = useMemo(() => getRiskCourses(courses), [courses]);
  const teacherWorkload = useMemo(() => getTeacherWorkload(courses, teachers), [courses, teachers]);
  const quickStats = useMemo(() => getQuickStatistics(teachers, students, rooms), [teachers, students, rooms]);
  const recentCourses = useMemo(() => getRecentCourses(courses, teachers), [courses, teachers]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Bảng điều khiển
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tổng quan tình trạng hoạt động của trung tâm đào tạo.
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap' }}>
        <StatCard title="Tổng số khóa học" count={summary.total} icon={<LibraryBooksIcon />} color="primary" />
        <StatCard title="Đang mở đăng ký" count={summary.enrollmentOpen} icon={<HowToRegIcon />} color="info" />
        <StatCard title="Đang diễn ra" count={summary.ongoing} icon={<AutorenewIcon />} color="warning" />
        <StatCard title="Đã kết thúc" count={summary.finished} icon={<CheckCircleIcon />} color="success" />
        <StatCard title="Đã hủy" count={summary.cancelled} icon={<CancelIcon />} color="error" />
      </Stack>

      <QuickStatsRow stats={quickStats} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <UpcomingCoursesCard courses={upcomingCourses} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <RiskCoursesCard courses={riskCourses} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <TeacherWorkloadCard workload={teacherWorkload} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <RecentCoursesCard courses={recentCourses} />
        </Grid>
      </Grid>
    </Stack>
  );
}
