import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Course, CourseFormValues } from '../types/course';
import { generateId } from '../utils/id';
import { seedCourses } from './seedData';
import { reconcileCourses } from '../services/courseStatusEngine';

export const COURSE_STORAGE_KEY = 'hr-courses';

interface CourseState {
  items: Course[];
  loading: boolean;
  fetchAll: () => Promise<void>;
  add: (data: CourseFormValues) => Course;
  update: (id: string, data: CourseFormValues) => void;
  remove: (id: string) => void;
  openEnrollment: (id: string) => void;
  enrollStudent: (courseId: string, studentId: string) => void;
  unenrollStudent: (courseId: string, studentId: string) => void;
  getById: (id: string) => Course | undefined;
  reconcileAll: () => void;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      items: reconcileCourses(seedCourses),
      loading: false,

      fetchAll: async () => {
        set({ loading: true });
        await new Promise((resolve) => setTimeout(resolve, 600));
        set((state) => ({ loading: false, items: reconcileCourses(state.items) }));
      },

      add: (data) => {
        const newItem: Course = {
          ...data,
          id: generateId(),
          studentIds: [],
          status: 'Draft',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ items: reconcileCourses([...state.items, newItem]) }));
        return newItem;
      },

      update: (id, data) => {
        set((state) => ({
          items: reconcileCourses(state.items.map((item) => (item.id === id ? { ...item, ...data } : item))),
        }));
      },

      remove: (id) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
      },

      openEnrollment: (id) => {
        set((state) => ({
          items: reconcileCourses(
            state.items.map((item) =>
              item.id === id && item.status === 'Draft' ? { ...item, status: 'Enrollment Open' } : item,
            ),
          ),
        }));
      },

      enrollStudent: (courseId, studentId) => {
        set((state) => ({
          items: reconcileCourses(
            state.items.map((item) =>
              item.id === courseId && !item.studentIds.includes(studentId)
                ? { ...item, studentIds: [...item.studentIds, studentId] }
                : item,
            ),
          ),
        }));
      },

      unenrollStudent: (courseId, studentId) => {
        set((state) => ({
          items: reconcileCourses(
            state.items.map((item) =>
              item.id === courseId
                ? { ...item, studentIds: item.studentIds.filter((id) => id !== studentId) }
                : item,
            ),
          ),
        }));
      },

      getById: (id) => get().items.find((item) => item.id === id),

      reconcileAll: () => {
        set((state) => ({ items: reconcileCourses(state.items) }));
      },
    }),
    {
      name: COURSE_STORAGE_KEY,
      partialize: (state) => ({ items: state.items }) as CourseState,
      onRehydrateStorage: () => (state) => {
        state?.reconcileAll();
      },
    },
  ),
);
