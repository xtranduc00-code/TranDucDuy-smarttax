import type { ReactNode } from 'react';

export type Status = 'Active' | 'Inactive';

export interface BaseEntity {
  id: string;
  name: string;
  status: Status;
  createdAt: string;
}

export type SortDirection = 'asc' | 'desc';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  width?: string | number;
}
