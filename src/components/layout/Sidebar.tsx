import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  People as PeopleIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';

interface SidebarProps {
  drawerWidth: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ drawerWidth }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid #e0e0e0',
          bgcolor: 'white',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box sx={{ 
            bgcolor: '#4CAF50', 
            width: 40, 
            height: 40, 
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 1.5
          }}>
            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.4rem' }}>
              F
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>
            Flugo
          </Typography>
        </Box>
      </Box>
      
      <List sx={{ px: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            selected
            sx={{
              borderRadius: 2,
              mb: 1,
              '&.Mui-selected': {
                bgcolor: '#f5f5f5',
                '&:hover': {
                  bgcolor: '#eeeeee',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <PeopleIcon sx={{ color: '#666' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Colaboradores" 
              primaryTypographyProps={{ 
                fontSize: '0.95rem',
                fontWeight: 500
              }} 
            />
            <ChevronRightIcon sx={{ color: '#999', fontSize: 20 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};