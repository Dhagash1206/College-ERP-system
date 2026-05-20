import { Card, CardContent, Divider, Grid, Typography } from '@mui/material';

function Field({ label, value }) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={500}>
        {value ?? '—'}
      </Typography>
    </Grid>
  );
}

export default function ProfileCard({ title, subtitle, fields }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {subtitle}
          </Typography>
        )}
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {fields.map((f) => (
            <Field key={f.label} label={f.label} value={f.value} />
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
