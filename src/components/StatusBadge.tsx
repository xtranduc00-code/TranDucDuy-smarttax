import Chip from '@mui/material/Chip';
import type { Status } from '../types/common';
import { statusLabels } from '../utils/statusLabels';

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isActive = status === 'Active';
  return (
    <Chip
      label={statusLabels[status]}
      color={isActive ? 'success' : 'default'}
      size="small"
      variant={isActive ? 'filled' : 'outlined'}
      sx={!isActive ? { color: 'text.secondary', borderColor: 'text.disabled' } : undefined}
    />
  );
}
