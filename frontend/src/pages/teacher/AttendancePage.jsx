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
} from '@mui/material';
import { api } from '../../api';
import Loading from '../../components/Loading';
import PageHeader from '../../components/PageHeader';

export default function TeacherAttendancePage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api
      .teacherSession(sessionId)
      .then((d) => {
        setData(d);
        const map = {};
        d.students.forEach((s) => {
          map[s.usn] = s.present ? 'present' : 'absent';
        });
        setAttendance(map);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.saveAttendance(sessionId, attendance);
      setSuccess('Attendance saved.');
      setTimeout(() => navigate(`/teacher/assignments/${data.assign_id}/sessions`), 800);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (error && !data) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <PageHeader
        title={`Attendance — ${data.date}`}
        subtitle={`${data.class_name} · ${data.course_name}`}
        crumbs={[
          { label: 'Sessions', to: `/teacher/assignments/${data.assign_id}/sessions` },
          { label: data.date },
        ]}
      />
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>USN</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.students.map((s) => (
              <TableRow key={s.usn}>
                <TableCell>{s.usn}</TableCell>
                <TableCell>{s.name}</TableCell>
                <TableCell>
                  <RadioGroup
                    row
                    value={attendance[s.usn] || 'present'}
                    onChange={(e) => setAttendance((prev) => ({ ...prev, [s.usn]: e.target.value }))}
                  >
                    <FormControlLabel value="present" control={<Radio color="success" />} label="Present" />
                    <FormControlLabel value="absent" control={<Radio color="error" />} label="Absent" />
                  </RadioGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save attendance'}
        </Button>
        <Button onClick={() => navigate(`/teacher/assignments/${data.assign_id}/sessions`)}>Cancel</Button>
      </Stack>
    </>
  );
}
