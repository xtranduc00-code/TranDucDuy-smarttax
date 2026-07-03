import type { Course } from '../types/course';
import type { Teacher } from '../types/teacher';
import type { Student } from '../types/student';
import type { Room } from '../types/room';
import { buildCsv, downloadCsv, sanitizeFilenamePart } from '../utils/csv';
import { statusLabels } from '../utils/statusLabels';
import { formatDate } from '../utils/date';

/**
 * Exports the roster of a single course to CSV: every student currently
 * enrolled in it (course.studentIds), with their live Active/Inactive
 * status. No enrollment snapshot is kept anywhere in this app, so "current
 * enrollment status" is read straight from the Student record at export
 * time — the same data every other page in the app already relies on.
 */
export function exportCourseStudents(course: Course, students: Student[]): void {
  const headers = ['Mã học viên', 'Họ và tên', 'Trạng thái ghi danh'];

  const rows = course.studentIds
    .map((studentId) => students.find((s) => s.id === studentId))
    .filter((student): student is Student => !!student)
    .map((student) => [student.id, student.name, statusLabels[student.status]]);

  const csv = buildCsv(headers, rows);
  downloadCsv(`students_course_${sanitizeFilenamePart(course.name)}.csv`, csv);
}

interface ScheduleEntry {
  date: string;
  startTime: string;
  endTime: string;
  courseName: string;
  roomName: string;
}

/**
 * Exports every teaching session assigned to a teacher, across all of their
 * courses, sorted chronologically (date, then start time).
 */
export function exportTeacherSchedule(teacher: Teacher, courses: Course[], rooms: Room[]): void {
  const roomName = (roomId: string) => rooms.find((r) => r.id === roomId)?.name ?? 'Không xác định';

  const entries: ScheduleEntry[] = courses
    .filter((course) => course.teacherId === teacher.id)
    .flatMap((course) =>
      course.sessions.map((session) => ({
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        courseName: course.name,
        roomName: roomName(course.roomId),
      })),
    )
    // session.date is an ISO "yyyy-mm-dd" string, so lexicographic order is
    // also chronological order; startTime is zero-padded "HH:mm" for the
    // same reason. Sort on the raw values before formatting for display.
    .sort((a, b) => (a.date === b.date ? a.startTime.localeCompare(b.startTime) : a.date.localeCompare(b.date)));

  const headers = ['Ngày', 'Giờ bắt đầu', 'Giờ kết thúc', 'Khóa học', 'Phòng học'];
  const rows = entries.map((entry) => [
    formatDate(entry.date),
    entry.startTime,
    entry.endTime,
    entry.courseName,
    entry.roomName,
  ]);

  const csv = buildCsv(headers, rows);
  downloadCsv(`teacher_schedule_${sanitizeFilenamePart(teacher.name)}.csv`, csv);
}
