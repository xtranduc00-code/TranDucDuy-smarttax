import type { Course } from '../types/course';
import type { Student } from '../types/student';
import type { Room } from '../types/room';
import type { Teacher } from '../types/teacher';
import { validateCourseConflicts, type CourseConflictCandidate, type ScheduleConflict } from './conflictValidation';

export interface EnrollCheckResult {
  canEnroll: boolean;
  reason?: string;
  conflicts?: ScheduleConflict[];
}

export interface EnrollEligibilityContext {
  course: Course;
  student: Student;
  room: Room;
  courses: Course[];
  teachers: Teacher[];
  rooms: Room[];
  students: Student[];
}

/**
 * Full enrollment eligibility check, evaluated in the order a user would
 * expect to be told about a problem: student usability, course acceptance,
 * duplicate enrollment, room capacity, and finally whether taking that seat
 * would double-book the student against another course's sessions.
 */
export function canEnrollStudent(ctx: EnrollEligibilityContext): EnrollCheckResult {
  const { course, student, room, courses, teachers, rooms, students } = ctx;

  if (student.status === 'Inactive') {
    return { canEnroll: false, reason: 'Học viên đang ngừng hoạt động nên không thể ghi danh.' };
  }
  if (course.status !== 'Enrollment Open') {
    return { canEnroll: false, reason: 'Khóa học hiện không nhận đăng ký.' };
  }
  if (course.studentIds.includes(student.id)) {
    return { canEnroll: false, reason: 'Học viên đã được ghi danh vào khóa học này.' };
  }
  if (course.studentIds.length >= room.capacity) {
    return { canEnroll: false, reason: 'Đã vượt quá sức chứa phòng học.' };
  }

  const candidate: CourseConflictCandidate = {
    id: course.id,
    teacherId: course.teacherId,
    roomId: course.roomId,
    studentIds: [...course.studentIds, student.id],
    sessions: course.sessions,
  };
  const conflictResult = validateCourseConflicts(candidate, courses, { teachers, rooms, students });
  if (!conflictResult.valid) {
    return {
      canEnroll: false,
      reason: 'Học viên có lịch học bị trùng với khóa học khác.',
      conflicts: conflictResult.conflicts,
    };
  }

  return { canEnroll: true };
}
