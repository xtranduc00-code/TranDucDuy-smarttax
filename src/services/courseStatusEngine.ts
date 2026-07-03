import type { Course, CourseStatus, Session } from '../types/course';

const TERMINAL_STATUSES: CourseStatus[] = ['Draft', 'Finished', 'Cancelled'];

function isSessionFinished(session: Session, now: Date): boolean {
  return new Date(`${session.date}T${session.endTime}`).getTime() < now.getTime();
}

export function evaluateCourseStatus(course: Course, now: Date = new Date()): CourseStatus {
  if (TERMINAL_STATUSES.includes(course.status)) {
    return course.status;
  }

  const started = now >= new Date(course.startDate);
  if (!started) return 'Enrollment Open';

  const minimumMet = course.studentIds.length >= course.minimumStudents;
  if (!minimumMet) return 'Cancelled';

  const allSessionsFinished =
    course.sessions.length > 0 && course.sessions.every((session) => isSessionFinished(session, now));
  return allSessionsFinished ? 'Finished' : 'Ongoing';
}

export function reconcileCourses(courses: Course[], now: Date = new Date()): Course[] {
  let changed = false;
  const next = courses.map((course) => {
    const nextStatus = evaluateCourseStatus(course, now);
    if (nextStatus !== course.status) {
      changed = true;
      return { ...course, status: nextStatus };
    }
    return course;
  });
  return changed ? next : courses;
}
