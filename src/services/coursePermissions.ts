import type { CourseStatus } from '../types/course';

export interface CourseEditPermissions {
  name: boolean;
  teacher: boolean;
  room: boolean;
  startDate: boolean;
  minimumStudents: boolean;
  sessions: boolean;
  enrollment: boolean;
}

const LOCKED: CourseEditPermissions = {
  name: false,
  teacher: false,
  room: false,
  startDate: false,
  minimumStudents: false,
  sessions: false,
  enrollment: false,
};

export function getCourseEditPermissions(status: CourseStatus): CourseEditPermissions {
  switch (status) {
    case 'Draft':
      return {
        name: true,
        teacher: true,
        room: true,
        startDate: true,
        minimumStudents: true,
        sessions: true,
        enrollment: false,
      };
    case 'Enrollment Open':
      return {
        ...LOCKED,
        teacher: true,
        room: true,
        sessions: true,
        enrollment: true,
      };
    case 'Ongoing':
    case 'Finished':
    case 'Cancelled':
    default:
      return { ...LOCKED };
  }
}
