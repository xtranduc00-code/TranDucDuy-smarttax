import type { EnrollmentStatus } from '../types/enrollment';

export const enrollmentStatusLabels: Record<EnrollmentStatus, string> = {
  Pending: 'Chờ xác nhận',
  Confirmed: 'Đã xác nhận',
  Completed: 'Đã hoàn thành',
  Cancelled: 'Đã hủy',
};
