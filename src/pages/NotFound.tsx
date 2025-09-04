import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Home, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 600,
          p: 6,
          borderRadius: 3,
          textAlign: 'center',
          bgcolor: 'white'
        }}
      >
        {/* Ilustração 404 */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '6rem', sm: '8rem', md: '10rem' },
              fontWeight: 900,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
              mb: 2
            }}
          >
            404
          </Typography>
          
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: '#1a1a1a',
              mb: 2
            }}
          >
            Página não encontrada
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mb: 4,
              px: 2
            }}
          >
            Oops! Parece que você se perdeu. A página que você está procurando não existe ou foi movida.
          </Typography>
        </Box>

        {/* Ações */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
            startIcon={<Home />}
            sx={{
              px: 4,
              py: 1.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b4299 100%)',
              }
            }}
          >
            Ir para o Início
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBack />}
            sx={{
              px: 4,
              py: 1.5,
              borderColor: '#667eea',
              color: '#667eea',
              '&:hover': {
                borderColor: '#5a67d8',
                bgcolor: 'rgba(102, 126, 234, 0.04)'
              }
            }}
          >
            Voltar
          </Button>
        </Box>

        {/* Sugestões */}
        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Você pode estar procurando por:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              size="small"
              onClick={() => navigate('/login')}
              sx={{ color: '#667eea' }}
            >
              Login
            </Button>
            <Button
              size="small"
              onClick={() => navigate('/register')}
              sx={{ color: '#667eea' }}
            >
              Criar Conta
            </Button>
            <Button
              size="small"
              onClick={() => navigate('/')}
              sx={{ color: '#667eea' }}
            >
              Dashboard
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};