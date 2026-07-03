import type { Course, Session } from '../types/course';
import type { Teacher } from '../types/teacher';
import type { Student } from '../types/student';
import type { Room } from '../types/room';
import type {
  CourseSummary,
  UpcomingCourseInfo,
  RiskCourseInfo,
  TeacherWorkloadInfo,
  QuickStatistics,
  RecentCourseInfo,
} from '../types/dashboard';
import { daysUntilStart } from '../utils/date';

const UPCOMING_WINDOW_DAYS = 7;
const RISK_WINDOW_DAYS = 7;
const WORKLOAD_TOP_N = 5;
const RECENT_COURSES_TOP_N = 5;

function findName<T extends { id: string; name: string }>(items: T[], id: string): string {
  return items.find((item) => item.id === id)?.name ?? 'Không xác định';
}

/**
 * Total courses grouped by status, for the top statistic cards. Courses in
 * "Draft" are counted in `total` but have no dedicated card per the spec.
 */
export function getCourseSummary(courses: Course[]): CourseSummary {
  return {
    total: courses.length,
    enrollmentOpen: courses.filter((course) => course.status === 'Enrollment Open').length,
    ongoing: courses.filter((course) => course.status === 'Ongoing').length,
    finished: courses.filter((course) => course.status === 'Finished').length,
    cancelled: courses.filter((course) => course.status === 'Cancelled').length,
  };
}

/**
 * A course is "upcoming" when it hasn't already finished or been cancelled,
 * and its start date falls within the next 7 days (today counts as day 0).
 * This intentionally includes Draft courses too — an admin needs to know a
 * draft is about to start so they remember to open enrollment for it.
 */
export function isUpcomingCourse(course: Course, now: Date = new Date()): boolean {
  if (course.status === 'Finished' || course.status === 'Cancelled') return false;
  const days = daysUntilStart(course.startDate, now);
  return days >= 0 && days <= UPCOMING_WINDOW_DAYS;
}

/** Courses starting within the next 7 days, nearest start date first. */
export function getUpcomingCourses(
  courses: Course[],
  teachers: Teacher[],
  rooms: Room[],
  now: Date = new Date(),
): UpcomingCourseInfo[] {
  return courses
    .filter((course) => isUpcomingCourse(course, now))
    .map((course) => ({
      id: course.id,
      name: course.name,
      teacherName: findName(teachers, course.teacherId),
      roomName: findName(rooms, course.roomId),
      startDate: course.startDate,
      currentStudents: course.studentIds.length,
      minimumStudents: course.minimumStudents,
    }))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

/**
 * A course is "at risk" of the automatic cancellation rule (see
 * courseStatusEngine) when it is still open for enrollment, starts within
 * the next 7 days, and hasn't reached its minimum student count yet.
 */
export function isRiskCourse(course: Course, now: Date = new Date()): boolean {
  if (course.status !== 'Enrollment Open') return false;
  const days = daysUntilStart(course.startDate, now);
  return days >= 0 && days <= RISK_WINDOW_DAYS && course.studentIds.length < course.minimumStudents;
}

/** Courses likely to be auto-cancelled soon, most urgent (fewest days) first. */
export function getRiskCourses(courses: Course[], now: Date = new Date()): RiskCourseInfo[] {
  return courses
    .filter((course) => isRiskCourse(course, now))
    .map((course) => ({
      id: course.id,
      name: course.name,
      daysRemaining: daysUntilStart(course.startDate, now),
      currentStudents: course.studentIds.length,
      minimumStudents: course.minimumStudents,
      missingStudents: course.minimumStudents - course.studentIds.length,
    }))
    .sort((a, b) => a.daysRemaining - b.daysRemaining);
}

/** Duration of a single session in hours, from its "HH:mm" start/end times. */
function sessionHours(session: Session): number {
  const [startHour, startMinute] = session.startTime.split(':').map(Number);
  const [endHour, endMinute] = session.endTime.split(':').map(Number);
  const minutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);
  return minutes / 60;
}

/** Total teaching hours across a set of sessions. */
export function calculateTeachingHours(sessions: Session[]): number {
  return sessions.reduce((total, session) => total + sessionHours(session), 0);
}

/** Whether a date-only ISO string falls in the same calendar month as `now`. */
function isInSameMonth(dateIso: string, now: Date): boolean {
  const date = new Date(dateIso);
  return date.getUTCFullYear() === now.getFullYear() && date.getUTCMonth() === now.getMonth();
}

/**
 * Workload per teacher for the current calendar month: how many sessions
 * they teach, across how many distinct courses, and the total teaching
 * hours those sessions add up to. Sorted by teaching hours (the most
 * direct measure of workload), descending, capped to the busiest 5.
 */
export function getTeacherWorkload(courses: Course[], teachers: Teacher[], now: Date = new Date()): TeacherWorkloadInfo[] {
  const sessionsByTeacher = new Map<string, Session[]>();
  const courseIdsByTeacher = new Map<string, Set<string>>();

  for (const course of courses) {
    const sessionsThisMonth = course.sessions.filter((session) => isInSameMonth(session.date, now));
    if (sessionsThisMonth.length === 0) continue;

    const existingSessions = sessionsByTeacher.get(course.teacherId) ?? [];
    sessionsByTeacher.set(course.teacherId, [...existingSessions, ...sessionsThisMonth]);

    const existingCourseIds = courseIdsByTeacher.get(course.teacherId) ?? new Set<string>();
    existingCourseIds.add(course.id);
    courseIdsByTeacher.set(course.teacherId, existingCourseIds);
  }

  const workload: TeacherWorkloadInfo[] = teachers
    .filter((teacher) => sessionsByTeacher.has(teacher.id))
    .map((teacher) => {
      const sessions = sessionsByTeacher.get(teacher.id) ?? [];
      return {
        teacherId: teacher.id,
        teacherName: teacher.name,
        sessionCount: sessions.length,
        courseCount: courseIdsByTeacher.get(teacher.id)?.size ?? 0,
        teachingHours: calculateTeachingHours(sessions),
      };
    });

  return workload.sort((a, b) => b.teachingHours - a.teachingHours).slice(0, WORKLOAD_TOP_N);
}

/** Org-wide headcounts, reusing the same Active/Inactive status already on every entity. */
export function getQuickStatistics(teachers: Teacher[], students: Student[], rooms: Room[]): QuickStatistics {
  return {
    totalTeachers: teachers.length,
    activeTeachers: teachers.filter((teacher) => teacher.status === 'Active').length,
    totalStudents: students.length,
    activeStudents: students.filter((student) => student.status === 'Active').length,
    totalRooms: rooms.length,
    activeRooms: rooms.filter((room) => room.status === 'Active').length,
  };
}

/** The most recently created courses, newest first. */
export function getRecentCourses(courses: Course[], teachers: Teacher[]): RecentCourseInfo[] {
  return [...courses]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, RECENT_COURSES_TOP_N)
    .map((course) => ({
      id: course.id,
      name: course.name,
      teacherName: findName(teachers, course.teacherId),
      status: course.status,
      createdAt: course.createdAt,
    }));
}
