import type { Teacher } from "../types/teacher";
import type { Student } from "../types/student";
import type { Room } from "../types/room";
import type { CourseClass } from "../types/activity";
import type { Course } from "../types/course";
import type { Enrollment, EnrollmentStatus } from "../types/enrollment";

const now = new Date().toISOString();

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const seedTeachers: Teacher[] = [
  { id: "t-1", name: "Nguyen Diem L", status: "Active", createdAt: now },
  { id: "t-2", name: "Tran Huu X", status: "Active", createdAt: now },
  { id: "t-3", name: "Pham Thanh U", status: "Active", createdAt: now },
  { id: "t-4", name: "Do Diem Hoa", status: "Active", createdAt: now },
  { id: "t-5", name: "Dang Cong Tuan", status: "Inactive", createdAt: now },
  { id: "t-6", name: "Le Diem R", status: "Active", createdAt: now },
  { id: "t-7", name: "Ho Xuan D", status: "Active", createdAt: now },
  { id: "t-8", name: "Ngo Xuan Y", status: "Active", createdAt: now },
  { id: "t-9", name: "Vu Huu Q", status: "Active", createdAt: now },
  { id: "t-10", name: "Bui Xuan X", status: "Active", createdAt: now },
  { id: "t-11", name: "Bui Thanh Dat", status: "Active", createdAt: now },
  { id: "t-12", name: "Pham Huu Q", status: "Active", createdAt: now },
  { id: "t-13", name: "Huynh Ngoc P", status: "Active", createdAt: now },
];

export const seedStudents: Student[] = [
  { id: "s-1", name: "Do Diem Lan", status: "Active", createdAt: now },
  { id: "s-2", name: "Vo Diem K", status: "Active", createdAt: now },
  { id: "s-3", name: "Duong Thanh Nam", status: "Active", createdAt: now },
  { id: "s-4", name: "Nguyen Ngoc Chi", status: "Active", createdAt: now },
  { id: "s-5", name: "Hoang Huu H", status: "Inactive", createdAt: now },
  { id: "s-6", name: "Do Kim H", status: "Active", createdAt: now },
  { id: "s-7", name: "Duong Quang E", status: "Active", createdAt: now },
  { id: "s-8", name: "Vo Cong Long", status: "Active", createdAt: now },
  { id: "s-9", name: "Phan Kim K", status: "Inactive", createdAt: now },
  { id: "s-10", name: "Vu Huu Dat", status: "Active", createdAt: now },
  { id: "s-11", name: "Bui Duc Tuan", status: "Active", createdAt: now },
  { id: "s-12", name: "Phan Thu Y", status: "Inactive", createdAt: now },
  { id: "s-13", name: "Vo My A", status: "Active", createdAt: now },
  { id: "s-14", name: "Duong Cong Dat", status: "Active", createdAt: now },
  { id: "s-15", name: "Phan Duc S", status: "Active", createdAt: now },
  { id: "s-16", name: "Do Kim U", status: "Active", createdAt: now },
  { id: "s-17", name: "Tran My Lan", status: "Active", createdAt: now },
  { id: "s-18", name: "Dang Ngoc E", status: "Active", createdAt: now },
  { id: "s-19", name: "Ho Van Y", status: "Active", createdAt: now },
  { id: "s-20", name: "Duong Xuan Khoa", status: "Active", createdAt: now },
  { id: "s-21", name: "Pham Huu C", status: "Active", createdAt: now },
  { id: "s-22", name: "Ho Anh Trang", status: "Active", createdAt: now },
  { id: "s-23", name: "Vo Ngoc L", status: "Active", createdAt: now },
  { id: "s-24", name: "Pham Anh Trang", status: "Active", createdAt: now },
  { id: "s-25", name: "Hoang Minh Nam", status: "Active", createdAt: now },
  { id: "s-26", name: "Vo Quang D", status: "Active", createdAt: now },
  { id: "s-27", name: "Nguyen Thanh X", status: "Active", createdAt: now },
  { id: "s-28", name: "Bui Van K", status: "Active", createdAt: now },
  { id: "s-29", name: "Huynh Huu U", status: "Active", createdAt: now },
  { id: "s-30", name: "Pham Anh E", status: "Active", createdAt: now },
  { id: "s-31", name: "Dang Thu K", status: "Active", createdAt: now },
  { id: "s-32", name: "Pham Thi D", status: "Active", createdAt: now },
  { id: "s-33", name: "Phan Quang Phong", status: "Active", createdAt: now },
  { id: "s-34", name: "Bui Thi B", status: "Active", createdAt: now },
  { id: "s-35", name: "Ngo Huu K", status: "Active", createdAt: now },
  { id: "s-36", name: "Le Thu G", status: "Active", createdAt: now },
  { id: "s-37", name: "Duong Huu S", status: "Active", createdAt: now },
  { id: "s-38", name: "Tran Thi Lan", status: "Inactive", createdAt: now },
  { id: "s-39", name: "Tran My Yen", status: "Active", createdAt: now },
  { id: "s-40", name: "Vu Thanh Phong", status: "Active", createdAt: now },
  { id: "s-41", name: "Phan Van Q", status: "Active", createdAt: now },
  { id: "s-42", name: "Vu Kim R", status: "Active", createdAt: now },
  { id: "s-43", name: "Ho Anh Huong", status: "Active", createdAt: now },
  { id: "s-44", name: "Hoang Thanh B", status: "Active", createdAt: now },
  { id: "s-45", name: "Do Kim B", status: "Active", createdAt: now },
  { id: "s-46", name: "Duong Duc B", status: "Inactive", createdAt: now },
  { id: "s-47", name: "Le Huu Y", status: "Active", createdAt: now },
  { id: "s-48", name: "Phan Thi X", status: "Active", createdAt: now },
  { id: "s-49", name: "Dang Thi R", status: "Active", createdAt: now },
  { id: "s-50", name: "Huynh Kim H", status: "Active", createdAt: now },
];

export const seedRooms: Room[] = [
  {
    id: "r-1",
    name: "Room 101",
    code: "R101",
    capacity: 30,
    status: "Active",
    createdAt: now,
  },
  {
    id: "r-2",
    name: "Room 102",
    code: "R102",
    capacity: 28,
    status: "Active",
    createdAt: now,
  },
  {
    id: "r-3",
    name: "Room 201",
    code: "R201",
    capacity: 35,
    status: "Active",
    createdAt: now,
  },
  {
    id: "r-4",
    name: "Room 202",
    code: "R202",
    capacity: 25,
    status: "Active",
    createdAt: now,
  },
  {
    id: "r-5",
    name: "Room 203",
    code: "R203",
    capacity: 30,
    status: "Active",
    createdAt: now,
  },
  {
    id: "r-6",
    name: "Room 301",
    code: "R301",
    capacity: 40,
    status: "Inactive",
    createdAt: now,
  },
  {
    id: "r-7",
    name: "Room 302",
    code: "R302",
    capacity: 20,
    status: "Inactive",
    createdAt: now,
  },
  {
    id: "r-8",
    name: "Room 303",
    code: "R303",
    capacity: 22,
    status: "Active",
    createdAt: now,
  },
  {
    id: "r-9",
    name: "Lab 401",
    code: "L401",
    capacity: 15,
    status: "Active",
    createdAt: now,
  },
];

export const seedCourseClasses: CourseClass[] = [
  {
    id: "c-1",
    name: "React Fundamentals",
    teacherId: "t-1",
    roomId: "r-1",
    studentIds: ["s-1", "s-2"],
    status: "ongoing",
    createdAt: now,
  },
  {
    id: "c-2",
    name: "TypeScript Basics",
    teacherId: "t-2",
    roomId: "r-2",
    studentIds: ["s-3"],
    status: "finished",
    createdAt: now,
  },
];

export const seedCourses: Course[] = [
  {
    id: "course-1",
    name: "Node.js Nâng cao",
    teacherId: "t-1",
    roomId: "r-1",
    studentIds: [],
    startDate: daysFromNow(20),
    minimumStudents: 4,
    status: "Draft",
    sessions: [
      {
        id: "ses-1-1",
        title: "Buổi 1: Giới thiệu Node.js",
        date: daysFromNow(20),
        startTime: "18:00",
        endTime: "20:00",
      },
      {
        id: "ses-1-2",
        title: "Buổi 2: Thực hành Express",
        date: daysFromNow(22),
        startTime: "18:00",
        endTime: "20:00",
      },
    ],
    createdAt: now,
  },
  {
    id: "course-2",
    name: "React Nâng cao",
    teacherId: "t-2",
    roomId: "r-2",
    studentIds: ["s-1"],
    startDate: daysFromNow(10),
    minimumStudents: 3,
    status: "Enrollment Open",
    sessions: [
      {
        id: "ses-2-1",
        title: "Buổi 1: Component nâng cao",
        date: daysFromNow(10),
        startTime: "18:00",
        endTime: "20:00",
      },
      {
        id: "ses-2-2",
        title: "Buổi 2: Quản lý State",
        date: daysFromNow(12),
        startTime: "18:00",
        endTime: "20:00",
      },
    ],
    createdAt: now,
  },
  {
    id: "course-3",
    name: "TypeScript Chuyên sâu",
    teacherId: "t-1",
    roomId: "r-1",
    studentIds: ["s-1", "s-2", "s-3"],
    startDate: daysFromNow(-10),
    minimumStudents: 2,
    status: "Ongoing",
    sessions: [
      {
        id: "ses-3-1",
        title: "Buổi 1: Kiểu dữ liệu",
        date: daysFromNow(-10),
        startTime: "18:00",
        endTime: "20:00",
      },
      {
        id: "ses-3-2",
        title: "Buổi 2: Generic",
        date: daysFromNow(-3),
        startTime: "18:00",
        endTime: "20:00",
      },
      {
        id: "ses-3-3",
        title: "Buổi 3: Dự án thực tế",
        date: daysFromNow(5),
        startTime: "18:00",
        endTime: "20:00",
      },
    ],
    createdAt: now,
  },
  {
    id: "course-4",
    name: "HTML CSS Cơ bản",
    teacherId: "t-2",
    roomId: "r-2",
    studentIds: ["s-2", "s-3"],
    startDate: daysFromNow(-30),
    minimumStudents: 2,
    status: "Finished",
    sessions: [
      {
        id: "ses-4-1",
        title: "Buổi 1: HTML",
        date: daysFromNow(-30),
        startTime: "18:00",
        endTime: "20:00",
      },
      {
        id: "ses-4-2",
        title: "Buổi 2: CSS",
        date: daysFromNow(-25),
        startTime: "18:00",
        endTime: "20:00",
      },
    ],
    createdAt: now,
  },
  {
    id: "course-5",
    name: "Python Cho Người Mới",
    teacherId: "t-1",
    roomId: "r-1",
    studentIds: ["s-1"],
    startDate: daysFromNow(-5),
    minimumStudents: 5,
    status: "Enrollment Open",
    sessions: [
      {
        id: "ses-5-1",
        title: "Buổi 1: Nhập môn Python",
        date: daysFromNow(-5),
        startTime: "18:00",
        endTime: "20:00",
      },
    ],
    createdAt: now,
  },
];

/** What an enrollment's status would already have settled to, for a course seeded directly into a later lifecycle stage. */
function seedEnrollmentStatus(courseStatus: Course["status"]): EnrollmentStatus {
  switch (courseStatus) {
    case "Ongoing":
      return "Confirmed";
    case "Finished":
      return "Completed";
    case "Cancelled":
      return "Cancelled";
    default:
      return "Pending";
  }
}

export const seedEnrollments: Enrollment[] = seedCourses.flatMap((course) =>
  course.studentIds.map((studentId, index) => ({
    id: `enr-${course.id}-${index}`,
    courseId: course.id,
    studentId,
    status: seedEnrollmentStatus(course.status),
    createdAt: now,
  })),
);
