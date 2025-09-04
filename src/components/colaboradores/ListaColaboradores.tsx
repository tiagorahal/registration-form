import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Button,
  IconButton,
  Checkbox,
  Toolbar,
  alpha
} from '@mui/material';
import { 
  Edit as EditIcon,
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { Colaborador } from '../../types/colaborador';

interface ListaColaboradoresProps {
  colaboradores: Colaborador[];
  loading: boolean;
  onAddClick: () => void;
  onEditClick: (colaborador: Colaborador) => void;
  onDeleteClick: (colaborador: Colaborador) => void;
  onBulkDelete?: (ids: string[]) => void;
}

const getAvatarEmoji = (name: string) => {
  const avatarEmojis = ['👩‍💼', '👨‍💼', '👩‍💻', '👨‍💻', '👩‍🎨', '👨‍🎨', '👩‍🔧', '👨‍🔧'];
  const index = name.charCodeAt(0) % avatarEmojis.length;
  return avatarEmojis[index];
};

const getAvatarColor = (name: string) => {
  const colors = [
    '#FFE0B2', '#F8BBD0', '#E1BEE7', '#C5CAE9', 
    '#BBDEFB', '#B2EBF2', '#B2DFDB', '#DCEDC8',
    '#F0F4C3', '#FFF9C4', '#FFECB3', '#FFCCBC'
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export const ListaColaboradores: React.FC<ListaColaboradoresProps> = ({ 
  colaboradores, 
  loading,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onBulkDelete
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = colaboradores.map((n) => n.id!).filter(id => id !== undefined) as string[];
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && selected.length > 0) {
      onBulkDelete(selected);
      setSelected([]);
    }
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (colaboradores.length === 0) {
    return (
      <Paper sx={{ 
        p: 6, 
        textAlign: 'center', 
        borderRadius: 3,
        border: '1px solid #e0e0e0',
        boxShadow: 'none'
      }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Nenhum colaborador cadastrado
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Clique no botão "Novo Colaborador" para adicionar o primeiro funcionário.
        </Typography>
        <Button
          variant="contained"
          onClick={onAddClick}
          sx={{ 
            bgcolor: '#4CAF50',
            '&:hover': { bgcolor: '#45a049' }
          }}
        >
          Novo Colaborador
        </Button>
      </Paper>
    );
  }

  return (
    <Paper sx={{ 
      width: '100%', 
      mb: 2, 
      borderRadius: 3, 
      border: '1px solid #e0e0e0', 
      boxShadow: 'none',
      overflow: 'hidden'
    }}>
      {selected.length > 0 && (
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(selected.length > 0 && {
              bgcolor: (theme) =>
                alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }),
          }}
        >
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {selected.length} selecionado{selected.length > 1 ? 's' : ''}
          </Typography>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleBulkDelete}
            startIcon={<DeleteIcon />}
            sx={{ 
              px: 2,
              py: 0.75,
              fontSize: '0.875rem'
            }}
          >
            Excluir
          </Button>
        </Toolbar>
      )}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={selected.length > 0 && selected.length < colaboradores.length}
                  checked={colaboradores.length > 0 && selected.length === colaboradores.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#333' }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#333' }}>E-mail</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#333' }}>Cargo</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#333' }}>Departamento</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#333' }}>Nível</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#333' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#333', textAlign: 'center' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {colaboradores.map((colaborador) => {
              const isItemSelected = isSelected(colaborador.id!);
              return (
                <TableRow 
                  key={colaborador.id}
                  hover
                  onClick={() => handleClick(colaborador.id!)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  selected={isItemSelected}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: getAvatarColor(colaborador.nome),
                          width: 40,
                          height: 40,
                          fontSize: '1.5rem'
                        }}
                      >
                        {getAvatarEmoji(colaborador.nome)}
                      </Avatar>
                      <Typography sx={{ fontWeight: 500 }}>
                        {colaborador.nome}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.95rem', color: '#666' }}>
                    {colaborador.email}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.95rem', color: '#666' }}>
                    {colaborador.cargo}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.95rem', color: '#666' }}>
                    {colaborador.departamento}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={colaborador.nivelHierarquico}
                      size="small"
                      sx={{ 
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={colaborador.status}
                      size="small"
                      sx={{ 
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        bgcolor: 'transparent',
                        color: colaborador.status === 'ativo' ? '#4CAF50' : '#F44336',
                        border: 'none',
                        px: 0,
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditClick(colaborador);
                        }}
                        sx={{ 
                          color: '#1976d2',
                          '&:hover': { bgcolor: '#e3f2fd' }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteClick(colaborador);
                        }}
                        sx={{ 
                          color: '#d32f2f',
                          '&:hover': { bgcolor: '#ffebee' }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};