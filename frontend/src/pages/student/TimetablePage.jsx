import { useEffect, useState } from 'react';
import { Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { api } from '../../api';
import Loading from '../../components/Loading';
import PageHeader from '../../components/PageHeader';

function slotLabel(slot) {
  if (slot.type === 'label') return slot.value;
  if (slot.type === 'break') return 'Break';
  if (slot.type === 'class') return slot.course_name || slot.value;
  return '';
}

export default function StudentTimetablePage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .studentTimetable()
      .then((d) => setRows(d.rows))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!rows.length) return <Typography>No timetable data.</Typography>;

  const headerSlots = rows[0].slots;

  return (
    <>
      <PageHeader title="Timetable" subtitle="Weekly class schedule" />
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {headerSlots.map((_, i) => (
                <TableCell key={i} align="center" sx={{ fontWeight: 600, minWidth: i === 0 ? 100 : 72 }}>
                  {i === 0 ? 'Day' : i === 4 || i === 8 ? '—' : `P${i <= 4 ? i : i <= 8 ? i - 1 : i - 2}`}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.day}>
                {row.slots.map((slot, i) => (
                  <TableCell
                    key={i}
                    align="center"
                    sx={{
                      bgcolor: slot.type === 'break' ? 'action.hover' : slot.type === 'class' ? 'primary.50' : undefined,
                      fontWeight: i === 0 ? 600 : 400,
                    }}
                  >
                    {slotLabel(slot)}
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
