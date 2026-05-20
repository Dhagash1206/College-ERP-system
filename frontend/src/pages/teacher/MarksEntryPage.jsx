import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  TextField,
} from '@mui/material';
import { api } from '../../api';
import Loading from '../../components/Loading';
import PageHeader from '../../components/PageHeader';

export default function TeacherMarksEntryPage() {
  const { marksClassId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .teacherMarksEntry(marksClassId)
      .then((d) => {
        setData(d);
        const map = {};
        d.students.forEach((s) => {
          map[s.usn] = s.marks;
        });
        setMarks(map);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [marksClassId]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await api.saveMarks(marksClassId, marks);
      navigate(`/teacher/assignments/${res.assign_id}/marks`);
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
        title={data.test_name}
        subtitle={`Max marks: ${data.total_marks}`}
        crumbs={[
          { label: 'Marks', to: '/teacher/assignments/2' },
          { label: data.test_name },
        ]}
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>USN</TableCell>
              <TableCell>Name</TableCell>
              <TableCell width={120}>Marks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.students.map((s) => (
              <TableRow key={s.usn}>
                <TableCell>{s.usn}</TableCell>
                <TableCell>{s.name}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    inputProps={{ min: 0, max: data.total_marks }}
                    value={marks[s.usn] ?? 0}
                    onChange={(e) => setMarks((prev) => ({ ...prev, [s.usn]: e.target.value }))}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save marks'}
        </Button>
        <Button onClick={() => navigate(`/teacher/assignments/${data.assign_id}/marks`)}>Cancel</Button>
      </Stack>
    </>
  );
}
