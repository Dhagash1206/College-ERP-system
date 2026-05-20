import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import { api } from '../../api';
import Loading from '../../components/Loading';
import PageHeader from '../../components/PageHeader';

export default function TeacherSessionsPage() {
  const { assignId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api
      .teacherSessions(assignId)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [assignId]);

  const cancel = async (sessionId) => {
    await api.cancelSession(sessionId);
    load();
  };

  if (loading) return <Loading />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <PageHeader
        title="Class sessions"
        subtitle={`${data.class_name} — ${data.course_name}`}
        crumbs={[
          { label: 'Attendance', to: '/teacher/assignments/1' },
          { label: 'Sessions' },
        ]}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.sessions.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.date}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={s.status_label}
                    color={s.status === 1 ? 'success' : s.status === 2 ? 'default' : 'warning'}
                  />
                </TableCell>
                <TableCell align="right">
                  {s.status !== 2 && (
                    <>
                      <Button
                        size="small"
                        variant="contained"
                        component={RouterLink}
                        to={`/teacher/sessions/${s.id}`}
                        sx={{ mr: 1 }}
                      >
                        {s.status === 1 ? 'Edit' : 'Enter'}
                      </Button>
                      {s.status === 0 && (
                        <IconButton size="small" color="error" onClick={() => cancel(s.id)} title="Cancel class">
                          <BlockIcon />
                        </IconButton>
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button sx={{ mt: 2 }} onClick={() => navigate('/teacher/assignments/1')}>
        Back to classes
      </Button>
    </>
  );
}
