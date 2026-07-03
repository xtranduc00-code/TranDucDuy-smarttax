import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InboxIcon from '@mui/icons-material/InboxOutlined';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = 'Không tìm thấy bản ghi nào',
  description = 'Hãy thử điều chỉnh tìm kiếm hoặc thêm bản ghi mới.',
}: EmptyStateProps) {
  return (
    <Stack spacing={1} sx={{ py: 8, color: 'text.secondary', alignItems: 'center', justifyContent: 'center' }}>
      <InboxIcon sx={{ fontSize: 48 }} />
      <Typography variant="subtitle1">{title}</Typography>
      <Typography variant="body2">{description}</Typography>
    </Stack>
  );
}
