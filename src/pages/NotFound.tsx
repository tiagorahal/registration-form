import React from 'react';
import { Box, Typography, Button, Paper, Chip, Divider } from '@mui/material';
import { 
  Home, 
  ArrowBack, 
  SearchOff, 
  People, 
  Business,
  Dashboard
} from '@mui/icons-material';
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
        background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
        padding: 2
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: '100%',
          maxWidth: 650,
          p: { xs: 4, sm: 6 },
          borderRadius: 3,
          textAlign: 'center',
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
        {/* Ícone decorativo */}
        <Box 
          sx={{ 
            mb: 3,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(46, 125, 50, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(76, 175, 80, 0.2)'
            }}
          >
            <SearchOff 
              sx={{ 
                fontSize: 40, 
                color: '#4CAF50'
              }} 
            />
          </Box>
        </Box>

        {/* Ilustração 404 */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '5rem', sm: '7rem', md: '9rem' },
              fontWeight: 900,
              background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
              mb: 2,
              fontFamily: '"Inter", "Roboto", sans-serif'
            }}
          >
            404
          </Typography>
          
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: '#1a1a1a',
              mb: 2,
              fontSize: { xs: '1.5rem', sm: '2rem' },
              fontFamily: '"Inter", "Roboto", sans-serif'
            }}
          >
            Página não encontrada
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mb: 4,
              px: 2,
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}
          >
            Oops! Parece que você se perdeu no sistema. A página que você está 
            procurando não existe ou foi movida para outro local.
          </Typography>

          {/* Status indicator */}
          <Chip
            label="Erro 404"
            sx={{
              bgcolor: 'rgba(76, 175, 80, 0.1)',
              color: '#2E7D32',
              fontWeight: 600,
              mb: 4
            }}
          />
        </Box>

        {/* Ações principais */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          mb: 4
        }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
            startIcon={<Home />}
            sx={{
              px: 4,
              py: 1.5,
              background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              '&:hover': {
                background: 'linear-gradient(135deg, #45a049 0%, #1B5E20 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Ir para o Dashboard
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBack />}
            sx={{
              px: 4,
              py: 1.5,
              borderColor: '#4CAF50',
              color: '#4CAF50',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              '&:hover': {
                borderColor: '#2E7D32',
                bgcolor: 'rgba(76, 175, 80, 0.04)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            Voltar
          </Button>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Sugestões de navegação */}
        <Box sx={{ mt: 4 }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              fontWeight: 500,
              fontSize: '0.95rem'
            }}
          >
            Explore estas seções do sistema:
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 2
          }}>
            <Button
              variant="text"
              onClick={() => navigate('/')}
              startIcon={<Dashboard />}
              sx={{ 
                color: '#4CAF50',
                textTransform: 'none',
                fontWeight: 500,
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(76, 175, 80, 0.08)'
                }
              }}
            >
              Dashboard
            </Button>
            
            <Button
              variant="text"
              onClick={() => navigate('/')}
              startIcon={<People />}
              sx={{ 
                color: '#4CAF50',
                textTransform: 'none',
                fontWeight: 500,
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(76, 175, 80, 0.08)'
                }
              }}
            >
              Colaboradores
            </Button>
            
            <Button
              variant="text"
              onClick={() => navigate('/departamentos')}
              startIcon={<Business />}
              sx={{ 
                color: '#4CAF50',
                textTransform: 'none',
                fontWeight: 500,
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(76, 175, 80, 0.08)'
                }
              }}
            >
              Departamentos
            </Button>
          </Box>
        </Box>

        {/* Informação adicional */}
        <Box sx={{ 
          mt: 5, 
          pt: 3, 
          borderTop: '1px solid rgba(0,0,0,0.08)'
        }}>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              display: 'block',
              fontSize: '0.85rem'
            }}
          >
            Sistema de Gestão de Recursos Humanos
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              fontSize: '0.75rem',
              opacity: 0.7
            }}
          >
            Se o problema persistir, entre em contato com o suporte
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};