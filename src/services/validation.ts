import { useActivityStore } from '../store/activityStore';

export interface DeleteCheckResult {
  canDelete: boolean;
  reason?: string;
}

export function canDeleteTeacher(teacherId: string): DeleteCheckResult {
  const hasOngoing = useActivityStore.getState().hasOngoingForTeacher(teacherId);
  return hasOngoing
    ? { canDelete: false, reason: 'Giáo viên này đang dạy một lớp đang diễn ra nên không thể xóa.' }
    : { canDelete: true };
}

export function canDeleteRoom(roomId: string): DeleteCheckResult {
  const hasOngoing = useActivityStore.getState().hasOngoingForRoom(roomId);
  return hasOngoing
    ? { canDelete: false, reason: 'Phòng học này đang được sử dụng cho một lớp đang diễn ra nên không thể xóa.' }
    : { canDelete: true };
}

export function canDeleteStudent(studentId: string): DeleteCheckResult {
  const hasOngoing = useActivityStore.getState().hasOngoingForStudent(studentId);
  return hasOngoing
    ? { canDelete: false, reason: 'Học sinh này đang tham gia một lớp đang diễn ra nên không thể xóa.' }
    : { canDelete: true };
}
