import type { BaseEntity } from './common';

export interface Room extends BaseEntity {
  code: string;
  capacity: number;
}

export interface RoomFormValues {
  name: string;
  status: BaseEntity['status'];
  code: string;
  capacity: number;
}
