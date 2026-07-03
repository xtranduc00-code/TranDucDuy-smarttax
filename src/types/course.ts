export type CourseStatus = 'Draft' | 'Enrollment Open' | 'Ongoing' | 'Finished' | 'Cancelled';

export interface Session {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface Course {
  id: string;
  name: string;
  teacherId: string;
  roomId: string;
  studentIds: string[];
  startDate: string;
  minimumStudents: number;
  status: CourseStatus;
  sessions: Session[];
  createdAt: string;
}

export interface SessionFormValues {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface CourseFormValues {
  name: string;
  teacherId: string;
  roomId: string;
  startDate: string;
  minimumStudents: number;
  sessions: SessionFormValues[];
}
