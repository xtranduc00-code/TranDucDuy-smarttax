import type { CourseStatus } from './course';

/** Counts backing the top statistic cards. */
export interface CourseSummary {
  total: number;
  enrollmentOpen: number;
  ongoing: number;
  finished: number;
  cancelled: number;
}

/** A course starting within the next 7 days. */
export interface UpcomingCourseInfo {
  id: string;
  name: string;
  teacherName: string;
  roomName: string;
  startDate: string;
  currentStudents: number;
  minimumStudents: number;
}

/** A course at risk of automatic cancellation for lack of enrollment. */
export interface RiskCourseInfo {
  id: string;
  name: string;
  daysRemaining: number;
  currentStudents: number;
  minimumStudents: number;
  missingStudents: number;
}

/** One teacher's teaching load for the current calendar month. */
export interface TeacherWorkloadInfo {
  teacherId: string;
  teacherName: string;
  sessionCount: number;
  courseCount: number;
  teachingHours: number;
}

/** Org-wide headcounts across teachers, students and rooms. */
export interface QuickStatistics {
  totalTeachers: number;
  activeTeachers: number;
  totalStudents: number;
  activeStudents: number;
  totalRooms: number;
  activeRooms: number;
}

/** A recently created course, for the "latest activity" list. */
export interface RecentCourseInfo {
  id: string;
  name: string;
  teacherName: string;
  status: CourseStatus;
  createdAt: string;
}
