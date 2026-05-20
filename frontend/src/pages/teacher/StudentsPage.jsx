import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  Chip,
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

export default function TeacherStudentsPage() {
  const { assignId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .teacherStudents(assignId)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [assignId]);

  if (loading) return <Loading />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <PageHeader
        title="Student attendance"
        subtitle={data.course_name}
        crumbs={[
          { label: 'Attendance', to: '/teacher/assignments/1' },
          { label: 'Students' },
        ]}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>USN</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="center">Attended</TableCell>
              <TableCell align="center">Total</TableCell>
              <TableCell align="center">%</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.students.map((s) => (
              <TableRow key={s.usn}>
                <TableCell>{s.usn}</TableCell>
                <TableCell>{s.name}</TableCell>
                <TableCell align="center">{s.attended}</TableCell>
                <TableCell align="center">{s.total}</TableCell>
                <TableCell align="center">
                  <Chip label={`${s.percentage}%`} color={s.percentage < 75 ? 'error' : 'success'} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
