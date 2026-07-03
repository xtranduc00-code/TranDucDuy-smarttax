import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Enrollment } from '../types/enrollment';
import { generateId } from '../utils/id';
import { seedEnrollments } from './seedData';
import { useCourseStore } from './courseStore';
import { syncEnrollmentStatuses } from '../services/enrollmentSync';

export const ENROLLMENT_STORAGE_KEY = 'hr-enrollments';

interface EnrollmentState {
  items: Enrollment[];
  loading: boolean;
  fetchAll: () => Promise<void>;
  create: (courseId: string, studentId: string) => Enrollment;
  cancel: (id: string) => void;
  remove: (id: string) => void;
  removeByCourse: (courseId: string) => void;
  getByCourse: (courseId: string) => Enrollment[];
  syncWithCourses: () => void;
}

export const useEnrollmentStore = create<EnrollmentState>()(
  persist(
    (set, get) => ({
      items: seedEnrollments,
      loading: false,

      fetchAll: async () => {
        set({ loading: true });
        await new Promise((resolve) => setTimeout(resolve, 600));
        set({ loading: false });
        get().syncWithCourses();
      },

      create: (courseId, studentId) => {
        const enrollment: Enrollment = {
          id: generateId(),
          courseId,
          studentId,
          status: 'Pending',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ items: [...state.items, enrollment] }));
        // Enrollment records track lifecycle status; Course.studentIds stays
        // the canonical "currently enrolled" list already relied on by
        // capacity checks, conflict detection, and the status engine.
        useCourseStore.getState().enrollStudent(courseId, studentId);
        return enrollment;
      },

      cancel: (id) => {
        const enrollment = get().items.find((item) => item.id === id);
        if (!enrollment) return;
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, status: 'Cancelled' as const } : item)),
        }));
        useCourseStore.getState().unenrollStudent(enrollment.courseId, enrollment.studentId);
      },

      remove: (id) => {
        const enrollment = get().items.find((item) => item.id === id);
        if (!enrollment) return;
        set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
        useCourseStore.getState().unenrollStudent(enrollment.courseId, enrollment.studentId);
      },

      removeByCourse: (courseId) => {
        set((state) => ({ items: state.items.filter((item) => item.courseId !== courseId) }));
      },

      getByCourse: (courseId) => get().items.filter((item) => item.courseId === courseId),

      syncWithCourses: () => {
        set((state) => ({ items: syncEnrollmentStatuses(state.items, useCourseStore.getState().items) }));
      },
    }),
    {
      name: ENROLLMENT_STORAGE_KEY,
      partialize: (state) => ({ items: state.items }) as EnrollmentState,
      onRehydrateStorage: () => (state) => {
        state?.syncWithCourses();
      },
    },
  ),
);

// Keep enrollment statuses in lockstep with course status changes automatically,
// however those changes happen (manual actions or the periodic status-engine reconciliation).
useCourseStore.subscribe((state, prevState) => {
  if (state.items !== prevState.items) {
    useEnrollmentStore.getState().syncWithCourses();
  }
});
