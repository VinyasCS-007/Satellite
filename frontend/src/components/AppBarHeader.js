import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Box from '@mui/material/Box';

function AppBarHeader({ darkMode, setDarkMode, onMenuClick }) {
  return (
    <AppBar position="sticky" elevation={4} sx={{ background: 'linear-gradient(90deg, #232a34 0%, #3949ab 100%)', borderRadius: 0, zIndex: 1201 }}>
      <Toolbar>
        {onMenuClick && (
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
        )}
        <img src="/logo192.png" alt="Logo" style={{ width: 40, height: 40, marginRight: 16, borderRadius: '50%' }} />
        <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1, color: '#fff' }}>
          Satellite Collision Predictor
        </Typography>
        <Box>
          <IconButton sx={{ ml: 1 }} onClick={() => setDarkMode(dm => !dm)} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AppBarHeader;
