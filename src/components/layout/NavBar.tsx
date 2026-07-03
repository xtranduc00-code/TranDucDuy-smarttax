import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SchoolIcon from '@mui/icons-material/School';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/teachers', label: 'Giáo viên' },
  { to: '/students', label: 'Học sinh' },
  { to: '/rooms', label: 'Phòng học' },
  { to: '/activities', label: 'Lớp học' },
];

export function NavBar() {
  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
        <Stack direction="row" spacing={1} sx={{ mr: 2, alignItems: 'center' }}>
          <SchoolIcon color="primary" />
          <Typography variant="h6" component="div" noWrap>
            Quản lý Nhân sự & Lớp học
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {links.map((link) => (
            <Button
              key={link.to}
              component={NavLink}
              to={link.to}
              sx={{
                '&.active': {
                  fontWeight: 700,
                  color: 'primary.main',
                  backgroundColor: 'action.selected',
                },
              }}
            >
              {link.label}
            </Button>
          ))}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
