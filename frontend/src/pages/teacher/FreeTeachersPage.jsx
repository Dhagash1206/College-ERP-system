import { useEffect, useState } from 'react';
import { Alert, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { api } from '../../api';
import Loading from '../../components/Loading';
import PageHeader from '../../components/PageHeader';

export default function FreeTeachersPage() {
  const { assignTimeId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .freeTeachers(assignTimeId)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [assignTimeId]);

  if (loading) return <Loading />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <PageHeader
        title="Free teachers"
        subtitle={`${data.day} · ${data.period} · ${data.class_name}`}
        crumbs={[{ label: 'Timetable', to: '/teacher/timetable' }, { label: 'Free teachers' }]}
      />
      <Paper sx={{ p: 2 }}>
        {data.teachers.length === 0 ? (
          <Typography color="text.secondary">No free teachers for this slot.</Typography>
        ) : (
          <List>
            {data.teachers.map((t) => (
              <ListItem key={t.id}>
                <ListItemText primary={t.name} secondary={`ID: ${t.id}`} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </>
  );
}
