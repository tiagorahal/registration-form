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
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  PersonAdd,
  CheckCircle,
  Security
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validações
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Preencha todos os campos');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);
      await register(formData.email, formData.password, formData.name);
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  // Calcular força da senha
  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return 0;
    if (password.length < 6) return 25;
    if (password.length < 8) return 50;
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 100;
    return 75;
  };

  const getPasswordStrengthLabel = () => {
    const strength = getPasswordStrength();
    if (strength === 0) return '';
    if (strength <= 25) return 'Muito fraca';
    if (strength <= 50) return 'Fraca';
    if (strength <= 75) return 'Boa';
    return 'Forte';
  };

  const getPasswordStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength <= 25) return '#f44336';
    if (strength <= 50) return '#ff9800';
    if (strength <= 75) return '#2196f3';
    return '#4CAF50';
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
          maxWidth: 480,
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
            <PersonAdd 
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
            Crie sua conta
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              mb: 2,
              fontSize: '1.05rem'
            }}
          >
            Preencha os dados para começar a usar o sistema
          </Typography>

          {/* Badge do sistema */}
          <Chip
            icon={<Security sx={{ fontSize: '18px !important' }} />}
            label="Cadastro Seguro"
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
            label="Nome completo"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: '#4CAF50', fontSize: 20 }} />
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
            helperText="Mínimo 6 caracteres"
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
              mb: 1,
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

          {/* Indicador de força da senha */}
          {formData.password && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Força da senha:
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: getPasswordStrengthColor(),
                    fontWeight: 600
                  }}
                >
                  {getPasswordStrengthLabel()}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={getPasswordStrength()}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getPasswordStrengthColor(),
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          )}

          <TextField
            fullWidth
            label="Confirmar senha"
            type={showPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#4CAF50', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: formData.confirmPassword && formData.password === formData.confirmPassword ? (
                <InputAdornment position="end">
                  <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />
                </InputAdornment>
              ) : null,
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
                <span>Criando conta...</span>
              </Box>
            ) : (
              'Criar Conta'
            )}
          </Button>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OU
            </Typography>
          </Divider>

          {/* Link para login */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Já tem uma conta?{' '}
              <Link
                component={RouterLink}
                to="/login"
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
                Fazer login
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
            Ao criar uma conta, você concorda com nossos termos de uso
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};