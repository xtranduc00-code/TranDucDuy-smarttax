import { createEntityStore } from './createEntityStore';
import type { Student } from '../types/student';
import { seedStudents } from './seedData';

export const useStudentStore = createEntityStore<Student>('hr-students', seedStudents);
