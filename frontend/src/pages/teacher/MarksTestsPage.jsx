import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
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

export default function TeacherMarksTestsPage() {
  const { assignId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .teacherMarksTests(assignId)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [assignId]);

  if (loading) return <Loading />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <PageHeader
        title="Marks entry"
        subtitle="Select an assessment to enter or edit marks"
        crumbs={[{ label: 'Marks', to: '/teacher/assignments/2' }, { label: 'Tests' }]}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Assessment</TableCell>
              <TableCell>Max marks</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.tests.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.name}</TableCell>
                <TableCell>{t.total_marks}</TableCell>
                <TableCell>
                  <Chip size="small" label={t.status ? 'Submitted' : 'Pending'} color={t.status ? 'success' : 'warning'} />
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="contained"
                    component={RouterLink}
                    to={`/teacher/marks/${t.id}`}
                  >
                    {t.status ? 'Edit' : 'Enter'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
