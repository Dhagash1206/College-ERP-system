import { useEffect, useState } from 'react';
import { Alert, Box, Grid, Paper, Typography } from '@mui/material';
import { api } from '../../api';
import Loading from '../../components/Loading';
import PageHeader from '../../components/PageHeader';
import ProfileCard from '../../components/ProfileCard';

export default function StudentProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .studentProfile()
      .then(setProfile)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <PageHeader title="My profile" subtitle="Your academic identity and class details" />
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ProfileCard
            title={profile.name}
            subtitle={`USN: ${profile.usn}`}
            fields={[
              { label: 'Username', value: profile.username },
              { label: 'Email', value: profile.email || 'Not set' },
              { label: 'USN', value: profile.usn },
              { label: 'Gender', value: profile.sex },
              { label: 'Date of birth', value: profile.dob },
              { label: 'Class', value: profile.class.name },
              { label: 'Section', value: profile.class.section },
              { label: 'Semester', value: profile.class.semester },
              { label: 'Department', value: profile.class.dept_name },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Enrolment summary
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Courses
              </Typography>
              <Typography variant="h4" color="primary">
                {profile.enrolled_courses}
              </Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Class assignments
              </Typography>
              <Typography variant="h4" color="secondary">
                {profile.assignments}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
