import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  BusinessCenter,
  Shield
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
        padding: 2,
        position: 'relative'
      }}
    >
      {/* Elemento decorativo de fundo */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <Paper
        elevation={12}
        sx={{
          width: '100%',
          maxWidth: 460,
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          bgcolor: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #4CAF50 0%, #2E7D32 100%)',
          }
        }}
      >
        {/* Logo/Header */}
        <Box sx={{ textAlign: 'center', mb: 4, mt: 2 }}>
          {/* Ícone decorativo */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(46, 125, 50, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '2px solid rgba(76, 175, 80, 0.2)'
            }}
          >
            <BusinessCenter 
              sx={{ 
                fontSize: 36, 
                color: '#4CAF50'
              }} 
            />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
              fontFamily: '"Inter", "Roboto", sans-serif'
            }}
          >
            Bem-vindo de volta!
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              mb: 2,
              fontSize: '1.05rem'
            }}
          >
            Entre com suas credenciais para acessar o sistema
          </Typography>

          {/* Badge do sistema */}
          <Chip
            icon={<Shield sx={{ fontSize: '18px !important' }} />}
            label="Sistema de Gestão de RH"
            sx={{
              bgcolor: 'rgba(76, 175, 80, 0.1)',
              color: '#2E7D32',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          />
        </Box>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2
              }}
            >
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="E-mail"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#4CAF50', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#4CAF50',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4CAF50',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#4CAF50',
              },
            }}
          />

          <TextField
            fullWidth
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#4CAF50', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{
                      color: '#4CAF50',
                      '&:hover': {
                        bgcolor: 'rgba(76, 175, 80, 0.08)'
                      }
                    }}
                  >
                    {showPassword ? 
                      <VisibilityOff sx={{ fontSize: 20 }} /> : 
                      <Visibility sx={{ fontSize: 20 }} />
                    }
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#4CAF50',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4CAF50',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#4CAF50',
              },
            }}
          />

          {/* Link Esqueceu senha */}
          <Box sx={{ textAlign: 'right', mb: 3 }}>
            <Link
              component={RouterLink}
              to="/forgot-password"
              sx={{
                fontSize: '0.875rem',
                color: '#4CAF50',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline',
                  color: '#2E7D32'
                },
                transition: 'color 0.2s ease'
              }}
            >
              Esqueceu sua senha?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              py: 1.5,
              mb: 2,
              background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #45a049 0%, #1B5E20 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 16px rgba(76, 175, 80, 0.4)'
              },
              '&:disabled': {
                background: 'rgba(76, 175, 80, 0.5)',
                transform: 'none',
                boxShadow: 'none'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                <span>Entrando...</span>
              </Box>
            ) : (
              'Entrar no Sistema'
            )}
          </Button>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OU
            </Typography>
          </Divider>

          {/* Link para registro */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Não tem uma conta?{' '}
              <Link
                component={RouterLink}
                to="/register"
                sx={{
                  color: '#4CAF50',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: '#2E7D32'
                  },
                  transition: 'color 0.2s ease'
                }}
              >
                Cadastre-se aqui
              </Link>
            </Typography>
          </Box>
        </form>

        {/* Informações adicionais */}
        <Box sx={{ 
          mt: 4, 
          pt: 3, 
          borderTop: '1px solid rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              display: 'block',
              fontSize: '0.8rem',
              opacity: 0.8
            }}
          >
            Acesso seguro e protegido
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};