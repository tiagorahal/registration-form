import React, { useState, useMemo } from 'react';
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
  alpha,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Collapse,
  Grid
} from '@mui/material';
import { 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
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

interface Filters {
  search: string;
  departamento: string;
  nivelHierarquico: string;
  status: string;
  salarioMin: string;
  salarioMax: string;
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
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    departamento: '',
    nivelHierarquico: '',
    status: '',
    salarioMin: '',
    salarioMax: ''
  });

  // Filtrar colaboradores
  const filteredColaboradores = useMemo(() => {
    return colaboradores.filter(colaborador => {
      // Filtro de busca geral
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!colaborador.nome.toLowerCase().includes(searchLower) &&
            !colaborador.email.toLowerCase().includes(searchLower) &&
            !colaborador.cargo.toLowerCase().includes(searchLower) &&
            !colaborador.cpf.includes(filters.search)) {
          return false;
        }
      }

      // Filtro de departamento
      if (filters.departamento && colaborador.departamento !== filters.departamento) {
        return false;
      }

      // Filtro de nível hierárquico
      if (filters.nivelHierarquico && colaborador.nivelHierarquico !== filters.nivelHierarquico) {
        return false;
      }

      // Filtro de status
      if (filters.status && colaborador.status !== filters.status) {
        return false;
      }

      // Filtro de salário mínimo
      if (filters.salarioMin && colaborador.salarioBase < Number(filters.salarioMin)) {
        return false;
      }

      // Filtro de salário máximo
      if (filters.salarioMax && colaborador.salarioBase > Number(filters.salarioMax)) {
        return false;
      }

      return true;
    });
  }, [colaboradores, filters]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredColaboradores.map((n) => n.id!).filter(id => id !== undefined) as string[];
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

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      departamento: '',
      nivelHierarquico: '',
      status: '',
      salarioMin: '',
      salarioMax: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

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
    <Box>
      {/* Barra de filtros */}
      <Paper sx={{ 
        mb: 2, 
        p: 2,
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        boxShadow: 'none'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: showFilters ? 2 : 0 }}>
          <TextField
            size="small"
            placeholder="Buscar por nome, email, cargo ou CPF..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            sx={{ flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: filters.search && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => handleFilterChange('search', '')}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          <Button
            size="small"
            startIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            endIcon={hasActiveFilters && !showFilters ? 
              <Chip label={Object.values(filters).filter(v => v !== '').length} size="small" color="primary" /> : 
              null
            }
            onClick={() => setShowFilters(!showFilters)}
            sx={{ 
              minWidth: 120,
              color: hasActiveFilters ? 'primary.main' : 'text.secondary'
            }}
          >
            {showFilters ? 'Ocultar' : 'Filtros'}
          </Button>

          {hasActiveFilters && (
            <Button
              size="small"
              color="error"
              onClick={handleClearFilters}
              startIcon={<ClearIcon />}
            >
              Limpar
            </Button>
          )}
        </Box>

        {/* Filtros expandidos */}
        <Collapse in={showFilters}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Departamento</InputLabel>
                <Select
                  value={filters.departamento}
                  onChange={(e) => handleFilterChange('departamento', e.target.value)}
                  label="Departamento"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="Design">Design</MenuItem>
                  <MenuItem value="TI">TI</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Produto">Produto</MenuItem>
                  <MenuItem value="Vendas">Vendas</MenuItem>
                  <MenuItem value="RH">RH</MenuItem>
                  <MenuItem value="Financeiro">Financeiro</MenuItem>
                  <MenuItem value="Operações">Operações</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Nível</InputLabel>
                <Select
                  value={filters.nivelHierarquico}
                  onChange={(e) => handleFilterChange('nivelHierarquico', e.target.value)}
                  label="Nível"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="junior">Júnior</MenuItem>
                  <MenuItem value="pleno">Pleno</MenuItem>
                  <MenuItem value="senior">Sênior</MenuItem>
                  <MenuItem value="gestor">Gestor</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="ativo">Ativo</MenuItem>
                  <MenuItem value="inativo">Inativo</MenuItem>
                  <MenuItem value="ferias">Férias</MenuItem>
                  <MenuItem value="afastado">Afastado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Salário mín."
                type="number"
                value={filters.salarioMin}
                onChange={(e) => handleFilterChange('salarioMin', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Salário máx."
                type="number"
                value={filters.salarioMax}
                onChange={(e) => handleFilterChange('salarioMax', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
        </Collapse>
      </Paper>

      {/* Contador de resultados */}
      {hasActiveFilters && (
        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
          Mostrando {filteredColaboradores.length} de {colaboradores.length} colaboradores
        </Typography>
      )}

      {/* Tabela */}
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
              pr: { xs: 1, sm: 2 },
              py: 1.5,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              ...(selected.length > 0 && {
                bgcolor: (theme) =>
                  alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
              }),
            }}
          >
            <Typography
              sx={{ flex: '1 1 100%' }}
              color="inherit"
              variant="body2"
              component="div"
            >
              {selected.length} selecionado{selected.length > 1 ? 's' : ''}
            </Typography>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleBulkDelete}
              startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
              sx={{ 
                px: 1.5,
                py: 0.5,
                fontSize: '0.75rem',
                minHeight: 'auto',
                textTransform: 'none'
              }}
            >
              Excluir
            </Button>
          </Toolbar>
        )}
        
        <TableContainer sx={{ 
          borderRadius: selected.length > 0 ? '0 0 12px 12px' : 3,
          overflow: 'hidden'
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < filteredColaboradores.length}
                    checked={filteredColaboradores.length > 0 && selected.length === filteredColaboradores.length}
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
              {filteredColaboradores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">
                      Nenhum colaborador encontrado com os filtros aplicados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredColaboradores.map((colaborador) => {
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
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};