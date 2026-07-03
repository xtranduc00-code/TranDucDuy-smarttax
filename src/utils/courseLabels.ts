import type { CourseStatus } from '../types/course';

export const courseStatusLabels: Record<CourseStatus, string> = {
  Draft: 'Nháp',
  'Enrollment Open': 'Đang mở đăng ký',
  Ongoing: 'Đang diễn ra',
  Finished: 'Đã kết thúc',
  Cancelled: 'Đã hủy',
};
