import { useEffect, useMemo, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlined';
import { useCourseStore } from '../store/courseStore';
import { useEnrollmentStore } from '../store/enrollmentStore';
import { useTeacherStore } from '../store/teacherStore';
import { useRoomStore } from '../store/roomStore';
import { useStudentStore } from '../store/studentStore';
import { usePaginatedList } from '../hooks/usePaginatedList';
import { useToast } from '../hooks/useToast';
import { DataTable } from '../components/DataTable';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { CourseFormDialog } from '../components/forms/CourseFormDialog';
import { EnrollmentDialog } from '../components/forms/EnrollmentDialog';
import { ConflictDialog } from '../components/ConflictDialog';
import { CourseStatusBadge } from '../components/courses/CourseStatusBadge';
import { ProgressIndicator } from '../components/courses/ProgressIndicator';
import { formatDate } from '../utils/date';
import { canDeleteCourse } from '../services/validation';
import { canEnrollStudent } from '../services/enrollment';
import { validateCourseConflicts, type CourseConflictCandidate, type ScheduleConflict } from '../services/conflictValidation';
import type { Course } from '../types/course';
import type { Column } from '../types/common';
import type { CourseFormSchemaValues } from '../utils/validationSchemas';

interface CourseRow extends Course {
  teacherName: string;
  roomName: string;
}

export default function CoursesPage() {
  const courses = useCourseStore((s) => s.items);
  const loading = useCourseStore((s) => s.loading);
  const fetchAll = useCourseStore((s) => s.fetchAll);
  const add = useCourseStore((s) => s.add);
  const update = useCourseStore((s) => s.update);
  const remove = useCourseStore((s) => s.remove);
  const openEnrollment = useCourseStore((s) => s.openEnrollment);

  const enrollments = useEnrollmentStore((s) => s.items);
  const createEnrollment = useEnrollmentStore((s) => s.create);
  const cancelEnrollment = useEnrollmentStore((s) => s.cancel);
  const removeEnrollment = useEnrollmentStore((s) => s.remove);
  const removeEnrollmentsByCourse = useEnrollmentStore((s) => s.removeByCourse);

  const teachers = useTeacherStore((s) => s.items);
  const rooms = useRoomStore((s) => s.items);
  const students = useStudentStore((s) => s.items);

  const { showToast } = useToast();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const teacherName = (id: string) => teachers.find((t) => t.id === id)?.name ?? 'Không xác định';
  const roomName = (id: string) => rooms.find((r) => r.id === id)?.name ?? 'Không xác định';

  const rows: CourseRow[] = useMemo(
    () => courses.map((c) => ({ ...c, teacherName: teacherName(c.teacherId), roomName: roomName(c.roomId) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [courses, teachers, rooms],
  );

  const { keyword, setKeyword, page, setPage, totalPages, total, pageSize, sortDirection, toggleSort, pageItems } =
    usePaginatedList(rows, ['name', 'teacherName', 'roomName']);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [enrollmentTarget, setEnrollmentTarget] = useState<Course | null>(null);
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(course: Course) {
    setEditing(course);
    setFormOpen(true);
  }

  function handleSubmit(values: CourseFormSchemaValues) {
    // A course is created/updated only after it clears schedule conflict checks
    // (teacher, room, and enrolled-student overlaps) against every other course.
    const candidate: CourseConflictCandidate = {
      id: editing?.id,
      teacherId: values.teacherId,
      roomId: values.roomId,
      studentIds: editing?.studentIds ?? [],
      sessions: values.sessions,
    };
    const result = validateCourseConflicts(candidate, courses, { teachers, rooms, students });
    if (!result.valid) {
      setConflicts(result.conflicts);
      return;
    }

    if (editing) {
      update(editing.id, values);
      showToast('Khóa học đã được cập nhật thành công', 'success');
    } else {
      add(values);
      showToast('Khóa học đã được tạo thành công', 'success');
    }
    setFormOpen(false);
  }

  function deleteBlockedReason(course: Course): string | undefined {
    const result = canDeleteCourse(course);
    return result.canDelete ? undefined : result.reason;
  }

  function requestDelete(course: Course) {
    const result = canDeleteCourse(course);
    if (!result.canDelete) {
      showToast(result.reason ?? 'Không thể xóa khóa học này.', 'error');
      return;
    }
    setDeleteTarget(course);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    removeEnrollmentsByCourse(deleteTarget.id);
    showToast('Khóa học đã được xóa', 'success');
    setDeleteTarget(null);
  }

  function handleOpenEnrollment(course: Course) {
    openEnrollment(course.id);
    showToast('Đã mở đăng ký cho khóa học', 'success');
  }

  function handleEnroll(courseId: string, studentId: string) {
    const course = courses.find((c) => c.id === courseId);
    const student = students.find((s) => s.id === studentId);
    const room = course ? rooms.find((r) => r.id === course.roomId) : undefined;
    if (!course || !student || !room) return;

    // canEnrollStudent covers eligibility, capacity, and schedule-conflict
    // checks in one pass, so enrolling never needs a separate conflict check.
    const result = canEnrollStudent({ course, student, room, courses, teachers, rooms, students });
    if (!result.canEnroll) {
      if (result.conflicts) {
        setConflicts(result.conflicts);
      } else {
        showToast(result.reason ?? 'Không thể ghi danh học viên này.', 'error');
      }
      return;
    }

    createEnrollment(courseId, studentId);
    showToast('Đã ghi danh học viên thành công', 'success');
  }

  function handleCancelEnrollment(enrollmentId: string) {
    cancelEnrollment(enrollmentId);
    showToast('Đã hủy ghi danh', 'success');
  }

  function handleRemoveEnrollment(enrollmentId: string) {
    removeEnrollment(enrollmentId);
    showToast('Đã xóa ghi danh', 'success');
  }

  const initialFormValues: CourseFormSchemaValues | undefined = editing
    ? {
        name: editing.name,
        teacherId: editing.teacherId,
        roomId: editing.roomId,
        startDate: editing.startDate,
        minimumStudents: editing.minimumStudents,
        sessions: editing.sessions,
      }
    : undefined;

  const enrollmentCourse = enrollmentTarget ? (courses.find((c) => c.id === enrollmentTarget.id) ?? null) : null;
  const enrollmentCourseRoom = enrollmentCourse ? rooms.find((r) => r.id === enrollmentCourse.roomId) : undefined;
  const enrollmentCourseEnrollments = enrollmentCourse
    ? enrollments.filter((e) => e.courseId === enrollmentCourse.id)
    : [];

  const columns: Column<CourseRow>[] = [
    { key: 'name', header: 'Khóa học' },
    { key: 'teacherName', header: 'Giáo viên' },
    { key: 'roomName', header: 'Phòng học' },
    {
      key: 'studentIds',
      header: 'Học viên',
      render: (row) => <ProgressIndicator current={row.studentIds.length} minimum={row.minimumStudents} />,
    },
    { key: 'status', header: 'Trạng thái', render: (row) => <CourseStatusBadge status={row.status} /> },
    { key: 'startDate', header: 'Ngày bắt đầu', render: (row) => formatDate(row.startDate) },
  ];

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Khóa học
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quản lý khóa học, lịch buổi học và ghi danh học viên.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Thêm khóa học
        </Button>
      </Stack>

      <SearchBar value={keyword} onChange={setKeyword} placeholder="Tìm theo tên khóa học, giáo viên hoặc phòng học..." />

      {loading ? (
        <LoadingSkeleton />
      ) : total === 0 ? (
        <EmptyState
          title={keyword ? 'Không tìm thấy khóa học nào phù hợp' : 'Chưa có khóa học nào'}
          description={keyword ? 'Hãy thử từ khóa khác.' : 'Thêm khóa học đầu tiên để bắt đầu.'}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={pageItems}
            getRowId={(row) => row.id}
            sortableKey="name"
            sortDirection={sortDirection}
            onSortToggle={toggleSort}
            actions={(row) => {
              const blockedReason = deleteBlockedReason(row);
              return (
                <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                  {row.status === 'Draft' && (
                    <Tooltip title="Mở đăng ký">
                      <IconButton size="small" onClick={() => handleOpenEnrollment(row)}>
                        <PlayCircleOutlineIcon fontSize="small" color="primary" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Ghi danh học viên">
                    <IconButton size="small" onClick={() => setEnrollmentTarget(row)}>
                      <HowToRegIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sửa">
                    <IconButton size="small" onClick={() => openEdit(row)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={blockedReason ?? 'Xóa'}>
                    <span>
                      <IconButton size="small" disabled={!!blockedReason} onClick={() => requestDelete(row)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
              );
            }}
          />
          <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={setPage} />
        </>
      )}

      <CourseFormDialog
        open={formOpen}
        teachers={teachers}
        rooms={rooms}
        initialValues={initialFormValues}
        initialStatus={editing?.status}
        onSubmit={handleSubmit}
        onClose={() => setFormOpen(false)}
      />

      <EnrollmentDialog
        open={!!enrollmentTarget}
        course={enrollmentCourse}
        room={enrollmentCourseRoom}
        students={students}
        enrollments={enrollmentCourseEnrollments}
        onEnroll={handleEnroll}
        onCancelEnrollment={handleCancelEnrollment}
        onRemoveEnrollment={handleRemoveEnrollment}
        onClose={() => setEnrollmentTarget(null)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa khóa học"
        message={`Bạn có chắc chắn muốn xóa "${deleteTarget?.name}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConflictDialog open={conflicts.length > 0} conflicts={conflicts} onClose={() => setConflicts([])} />
    </Stack>
  );
}
