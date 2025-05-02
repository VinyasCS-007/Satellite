import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import SatelliteManagement from './components/SatelliteManagement';
import CollisionPrediction from './components/CollisionPrediction';
import GlobePage from './components/GlobePage';
import AnalyticsPanel from './components/AnalyticsPanel';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SatelliteIcon from '@mui/icons-material/Satellite';
import WarningIcon from '@mui/icons-material/Warning';
import PublicIcon from '@mui/icons-material/Public';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import DarkModeToggle from './components/DarkModeToggle';

window.CESIUM_BASE_URL = "/Cesium/";

function App() {
  const [collisions, setCollisions] = useState([]);
  const [satellites, setSatellites] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [page, setPage] = useState('dashboard');

  // Custom flagship theme
  const flagshipTheme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#3949ab' },
      secondary: { main: '#ff6e7f' },
      background: {
        default: darkMode ? '#181c24' : '#f4f6fa',
        paper: darkMode ? '#232a34' : '#fff',
      },
      info: { main: '#00bcd4' },
      warning: { main: '#fbc02d' },
      error: { main: '#fc3d21' },
      success: { main: '#43a047' },
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: 'Segoe UI, Roboto, Arial, sans-serif',
      fontWeightBold: 700,
      h5: { fontWeight: 700, letterSpacing: 1 },
      h3: { fontWeight: 800, letterSpacing: 2 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
            transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            boxShadow: '0 8px 32px rgba(44,62,80,0.10), 0 2px 8px rgba(44,62,80,0.10)',
            transition: 'box-shadow 0.2s',
          },
        },
      },
    },
  });

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    Promise.all([
      axios.get('/api/satellites/').then(res => setSatellites(res.data)),
      axios.get('/api/predict-collisions/').then(res => setCollisions(res.data.collisions || []))
    ]);
  }, []);

  const handleCheckPrediction = () => {
    axios.get('/api/predict-collisions/')
      .then(res => {
        const collisionData = res.data.collisions || [];
        setCollisions(collisionData);
      })
      .catch(() => {
        setCollisions([]);
      });
  };

  return (
    <ThemeProvider theme={flagshipTheme}>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <img src="/logo192.png" alt="Logo" style={{ width: 36, height: 36, marginRight: 16, borderRadius: '50%' }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
            Satellite Collision Predictor
          </Typography>
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </Toolbar>
      </AppBar>
      <Grid container spacing={4} sx={{ maxWidth: 1200, mx: 'auto', mt: 4, px: 2 }}>
        {page === 'dashboard' && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <DashboardIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6">Analytics</Typography>
                  <Typography variant="body2" color="text.secondary">Live stats and insights</Typography>
                </CardContent>
                <CardActions>
                  <Button variant="contained" onClick={() => setPage('analytics')}>View Analytics</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <SatelliteIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6">Satellites</Typography>
                  <Typography variant="body2" color="text.secondary">Manage your satellites</Typography>
                </CardContent>
                <CardActions>
                  <Button variant="contained" onClick={() => setPage('satellites')}>Manage Satellites</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <WarningIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h6">Collisions</Typography>
                  <Typography variant="body2" color="text.secondary">Predict and review collisions</Typography>
                </CardContent>
                <CardActions>
                  <Button variant="contained" color="warning" onClick={() => setPage('collisions')}>Check Collisions</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <PublicIcon sx={{ fontSize: 48, color: 'info.main', mb: 1 }} />
                  <Typography variant="h6">3D Globe</Typography>
                  <Typography variant="body2" color="text.secondary">Visualize orbits in 3D</Typography>
                </CardContent>
                <CardActions>
                  <Button variant="contained" color="info" onClick={() => setPage('globe')}>View Globe</Button>
                </CardActions>
              </Card>
            </Grid>
          </>
        )}
        {page === 'analytics' && (
          <Grid item xs={12}><AnalyticsPanel satellites={satellites} collisions={collisions} /><Button sx={{mt:2}} onClick={() => setPage('dashboard')}>Back to Dashboard</Button></Grid>
        )}
        {page === 'satellites' && (
          <Grid item xs={12}><SatelliteManagement satellites={satellites} setSatellites={setSatellites} /><Button sx={{mt:2}} onClick={() => setPage('dashboard')}>Back to Dashboard</Button></Grid>
        )}
        {page === 'collisions' && (
          <Grid item xs={12}><CollisionPrediction collisions={collisions} handleCheckPrediction={handleCheckPrediction} /><Button sx={{mt:2}} onClick={() => setPage('dashboard')}>Back to Dashboard</Button></Grid>
        )}
        {page === 'globe' && (
          <Grid item xs={12}><GlobePage satellites={satellites} collisions={collisions} darkMode={darkMode} /><Button sx={{mt:2}} onClick={() => setPage('dashboard')}>Back to Dashboard</Button></Grid>
        )}
      </Grid>
    </ThemeProvider>
  );
}

export default App;