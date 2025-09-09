import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Storage as StorageIcon
} from '@mui/icons-material';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';

const drawerWidth = 280;

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      updates: true,
      marketing: false
    },
    privacy: {
      profilePublic: false,
      dataCollection: true,
      analytics: true
    },
    appearance: {
      darkMode: false,
      compactView: false,
      animations: true
    }
  });

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

  const handleSettingChange = (category: string, setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
    showSnackbar('Configuração atualizada com sucesso!', 'success');
  };

  const handleSaveAll = () => {
    // Aqui você salvaria todas as configurações no backend/localStorage
    showSnackbar('Todas as configurações foram salvas!', 'success');
  };

  const handleResetToDefault = () => {
    setSettings({
      notifications: {
        email: true,
        push: false,
        updates: true,
        marketing: false
      },
      privacy: {
        profilePublic: false,
        dataCollection: true,
        analytics: true
      },
      appearance: {
        darkMode: false,
        compactView: false,
        animations: true
      }
    });
    showSnackbar('Configurações restauradas para o padrão!', 'success');
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
              Configurações
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Personalize sua experiência no sistema
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Notificações */}
            <Grid item xs={12} lg={6}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', height: 'fit-content' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NotificationsIcon sx={{ color: '#4CAF50' }} />
                    Notificações
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.email}
                          onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                          color="success"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Notificações por E-mail
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Receba atualizações importantes por e-mail
                          </Typography>
                        </Box>
                      }
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.push}
                          onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                          color="success"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Notificações Push
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Receba notificações em tempo real no navegador
                          </Typography>
                        </Box>
                      }
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.updates}
                          onChange={(e) => handleSettingChange('notifications', 'updates', e.target.checked)}
                          color="success"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Atualizações do Sistema
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Seja notificado sobre novas funcionalidades
                          </Typography>
                        </Box>
                      }
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.marketing}
                          onChange={(e) => handleSettingChange('notifications', 'marketing', e.target.checked)}
                          color="success"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            E-mails Promocionais
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Receba dicas e novidades sobre o sistema
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Privacidade e Segurança */}
            <Grid item xs={12} lg={6}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', height: 'fit-content' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityIcon sx={{ color: '#4CAF50' }} />
                    Privacidade e Segurança
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.privacy.profilePublic}
                          onChange={(e) => handleSettingChange('privacy', 'profilePublic', e.target.checked)}
                          color="success"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Perfil Público
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Permitir que outros usuários vejam seu perfil
                          </Typography>
                        </Box>
                      }
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.privacy.dataCollection}
                          onChange={(e) => handleSettingChange('privacy', 'dataCollection', e.target.checked)}
                          color="success"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Coleta de Dados
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Permitir coleta de dados para melhorar o sistema
                          </Typography>
                        </Box>
                      }
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.privacy.analytics}
                          onChange={(e) => handleSettingChange('privacy', 'analytics', e.target.checked)}
                          color="success"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Analytics
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Permitir análise de uso para otimizações
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Aparência */}
            <Grid item xs={12} lg={6}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', height: 'fit-content' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PaletteIcon sx={{ color: '#4CAF50' }} />
                    Aparência
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.appearance.darkMode}
                          onChange={(e) => handleSettingChange('appearance', 'darkMode', e.target.checked)}
                          color="success"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Modo Escuro
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Ativar tema escuro para reduzir cansaço visual
                          </Typography>
                        </Box>
                      }
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.appearance.compactView}
                          onChange={(e) => handleSettingChange('appearance', 'compactView', e.target.checked)}
                          color="success"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Visualização Compacta
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Reduzir espaçamentos para mostrar mais conteúdo
                          </Typography>
                        </Box>
                      }
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.appearance.animations}
                          onChange={(e) => handleSettingChange('appearance', 'animations', e.target.checked)}
                          color="success"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Animações
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Ativar animações e transições na interface
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Outras Configurações */}
            <Grid item xs={12} lg={6}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', height: 'fit-content' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SettingsIcon sx={{ color: '#4CAF50' }} />
                    Outras Configurações
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<LanguageIcon />}
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
                      Idioma: Português (Brasil)
                    </Button>

                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<StorageIcon />}
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
                      Gerenciar Dados
                    </Button>

                    <Divider sx={{ my: 1 }} />

                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleSaveAll}
                      sx={{
                        borderColor: '#4CAF50',
                        color: '#4CAF50',
                        '&:hover': {
                          borderColor: '#45a049',
                          bgcolor: 'rgba(76, 175, 80, 0.04)'
                        }
                      }}
                    >
                      Salvar Todas as Configurações
                    </Button>

                    <Button
                      variant="text"
                      fullWidth
                      onClick={handleResetToDefault}
                      sx={{
                        color: 'text.secondary',
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.04)'
                        }
                      }}
                    >
                      Restaurar Padrões
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Snackbar para notificações */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
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