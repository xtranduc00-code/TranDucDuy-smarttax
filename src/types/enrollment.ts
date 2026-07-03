export type EnrollmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
  status: EnrollmentStatus;
  createdAt: string;
}
