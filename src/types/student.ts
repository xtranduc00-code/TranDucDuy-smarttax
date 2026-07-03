import type { BaseEntity } from './common';

export type Student = BaseEntity;

export interface StudentFormValues {
  name: string;
  status: BaseEntity['status'];
}
