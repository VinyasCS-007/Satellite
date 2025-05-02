import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SatelliteViewer from './SatelliteViewer';

function GlobePage({ satellites, collisions, darkMode }) {
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'info' });

  React.useEffect(() => {
    if (satellites.length === 0) {
      setSnackbar({ open: true, message: 'No satellites to display on the globe. Add one to get started!', severity: 'info' });
    }
  }, [satellites.length]);

  return (
    <Card sx={{ margin: 2, boxShadow: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>3D Globe Visualization</Typography>
        <Box sx={{ height: { xs: 400, sm: 600, md: 900 }, width: { xs: '100%', sm: 700, md: 1100 }, minWidth: 350, minHeight: 400, mx: 'auto' }}>
          <SatelliteViewer satellites={satellites} collisions={collisions} darkMode={darkMode} />
        </Box>
        <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <MuiAlert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }} elevation={6} variant="filled">
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}

export default GlobePage;