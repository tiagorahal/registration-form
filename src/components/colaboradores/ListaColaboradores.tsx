import React from 'react';
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
  IconButton
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
  onDeleteClick
}) => {
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
            borderRadius: 2,
            '&:hover': { bgcolor: '#45a049' }
          }}
        >
          Adicionar Primeiro Colaborador
        </Button>
      </Paper>
    );
  }

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        borderRadius: 3,
        border: '1px solid #e0e0e0',
        boxShadow: 'none',
        overflow: 'hidden'
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#fafafa' }}>
            <TableCell sx={{ fontWeight: 500, color: '#666' }}>Nome ↓</TableCell>
            <TableCell sx={{ fontWeight: 500, color: '#666' }}>Email ↓</TableCell>
            <TableCell sx={{ fontWeight: 500, color: '#666' }}>Cargo</TableCell>
            <TableCell sx={{ fontWeight: 500, color: '#666' }}>Departamento ↓</TableCell>
            <TableCell sx={{ fontWeight: 500, color: '#666' }}>Nível</TableCell>
            <TableCell sx={{ fontWeight: 500, color: '#666' }}>Status ↓</TableCell>
            <TableCell sx={{ fontWeight: 500, color: '#666' }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {colaboradores.map((colaborador) => (
            <TableRow 
              key={colaborador.id} 
              sx={{ 
                '&:hover': { bgcolor: '#fafafa' },
                '&:last-child td': { border: 0 }
              }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      mr: 2, 
                      bgcolor: getAvatarColor(colaborador.nome),
                      width: 40,
                      height: 40,
                      fontSize: '1.2rem'
                    }}
                  >
                    {getAvatarEmoji(colaborador.nome)}
                  </Avatar>
                  <Typography sx={{ fontSize: '0.95rem', color: '#333' }}>
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
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton 
                    size="small"
                    onClick={() => onEditClick(colaborador)}
                    sx={{ 
                      color: '#1976d2',
                      '&:hover': { bgcolor: '#e3f2fd' }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small"
                    onClick={() => onDeleteClick(colaborador)}
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
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};