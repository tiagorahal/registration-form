import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Paper
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ListaDepartamentos } from '../components/departamentos/ListaDepartamentos';
import { FormDepartamento } from '../components/departamentos/FormDepartamento';
import { useDepartamentos } from '../hooks/useDepartamentos';
import { useColaboradores } from '../hooks/useColaboradores';
import { Departamento } from '../types/departamento';

// ✅ ADIÇÃO: shell de layout igual ao do Dashboard
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';

const drawerWidth = 280; // mesmo valor usado no Dashboard

export const Departamentos: React.FC = () => {
  const { departamentos, loading, deleteDepartamento, reloadDepartamentos } = useDepartamentos();
  const { colaboradores } = useColaboradores();
  
  const [formOpen, setFormOpen] = useState(false);
  const [departamentoEdit, setDepartamentoEdit] = useState<Departamento | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    departamento: Departamento | null;
  }>({ open: false, departamento: null });
  
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

  const handleAddClick = () => {
    setDepartamentoEdit(null);
    setFormOpen(true);
  };

  const handleEditClick = (departamento: Departamento) => {
    setDepartamentoEdit(departamento);
    setFormOpen(true);
  };

  const handleDeleteClick = (departamento: Departamento) => {
    if (departamento.colaboradoresIds.length > 0) {
      showSnackbar('Não é possível excluir um departamento com colaboradores', 'error');
      return;
    }
    setDeleteDialog({ open: true, departamento });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialog.departamento?.id) {
      try {
        await deleteDepartamento(deleteDialog.departamento.id);
        showSnackbar('Departamento excluído com sucesso!', 'success');
        await reloadDepartamentos();
      } catch (error: any) {
        showSnackbar(error.message || 'Erro ao excluir departamento', 'error');
      }
    }
    setDeleteDialog({ open: false, departamento: null });
  };

  const handleFormSuccess = async () => {
    const message = departamentoEdit 
      ? 'Departamento atualizado com sucesso!' 
      : 'Departamento criado com sucesso!';
    
    showSnackbar(message, 'success');
    await reloadDepartamentos();
    setFormOpen(false);
    setDepartamentoEdit(null);
  };

  // ✅ ADIÇÃO: envolvemos o conteúdo com o mesmo layout do Dashboard
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Sidebar */}
      <Sidebar drawerWidth={drawerWidth} />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <TopBar />

        {/* Content Area (mantivemos seu conteúdo original aqui dentro) */}
        <Box sx={{ flexGrow: 1, p: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 600, color: '#1a1a1a' }}>
              Departamentos
            </Typography>
            <Button
              variant="contained"
              onClick={handleAddClick}
              startIcon={<AddIcon />}
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
              Novo Departamento
            </Button>
          </Box>

          {/* Lista de departamentos */}
          <ListaDepartamentos
            departamentos={departamentos}
            colaboradores={colaboradores}
            loading={loading}
            onAddClick={handleAddClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />

          {/* Formulário de departamento */}
          <FormDepartamento
            open={formOpen}
            onClose={() => {
              setFormOpen(false);
              setDepartamentoEdit(null);
            }}
            onSuccess={handleFormSuccess}
            departamento={departamentoEdit}
            colaboradores={colaboradores}
            departamentos={departamentos}
          />

          {/* Dialog de confirmação de exclusão */}
          <Dialog
            open={deleteDialog.open}
            onClose={() => setDeleteDialog({ open: false, departamento: null })}
          >
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Tem certeza que deseja excluir o departamento{' '}
                <strong>{deleteDialog.departamento?.nome}</strong>?
                Esta ação não pode ser desfeita.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setDeleteDialog({ open: false, departamento: null })}
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
