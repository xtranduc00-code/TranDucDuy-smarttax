import { createEntityStore } from './createEntityStore';
import type { Teacher } from '../types/teacher';
import { seedTeachers } from './seedData';

export const useTeacherStore = createEntityStore<Teacher>('hr-teachers', seedTeachers);
