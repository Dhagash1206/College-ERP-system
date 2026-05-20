import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { api } from '../../api';
import Loading from '../../components/Loading';
import PageHeader from '../../components/PageHeader';

export default function TeacherAssignmentCatalogPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .teacherAssignmentCatalog()
      .then((d) => setAssignments(d.assignments))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <PageHeader
        title="Assignments"
        subtitle="All class–course assignments with timetable slots"
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((a) => (
              <TableRow key={a.id}>
                <TableCell>
                  {a.course.name}
                  <br />
                  <small>{a.course.id}</small>
                </TableCell>
                <TableCell>{a.class_name}</TableCell>
                <TableCell>
                  <Stack direction="row" flexWrap="wrap" gap={0.5}>
                    {a.schedule?.map((s) => (
                      <Chip
                        key={s.id}
                        size="small"
                        label={`${s.day.slice(0, 3)} · ${s.period}`}
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      size="small"
                      component={RouterLink}
                      to={`/teacher/assignments/${a.id}/sessions`}
                    >
                      Attendance
                    </Button>
                    <Button
                      size="small"
                      component={RouterLink}
                      to={`/teacher/assignments/${a.id}/marks`}
                    >
                      Marks
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
