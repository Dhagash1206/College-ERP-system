import { useEffect, useState } from 'react';
import {
  Alert,
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

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .studentAssignments()
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
        subtitle="Course–teacher assignments for your class, including weekly slots"
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell>Weekly schedule</TableCell>
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
                <TableCell>{a.teacher_name}</TableCell>
                <TableCell>
                  <Stack direction="row" flexWrap="wrap" gap={0.5}>
                    {a.schedule?.length ? (
                      a.schedule.map((s) => (
                        <Chip
                          key={s.id}
                          size="small"
                          label={`${s.day.slice(0, 3)} · ${s.period}`}
                          variant="outlined"
                        />
                      ))
                    ) : (
                      <Chip size="small" label="No slots" color="warning" />
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {assignments.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No assignments found for your class.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
