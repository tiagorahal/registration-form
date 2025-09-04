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
  Chip,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Email,
  ArrowBack,
  LockReset,
  Send,
  CheckCircle,
  Support
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!email) {
      setError('Digite seu e-mail');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    'Digite seu e-mail',
    'Verificar caixa de entrada',
    'Redefinir senha'
  ];

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
          maxWidth: 500,
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
        {/* Voltar para login */}
        <Box sx={{ mb: 3, mt: 1 }}>
          <Link
            component={RouterLink}
            to="/login"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              color: '#4CAF50',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              '&:hover': {
                textDecoration: 'underline',
                color: '#2E7D32'
              },
              transition: 'color 0.2s ease'
            }}
          >
            <ArrowBack sx={{ fontSize: 18, mr: 0.5 }} />
            Voltar para login
          </Link>
        </Box>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          {/* Ícone decorativo */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: success 
                ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(46, 125, 50, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(46, 125, 50, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '2px solid rgba(76, 175, 80, 0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            {success ? (
              <CheckCircle 
                sx={{ 
                  fontSize: 36, 
                  color: '#4CAF50'
                }} 
              />
            ) : (
              <LockReset 
                sx={{ 
                  fontSize: 36, 
                  color: '#4CAF50'
                }} 
              />
            )}
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
            {success ? 'Email Enviado!' : 'Recuperar Senha'}
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              mb: 2,
              fontSize: '1.05rem'
            }}
          >
            {success 
              ? 'Verifique sua caixa de entrada e siga as instruções para redefinir sua senha'
              : 'Digite seu e-mail para receber as instruções de recuperação'
            }
          </Typography>

          {/* Badge do sistema */}
          <Chip
            icon={<Support sx={{ fontSize: '18px !important' }} />}
            label={success ? "Suporte Enviado" : "Recuperação Segura"}
            sx={{
              bgcolor: success 
                ? 'rgba(76, 175, 80, 0.15)' 
                : 'rgba(76, 175, 80, 0.1)',
              color: '#2E7D32',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          />
        </Box>

        {/* Stepper de progresso */}
        {!success && (
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={0} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontSize: '0.75rem',
                        color: 'text.secondary'
                      },
                      '& .MuiStepIcon-root': {
                        color: 'rgba(76, 175, 80, 0.3)',
                        '&.Mui-active': {
                          color: '#4CAF50',
                        },
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}

        {/* Formulário */}
        {!success && (
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
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              margin="normal"
              placeholder="seu.email@exemplo.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#4CAF50', fontSize: 20 }} />
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
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
              {loading ? 'Enviando...' : 'Enviar Email de Recuperação'}
            </Button>
          </form>
        )}

        {/* Mensagem de sucesso */}
        {success && (
          <Box sx={{ textAlign: 'center' }}>
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: '#4CAF50'
                }
              }}
            >
              Email de recuperação enviado com sucesso!
            </Alert>

            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                mb: 3,
                lineHeight: 1.6
              }}
            >
              Se você não receber o email em alguns minutos, verifique sua pasta de spam 
              ou tente novamente com outro endereço de email.
            </Typography>

            <Button
              variant="outlined"
              size="large"
              onClick={() => {
                setSuccess(false);
                setEmail('');
                setError('');
              }}
              sx={{
                borderColor: '#4CAF50',
                color: '#4CAF50',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: '#2E7D32',
                  bgcolor: 'rgba(76, 175, 80, 0.04)',
                  color: '#2E7D32'
                },
                transition: 'all 0.2s ease'
              }}
            >
              Tentar Outro Email
            </Button>
          </Box>
        )}

        {/* Informações de ajuda */}
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
              opacity: 0.8,
              lineHeight: 1.4
            }}
          >
            {success 
              ? 'O link de recuperação expira em 24 horas por segurança'
              : 'Problemas para acessar? Entre em contato com o suporte'
            }
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};