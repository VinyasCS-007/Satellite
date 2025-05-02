import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function HomePage() {
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'info' });

  React.useEffect(() => {
    setSnackbar({ open: true, message: 'Welcome! Use the sidebar to navigate the app.', severity: 'info' });
  }, []);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Card sx={{ maxWidth: 600, width: '100%', boxShadow: 3, p: 2 }}>
        <CardContent>
          <Typography variant="h3" align="center" gutterBottom>Welcome to the Satellite Collision Predictor</Typography>
          <Typography align="center" sx={{ fontSize: '1.2em', my: 3 }}>
            This platform allows you to manage satellites, predict potential collisions, and visualize orbits in 3D. Use the sidebar to get started with satellite management, collision prediction, or explore the interactive globe.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <img src="/logo192.png" alt="Satellite" style={{width: 120}} />
          </Box>
        </CardContent>
      </Card>
      <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <MuiAlert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }} elevation={6} variant="filled">
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}

export default HomePage;