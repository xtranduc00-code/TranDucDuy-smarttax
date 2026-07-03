import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { calculateEnrollmentProgress } from '../../utils/enrollmentProgress';

interface ProgressIndicatorProps {
  current: number;
  minimum: number;
  unit?: string;
  /**
   * "minimum" (default): `minimum` is a floor to reach — current can
   * legitimately exceed it (e.g. course enrollment vs. minimumStudents), so
   * once met the label switches away from "X / Y" to avoid reading like a
   * broken fraction (e.g. "3 / 2 học viên").
   * "capacity": `minimum` is a hard ceiling (e.g. room capacity), so "X / Y"
   * always applies.
   */
  mode?: 'minimum' | 'capacity';
}

export function ProgressIndicator({ current, minimum, unit = 'học viên', mode = 'minimum' }: ProgressIndicatorProps) {
  const { percent, met } = calculateEnrollmentProgress(current, minimum);
  const label =
    mode === 'minimum' && met
      ? `${current} ${unit} (đủ tối thiểu ${minimum})`
      : `${current} / ${minimum} ${unit}`;

  return (
    <Box sx={{ minWidth: 140 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <LinearProgress variant="determinate" value={percent} color={met ? 'success' : 'warning'} sx={{ mt: 0.5 }} />
    </Box>
  );
}
