import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person,
  Settings,
  Logout
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Função para gerar cor do avatar baseada no email
const getAvatarColor = (email: string | null | undefined = '') => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  const emailStr = email || '';
  const hash = emailStr.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return colors[Math.abs(hash) % colors.length];
};

// Função para obter iniciais do nome
const getInitials = (name: string | null | undefined = '') => {
  const nameStr = name || '';
  return nameStr
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';
};

export const TopBar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleClose();
    navigate('/perfil');
  };

  const handleSettingsClick = () => {
    handleClose();
    navigate('/configuracoes');
  };

  const handleLogout = async () => {
    handleClose();
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        bgcolor: 'white',
        borderBottom: '1px solid #e0e0e0'
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Menu Mobile */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { sm: 'none' }, color: '#666' }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo/Title */}
        <Typography 
          variant="h6" 
          sx={{ 
            flexGrow: 1,
            color: '#1a1a1a',
            fontWeight: 600
          }}
        >
          Sistema de Gestão
        </Typography>

        {/* User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>
              {user?.displayName || 'Usuário'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              {user?.email}
            </Typography>
          </Box>
          
          <IconButton
            size="large"
            onClick={handleMenu}
            sx={{ p: 0 }}
          >
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40,
                background: getAvatarColor(user?.email),
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              {getInitials(user?.displayName)}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 200,
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  mx: 0.5,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user?.displayName || 'Usuário'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {user?.email}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 0.5 }} />
            
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText>Meu Perfil</ListItemText>
            </MenuItem>
            
            <MenuItem onClick={handleSettingsClick}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText>Configurações</ListItemText>
            </MenuItem>
            
            <Divider sx={{ my: 0.5 }} />
            
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <Logout fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText>Sair</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};