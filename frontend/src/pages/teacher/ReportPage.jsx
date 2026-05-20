import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { api } from '../../api';
import Loading from '../../components/Loading';
import PageHeader from '../../components/PageHeader';

export default function TeacherReportPage() {
  const { assignId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .teacherReport(assignId)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [assignId]);

  if (loading) return <Loading />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <PageHeader
        title="Class report"
        subtitle={`${data.class_name} — ${data.course_name}`}
        crumbs={[{ label: 'Reports', to: '/teacher/assignments/3' }, { label: 'Report' }]}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>USN</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="center">CIE</TableCell>
              <TableCell align="center">Attendance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.students.map((s) => (
              <TableRow key={s.usn}>
                <TableCell>{s.usn}</TableCell>
                <TableCell>{s.name}</TableCell>
                <TableCell align="center">{s.cie}</TableCell>
                <TableCell align="center">
                  <Chip label={`${s.attendance}%`} color={s.attendance < 75 ? 'error' : 'success'} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
