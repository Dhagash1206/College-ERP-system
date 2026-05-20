import { useEffect, useState } from 'react';
import { Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { api } from '../../api';
import Loading from '../../components/Loading';
import PageHeader from '../../components/PageHeader';

const MARK_COLUMNS = [
  'Internal test 1',
  'Internal test 2',
  'Internal test 3',
  'Event 1',
  'Event 2',
  'Semester End Exam',
];

export default function StudentMarksPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .studentMarks()
      .then(setRows)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <PageHeader title="Marks" subtitle="Internals, events, and semester exam" />
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Course ID</TableCell>
              <TableCell>Course</TableCell>
              {MARK_COLUMNS.map((c) => (
                <TableCell key={c} align="center">
                  {c.replace('Internal test ', 'I').replace('Semester End Exam', 'SEE')}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.course_id}>
                <TableCell>{r.course_id}</TableCell>
                <TableCell>{r.course_name}</TableCell>
                {MARK_COLUMNS.map((c) => (
                  <TableCell key={c} align="center">
                    {r.marks[c] ?? '—'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
