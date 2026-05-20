import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function PageHeader({ title, subtitle, crumbs = [] }) {
  return (
    <Box sx={{ mb: 3 }}>
      {crumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 1 }}>
          {crumbs.map((c, i) =>
            c.to ? (
              <Link key={i} component={RouterLink} to={c.to} underline="hover" color="inherit">
                {c.label}
              </Link>
            ) : (
              <Typography key={i} color="text.primary">
                {c.label}
              </Typography>
            ),
          )}
        </Breadcrumbs>
      )}
      <Typography variant="h4" component="h1">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
