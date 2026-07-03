import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MuiPagination from '@mui/material/Pagination';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, pageSize, onPageChange }: PaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1}
      sx={{ mt: 2, alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Typography variant="body2" color="text.secondary">
        {total === 0 ? 'Không có bản ghi nào' : `Hiển thị ${from}-${to} trong ${total} bản ghi`}
      </Typography>
      <MuiPagination
        count={totalPages}
        page={page}
        onChange={(_, value) => onPageChange(value)}
        color="primary"
        size="small"
      />
    </Stack>
  );
}
