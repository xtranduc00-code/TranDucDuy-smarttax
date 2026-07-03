import Chip from '@mui/material/Chip';
import type { ChipProps } from '@mui/material/Chip';
import type { EnrollmentStatus } from '../types/enrollment';
import { enrollmentStatusLabels } from '../utils/enrollmentLabels';

interface EnrollmentStatusBadgeProps {
  status: EnrollmentStatus;
}

const colorByStatus: Record<EnrollmentStatus, ChipProps['color']> = {
  Pending: 'warning',
  Confirmed: 'info',
  Completed: 'success',
  Cancelled: 'error',
};

export function EnrollmentStatusBadge({ status }: EnrollmentStatusBadgeProps) {
  return (
    <Chip
      label={enrollmentStatusLabels[status]}
      size="small"
      color={colorByStatus[status]}
      variant={status === 'Cancelled' ? 'outlined' : 'filled'}
    />
  );
}
