import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Chip,
  Link,
  Paper,
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

export default function StudentAttendancePage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .studentAttendance()
      .then(setRows)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <PageHeader title="Attendance" subtitle="Overview across all your courses" />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course ID</TableCell>
              <TableCell>Course</TableCell>
              <TableCell align="center">Attended</TableCell>
              <TableCell align="center">Total</TableCell>
              <TableCell align="center">%</TableCell>
              <TableCell align="center">To attend</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.course_id} hover>
                <TableCell>{r.course_id}</TableCell>
                <TableCell>
                  <Link component={RouterLink} to={`/student/attendance/${r.course_id}`}>
                    {r.course_name}
                  </Link>
                </TableCell>
                <TableCell align="center">{r.attended}</TableCell>
                <TableCell align="center">{r.total}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={`${r.percentage}%`}
                    color={r.percentage < 75 ? 'error' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">{r.classes_to_attend}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
