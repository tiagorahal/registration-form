import { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  Paper
} from '@mui/material';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { ListaColaboradores } from './components/colaboradores/ListaColaboradores';
import { StepperCadastro } from './components/colaboradores/StepperCadastro';
import { useColaboradores } from './hooks/useColaboradores';

// Theme configuration (mantém o mesmo)
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

const drawerWidth = 280;

function App() {
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const { colaboradores, loading, reloadColaboradores } = useColaboradores();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSuccess = async () => {
    showSnackbar('Colaborador cadastrado com sucesso!', 'success');
    await reloadColaboradores(); // Recarrega a lista
    setCurrentView('list');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
        {/* Sidebar */}
        <Sidebar drawerWidth={drawerWidth} />

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Top Bar */}
          <TopBar />

          {/* Content Area */}
          <Box sx={{ flexGrow: 1, p: 4 }}>
            {currentView === 'list' ? (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 600, color: '#1a1a1a' }}>
                    Colaboradores
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setCurrentView('form')}
                    sx={{ 
                      bgcolor: '#4CAF50',
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      fontSize: '0.95rem',
                      '&:hover': { bgcolor: '#45a049' },
                      boxShadow: 'none',
                    }}
                  >
                    Novo Colaborador
                  </Button>
                </Box>

                <ListaColaboradores 
                  colaboradores={colaboradores}
                  loading={loading}
                  onAddClick={() => setCurrentView('form')}
                />
              </Box>
            ) : (
              <Box>
                {/* Breadcrumb */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Button 
                    onClick={() => setCurrentView('list')}
                    sx={{ color: '#666' }}
                  >
                    ← Voltar para Colaboradores
                  </Button>
                </Box>

                <Paper sx={{ 
                  bgcolor: 'white', 
                  borderRadius: 3, 
                  p: 4,
                  border: '1px solid #e0e0e0'
                }}>
                  <StepperCadastro
                    onClose={() => setCurrentView('list')}
                    onSuccess={handleSuccess}
                  />
                </Paper>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
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
    </ThemeProvider>
  );
}

export default App;