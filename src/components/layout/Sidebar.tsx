import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider
} from '@mui/material';
import {
  People,
  Business,
  Settings,
  Assessment,
  AccountCircle
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  drawerWidth: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ drawerWidth }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Colaboradores', icon: <People />, path: '/' },
    { text: 'Departamentos', icon: <Business />, path: '/departamentos' },
    { text: 'Relatórios', icon: <Assessment />, path: '/relatorios' },
  ];

  const userItems = [
    { text: 'Meu Perfil', icon: <AccountCircle />, path: '/perfil' },
    { text: 'Configurações', icon: <Settings />, path: '/configuracoes' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const isItemActive = (path: string, text: string) => {
    return path === location.pathname || 
      (text === 'Colaboradores' && location.pathname === '/');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#2c3e50',
          color: 'white',
          borderRight: 'none',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#4CAF50' }}>
          HR System
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          Sistema de Gestão
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

      {/* Menu Principal */}
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => {
          const isActive = isItemActive(item.path, item.text);
          
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                disabled={item.path === '/relatorios'}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  backgroundColor: isActive ? 'rgba(76, 175, 80, 0.15)' : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive 
                      ? 'rgba(76, 175, 80, 0.25)' 
                      : 'rgba(255, 255, 255, 0.05)',
                  },
                  '&.Mui-disabled': {
                    opacity: 0.5,
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: isActive ? '#4CAF50' : 'rgba(255,255,255,0.7)',
                  minWidth: 40 
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiTypography-root': {
                      fontSize: '0.95rem',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#4CAF50' : 'rgba(255,255,255,0.9)'
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Espaçamento flexível */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Seção do Usuário */}
      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 1 }} />
        
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
            CONTA
          </Typography>
        </Box>

        <List sx={{ px: 1, pb: 2 }}>
          {userItems.map((item) => {
            const isActive = item.path === location.pathname;
            
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    backgroundColor: isActive ? 'rgba(76, 175, 80, 0.15)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isActive 
                        ? 'rgba(76, 175, 80, 0.25)' 
                        : 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: isActive ? '#4CAF50' : 'rgba(255,255,255,0.7)',
                    minWidth: 40 
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '0.95rem',
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? '#4CAF50' : 'rgba(255,255,255,0.9)'
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};