export type ClassStatus = 'ongoing' | 'finished';

export interface CourseClass {
  id: string;
  name: string;
  teacherId: string;
  roomId: string;
  studentIds: string[];
  status: ClassStatus;
  createdAt: string;
}

export interface ActivityFormValues {
  name: string;
  teacherId: string;
  roomId: string;
  studentIds: string[];
  status: ClassStatus;
}
