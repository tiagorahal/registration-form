import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Autocomplete,
  Chip,
  Avatar,
  InputAdornment,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { Departamento } from '../../types/departamento';
import { Colaborador } from '../../types/colaborador';
import { useDepartamentos } from '../../hooks/useDepartamentos';

interface FormDepartamentoProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  departamento?: Departamento | null;
  colaboradores: Colaborador[];
  departamentos: Departamento[];
}

export const FormDepartamento: React.FC<FormDepartamentoProps> = ({
  open,
  onClose,
  onSuccess,
  departamento,
  colaboradores,
  departamentos
}) => {
  const { addDepartamento, updateDepartamento, transferColaborador } = useDepartamentos();
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    orcamento: '',
    gestorResponsavelId: '',
    colaboradoresIds: [] as string[]
  });
  
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [colaboradorToAdd, setColaboradorToAdd] = useState<Colaborador | null>(null);

  // Preenche o formulário quando editando
  useEffect(() => {
    if (departamento) {
      setFormData({
        nome: departamento.nome || '',
        descricao: departamento.descricao || '',
        orcamento: departamento.orcamento?.toString() || '',
        gestorResponsavelId: departamento.gestorResponsavelId || '',
        colaboradoresIds: departamento.colaboradoresIds || []
      });
    } else {
      setFormData({
        nome: '',
        descricao: '',
        orcamento: '',
        gestorResponsavelId: '',
        colaboradoresIds: []
      });
    }
    setErrors({});
  }, [departamento, open]);

  // Filtrar gestores disponíveis
  const gestoresDisponiveis = colaboradores.filter(c => c.nivelHierarquico === 'gestor');
  
  // Obter colaboradores selecionados
  const colaboradoresSelecionados = colaboradores.filter(c => 
    formData.colaboradoresIds.includes(c.id!)
  );

  // Colaboradores disponíveis para adicionar (não estão em nenhum departamento ou estão em outro)
  const colaboradoresDisponiveis = colaboradores.filter(c => {
    // Se estamos editando, permitir colaboradores de outros departamentos
    if (departamento) {
      return !formData.colaboradoresIds.includes(c.id!);
    }
    // Se criando novo, mostrar apenas colaboradores sem departamento
    const emOutroDepartamento = departamentos.some(d => 
      d.id !== departamento?.id && d.colaboradoresIds.includes(c.id!)
    );
    return !emOutroDepartamento && !formData.colaboradoresIds.includes(c.id!);
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors((prev: any) => ({ ...prev, [field]: undefined }));
  };

  const handleAddColaborador = () => {
    if (colaboradorToAdd && !formData.colaboradoresIds.includes(colaboradorToAdd.id!)) {
      handleInputChange('colaboradoresIds', [...formData.colaboradoresIds, colaboradorToAdd.id!]);
      setColaboradorToAdd(null);
    }
  };

  const handleRemoveColaborador = (colaboradorId: string) => {
    handleInputChange(
      'colaboradoresIds', 
      formData.colaboradoresIds.filter(id => id !== colaboradorId)
    );
  };

  const validate = () => {
    const newErrors: any = {};
    
    if (!formData.nome) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.gestorResponsavelId) {
      newErrors.gestorResponsavelId = 'Gestor responsável é obrigatório';
    }
    
    if (formData.orcamento && isNaN(Number(formData.orcamento))) {
      newErrors.orcamento = 'Orçamento deve ser um número';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const data = {
        nome: formData.nome,
        descricao: formData.descricao,
        orcamento: formData.orcamento ? Number(formData.orcamento) : undefined,
        gestorResponsavelId: formData.gestorResponsavelId,
        colaboradoresIds: formData.colaboradoresIds
      };

      if (departamento?.id) {
        // Atualizar departamento
        await updateDepartamento(departamento.id, data);
        
        // Transferir colaboradores se necessário
        const colaboradoresAntigos = departamento.colaboradoresIds || [];
        const colaboradoresNovos = formData.colaboradoresIds;
        
        // Colaboradores adicionados (podem vir de outros departamentos)
        const adicionados = colaboradoresNovos.filter(id => !colaboradoresAntigos.includes(id));
        
        // Para cada adicionado, verificar se está em outro departamento e transferir
        for (const colabId of adicionados) {
          const deptoOrigem = departamentos.find(d => 
            d.id !== departamento.id && d.colaboradoresIds.includes(colabId)
          );
          if (deptoOrigem) {
            await transferColaborador(colabId, deptoOrigem.id!, departamento.id);
          }
        }
      } else {
        // Criar novo departamento
        await addDepartamento(data);
        
        // Transferir colaboradores de outros departamentos se necessário
        for (const colabId of formData.colaboradoresIds) {
          const deptoOrigem = departamentos.find(d => d.colaboradoresIds.includes(colabId));
          if (deptoOrigem) {
            // Aqui precisaríamos do ID do novo departamento
            // Por simplicidade, vamos assumir que os colaboradores já foram adicionados
          }
        }
      }

      onSuccess();
      handleClose();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Erro ao salvar departamento' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nome: '',
      descricao: '',
      orcamento: '',
      gestorResponsavelId: '',
      colaboradoresIds: []
    });
    setErrors({});
    setColaboradorToAdd(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            {departamento ? 'Editar Departamento' : 'Novo Departamento'}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {errors.submit && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.submit}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Nome do Departamento"
            value={formData.nome}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            error={!!errors.nome}
            helperText={errors.nome}
            required
          />

          <TextField
            fullWidth
            label="Descrição"
            value={formData.descricao}
            onChange={(e) => handleInputChange('descricao', e.target.value)}
            multiline
            rows={2}
          />

          <TextField
            fullWidth
            label="Orçamento"
            type="number"
            value={formData.orcamento}
            onChange={(e) => handleInputChange('orcamento', e.target.value)}
            error={!!errors.orcamento}
            helperText={errors.orcamento}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MoneyIcon fontSize="small" />
                  R$
                </InputAdornment>
              ),
            }}
          />

          <Autocomplete
            options={gestoresDisponiveis}
            getOptionLabel={(option) => `${option.nome} - ${option.cargo}`}
            value={gestoresDisponiveis.find(g => g.id === formData.gestorResponsavelId) || null}
            onChange={(_, newValue) => 
              handleInputChange('gestorResponsavelId', newValue?.id || '')
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Gestor Responsável"
                error={!!errors.gestorResponsavelId}
                helperText={errors.gestorResponsavelId}
                required
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                  <PersonIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="body1">{option.nome}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.cargo} - {option.departamento}
                  </Typography>
                </Box>
              </Box>
            )}
          />

          <Divider sx={{ my: 1 }} />

          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Colaboradores do Departamento
          </Typography>

          {/* Adicionar colaborador */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Autocomplete
              fullWidth
              options={colaboradoresDisponiveis}
              getOptionLabel={(option) => option.nome}
              value={colaboradorToAdd}
              onChange={(_, newValue) => setColaboradorToAdd(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Adicionar colaborador"
                  placeholder="Buscar colaborador..."
                  size="small"
                />
              )}
              renderOption={(props, option) => {
                const deptoAtual = departamentos.find(d => 
                  d.colaboradoresIds.includes(option.id!)
                );
                return (
                  <Box component="li" {...props}>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="body2">{option.nome}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.cargo} • {deptoAtual ? `Departamento: ${deptoAtual.nome}` : 'Sem departamento'}
                      </Typography>
                    </Box>
                  </Box>
                );
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddColaborador}
              disabled={!colaboradorToAdd}
              startIcon={<AddIcon />}
              sx={{ minWidth: 120 }}
            >
              Adicionar
            </Button>
          </Box>

          {/* Lista de colaboradores */}
          {colaboradoresSelecionados.length > 0 ? (
            <List sx={{ bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
              {colaboradoresSelecionados.map((colab, index) => {
                const deptoOriginal = departamentos.find(d => 
                  d.id !== departamento?.id && d.colaboradoresIds.includes(colab.id!)
                );
                return (
                  <React.Fragment key={colab.id}>
                    {index > 0 && <Divider />}
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          {colab.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={colab.nome}
                        secondary={
                          <>
                            {colab.cargo} • {colab.nivelHierarquico}
                            {deptoOriginal && (
                              <Chip
                                label={`Será transferido de: ${deptoOriginal.nome}`}
                                size="small"
                                color="warning"
                                sx={{ ml: 1, fontSize: '0.7rem' }}
                              />
                            )}
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveColaborador(colab.id!)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </React.Fragment>
                );
              })}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              Nenhum colaborador adicionado ao departamento
            </Typography>
          )}

          {colaboradoresSelecionados.length > 0 && (
            <Alert severity="info">
              {colaboradoresSelecionados.length} colaborador(es) no departamento
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Salvando...' : departamento ? 'Atualizar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
