import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
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

const TITLES = {
  1: { title: 'Attendance — Classes', subtitle: 'Select a class to manage sessions' },
  2: { title: 'Marks — Classes', subtitle: 'Select a class to enter or view marks' },
  3: { title: 'Reports — Classes', subtitle: 'Generate class reports' },
};

export default function TeacherAssignmentsPage() {
  const { choice } = useParams();
  const choiceNum = Number(choice);
  const meta = TITLES[choiceNum] || TITLES[1];
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .teacherAssignments(choiceNum)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [choiceNum]);

  if (loading) return <Loading />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <PageHeader title={meta.title} subtitle={meta.subtitle} crumbs={[{ label: 'Home', to: '/' }, { label: meta.title }]} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Class</TableCell>
              <TableCell>Course</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.assignments.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.class_name}</TableCell>
                <TableCell>{a.course_name}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap">
                    {choiceNum === 1 && (
                      <>
                        <Button size="small" variant="contained" component={RouterLink} to={`/teacher/assignments/${a.id}/sessions`}>
                          Sessions
                        </Button>
                        <Button size="small" variant="outlined" component={RouterLink} to={`/teacher/assignments/${a.id}/extra-class`}>
                          Extra class
                        </Button>
                        <Button size="small" color="secondary" component={RouterLink} to={`/teacher/assignments/${a.id}/students`}>
                          Students
                        </Button>
                      </>
                    )}
                    {choiceNum === 2 && (
                      <>
                        <Button size="small" variant="contained" component={RouterLink} to={`/teacher/assignments/${a.id}/marks`}>
                          Enter marks
                        </Button>
                        <Button size="small" color="secondary" component={RouterLink} to={`/teacher/assignments/${a.id}/student-marks`}>
                          View students
                        </Button>
                      </>
                    )}
                    {choiceNum === 3 && (
                      <Button size="small" variant="contained" component={RouterLink} to={`/teacher/assignments/${a.id}/report`}>
                        Report
                      </Button>
                    )}
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
