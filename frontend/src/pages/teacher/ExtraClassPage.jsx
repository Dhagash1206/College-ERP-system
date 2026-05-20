import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { api } from '../../api';
import Loading from '../../components/Loading';
import PageHeader from '../../components/PageHeader';

export default function TeacherExtraClassPage() {
  const { assignId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .teacherStudents(assignId)
      .then((d) => {
        setStudents(d.students);
        const map = {};
        d.students.forEach((s) => {
          map[s.usn] = 'present';
        });
        setAttendance(map);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [assignId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.extraClass(assignId, date, attendance);
      navigate('/teacher/assignments/1');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <PageHeader
        title="Extra class"
        subtitle="Record attendance for an additional session"
        crumbs={[{ label: 'Attendance', to: '/teacher/assignments/1' }, { label: 'Extra class' }]}
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
          sx={{ mb: 3 }}
        />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>USN</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((s) => (
                <TableRow key={s.usn}>
                  <TableCell>{s.usn}</TableCell>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>
                    <RadioGroup
                      row
                      value={attendance[s.usn] || 'present'}
                      onChange={(e) => setAttendance((prev) => ({ ...prev, [s.usn]: e.target.value }))}
                    >
                      <FormControlLabel value="present" control={<Radio />} label="Present" />
                      <FormControlLabel value="absent" control={<Radio />} label="Absent" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'Saving…' : 'Save extra class'}
          </Button>
          <Button onClick={() => navigate('/teacher/assignments/1')}>Cancel</Button>
        </Stack>
      </Paper>
    </>
  );
}
