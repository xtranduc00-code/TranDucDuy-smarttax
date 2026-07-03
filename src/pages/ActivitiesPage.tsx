import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ReplayIcon from '@mui/icons-material/Replay';
import { useActivityStore } from '../store/activityStore';
import { useTeacherStore } from '../store/teacherStore';
import { useStudentStore } from '../store/studentStore';
import { useRoomStore } from '../store/roomStore';
import { usePaginatedList } from '../hooks/usePaginatedList';
import { useToast } from '../hooks/useToast';
import { DataTable } from '../components/DataTable';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ActivityFormDialog } from '../components/forms/ActivityFormDialog';
import type { CourseClass } from '../types/activity';
import type { Column } from '../types/common';
import type { ActivityFormSchemaValues } from '../utils/validationSchemas';

export default function ActivitiesPage() {
  const items = useActivityStore((s) => s.items);
  const loading = useActivityStore((s) => s.loading);
  const fetchAll = useActivityStore((s) => s.fetchAll);
  const add = useActivityStore((s) => s.add);
  const update = useActivityStore((s) => s.update);
  const remove = useActivityStore((s) => s.remove);
  const toggleStatus = useActivityStore((s) => s.toggleStatus);

  const teachers = useTeacherStore((s) => s.items);
  const students = useStudentStore((s) => s.items);
  const rooms = useRoomStore((s) => s.items);

  const { showToast } = useToast();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const teacherName = (id: string) => teachers.find((t) => t.id === id)?.name ?? 'Không xác định';
  const roomName = (id: string) => rooms.find((r) => r.id === id)?.name ?? 'Không xác định';
  const studentNames = (ids: string[]) =>
    ids.map((id) => students.find((s) => s.id === id)?.name ?? 'Không xác định').join(', ');

  const { keyword, setKeyword, page, setPage, totalPages, total, pageSize, sortDirection, toggleSort, pageItems } =
    usePaginatedList(items, ['name']);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CourseClass | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CourseClass | null>(null);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(item: CourseClass) {
    setEditing(item);
    setFormOpen(true);
  }

  function handleSubmit(values: ActivityFormSchemaValues) {
    if (editing) {
      update(editing.id, values);
      showToast('Lớp học đã được cập nhật thành công', 'success');
    } else {
      add(values);
      showToast('Lớp học đã được tạo thành công', 'success');
    }
    setFormOpen(false);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    showToast('Lớp học đã được xóa', 'success');
    setDeleteTarget(null);
  }

  const columns: Column<CourseClass>[] = [
    { key: 'name', header: 'Lớp học' },
    { key: 'teacherId', header: 'Giáo viên', render: (row) => teacherName(row.teacherId) },
    { key: 'roomId', header: 'Phòng học', render: (row) => roomName(row.roomId) },
    {
      key: 'studentIds',
      header: 'Học sinh',
      render: (row) => (
        <Typography variant="body2" noWrap sx={{ maxWidth: 220 }} title={studentNames(row.studentIds)}>
          {studentNames(row.studentIds) || '-'}
        </Typography>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (row) => (
        <Chip
          label={row.status === 'ongoing' ? 'Đang diễn ra' : 'Đã kết thúc'}
          size="small"
          color={row.status === 'ongoing' ? 'warning' : 'default'}
          variant={row.status === 'ongoing' ? 'filled' : 'outlined'}
        />
      ),
    },
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
            Lớp học
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dữ liệu mẫu dùng để kiểm tra quy tắc xóa đối với giáo viên, phòng học và học sinh.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Thêm lớp học
        </Button>
      </Stack>

      <SearchBar value={keyword} onChange={setKeyword} placeholder="Tìm lớp học theo tên..." />

      {loading ? (
        <LoadingSkeleton />
      ) : total === 0 ? (
        <EmptyState
          title={keyword ? 'Không tìm thấy lớp học nào phù hợp' : 'Chưa có lớp học nào'}
          description={keyword ? 'Hãy thử từ khóa khác.' : 'Thêm lớp học đầu tiên để bắt đầu.'}
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
            actions={(row) => (
              <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                <Tooltip title={row.status === 'ongoing' ? 'Đánh dấu Đã kết thúc' : 'Đánh dấu Đang diễn ra'}>
                  <IconButton size="small" onClick={() => toggleStatus(row.id)}>
                    {row.status === 'ongoing' ? (
                      <TaskAltIcon fontSize="small" color="warning" />
                    ) : (
                      <ReplayIcon fontSize="small" color="disabled" />
                    )}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Sửa">
                  <IconButton size="small" onClick={() => openEdit(row)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Xóa">
                  <IconButton size="small" onClick={() => setDeleteTarget(row)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
          />
          <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={setPage} />
        </>
      )}

      <ActivityFormDialog
        open={formOpen}
        teachers={teachers}
        rooms={rooms}
        students={students}
        initialValues={editing ?? undefined}
        onSubmit={handleSubmit}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa lớp học"
        message={`Bạn có chắc chắn muốn xóa "${deleteTarget?.name}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Stack>
  );
}
