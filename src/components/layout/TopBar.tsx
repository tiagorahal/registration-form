import React from 'react';
import { Box, IconButton, Avatar } from '@mui/material';
import { AccountCircle as AccountCircleIcon } from '@mui/icons-material';

export const TopBar: React.FC = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'flex-end', 
      p: 2,
      bgcolor: 'white',
      borderBottom: '1px solid #e0e0e0'
    }}>
      <IconButton>
        <Avatar sx={{ width: 36, height: 36, bgcolor: '#4CAF50' }}>
          <AccountCircleIcon />
        </Avatar>
      </IconButton>
    </Box>
  );
};