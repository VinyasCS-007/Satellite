import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import SatelliteIcon from '@mui/icons-material/Satellite';
import WarningIcon from '@mui/icons-material/Warning';
import PublicIcon from '@mui/icons-material/Public';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Satellites', icon: <SatelliteIcon />, path: '/satellites' },
  { text: 'Prediction', icon: <WarningIcon />, path: '/prediction' },
  { text: '3D Globe', icon: <PublicIcon />, path: '/globe' },
];

function Sidebar() {
  const location = useLocation();
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 220,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 220,
          boxSizing: 'border-box',
          background: '#1a237e',
          color: '#fff',
        },
      }}
    >
      <List>
        {navItems.map(item => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': { background: '#3949ab', color: '#fff' },
              '&:hover': { background: '#283593' },
            }}
          >
            <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
