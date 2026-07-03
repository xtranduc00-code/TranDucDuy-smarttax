import { z } from 'zod';

export const personSchema = z.object({
  name: z.string().trim().min(2, 'Tên phải có ít nhất 2 ký tự').max(100, 'Tên quá dài'),
  status: z.enum(['Active', 'Inactive']),
});
export type PersonFormValues = z.infer<typeof personSchema>;

export const roomSchema = z.object({
  name: z.string().trim().min(2, 'Tên phải có ít nhất 2 ký tự').max(100, 'Tên quá dài'),
  code: z.string().trim().min(1, 'Mã phòng là bắt buộc').max(20, 'Mã phòng quá dài'),
  capacity: z
    .number({ message: 'Sức chứa phải là một số' })
    .int('Sức chứa phải là số nguyên')
    .min(1, 'Sức chứa phải ít nhất là 1')
    .max(1000, 'Sức chứa quá lớn'),
  status: z.enum(['Active', 'Inactive']),
});
export type RoomFormSchemaValues = z.infer<typeof roomSchema>;

export const activitySchema = z.object({
  name: z.string().trim().min(2, 'Tên phải có ít nhất 2 ký tự').max(150, 'Tên quá dài'),
  teacherId: z.string().min(1, 'Giáo viên là bắt buộc'),
  roomId: z.string().min(1, 'Phòng học là bắt buộc'),
  studentIds: z.array(z.string()).min(1, 'Chọn ít nhất một học sinh'),
  status: z.enum(['ongoing', 'finished']),
});
export type ActivityFormSchemaValues = z.infer<typeof activitySchema>;
