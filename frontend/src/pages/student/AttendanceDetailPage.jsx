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

export default function StudentAttendanceDetailPage() {
  const { courseId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .studentAttendanceDetail(courseId)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return <Loading />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <PageHeader
        title={data.course_name}
        subtitle="Class-by-class attendance record"
        crumbs={[
          { label: 'Attendance', to: '/student/attendance' },
          { label: data.course_name },
        ]}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.records.map((r) => (
              <TableRow key={r.date}>
                <TableCell>{r.date}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={r.present ? 'Present' : 'Absent'}
                    color={r.present ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
