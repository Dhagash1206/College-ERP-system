import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loading({ fullScreen = false, label = 'Loading…' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        minHeight: fullScreen ? '100vh' : 240,
      }}
    >
      <CircularProgress color="primary" />
      <Typography color="text.secondary">{label}</Typography>
    </Box>
  );
}
