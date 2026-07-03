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

export const sessionSchema = z
  .object({
    id: z.string(),
    title: z.string().trim().min(1, 'Tiêu đề buổi học là bắt buộc').max(150, 'Tiêu đề quá dài'),
    date: z.string().min(1, 'Ngày học là bắt buộc'),
    startTime: z.string().min(1, 'Giờ bắt đầu là bắt buộc'),
    endTime: z.string().min(1, 'Giờ kết thúc là bắt buộc'),
  })
  .refine((session) => session.endTime > session.startTime, {
    message: 'Giờ kết thúc phải sau giờ bắt đầu',
    path: ['endTime'],
  });

export const courseSchema = z.object({
  name: z.string().trim().min(2, 'Tên phải có ít nhất 2 ký tự').max(150, 'Tên quá dài'),
  teacherId: z.string().min(1, 'Giáo viên là bắt buộc'),
  roomId: z.string().min(1, 'Phòng học là bắt buộc'),
  startDate: z.string().min(1, 'Ngày bắt đầu là bắt buộc'),
  minimumStudents: z
    .number({ message: 'Số lượng học viên tối thiểu phải là một số' })
    .int('Số lượng học viên tối thiểu phải là số nguyên')
    .min(1, 'Số lượng học viên tối thiểu phải lớn hơn 0'),
  sessions: z.array(sessionSchema).min(1, 'Cần ít nhất một buổi học'),
});
export type CourseFormSchemaValues = z.infer<typeof courseSchema>;
