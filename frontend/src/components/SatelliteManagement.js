import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Avatar } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SatelliteIcon from '@mui/icons-material/Satellite';

function SatelliteManagement({ satellites, setSatellites }) {
  // Local state for add/edit forms and pagination
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', norad_id: '', tle_line1: '', tle_line2: '', color: '' });
  const [addError, setAddError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', norad_id: '', tle_line1: '', tle_line2: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const satellitesPerPage = 5;
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Pagination
  const totalPages = Math.ceil(satellites.length / satellitesPerPage);
  const paginatedSatellites = satellites.slice((currentPage-1)*satellitesPerPage, currentPage*satellitesPerPage);

  // Handlers
  const startEdit = (sat) => {
    setEditId(sat.id);
    setEditForm({
      name: sat.name,
      norad_id: sat.norad_id,
      tle_line1: sat.tle_line1,
      tle_line2: sat.tle_line2
    });
  };
  const cancelEdit = () => {
    setEditId(null);
    setEditForm({ name: '', norad_id: '', tle_line1: '', tle_line2: '' });
  };
  const handleEditChange = (e) => {
    setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  // Add Satellite
  const handleAddSatellite = (e) => {
    e.preventDefault();
    setAddError('');
    axios.post('/api/satellites/', addForm)
      .then(res => {
        axios.get('/api/satellites/')
          .then(res => setSatellites(res.data));
        setShowAddForm(false);
        setAddForm({ name: '', norad_id: '', tle_line1: '', tle_line2: '', color: '' });
        setSnackbar({ open: true, message: 'Satellite added successfully!', severity: 'success' });
      })
      .catch(() => {
        setAddError('Failed to add satellite.');
        setSnackbar({ open: true, message: 'Failed to add satellite.', severity: 'error' });
      });
  };

  // Edit Satellite
  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`/api/satellites/${editId}/`, editForm)
      .then(() => {
        axios.get('/api/satellites/').then(res => setSatellites(res.data));
        cancelEdit();
        setSnackbar({ open: true, message: 'Satellite updated successfully!', severity: 'success' });
      })
      .catch(() => {
        setAddError('Failed to update satellite.');
        setSnackbar({ open: true, message: 'Failed to update satellite.', severity: 'error' });
      });
  };

  // Delete Satellite
  const handleDelete = (id) => {
    axios.delete(`/api/satellites/${id}/`)
      .then(() => {
        setSatellites(prev => prev.filter(sat => sat.id !== id));
        setSnackbar({ open: true, message: 'Satellite deleted successfully!', severity: 'success' });
      })
      .catch(() => {
        setAddError('Failed to delete satellite.');
        setSnackbar({ open: true, message: 'Failed to delete satellite.', severity: 'error' });
      });
  };

  const getColorByIndex = (index) => {
    const colors = ['#FF5722', '#4CAF50', '#2196F3', '#FFC107', '#9C27B0'];
    return colors[index % colors.length];
  };

  return (
    <Card sx={{ margin: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Satellite Management</Typography>
        <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setShowAddForm(f => !f)}>
          {showAddForm ? 'Cancel' : 'Add Satellite'}
        </Button>
        <Dialog open={showAddForm} onClose={() => setShowAddForm(false)}>
          <DialogTitle>Add Satellite</DialogTitle>
          <form onSubmit={handleAddSatellite}>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 350 }}>
              <TextField required label="Name" value={addForm.name} onChange={e => setAddForm(f => ({...f, name: e.target.value}))} />
              <TextField required label="NORAD ID" type="number" value={addForm.norad_id} onChange={e => setAddForm(f => ({...f, norad_id: e.target.value}))} />
              <TextField required label="TLE Line 1" value={addForm.tle_line1} onChange={e => setAddForm(f => ({...f, tle_line1: e.target.value}))} />
              <TextField required label="TLE Line 2" value={addForm.tle_line2} onChange={e => setAddForm(f => ({...f, tle_line2: e.target.value}))} />
              <TextField required label="Color" value={addForm.color} onChange={e => setAddForm(f => ({...f, color: e.target.value}))} />
              {addError && <Alert severity="error">{addError}</Alert>}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Add</Button>
            </DialogActions>
          </form>
        </Dialog>
        <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 3, boxShadow: 2 }}>
          <Table size="medium" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
                <TableCell></TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>NORAD ID</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>TLE Line 1</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>TLE Line 2</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSatellites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, fontSize: '1.1rem', color: 'text.secondary' }}>
                    No satellites found.
                  </TableCell>
                </TableRow>
              ) : paginatedSatellites.map((sat, idx) => (
                <TableRow key={sat.id} sx={{ backgroundColor: idx % 2 === 0 ? 'background.default' : 'grey.100' }}>
                  <TableCell>
                    <Avatar sx={{ bgcolor: getColorByIndex(idx) }}>
                      <SatelliteIcon />
                    </Avatar>
                  </TableCell>
                  {editId === sat.id ? (
                    <>
                      <TableCell><TextField name="name" value={editForm.name} onChange={handleEditChange} fullWidth size="small" /></TableCell>
                      <TableCell><TextField name="norad_id" value={editForm.norad_id} onChange={handleEditChange} fullWidth size="small" /></TableCell>
                      <TableCell><TextField name="tle_line1" value={editForm.tle_line1} onChange={handleEditChange} fullWidth size="small" /></TableCell>
                      <TableCell><TextField name="tle_line2" value={editForm.tle_line2} onChange={handleEditChange} fullWidth size="small" /></TableCell>
                      <TableCell>
                        <Button variant="contained" color="success" sx={{mr:1}} onClick={handleEditSubmit} size="small" startIcon={<span className="material-icons">check</span>}>Save</Button>
                        <Button variant="outlined" color="secondary" onClick={cancelEdit} size="small" startIcon={<span className="material-icons">close</span>}>Cancel</Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell sx={{fontSize: '1rem'}}>{sat.name}</TableCell>
                      <TableCell sx={{fontSize: '1rem'}}>{sat.norad_id}</TableCell>
                      <TableCell sx={{fontSize: '0.95em'}}>{sat.tle_line1}</TableCell>
                      <TableCell sx={{fontSize: '0.95em'}}>{sat.tle_line2}</TableCell>
                      <TableCell>
                        <Button variant="contained" color="info" sx={{mr:1}} onClick={() => startEdit(sat)} size="small" startIcon={<span className="material-icons">edit</span>}>Edit</Button>
                        <Button variant="contained" color="error" onClick={() => handleDelete(sat.id)} size="small" startIcon={<span className="material-icons">delete</span>}>Delete</Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:12, marginTop:16}}>
          <Button variant="outlined" disabled={currentPage===1} onClick={()=>setCurrentPage(p=>p-1)}>Prev</Button>
          <span>Page {currentPage} of {totalPages || 1}</span>
          <Button variant="outlined" disabled={currentPage===totalPages || totalPages===0} onClick={()=>setCurrentPage(p=>p+1)}>Next</Button>
        </div>
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <MuiAlert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }} elevation={6} variant="filled">
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}

export default SatelliteManagement;