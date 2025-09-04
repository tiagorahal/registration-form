import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { NotFound } from './pages/NotFound';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { ListaColaboradores } from './components/colaboradores/ListaColaboradores';
import { StepperCadastro } from './components/colaboradores/StepperCadastro';
import { useColaboradores } from './hooks/useColaboradores';
import { Colaborador } from './types/colaborador';
import { Departamentos } from './pages/Departamentos';

// Theme configuration
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

function Dashboard() {
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [colaboradorEdit, setColaboradorEdit] = useState<Colaborador | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    colaborador: Colaborador | null;
  }>({ open: false, colaborador: null });
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState<{
    open: boolean;
    ids: string[];
  }>({ open: false, ids: [] });
  
  const { colaboradores, loading, reloadColaboradores, deleteColaborador, deleteColaboradoresBulk } = useColaboradores();
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
    const message = colaboradorEdit 
      ? 'Colaborador atualizado com sucesso!' 
      : 'Colaborador cadastrado com sucesso!';
    
    showSnackbar(message, 'success');
    await reloadColaboradores();
    setCurrentView('list');
    setColaboradorEdit(null);
  };

  const handleEditClick = (colaborador: Colaborador) => {
    setColaboradorEdit(colaborador);
    setCurrentView('form');
  };

  const handleDeleteClick = (colaborador: Colaborador) => {
    setDeleteDialog({ open: true, colaborador });
  };

  const handleBulkDelete = (ids: string[]) => {
    setBulkDeleteDialog({ open: true, ids });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialog.colaborador?.id) {
      try {
        await deleteColaborador(deleteDialog.colaborador.id);
        showSnackbar('Colaborador excluído com sucesso!', 'success');
        await reloadColaboradores();
      } catch (error) {
        showSnackbar('Erro ao excluir colaborador', 'error');
      }
    }
    setDeleteDialog({ open: false, colaborador: null });
  };

  const handleConfirmBulkDelete = async () => {
    try {
      await deleteColaboradoresBulk(bulkDeleteDialog.ids);
      const count = bulkDeleteDialog.ids.length;
      showSnackbar(`${count} colaborador${count > 1 ? 'es' : ''} excluído${count > 1 ? 's' : ''} com sucesso!`, 'success');
      await reloadColaboradores();
    } catch (error) {
      showSnackbar('Erro ao excluir colaboradores', 'error');
    }
    setBulkDeleteDialog({ open: false, ids: [] });
  };

  const handleNewClick = () => {
    setColaboradorEdit(null);
    setCurrentView('form');
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
          {currentView === 'list' ? (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 600, color: '#1a1a1a' }}>
                  Colaboradores
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleNewClick}
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
                onAddClick={handleNewClick}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                onBulkDelete={handleBulkDelete}
              />
            </Box>
          ) : (
            <Box>
              {/* Breadcrumb */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Button 
                  onClick={() => {
                    setCurrentView('list');
                    setColaboradorEdit(null);
                  }}
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
                  onClose={() => {
                    setCurrentView('list');
                    setColaboradorEdit(null);
                  }}
                  onSuccess={handleSuccess}
                  colaboradorEdit={colaboradorEdit}
                />
              </Paper>
            </Box>
          )}
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, colaborador: null })}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o colaborador{' '}
            <strong>{deleteDialog.colaborador?.nome}</strong>?
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, colaborador: null })}
            size="small"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            size="small"
            sx={{ 
              px: 2,
              py: 0.5,
              fontSize: '0.875rem'
            }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        open={bulkDeleteDialog.open}
        onClose={() => setBulkDeleteDialog({ open: false, ids: [] })}
      >
        <DialogTitle>Confirmar Exclusão em Massa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir {bulkDeleteDialog.ids.length} colaborador{bulkDeleteDialog.ids.length > 1 ? 'es' : ''}?
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setBulkDeleteDialog({ open: false, ids: [] })}
            size="small"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmBulkDelete} 
            color="error" 
            variant="contained"
            size="small"
            sx={{ 
              px: 2,
              py: 0.5,
              fontSize: '0.875rem'
            }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Rotas privadas */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            {/* ADIÇÃO: rota privada de Departamentos */}
            <Route
              path="/departamentos"
              element={
                <PrivateRoute>
                  <Departamentos />
                </PrivateRoute>
              }
            />
            
            {/* Página 404 */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
