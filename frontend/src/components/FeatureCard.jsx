import { Card, CardActionArea, CardContent, Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function FeatureCard({ title, description, to, icon: Icon, color = 'primary.main' }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={RouterLink} to={to} sx={{ flexGrow: 1 }}>
        <CardContent>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: `${color}22`,
              color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            {Icon && <Icon />}
          </Box>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button component={RouterLink} to={to} variant="contained" fullWidth>
          Open
        </Button>
      </Box>
    </Card>
  );
}
