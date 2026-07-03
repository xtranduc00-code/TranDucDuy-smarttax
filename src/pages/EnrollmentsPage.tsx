import { useEffect, useMemo, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEnrollmentStore } from '../store/enrollmentStore';
import { useCourseStore } from '../store/courseStore';
import { useStudentStore } from '../store/studentStore';
import { useRoomStore } from '../store/roomStore';
import { useTeacherStore } from '../store/teacherStore';
import { usePaginatedList } from '../hooks/usePaginatedList';
import { useToast } from '../hooks/useToast';
import { DataTable } from '../components/DataTable';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ConflictDialog } from '../components/ConflictDialog';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EnrollmentStatusBadge } from '../components/EnrollmentStatusBadge';
import { EnrollmentFormDialog } from '../components/forms/EnrollmentFormDialog';
import { canEnrollStudent } from '../services/enrollment';
import { formatDate } from '../utils/date';
import { enrollmentStatusLabels } from '../utils/enrollmentLabels';
import type { Enrollment, EnrollmentStatus } from '../types/enrollment';
import type { Column } from '../types/common';
import type { ScheduleConflict } from '../services/conflictValidation';

interface EnrollmentRow extends Enrollment {
  name: string;
  studentName: string;
  courseName: string;
}

const STATUS_FILTER_OPTIONS: Array<{ value: EnrollmentStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'Pending', label: enrollmentStatusLabels.Pending },
  { value: 'Confirmed', label: enrollmentStatusLabels.Confirmed },
  { value: 'Completed', label: enrollmentStatusLabels.Completed },
  { value: 'Cancelled', label: enrollmentStatusLabels.Cancelled },
];

export default function EnrollmentsPage() {
  const items = useEnrollmentStore((s) => s.items);
  const loading = useEnrollmentStore((s) => s.loading);
  const fetchAll = useEnrollmentStore((s) => s.fetchAll);
  const create = useEnrollmentStore((s) => s.create);
  const cancel = useEnrollmentStore((s) => s.cancel);
  const remove = useEnrollmentStore((s) => s.remove);

  const courses = useCourseStore((s) => s.items);
  const students = useStudentStore((s) => s.items);
  const rooms = useRoomStore((s) => s.items);
  const teachers = useTeacherStore((s) => s.items);

  const { showToast } = useToast();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const studentName = (id: string) => students.find((s) => s.id === id)?.name ?? 'Không xác định';
  const courseName = (id: string) => courses.find((c) => c.id === id)?.name ?? 'Không xác định';

  const rows: EnrollmentRow[] = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        name: studentName(item.studentId),
        studentName: studentName(item.studentId),
        courseName: courseName(item.courseId),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, students, courses],
  );

  const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | 'all'>('all');
  const filteredRows = useMemo(
    () => (statusFilter === 'all' ? rows : rows.filter((row) => row.status === statusFilter)),
    [rows, statusFilter],
  );

  const { keyword, setKeyword, page, setPage, totalPages, total, pageSize, sortDirection, toggleSort, pageItems } =
    usePaginatedList(filteredRows, ['studentName', 'courseName']);

  const [formOpen, setFormOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<Enrollment | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Enrollment | null>(null);
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);

  function handleStatusFilterChange(event: SelectChangeEvent) {
    setStatusFilter(event.target.value as EnrollmentStatus | 'all');
  }

  function handleCreate(courseId: string, studentId: string) {
    const course = courses.find((c) => c.id === courseId);
    const student = students.find((s) => s.id === studentId);
    const room = course ? rooms.find((r) => r.id === course.roomId) : undefined;
    if (!course || !student || !room) return;

    const result = canEnrollStudent({ course, student, room, courses, teachers, rooms, students });
    if (!result.canEnroll) {
      if (result.conflicts) {
        setConflicts(result.conflicts);
      } else {
        showToast(result.reason ?? 'Không thể ghi danh học viên này.', 'error');
      }
      return;
    }

    create(courseId, studentId);
    showToast('Đã ghi danh học viên thành công', 'success');
    setFormOpen(false);
  }

  function confirmCancel() {
    if (!cancelTarget) return;
    cancel(cancelTarget.id);
    showToast('Đã hủy ghi danh', 'success');
    setCancelTarget(null);
  }

  function confirmRemove() {
    if (!removeTarget) return;
    remove(removeTarget.id);
    showToast('Đã xóa ghi danh', 'success');
    setRemoveTarget(null);
  }

  const columns: Column<EnrollmentRow>[] = [
    { key: 'studentName', header: 'Học viên' },
    { key: 'courseName', header: 'Khóa học' },
    { key: 'status', header: 'Trạng thái', render: (row) => <EnrollmentStatusBadge status={row.status} /> },
    { key: 'createdAt', header: 'Ngày tạo', render: (row) => formatDate(row.createdAt) },
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
            Quản lý ghi danh
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Theo dõi và xử lý ghi danh học viên vào khóa học.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
          Thêm ghi danh
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <SearchBar value={keyword} onChange={setKeyword} placeholder="Tìm theo tên học viên hoặc khóa học..." />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select value={statusFilter} label="Trạng thái" onChange={handleStatusFilterChange}>
            {STATUS_FILTER_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {loading ? (
        <LoadingSkeleton />
      ) : total === 0 ? (
        <EmptyState
          title={keyword || statusFilter !== 'all' ? 'Không tìm thấy ghi danh nào phù hợp' : 'Chưa có ghi danh nào'}
          description={
            keyword || statusFilter !== 'all' ? 'Hãy thử điều kiện khác.' : 'Thêm ghi danh đầu tiên để bắt đầu.'
          }
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={pageItems}
            getRowId={(row) => row.id}
            sortableKey="studentName"
            sortDirection={sortDirection}
            onSortToggle={toggleSort}
            actions={(row) => {
              const canCancel = row.status === 'Pending' || row.status === 'Confirmed';
              return (
                <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Tooltip title={canCancel ? 'Hủy ghi danh' : 'Không thể hủy'}>
                    <span>
                      <IconButton size="small" disabled={!canCancel} onClick={() => setCancelTarget(row)}>
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Xóa ghi danh">
                    <IconButton size="small" onClick={() => setRemoveTarget(row)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              );
            }}
          />
          <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={setPage} />
        </>
      )}

      <EnrollmentFormDialog
        open={formOpen}
        courses={courses}
        students={students}
        onSubmit={handleCreate}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={!!cancelTarget}
        title="Hủy ghi danh"
        message={`Bạn có chắc chắn muốn hủy ghi danh của "${cancelTarget ? studentName(cancelTarget.studentId) : ''}"?`}
        confirmLabel="Hủy ghi danh"
        destructive
        onConfirm={confirmCancel}
        onCancel={() => setCancelTarget(null)}
      />

      <ConfirmDialog
        open={!!removeTarget}
        title="Xóa ghi danh"
        message={`Bạn có chắc chắn muốn xóa vĩnh viễn bản ghi ghi danh của "${removeTarget ? studentName(removeTarget.studentId) : ''}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        destructive
        onConfirm={confirmRemove}
        onCancel={() => setRemoveTarget(null)}
      />

      <ConflictDialog open={conflicts.length > 0} conflicts={conflicts} onClose={() => setConflicts([])} />
    </Stack>
  );
}
