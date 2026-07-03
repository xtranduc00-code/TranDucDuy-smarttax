import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { useRoomStore } from '../store/roomStore';
import { canDeleteRoom } from '../services/validation';
import { usePaginatedList } from '../hooks/usePaginatedList';
import { useToast } from '../hooks/useToast';
import { DataTable } from '../components/DataTable';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { RoomFormDialog } from '../components/forms/RoomFormDialog';
import { formatDate } from '../utils/date';
import type { Room } from '../types/room';
import type { Column } from '../types/common';
import type { RoomFormSchemaValues } from '../utils/validationSchemas';

export default function RoomsPage() {
  const items = useRoomStore((s) => s.items);
  const loading = useRoomStore((s) => s.loading);
  const fetchAll = useRoomStore((s) => s.fetchAll);
  const add = useRoomStore((s) => s.add);
  const update = useRoomStore((s) => s.update);
  const remove = useRoomStore((s) => s.remove);
  const toggleStatus = useRoomStore((s) => s.toggleStatus);
  const { showToast } = useToast();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const { keyword, setKeyword, page, setPage, totalPages, total, pageSize, sortDirection, toggleSort, pageItems } =
    usePaginatedList(items, ['name', 'code']);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Room | null>(null);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(room: Room) {
    setEditing(room);
    setFormOpen(true);
  }

  function handleSubmit(values: RoomFormSchemaValues) {
    if (editing) {
      update(editing.id, values);
      showToast('Phòng học đã được cập nhật thành công', 'success');
    } else {
      add(values);
      showToast('Phòng học đã được tạo thành công', 'success');
    }
    setFormOpen(false);
  }

  function requestDelete(room: Room) {
    const result = canDeleteRoom(room.id);
    if (!result.canDelete) {
      showToast(result.reason ?? 'Không thể xóa phòng học này.', 'error');
      return;
    }
    setDeleteTarget(room);
  }

  function deleteBlockedReason(room: Room): string | undefined {
    const result = canDeleteRoom(room.id);
    return result.canDelete ? undefined : result.reason;
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    showToast('Phòng học đã được xóa', 'success');
    setDeleteTarget(null);
  }

  const columns: Column<Room>[] = [
    { key: 'name', header: 'Tên' },
    { key: 'code', header: 'Mã phòng' },
    { key: 'capacity', header: 'Sức chứa' },
    { key: 'status', header: 'Trạng thái', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'createdAt', header: 'Ngày tạo', render: (row) => formatDate(row.createdAt) },
  ];

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Phòng học
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Thêm phòng học
        </Button>
      </Stack>

      <SearchBar value={keyword} onChange={setKeyword} placeholder="Tìm phòng học theo tên hoặc mã..." />

      {loading ? (
        <LoadingSkeleton />
      ) : total === 0 ? (
        <EmptyState
          title={keyword ? 'Không tìm thấy phòng học nào phù hợp' : 'Chưa có phòng học nào'}
          description={keyword ? 'Hãy thử từ khóa khác.' : 'Thêm phòng học đầu tiên để bắt đầu.'}
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
            rowDisabled={(row) => row.status === 'Inactive'}
            actions={(row) => {
              const blockedReason = deleteBlockedReason(row);
              return (
                <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Tooltip title={row.status === 'Active' ? 'Ngừng hoạt động' : 'Kích hoạt'}>
                    <IconButton size="small" onClick={() => toggleStatus(row.id)}>
                      {row.status === 'Active' ? (
                        <ToggleOnIcon fontSize="small" color="success" />
                      ) : (
                        <ToggleOffIcon fontSize="small" color="disabled" />
                      )}
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

      <RoomFormDialog
        open={formOpen}
        initialValues={editing ?? undefined}
        onSubmit={handleSubmit}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa phòng học"
        message={`Bạn có chắc chắn muốn xóa "${deleteTarget?.name}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Stack>
  );
}
