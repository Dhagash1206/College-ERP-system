import { useEffect, useState } from 'react';
import { Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { api } from '../../api';
import Loading from '../../components/Loading';
import PageHeader from '../../components/PageHeader';
import { useParams } from 'react-router-dom';

export default function TeacherStudentMarksPage() {
  const { assignId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .teacherStudentMarks(assignId)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [assignId]);

  if (loading) return <Loading />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <PageHeader
        title="Student marks overview"
        crumbs={[{ label: 'Marks', to: '/teacher/assignments/2' }, { label: 'Students' }]}
      />
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>USN</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="center">CIE</TableCell>
              <TableCell align="center">Attendance %</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.students.map((s) => (
              <TableRow key={s.usn}>
                <TableCell>{s.usn}</TableCell>
                <TableCell>{s.name}</TableCell>
                <TableCell align="center">{s.cie}</TableCell>
                <TableCell align="center">{s.attendance}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
