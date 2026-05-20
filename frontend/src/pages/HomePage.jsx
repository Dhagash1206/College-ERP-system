import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import GradeIcon from '@mui/icons-material/Grade';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '../AuthContext';
import FeatureCard from '../components/FeatureCard';

export default function HomePage() {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Welcome, Administrator
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Manage users, courses, and system data from the Django admin panel.
        </Typography>
        <Button variant="contained" size="large" href="/admin/" startIcon={<AdminPanelSettingsIcon />}>
          Open admin panel
        </Button>
      </Box>
    );
  }

  if (user?.role === 'teacher') {
    return (
      <Box>
        <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(90deg, #1e3a5f, #2d5a87)' }}>
          <Typography variant="h4" color="white" sx={{ textTransform: 'capitalize' }}>
            Welcome, {user.display_name}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', mt: 1 }}>
            Manage attendance, marks, timetables, and class reports.
          </Typography>
        </Paper>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              title="Profile"
              description="Faculty ID, department, and teaching load summary."
              to="/teacher/profile"
              icon={PersonIcon}
              color="#2563eb"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              title="Courses"
              description="Subjects you teach and the classes assigned to each."
              to="/teacher/courses"
              icon={MenuBookIcon}
              color="#7c3aed"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              title="Assignments"
              description="Class–course links with weekly timetable slots."
              to="/teacher/catalog"
              icon={AssignmentIcon}
              color="#0891b2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              title="Attendance"
              description="Record and edit class attendance, extra sessions, and student totals."
              to="/teacher/assignments/1"
              icon={EventAvailableIcon}
              color="#0d9488"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              title="Marks"
              description="Enter internal tests, events, and semester exam marks per class."
              to="/teacher/assignments/2"
              icon={GradeIcon}
              color="#7c3aed"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              title="Timetable"
              description="View your weekly schedule and find free teachers per slot."
              to="/teacher/timetable"
              icon={CalendarMonthIcon}
              color="#ea580c"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              title="Reports"
              description="Generate CIE and attendance reports for each assigned class."
              to="/teacher/assignments/3"
              icon={AssessmentIcon}
              color="#dc2626"
            />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(90deg, #1e3a5f, #2d5a87)' }}>
        <Typography variant="h4" color="white" sx={{ textTransform: 'capitalize' }}>
          Welcome, {user?.display_name}
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.85)', mt: 1 }}>
          View your attendance, marks, and class timetable in one place.
        </Typography>
      </Paper>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard
            title="Profile"
            description="USN, class, department, and enrolment summary."
            to="/student/profile"
            icon={PersonIcon}
            color="#2563eb"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard
            title="Courses"
            description="All subjects for your class with faculty and department."
            to="/student/courses"
            icon={MenuBookIcon}
            color="#7c3aed"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard
            title="Assignments"
            description="Course–teacher assignments and weekly schedule slots."
            to="/student/assignments"
            icon={AssignmentIcon}
            color="#0891b2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard
            title="Timetable"
            description="Weekly schedule with periods and course assignments."
            to="/student/timetable"
            icon={CalendarMonthIcon}
            color="#ea580c"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard
            title="Attendance"
            description="Subject-wise attendance percentage and class-by-class history."
            to="/student/attendance"
            icon={EventAvailableIcon}
            color="#0d9488"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard
            title="Marks"
            description="Internals, events, and semester exam marks for all enrolled courses."
            to="/student/marks"
            icon={GradeIcon}
            color="#9333ea"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
