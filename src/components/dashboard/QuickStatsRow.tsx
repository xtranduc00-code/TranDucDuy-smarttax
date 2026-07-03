import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import type { QuickStatistics } from '../../types/dashboard';

interface QuickStatsRowProps {
  stats: QuickStatistics;
}

export function QuickStatsRow({ stats }: QuickStatsRowProps) {
  const items = [
    { icon: <PersonIcon fontSize="small" />, label: 'Giáo viên', active: stats.activeTeachers, total: stats.totalTeachers },
    { icon: <GroupIcon fontSize="small" />, label: 'Học sinh', active: stats.activeStudents, total: stats.totalStudents },
    { icon: <MeetingRoomIcon fontSize="small" />, label: 'Phòng học', active: stats.activeRooms, total: stats.totalRooms },
  ];

  return (
    <Card variant="outlined">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />}
        sx={{ p: 2 }}
      >
        {items.map((item) => (
          <Stack key={item.label} direction="row" spacing={1.5} sx={{ alignItems: 'center', flex: 1, py: { xs: 1, sm: 0 } }}>
            <Box sx={{ color: 'text.secondary', display: 'flex' }}>{item.icon}</Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {item.active} / {item.total} <Typography component="span" variant="body2" color="text.secondary">hoạt động</Typography>
              </Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
