import type { Course, CourseStatus } from '../types/course';
import type { Enrollment, EnrollmentStatus } from '../types/enrollment';

/**
 * Maps an enrollment's status forward whenever its course reaches a new
 * status. Each course status only advances one specific prior status
 * (Ongoing promotes Pending, Finished promotes Confirmed, Cancelled promotes
 * everything), so re-running this on every reconciliation is idempotent and
 * never regresses an enrollment to an earlier status.
 */
export function nextEnrollmentStatus(courseStatus: CourseStatus, current: EnrollmentStatus): EnrollmentStatus {
  switch (courseStatus) {
    case 'Ongoing':
      return current === 'Pending' ? 'Confirmed' : current;
    case 'Finished':
      return current === 'Confirmed' ? 'Completed' : current;
    case 'Cancelled':
      return 'Cancelled';
    case 'Draft':
    case 'Enrollment Open':
    default:
      return current;
  }
}

/** Re-applies `nextEnrollmentStatus` for every enrollment against its course's current status. */
export function syncEnrollmentStatuses(enrollments: Enrollment[], courses: Course[]): Enrollment[] {
  const statusByCourseId = new Map(courses.map((course) => [course.id, course.status]));
  let changed = false;

  const next = enrollments.map((enrollment) => {
    const courseStatus = statusByCourseId.get(enrollment.courseId);
    if (!courseStatus) return enrollment;

    const updatedStatus = nextEnrollmentStatus(courseStatus, enrollment.status);
    if (updatedStatus === enrollment.status) return enrollment;

    changed = true;
    return { ...enrollment, status: updatedStatus };
  });

  return changed ? next : enrollments;
}
