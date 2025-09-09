import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  AccessTime as AccessTimeIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';

const drawerWidth = 280;

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

// Função para formatar data
const formatDate = (date: string | null) => {
  if (!date) return 'Não disponível';
  return new Date(date).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const UserProfile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleEdit = () => {
    setDisplayName(user?.displayName || '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDisplayName(user?.displayName || '');
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      showSnackbar('O nome não pode estar vazio', 'error');
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile(displayName.trim());
      showSnackbar('Perfil atualizado com sucesso!', 'success');
      setIsEditing(false);
    } catch (error: any) {
      showSnackbar(error.message || 'Erro ao atualizar perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Sidebar */}
      <Sidebar drawerWidth={drawerWidth} />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <TopBar />

        {/* Content Area */}
        <Box sx={{ flexGrow: 1, p: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
              Meu Perfil
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Visualize e edite suas informações pessoais
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Card Principal do Perfil */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                {/* Header do Card */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ color: '#4CAF50' }} />
                    Informações Pessoais
                  </Typography>
                  
                  {!isEditing ? (
                    <Button
                      variant="outlined"
                      onClick={handleEdit}
                      startIcon={<EditIcon />}
                      sx={{
                        borderColor: '#4CAF50',
                        color: '#4CAF50',
                        '&:hover': {
                          borderColor: '#45a049',
                          bgcolor: 'rgba(76, 175, 80, 0.04)'
                        }
                      }}
                    >
                      Editar
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={loading}
                        startIcon={<SaveIcon />}
                        sx={{
                          bgcolor: '#4CAF50',
                          '&:hover': { bgcolor: '#45a049' }
                        }}
                      >
                        Salvar
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleCancel}
                        disabled={loading}
                        startIcon={<CancelIcon />}
                      >
                        Cancelar
                      </Button>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Avatar e Informações */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 4 }}>
                  {/* Avatar */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        background: getAvatarColor(user?.email),
                        fontSize: '2.5rem',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    >
                      {getInitials(user?.displayName)}
                    </Avatar>
                    <Chip
                      label="Conta Verificada"
                      color="success"
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>

                  {/* Campos de Informação */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Nome de Exibição"
                          value={isEditing ? displayName : (user?.displayName || 'Não informado')}
                          onChange={(e) => setDisplayName(e.target.value)}
                          disabled={!isEditing || loading}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&.Mui-disabled': {
                                bgcolor: 'rgba(0,0,0,0.02)'
                              }
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="E-mail"
                          value={user?.email || ''}
                          disabled
                          variant="outlined"
                          InputProps={{
                            startAdornment: <EmailIcon sx={{ color: 'text.secondary', mr: 1 }} />
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: 'rgba(0,0,0,0.02)'
                            }
                          }}
                        />
                        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                          O e-mail não pode ser alterado. Entre em contato com o suporte se necessário.
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Sidebar de Informações */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Card de Informações da Conta */}
                <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SecurityIcon sx={{ color: '#4CAF50' }} />
                      Informações da Conta
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          ID do Usuário
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'rgba(0,0,0,0.05)', p: 1, borderRadius: 1, fontSize: '0.75rem' }}>
                          {user?.uid || 'N/A'}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          E-mail Verificado
                        </Typography>
                        <Chip
                          label={user?.emailVerified ? 'Verificado' : 'Não Verificado'}
                          color={user?.emailVerified ? 'success' : 'warning'}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>

                      <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          Criado em
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          {formatDate(user?.metadata?.creationTime || null)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          Último Acesso
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          {formatDate(user?.metadata?.lastSignInTime || null)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Card de Ações Rápidas */}
                <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Ações Rápidas
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                          justifyContent: 'flex-start',
                          borderColor: 'rgba(0,0,0,0.12)',
                          color: 'text.primary',
                          '&:hover': {
                            borderColor: '#4CAF50',
                            bgcolor: 'rgba(76, 175, 80, 0.04)'
                          }
                        }}
                      >
                        Alterar Senha
                      </Button>
                      
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                          justifyContent: 'flex-start',
                          borderColor: 'rgba(0,0,0,0.12)',
                          color: 'text.primary',
                          '&:hover': {
                            borderColor: '#4CAF50',
                            bgcolor: 'rgba(76, 175, 80, 0.04)'
                          }
                        }}
                      >
                        Configurações de Privacidade
                      </Button>
                      
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                          justifyContent: 'flex-start',
                          borderColor: 'rgba(0,0,0,0.12)',
                          color: 'text.primary',
                          '&:hover': {
                            borderColor: '#4CAF50',
                            bgcolor: 'rgba(76, 175, 80, 0.04)'
                          }
                        }}
                      >
                        Histórico de Atividades
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>

          {/* Snackbar para notificações */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Box>
  );
};