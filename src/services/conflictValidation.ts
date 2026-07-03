import type { Course, Session } from '../types/course';
import type { Teacher } from '../types/teacher';
import type { Room } from '../types/room';
import type { Student } from '../types/student';

/** Minimal session shape needed for overlap checks (matches Session and SessionFormValues). */
export type ConflictSession = Pick<Session, 'title' | 'date' | 'startTime' | 'endTime'>;

/** The course being created/edited, described only by the fields relevant to conflict detection. */
export interface CourseConflictCandidate {
  id?: string;
  teacherId: string;
  roomId: string;
  studentIds: string[];
  sessions: ConflictSession[];
}

interface ConflictBase {
  courseId: string;
  courseName: string;
  sessionTitle: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface TeacherConflict extends ConflictBase {
  type: 'teacher';
  teacherId: string;
  teacherName: string;
}

export interface RoomConflict extends ConflictBase {
  type: 'room';
  roomId: string;
  roomName: string;
}

export interface StudentConflict extends ConflictBase {
  type: 'student';
  studentId: string;
  studentName: string;
}

export type ScheduleConflict = TeacherConflict | RoomConflict | StudentConflict;

export interface ConflictValidationResult {
  valid: boolean;
  conflicts: ScheduleConflict[];
}

export interface ConflictLookups {
  teachers: Teacher[];
  rooms: Room[];
  students: Student[];
}

// Cancelled courses no longer occupy a teacher, room, or student slot.
const CONFLICT_IGNORED_STATUSES: Course['status'][] = ['Cancelled'];

/**
 * Two sessions conflict when they happen on the same date and their time
 * ranges intersect (sessionA.start < sessionB.end && sessionA.end > sessionB.start).
 */
export function checkTimeOverlap(a: ConflictSession, b: ConflictSession): boolean {
  return a.date === b.date && a.startTime < b.endTime && a.endTime > b.startTime;
}

function findName<T extends { id: string; name: string }>(items: T[], id: string): string {
  return items.find((item) => item.id === id)?.name ?? 'Không xác định';
}

// Excludes the course being edited (so it never conflicts with its own previous version)
// and any cancelled course, which no longer holds its schedule slot.
function comparableCourses(candidate: CourseConflictCandidate, courses: Course[]): Course[] {
  return courses.filter(
    (course) => course.id !== candidate.id && !CONFLICT_IGNORED_STATUSES.includes(course.status),
  );
}

export function checkTeacherConflict(
  candidate: CourseConflictCandidate,
  courses: Course[],
  teachers: Teacher[],
): TeacherConflict[] {
  const conflicts: TeacherConflict[] = [];
  const teacherName = findName(teachers, candidate.teacherId);

  for (const course of comparableCourses(candidate, courses)) {
    if (course.teacherId !== candidate.teacherId) continue;
    for (const candidateSession of candidate.sessions) {
      for (const existingSession of course.sessions) {
        if (!checkTimeOverlap(candidateSession, existingSession)) continue;
        conflicts.push({
          type: 'teacher',
          teacherId: candidate.teacherId,
          teacherName,
          courseId: course.id,
          courseName: course.name,
          sessionTitle: existingSession.title,
          date: existingSession.date,
          startTime: existingSession.startTime,
          endTime: existingSession.endTime,
        });
      }
    }
  }
  return conflicts;
}

export function checkRoomConflict(
  candidate: CourseConflictCandidate,
  courses: Course[],
  rooms: Room[],
): RoomConflict[] {
  const conflicts: RoomConflict[] = [];
  const roomName = findName(rooms, candidate.roomId);

  for (const course of comparableCourses(candidate, courses)) {
    if (course.roomId !== candidate.roomId) continue;
    for (const candidateSession of candidate.sessions) {
      for (const existingSession of course.sessions) {
        if (!checkTimeOverlap(candidateSession, existingSession)) continue;
        conflicts.push({
          type: 'room',
          roomId: candidate.roomId,
          roomName,
          courseId: course.id,
          courseName: course.name,
          sessionTitle: existingSession.title,
          date: existingSession.date,
          startTime: existingSession.startTime,
          endTime: existingSession.endTime,
        });
      }
    }
  }
  return conflicts;
}

export function checkStudentConflict(
  candidate: CourseConflictCandidate,
  courses: Course[],
  students: Student[],
): StudentConflict[] {
  const conflicts: StudentConflict[] = [];

  for (const course of comparableCourses(candidate, courses)) {
    const sharedStudentIds = candidate.studentIds.filter((studentId) => course.studentIds.includes(studentId));
    if (sharedStudentIds.length === 0) continue;

    for (const candidateSession of candidate.sessions) {
      for (const existingSession of course.sessions) {
        if (!checkTimeOverlap(candidateSession, existingSession)) continue;
        for (const studentId of sharedStudentIds) {
          conflicts.push({
            type: 'student',
            studentId,
            studentName: findName(students, studentId),
            courseId: course.id,
            courseName: course.name,
            sessionTitle: existingSession.title,
            date: existingSession.date,
            startTime: existingSession.startTime,
            endTime: existingSession.endTime,
          });
        }
      }
    }
  }
  return conflicts;
}

/**
 * Runs every conflict check for a course being created or updated and aggregates
 * the results. Callers must block the save whenever `valid` is false.
 */
export function validateCourseConflicts(
  candidate: CourseConflictCandidate,
  courses: Course[],
  lookups: ConflictLookups,
): ConflictValidationResult {
  const conflicts: ScheduleConflict[] = [
    ...checkTeacherConflict(candidate, courses, lookups.teachers),
    ...checkRoomConflict(candidate, courses, lookups.rooms),
    ...checkStudentConflict(candidate, courses, lookups.students),
  ];
  return { valid: conflicts.length === 0, conflicts };
}
