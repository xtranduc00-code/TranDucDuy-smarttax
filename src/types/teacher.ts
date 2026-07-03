import type { BaseEntity } from './common';

export type Teacher = BaseEntity;

export interface TeacherFormValues {
  name: string;
  status: BaseEntity['status'];
}
