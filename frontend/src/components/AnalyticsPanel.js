import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Box, Chip } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function AnalyticsPanel({ satellites, collisions }) {
  const totalSatellites = satellites.length;
  const totalCollisions = collisions.length;
  const fastestSat = satellites.length > 0 ? satellites.reduce((max, sat) => (sat.speed && sat.speed > (max.speed || 0) ? sat : max), {}) : null;
  const avgAltitude = satellites.length > 0 ? (satellites.reduce((sum, sat) => sum + (sat.altitude || 0), 0) / satellites.length / 1000).toFixed(2) : 'N/A';

  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'info' });

  React.useEffect(() => {
    if (satellites.length === 0) {
      setSnackbar({ open: true, message: 'No satellites in the system. Add one to get started!', severity: 'info' });
    }
  }, [satellites.length]);

  return (
    <Card sx={{ margin: 2, boxShadow: 3, minWidth: 600 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Live Analytics</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <Chip label={`Total Satellites: ${totalSatellites}`} color="primary" sx={{ fontWeight: 600, fontSize: '1.1em' }} />
          <Chip label={`Active Collisions: ${totalCollisions}`} color={totalCollisions > 0 ? 'error' : 'success'} sx={{ fontWeight: 600, fontSize: '1.1em' }} />
          <Chip label={`Average Altitude: ${avgAltitude} km`} color="warning" sx={{ fontWeight: 600, fontSize: '1.1em' }} />
          {fastestSat && fastestSat.name && (
            <Chip label={`Fastest Satellite: ${fastestSat.name} (${fastestSat.speed?.toFixed(2)} m/s)`} color="info" sx={{ fontWeight: 600, fontSize: '1.1em' }} />
          )}
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Added Satellites:</Typography>
        <List dense>
          {satellites.length === 0 ? (
            <ListItem><ListItemText primary="No satellites added yet." /></ListItem>
          ) : (
            satellites.map(sat => (
              <ListItem key={sat.id}>
                <ListItemText primary={`${sat.name} (NORAD: ${sat.norad_id})`} />
              </ListItem>
            ))
          )}
        </List>
        <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <MuiAlert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }} elevation={6} variant="filled">
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}

export default AnalyticsPanel;
