import { useState } from 'react';
import { Outlet, Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import GradeIcon from '@mui/icons-material/Grade';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';
import { useAuth } from '../AuthContext';

const DRAWER_WIDTH = 260;

function navItems(user) {
  if (user?.role === 'student') {
    return [
      { label: 'Home', to: '/', icon: HomeIcon },
      { label: 'Attendance', to: '/student/attendance', icon: EventAvailableIcon },
      { label: 'Marks', to: '/student/marks', icon: GradeIcon },
      { label: 'Timetable', to: '/student/timetable', icon: CalendarMonthIcon },
    ];
  }
  if (user?.role === 'teacher') {
    return [
      { label: 'Home', to: '/', icon: HomeIcon },
      { label: 'Attendance', to: '/teacher/assignments/1', icon: EventAvailableIcon },
      { label: 'Marks', to: '/teacher/assignments/2', icon: GradeIcon },
      { label: 'Timetable', to: '/teacher/timetable', icon: CalendarMonthIcon },
      { label: 'Reports', to: '/teacher/assignments/3', icon: AssessmentIcon },
    ];
  }
  return [{ label: 'Home', to: '/', icon: HomeIcon }];
}

export default function AppLayout() {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const items = navItems(user);

  const drawer = (
    <Box sx={{ pt: 1 }}>
      <Box sx={{ px: 2, py: 2 }}>
        <Typography variant="overline" color="text.secondary">
          Menu
        </Typography>
      </Box>
      <List>
        {items.map((item) => (
          <ListItemButton
            key={item.to}
            component={RouterLink}
            to={item.to}
            selected={location.pathname === item.to}
            onClick={() => setMobileOpen(false)}
          >
            <ListItemIcon>
              <item.icon color="primary" />
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
        {user?.role === 'admin' && (
          <ListItemButton component="a" href="/admin/" target="_blank">
            <ListItemIcon>
              <SchoolIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Admin panel" />
          </ListItemButton>
        )}
      </List>
    </Box>
  );

  const handleLogout = async () => {
    await logout();
    navigate('/accounts/login/');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          bgcolor: 'primary.main',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}
          <SchoolIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            College ERP
          </Typography>
          <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
            {user?.display_name}
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={() => setLogoutOpen(true)}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          <Toolbar />
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>

      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)}>
        <DialogTitle>Log out?</DialogTitle>
        <DialogContent>Your session will end and you will return to the login page.</DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
