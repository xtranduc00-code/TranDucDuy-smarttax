import type { Teacher } from '../types/teacher';
import type { Student } from '../types/student';
import type { Room } from '../types/room';
import type { CourseClass } from '../types/activity';

const now = new Date().toISOString();

export const seedTeachers: Teacher[] = [
  { id: 't-1', name: 'Nguyen Van A', status: 'Active', createdAt: now },
  { id: 't-2', name: 'Tran Thi B', status: 'Active', createdAt: now },
  { id: 't-3', name: 'Le Van C', status: 'Inactive', createdAt: now },
];

export const seedStudents: Student[] = [
  { id: 's-1', name: 'Pham Thi D', status: 'Active', createdAt: now },
  { id: 's-2', name: 'Hoang Van E', status: 'Active', createdAt: now },
  { id: 's-3', name: 'Vu Thi F', status: 'Active', createdAt: now },
  { id: 's-4', name: 'Dang Van G', status: 'Inactive', createdAt: now },
];

export const seedRooms: Room[] = [
  { id: 'r-1', name: 'Room 101', code: 'R101', capacity: 30, status: 'Active', createdAt: now },
  { id: 'r-2', name: 'Room 202', code: 'R202', capacity: 25, status: 'Active', createdAt: now },
];

export const seedCourseClasses: CourseClass[] = [
  {
    id: 'c-1',
    name: 'React Fundamentals',
    teacherId: 't-1',
    roomId: 'r-1',
    studentIds: ['s-1', 's-2'],
    status: 'ongoing',
    createdAt: now,
  },
  {
    id: 'c-2',
    name: 'TypeScript Basics',
    teacherId: 't-2',
    roomId: 'r-2',
    studentIds: ['s-3'],
    status: 'finished',
    createdAt: now,
  },
];
