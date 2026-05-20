import { useEffect, useState } from 'react';
import { Alert, Box, Grid, Paper, Typography } from '@mui/material';
import { api } from '../../api';
import Loading from '../../components/Loading';
import PageHeader from '../../components/PageHeader';
import ProfileCard from '../../components/ProfileCard';

export default function TeacherProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .teacherProfile()
      .then(setProfile)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <PageHeader title="My profile" subtitle="Faculty details and teaching load" />
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ProfileCard
            title={profile.name}
            subtitle={`Faculty ID: ${profile.id}`}
            fields={[
              { label: 'Username', value: profile.username },
              { label: 'Email', value: profile.email || 'Not set' },
              { label: 'Faculty ID', value: profile.id },
              { label: 'Gender', value: profile.sex },
              { label: 'Date of birth', value: profile.dob },
              { label: 'Department', value: profile.dept_name },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Teaching load
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Courses
              </Typography>
              <Typography variant="h4" color="primary">
                {profile.courses_count}
              </Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Classes
              </Typography>
              <Typography variant="h4" color="secondary">
                {profile.classes_count}
              </Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Assignments
              </Typography>
              <Typography variant="h4">{profile.assignments_count}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
