import { useEffect, useState } from 'react';
import type { StoreApi, UseBoundStore } from 'zustand';
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
import type { EntityState } from '../store/createEntityStore';
import type { BaseEntity } from '../types/common';
import type { Column } from '../types/common';
import type { DeleteCheckResult } from '../services/validation';
import { usePaginatedList } from '../hooks/usePaginatedList';
import { useToast } from '../hooks/useToast';
import { DataTable } from '../components/DataTable';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { PersonFormDialog } from '../components/forms/PersonFormDialog';
import { formatDate } from '../utils/date';
import type { PersonFormValues } from '../utils/validationSchemas';

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

interface PeopleListPageProps<T extends BaseEntity> {
  title: string;
  entityLabel: string;
  useStore: UseBoundStore<StoreApi<EntityState<T>>>;
  checkDelete: (id: string) => DeleteCheckResult;
  searchPlaceholder: string;
}

export function PeopleListPage<T extends BaseEntity>({
  title,
  entityLabel,
  useStore,
  checkDelete,
  searchPlaceholder,
}: PeopleListPageProps<T>) {
  const items = useStore((s) => s.items);
  const loading = useStore((s) => s.loading);
  const fetchAll = useStore((s) => s.fetchAll);
  const add = useStore((s) => s.add);
  const update = useStore((s) => s.update);
  const remove = useStore((s) => s.remove);
  const toggleStatus = useStore((s) => s.toggleStatus);
  const { showToast } = useToast();

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { keyword, setKeyword, page, setPage, totalPages, total, pageSize, sortDirection, toggleSort, pageItems } =
    usePaginatedList(items, ['name']);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(item: T) {
    setEditing(item);
    setFormOpen(true);
  }

  function handleSubmit(values: PersonFormValues) {
    if (editing) {
      update(editing.id, values as Omit<T, 'id' | 'createdAt'>);
      showToast(`${capitalize(entityLabel)} đã được cập nhật thành công`, 'success');
    } else {
      add(values as Omit<T, 'id' | 'createdAt'>);
      showToast(`${capitalize(entityLabel)} đã được tạo thành công`, 'success');
    }
    setFormOpen(false);
  }

  function requestDelete(item: T) {
    const result = checkDelete(item.id);
    if (!result.canDelete) {
      showToast(result.reason ?? `Không thể xóa ${entityLabel} này.`, 'error');
      return;
    }
    setDeleteTarget(item);
  }

  function deleteBlockedReason(item: T): string | undefined {
    const result = checkDelete(item.id);
    return result.canDelete ? undefined : result.reason;
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    showToast(`${capitalize(entityLabel)} đã được xóa`, 'success');
    setDeleteTarget(null);
  }

  const columns: Column<T>[] = [
    { key: 'name', header: 'Tên' },
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
          {title}
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Thêm {entityLabel}
        </Button>
      </Stack>

      <SearchBar value={keyword} onChange={setKeyword} placeholder={searchPlaceholder} />

      {loading ? (
        <LoadingSkeleton />
      ) : total === 0 ? (
        <EmptyState
          title={keyword ? `Không tìm thấy ${entityLabel} nào phù hợp` : `Chưa có ${entityLabel} nào`}
          description={keyword ? 'Hãy thử từ khóa khác.' : `Thêm ${entityLabel} đầu tiên để bắt đầu.`}
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

      <PersonFormDialog
        open={formOpen}
        entityLabel={entityLabel}
        initialValues={editing ?? undefined}
        onSubmit={handleSubmit}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Xóa ${entityLabel}`}
        message={`Bạn có chắc chắn muốn xóa "${deleteTarget?.name}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Stack>
  );
}
