import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { api } from '../../api';
import Loading from '../../components/Loading';
import PageHeader from '../../components/PageHeader';

function slotContent(slot) {
  if (slot.type === 'label') return slot.value;
  if (slot.type === 'break') return 'Break';
  if (slot.type === 'class') {
    return (
      <Typography variant="body2">
        {slot.course}
        <br />
        <Typography component="span" variant="caption" color="text.secondary">
          {slot.class_name}
        </Typography>
      </Typography>
    );
  }
  return '';
}

export default function TeacherTimetablePage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .teacherTimetable()
      .then((d) => setRows(d.rows))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <PageHeader
        title="Timetable"
        subtitle="Click a scheduled slot to see free teachers for that period"
      />
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.day}>
                {row.slots.map((slot, i) => (
                  <TableCell
                    key={i}
                    align="center"
                    sx={{
                      minWidth: i === 0 ? 100 : 100,
                      bgcolor: slot.type === 'break' ? 'action.hover' : slot.type === 'class' ? 'primary.50' : undefined,
                      fontWeight: i === 0 ? 600 : 400,
                      verticalAlign: 'top',
                    }}
                  >
                    {slot.type === 'class' && slot.assign_time_id ? (
                      <Link component={RouterLink} to={`/teacher/free-teachers/${slot.assign_time_id}`}>
                        {slotContent(slot)}
                      </Link>
                    ) : (
                      slotContent(slot)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
