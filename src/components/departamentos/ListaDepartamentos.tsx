
import React, { useState, useMemo } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Avatar,
  AvatarGroup,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Business as BusinessIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { Departamento } from '../../types/departamento';
import { Colaborador } from '../../types/colaborador';

interface ListaDepartamentosProps {
  departamentos: Departamento[];
  colaboradores: Colaborador[];
  loading: boolean;
  onAddClick: () => void;
  onEditClick: (departamento: Departamento) => void;
  onDeleteClick: (departamento: Departamento) => void;
}

export const ListaDepartamentos: React.FC<ListaDepartamentosProps> = ({
  departamentos,
  colaboradores,
  loading,
  onAddClick,
  onEditClick,
  onDeleteClick
}) => {
  // Função para obter o gestor de um departamento
  const getGestor = (gestorId: string) => {
    return colaboradores.find(c => c.id === gestorId);
  };

  // Função para obter colaboradores de um departamento
  const getColaboradoresDepartamento = (colaboradoresIds: string[]) => {
    return colaboradores.filter(c => colaboradoresIds.includes(c.id!));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (departamentos.length === 0) {
    return (
      <Paper sx={{ 
        p: 6, 
        textAlign: 'center', 
        borderRadius: 3,
        border: '1px solid #e0e0e0',
        boxShadow: 'none'
      }}>
        <Box sx={{ mb: 3 }}>
          <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5 }} />
        </Box>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Nenhum departamento cadastrado
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Crie departamentos para organizar melhor seus colaboradores.
        </Typography>
        <Button
          variant="contained"
          onClick={onAddClick}
          startIcon={<AddIcon />}
          sx={{ 
            bgcolor: '#4CAF50',
            '&:hover': { bgcolor: '#45a049' }
          }}
        >
          Novo Departamento
        </Button>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ 
      borderRadius: 3,
      border: '1px solid #e0e0e0',
      boxShadow: 'none'
    }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, color: '#333' }}>Departamento</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#333' }}>Gestor Responsável</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#333' }}>Colaboradores</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#333' }}>Orçamento</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#333', textAlign: 'center' }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {departamentos.map((departamento) => {
            const gestor = getGestor(departamento.gestorResponsavelId);
            const colaboradoresList = getColaboradoresDepartamento(departamento.colaboradoresIds);
            
            return (
              <TableRow key={departamento.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#4CAF50' }}>
                      <BusinessIcon />
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 500 }}>
                        {departamento.nome}
                      </Typography>
                      {departamento.descricao && (
                        <Typography variant="caption" color="textSecondary">
                          {departamento.descricao}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                
                <TableCell>
                  {gestor ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32,
                          fontSize: '0.875rem'
                        }}
                      >
                        {gestor.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">{gestor.nome}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {gestor.cargo}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Sem gestor
                    </Typography>
                  )}
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {colaboradoresList.length > 0 ? (
                      <>
                        <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: '0.875rem' } }}>
                          {colaboradoresList.map((colab) => (
                            <Tooltip key={colab.id} title={colab.nome}>
                              <Avatar>
                                {colab.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                              </Avatar>
                            </Tooltip>
                          ))}
                        </AvatarGroup>
                        <Chip 
                          label={`${colaboradoresList.length} pessoas`}
                          size="small"
                          icon={<PeopleIcon />}
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Sem colaboradores
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                
                <TableCell>
                  {departamento.orcamento ? (
                    <Typography sx={{ fontWeight: 500 }}>
                      R$ {departamento.orcamento.toLocaleString('pt-BR')}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton 
                      size="small"
                      onClick={() => onEditClick(departamento)}
                      sx={{ 
                        color: '#1976d2',
                        '&:hover': { bgcolor: '#e3f2fd' }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={() => onDeleteClick(departamento)}
                      disabled={departamento.colaboradoresIds.length > 0}
                      sx={{ 
                        color: departamento.colaboradoresIds.length > 0 ? 'text.disabled' : '#d32f2f',
                        '&:hover': { 
                          bgcolor: departamento.colaboradoresIds.length > 0 ? 'transparent' : '#ffebee' 
                        }
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
  );
};
