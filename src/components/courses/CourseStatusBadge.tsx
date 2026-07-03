import Chip from '@mui/material/Chip';
import type { ChipProps } from '@mui/material/Chip';
import type { CourseStatus } from '../../types/course';
import { courseStatusLabels } from '../../utils/courseLabels';

interface CourseStatusBadgeProps {
  status: CourseStatus;
}

const colorByStatus: Record<CourseStatus, ChipProps['color']> = {
  Draft: 'default',
  'Enrollment Open': 'info',
  Ongoing: 'warning',
  Finished: 'success',
  Cancelled: 'error',
};

export function CourseStatusBadge({ status }: CourseStatusBadgeProps) {
  return (
    <Chip
      label={courseStatusLabels[status]}
      size="small"
      color={colorByStatus[status]}
      variant={status === 'Draft' ? 'outlined' : 'filled'}
    />
  );
}
