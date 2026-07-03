import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CourseClass, ClassStatus } from '../types/activity';
import { generateId } from '../utils/id';
import { seedCourseClasses } from './seedData';

interface ActivityState {
  items: CourseClass[];
  loading: boolean;
  fetchAll: () => Promise<void>;
  add: (data: Omit<CourseClass, 'id' | 'createdAt'>) => CourseClass;
  update: (id: string, data: Omit<CourseClass, 'id' | 'createdAt'>) => void;
  remove: (id: string) => void;
  toggleStatus: (id: string) => void;
  hasOngoingForTeacher: (teacherId: string) => boolean;
  hasOngoingForRoom: (roomId: string) => boolean;
  hasOngoingForStudent: (studentId: string) => boolean;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      items: seedCourseClasses,
      loading: false,

      fetchAll: async () => {
        set({ loading: true });
        await new Promise((resolve) => setTimeout(resolve, 600));
        set({ loading: false });
      },

      add: (data) => {
        const newItem: CourseClass = {
          ...data,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ items: [...state.items, newItem] }));
        return newItem;
      },

      update: (id, data) => {
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, ...data } : item)),
        }));
      },

      remove: (id) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
      },

      toggleStatus: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: (item.status === 'ongoing' ? 'finished' : 'ongoing') as ClassStatus,
                }
              : item,
          ),
        }));
      },

      hasOngoingForTeacher: (teacherId) =>
        get().items.some((item) => item.teacherId === teacherId && item.status === 'ongoing'),

      hasOngoingForRoom: (roomId) =>
        get().items.some((item) => item.roomId === roomId && item.status === 'ongoing'),

      hasOngoingForStudent: (studentId) =>
        get().items.some(
          (item) => item.studentIds.includes(studentId) && item.status === 'ongoing',
        ),
    }),
    {
      name: 'hr-activities',
      partialize: (state) => ({ items: state.items }) as ActivityState,
    },
  ),
);
