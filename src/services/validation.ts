import { useActivityStore } from '../store/activityStore';
import { useCourseStore } from '../store/courseStore';
import type { Course, CourseStatus } from '../types/course';
import { courseStatusLabels } from '../utils/courseLabels';

export interface DeleteCheckResult {
  canDelete: boolean;
  reason?: string;
}

const DELETABLE_COURSE_STATUSES: CourseStatus[] = ['Draft', 'Cancelled', 'Finished'];

function hasOngoingCourseForTeacher(teacherId: string): boolean {
  return useCourseStore.getState().items.some((course) => course.teacherId === teacherId && course.status === 'Ongoing');
}

function hasOngoingCourseForRoom(roomId: string): boolean {
  return useCourseStore.getState().items.some((course) => course.roomId === roomId && course.status === 'Ongoing');
}

function hasOngoingCourseForStudent(studentId: string): boolean {
  return useCourseStore
    .getState()
    .items.some((course) => course.studentIds.includes(studentId) && course.status === 'Ongoing');
}

export function canDeleteTeacher(teacherId: string): DeleteCheckResult {
  const hasOngoing =
    useActivityStore.getState().hasOngoingForTeacher(teacherId) || hasOngoingCourseForTeacher(teacherId);
  return hasOngoing
    ? { canDelete: false, reason: 'Giáo viên này đang dạy một lớp đang diễn ra nên không thể xóa.' }
    : { canDelete: true };
}

export function canDeleteRoom(roomId: string): DeleteCheckResult {
  const hasOngoing = useActivityStore.getState().hasOngoingForRoom(roomId) || hasOngoingCourseForRoom(roomId);
  return hasOngoing
    ? { canDelete: false, reason: 'Phòng học này đang được sử dụng cho một lớp đang diễn ra nên không thể xóa.' }
    : { canDelete: true };
}

export function canDeleteStudent(studentId: string): DeleteCheckResult {
  const hasOngoing =
    useActivityStore.getState().hasOngoingForStudent(studentId) || hasOngoingCourseForStudent(studentId);
  return hasOngoing
    ? { canDelete: false, reason: 'Học sinh này đang tham gia một lớp đang diễn ra nên không thể xóa.' }
    : { canDelete: true };
}

export function canDeleteCourse(course: Course): DeleteCheckResult {
  if (DELETABLE_COURSE_STATUSES.includes(course.status)) {
    return { canDelete: true };
  }
  return {
    canDelete: false,
    reason: `Không thể xóa khóa học đang ở trạng thái "${courseStatusLabels[course.status]}". Chỉ có thể xóa khóa học Nháp, Đã hủy hoặc Đã kết thúc.`,
  };
}
