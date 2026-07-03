import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BaseEntity, Status } from '../types/common';
import { generateId } from '../utils/id';

export interface EntityState<T extends BaseEntity> {
  items: T[];
  loading: boolean;
  fetchAll: () => Promise<void>;
  add: (data: Omit<T, 'id' | 'createdAt'>) => T;
  update: (id: string, data: Omit<T, 'id' | 'createdAt'>) => void;
  remove: (id: string) => void;
  toggleStatus: (id: string) => void;
  getById: (id: string) => T | undefined;
}

export function createEntityStore<T extends BaseEntity>(
  storageKey: string,
  seed: T[],
): UseBoundStore<StoreApi<EntityState<T>>> {
  return create<EntityState<T>>()(
    persist(
      (set, get) => ({
        items: seed,
        loading: false,

        fetchAll: async () => {
          set({ loading: true });
          await new Promise((resolve) => setTimeout(resolve, 600));
          set({ loading: false });
        },

        add: (data) => {
          const newItem = {
            ...data,
            id: generateId(),
            createdAt: new Date().toISOString(),
          } as T;
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
                    status: (item.status === 'Active' ? 'Inactive' : 'Active') as Status,
                  }
                : item,
            ),
          }));
        },

        getById: (id) => get().items.find((item) => item.id === id),
      }),
      {
        name: storageKey,
        partialize: (state) => ({ items: state.items }) as EntityState<T>,
      },
    ),
  );
}
