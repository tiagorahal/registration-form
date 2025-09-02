import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress,
  Grid,
  InputAdornment,
  Autocomplete
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { Colaborador } from '../../types/colaborador';
import { useColaboradores } from '../../hooks/useColaboradores';

const steps = ['Dados Pessoais', 'Informações Profissionais', 'Endereço', 'Revisão'];

interface StepperCadastroProps {
  onClose: () => void;
  onSuccess: () => void;
  colaboradorEdit?: Colaborador;
}

export const StepperCadastro: React.FC<StepperCadastroProps> = ({ 
  onClose, 
  onSuccess,
  colaboradorEdit 
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { colaboradores, addColaborador, updateColaborador } = useColaboradores();
  
  // Filtrar gestores para o autocomplete
  const gestores = colaboradores.filter(c => c.nivelHierarquico === 'gestor');
  
  const [formData, setFormData] = useState<Partial<Colaborador>>(
    colaboradorEdit || {
      nome: '',
      email: '',
      cpf: '',
      telefone: '',
      dataNascimento: '',
      cargo: '',
      dataAdmissao: '',
      nivelHierarquico: 'junior',
      gestorResponsavel: '',
      salarioBase: 0,
      departamento: '',
      status: 'ativo',
      endereco: {
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: ''
      }
    }
  );

  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    setErrors((prev: any) => ({ ...prev, [field]: undefined }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: any = {};

    if (step === 0) {
      // Dados pessoais
      if (!formData.nome || formData.nome.length < 3) {
        newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
      }
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }
      if (!formData.cpf) {
        newErrors.cpf = 'CPF é obrigatório';
      }
      if (!formData.telefone) {
        newErrors.telefone = 'Telefone é obrigatório';
      }
      if (!formData.dataNascimento) {
        newErrors.dataNascimento = 'Data de nascimento é obrigatória';
      }
    }

    if (step === 1) {
      // Informações profissionais
      if (!formData.cargo) {
        newErrors.cargo = 'Cargo é obrigatório';
      }
      if (!formData.dataAdmissao) {
        newErrors.dataAdmissao = 'Data de admissão é obrigatória';
      }
      if (!formData.departamento) {
        newErrors.departamento = 'Departamento é obrigatório';
      }
      if (!formData.salarioBase || formData.salarioBase <= 0) {
        newErrors.salarioBase = 'Salário deve ser maior que zero';
      }
      if (formData.nivelHierarquico !== 'gestor' && !formData.gestorResponsavel) {
        newErrors.gestorResponsavel = 'Selecione um gestor responsável';
      }
    }

    if (step === 2) {
      // Endereço
      if (!formData.endereco?.cep) {
        newErrors['endereco.cep'] = 'CEP é obrigatório';
      }
      if (!formData.endereco?.logradouro) {
        newErrors['endereco.logradouro'] = 'Logradouro é obrigatório';
      }
      if (!formData.endereco?.numero) {
        newErrors['endereco.numero'] = 'Número é obrigatório';
      }
      if (!formData.endereco?.bairro) {
        newErrors['endereco.bairro'] = 'Bairro é obrigatório';
      }
      if (!formData.endereco?.cidade) {
        newErrors['endereco.cidade'] = 'Cidade é obrigatória';
      }
      if (!formData.endereco?.estado) {
        newErrors['endereco.estado'] = 'Estado é obrigatório';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeStep < 3 && validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (colaboradorEdit?.id) {
        await updateColaborador(colaboradorEdit.id, formData);
      } else {
        await addColaborador(formData as Omit<Colaborador, 'id'>);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar colaborador:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Dados Pessoais
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome Completo"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  error={!!errors.nome}
                  helperText={errors.nome}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="E-mail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CPF"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  error={!!errors.cpf}
                  helperText={errors.cpf}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  error={!!errors.telefone}
                  helperText={errors.telefone}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data de Nascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                  error={!!errors.dataNascimento}
                  helperText={errors.dataNascimento}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Informações Profissionais
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cargo"
                  value={formData.cargo}
                  onChange={(e) => handleInputChange('cargo', e.target.value)}
                  error={!!errors.cargo}
                  helperText={errors.cargo}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data de Admissão"
                  type="date"
                  value={formData.dataAdmissao}
                  onChange={(e) => handleInputChange('dataAdmissao', e.target.value)}
                  error={!!errors.dataAdmissao}
                  helperText={errors.dataAdmissao}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.nivelHierarquico}>
                  <InputLabel>Nível Hierárquico</InputLabel>
                  <Select
                    value={formData.nivelHierarquico}
                    onChange={(e) => handleInputChange('nivelHierarquico', e.target.value)}
                    label="Nível Hierárquico"
                  >
                    <MenuItem value="junior">Júnior</MenuItem>
                    <MenuItem value="pleno">Pleno</MenuItem>
                    <MenuItem value="senior">Sênior</MenuItem>
                    <MenuItem value="gestor">Gestor</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Salário Base"
                  type="number"
                  value={formData.salarioBase}
                  onChange={(e) => handleInputChange('salarioBase', Number(e.target.value))}
                  error={!!errors.salarioBase}
                  helperText={errors.salarioBase}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                />
              </Grid>
              {formData.nivelHierarquico !== 'gestor' && (
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    options={gestores}
                    getOptionLabel={(option) => option.nome}
                    value={gestores.find(g => g.id === formData.gestorResponsavel) || null}
                    onChange={(_, newValue) => 
                      handleInputChange('gestorResponsavel', newValue?.id || '')
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Gestor Responsável"
                        error={!!errors.gestorResponsavel}
                        helperText={errors.gestorResponsavel}
                      />
                    )}
                  />
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.departamento}>
                  <InputLabel>Departamento</InputLabel>
                  <Select
                    value={formData.departamento}
                    onChange={(e) => handleInputChange('departamento', e.target.value)}
                    label="Departamento"
                  >
                    <MenuItem value="">Selecione</MenuItem>
                    <MenuItem value="Design">Design</MenuItem>
                    <MenuItem value="TI">TI</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                    <MenuItem value="Produto">Produto</MenuItem>
                    <MenuItem value="Vendas">Vendas</MenuItem>
                    <MenuItem value="RH">RH</MenuItem>
                    <MenuItem value="Financeiro">Financeiro</MenuItem>
                    <MenuItem value="Operações">Operações</MenuItem>
                  </Select>
                  {errors.departamento && (
                    <FormHelperText>{errors.departamento}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Endereço
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="CEP"
                  value={formData.endereco?.cep}
                  onChange={(e) => handleInputChange('endereco.cep', e.target.value)}
                  error={!!errors['endereco.cep']}
                  helperText={errors['endereco.cep']}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Logradouro"
                  value={formData.endereco?.logradouro}
                  onChange={(e) => handleInputChange('endereco.logradouro', e.target.value)}
                  error={!!errors['endereco.logradouro']}
                  helperText={errors['endereco.logradouro']}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Número"
                  value={formData.endereco?.numero}
                  onChange={(e) => handleInputChange('endereco.numero', e.target.value)}
                  error={!!errors['endereco.numero']}
                  helperText={errors['endereco.numero']}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Complemento"
                  value={formData.endereco?.complemento}
                  onChange={(e) => handleInputChange('endereco.complemento', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Bairro"
                  value={formData.endereco?.bairro}
                  onChange={(e) => handleInputChange('endereco.bairro', e.target.value)}
                  error={!!errors['endereco.bairro']}
                  helperText={errors['endereco.bairro']}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Cidade"
                  value={formData.endereco?.cidade}
                  onChange={(e) => handleInputChange('endereco.cidade', e.target.value)}
                  error={!!errors['endereco.cidade']}
                  helperText={errors['endereco.cidade']}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Estado"
                  value={formData.endereco?.estado}
                  onChange={(e) => handleInputChange('endereco.estado', e.target.value)}
                  error={!!errors['endereco.estado']}
                  helperText={errors['endereco.estado']}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Revisão dos Dados
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Dados Pessoais
                </Typography>
                <Typography>Nome: {formData.nome}</Typography>
                <Typography>Email: {formData.email}</Typography>
                <Typography>CPF: {formData.cpf}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>
                  Informações Profissionais
                </Typography>
                <Typography>Cargo: {formData.cargo}</Typography>
                <Typography>Departamento: {formData.departamento}</Typography>
                <Typography>Nível: {formData.nivelHierarquico}</Typography>
                <Typography>Salário: R$ {formData.salarioBase?.toLocaleString('pt-BR')}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>
                  Endereço
                </Typography>
                <Typography>
                  {formData.endereco?.logradouro}, {formData.endereco?.numero}
                  {formData.endereco?.complemento && ` - ${formData.endereco.complemento}`}
                </Typography>
                <Typography>
                  {formData.endereco?.bairro} - {formData.endereco?.cidade}/{formData.endereco?.estado}
                </Typography>
                <Typography>CEP: {formData.endereco?.cep}</Typography>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Progress Bar */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          height: 4, 
          bgcolor: '#e0e0e0', 
          borderRadius: 2,
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            height: '100%', 
            bgcolor: '#4CAF50',
            width: `${((activeStep + 1) / steps.length) * 100}%`,
            transition: 'width 0.3s ease'
          }} />
        </Box>
      </Box>

      {/* Step Indicators */}
      <Box sx={{ display: 'flex', mb: 4, justifyContent: 'space-between' }}>
        {steps.map((label, index) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: activeStep >= index ? '#4CAF50' : '#e0e0e0',
              color: activeStep >= index ? 'white' : '#999',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1,
              fontSize: '0.875rem',
              fontWeight: 600
            }}>
              {activeStep > index ? <CheckIcon sx={{ fontSize: 18 }} /> : index + 1}
            </Box>
            <Typography sx={{ 
              color: activeStep >= index ? '#333' : '#999',
              fontWeight: activeStep === index ? 600 : 400,
              fontSize: '0.875rem'
            }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Step Content */}
      <Box sx={{ mb: 4 }}>
        {getStepContent()}
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={activeStep === 0 ? onClose : handleBack}
          sx={{ color: '#666' }}
          disabled={loading}
        >
          {activeStep === 0 ? 'Cancelar' : 'Voltar'}
        </Button>
        
        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ 
              bgcolor: '#4CAF50',
              '&:hover': { bgcolor: '#45a049' }
            }}
          >
            Próximo
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ 
              bgcolor: '#4CAF50',
              '&:hover': { bgcolor: '#45a049' }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Salvar'}
          </Button>
        )}
      </Box>
    </Box>
  );
};