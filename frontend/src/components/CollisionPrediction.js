import React from 'react';
import { Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function CollisionPrediction({ collisions, handleCheckPrediction }) {
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

  const handleCheck = () => {
    handleCheckPrediction();
    setSnackbar({ open: true, message: 'Collision prediction updated.', severity: 'info' });
  };

  return (
    <Card sx={{ margin: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Collision Prediction</Typography>
        <Button variant="contained" color="warning" sx={{ mb: 2 }} onClick={handleCheck}>
          Check Prediction
        </Button>
        {collisions.length === 0 ? (
          <Typography>No predicted collisions at this time.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Satellite 1</TableCell>
                  <TableCell>Satellite 2</TableCell>
                  <TableCell>Distance (km)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {collisions.map((col, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{col.satellite1 || '-'}</TableCell>
                    <TableCell>{col.satellite2 || '-'}</TableCell>
                    <TableCell>{col.distance_km ? col.distance_km.toFixed(2) : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <MuiAlert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }} elevation={6} variant="filled">
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}

export default CollisionPrediction;