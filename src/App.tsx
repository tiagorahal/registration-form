import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Avatar,
  AppBar,
  Toolbar,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon
} from '@mui/icons-material';

// Firebase imports
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  Timestamp
} from 'firebase/firestore';

// Firebase configuration - COM CORREÇÃO
// @ts-ignore - Ignorar erro de tipagem do Vite
const firebaseConfig = {
  // @ts-ignore
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  // @ts-ignore  
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  // @ts-ignore
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  // @ts-ignore
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  // @ts-ignore
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  // @ts-ignore
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
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
  },
});

// Types
interface Employee {
  id?: string;
  name: string;
  email: string;
  department: string;
  active: boolean;
  createdAt?: Timestamp;
}

// Departments
const departments = [
  'Design',
  'TI',
  'Marketing',
  'Produto',
  'Vendas',
  'RH',
  'Financeiro',
  'Operações'
];

function App() {
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [activeStep, setActiveStep] = useState(0);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [formData, setFormData] = useState<Employee>({
    name: '',
    email: '',
    department: '',
    active: true,
  });
  const [errors, setErrors] = useState<any>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Load employees from Firebase on mount
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoadingList(true);
      const q = query(collection(db, 'employees'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const employeesList: Employee[] = [];
      
      querySnapshot.forEach((doc) => {
        employeesList.push({
          id: doc.id,
          ...doc.data()
        } as Employee);
      });
      
      setEmployees(employeesList);
    } catch (error) {
      console.error('Error loading employees:', error);
      showSnackbar('Erro ao carregar colaboradores', 'error');
    } finally {
      setLoadingList(false);
    }
  };

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

  const validateStep = (step: number): boolean => {
    const newErrors: any = {};

    if (step === 0) {
      if (!formData.name || formData.name.trim().length < 3) {
        newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
      }
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }
    }

    if (step === 1) {
      if (!formData.department) {
        newErrors.department = 'Selecione um departamento';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) return;

    try {
      setLoading(true);
      
      // Add employee to Firebase
      await addDoc(collection(db, 'employees'), {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        active: formData.active,
        createdAt: Timestamp.now()
      });
      
      showSnackbar('Colaborador cadastrado com sucesso!', 'success');
      
      // Reset form and go back to list
      setCurrentView('list');
      setActiveStep(0);
      setFormData({ name: '', email: '', department: '', active: true });
      setErrors({});
      
      // Reload employees list
      loadEmployees();
      
    } catch (error) {
      console.error('Error adding employee:', error);
      showSnackbar('Erro ao cadastrar colaborador. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Employee, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    setErrors((prev: any) => ({ ...prev, [field]: undefined }));
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.length > 1 
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  // List View
  const ListView = () => (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, mt: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Colaboradores
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCurrentView('form')}
          sx={{ 
            bgcolor: '#4CAF50',
            '&:hover': { bgcolor: '#45a049' }
          }}
        >
          Novo Colaborador
        </Button>
      </Box>

      {loadingList ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : employees.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Nenhum colaborador cadastrado
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Clique no botão "Novo Colaborador" para adicionar o primeiro funcionário.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCurrentView('form')}
            sx={{ 
              bgcolor: '#4CAF50',
              '&:hover': { bgcolor: '#45a049' }
            }}
          >
            Adicionar Primeiro Colaborador
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>Nome ↓</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>Email ↓</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>Departamento ↓</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666' }}>Status ↓</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id} sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          mr: 2, 
                          bgcolor: getAvatarColor(employee.name),
                          width: 36,
                          height: 36,
                          fontSize: '0.875rem'
                        }}
                      >
                        {getInitials(employee.name)}
                      </Avatar>
                      <Typography>{employee.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <Chip
                      label={employee.active ? 'Ativo' : 'Inativo'}
                      color={employee.active ? 'success' : 'error'}
                      size="small"
                      sx={{ 
                        fontWeight: 500,
                        bgcolor: employee.active ? '#E8F5E9' : '#FFEBEE',
                        color: employee.active ? '#4CAF50' : '#F44336',
                        border: 'none'
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  // Form View
  const FormView = () => (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => setCurrentView('list')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Colaboradores &gt; Cadastrar Colaborador
        </Typography>
      </Box>

      <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
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
              width: `${((activeStep + 1) / 2) * 100}%`,
              transition: 'width 0.3s ease'
            }} />
          </Box>
          <Typography variant="body2" sx={{ mt: 1, color: '#666', textAlign: 'right' }}>
            {((activeStep + 1) / 2 * 100).toFixed(0)}%
          </Typography>
        </Box>

        {/* Steps */}
        <Box sx={{ display: 'flex', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <Box sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: activeStep >= 0 ? '#4CAF50' : '#e0e0e0',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1,
              fontSize: '0.875rem',
              fontWeight: 600
            }}>
              {activeStep > 0 ? <CheckIcon sx={{ fontSize: 18 }} /> : '1'}
            </Box>
            <Typography sx={{ 
              color: activeStep >= 0 ? '#333' : '#999',
              fontWeight: activeStep === 0 ? 600 : 400
            }}>
              Infos Básicas
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: activeStep >= 1 ? '#4CAF50' : '#e0e0e0',
              color: activeStep >= 1 ? 'white' : '#999',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1,
              fontSize: '0.875rem',
              fontWeight: 600
            }}>
              {activeStep > 1 ? <CheckIcon sx={{ fontSize: 18 }} /> : '2'}
            </Box>
            <Typography sx={{ 
              color: activeStep >= 1 ? '#333' : '#999',
              fontWeight: activeStep === 1 ? 600 : 400
            }}>
              Infos Profissionais
            </Typography>
          </Box>
        </Box>

        {/* Step Content */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
              Informações Básicas
            </Typography>
            
            <TextField
              fullWidth
              label="Título"
              placeholder="João da Silva"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ mb: 3 }}
              InputProps={{
                sx: { 
                  bgcolor: errors.name ? '#FFF3F3' : 'white',
                  '&.Mui-focused': {
                    bgcolor: 'white'
                  }
                }
              }}
            />

            <TextField
              fullWidth
              label="E-mail"
              placeholder="e.g. john@gmail.com"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 3 }}
              InputProps={{
                sx: { 
                  bgcolor: errors.email ? '#FFF3F3' : 'white',
                  '&.Mui-focused': {
                    bgcolor: 'white'
                  }
                }
              }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={(e) => handleInputChange('active', e.target.checked)}
                  color="primary"
                />
              }
              label="Ativar ao criar"
              sx={{ mb: 3 }}
            />
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
              Informações Profissionais
            </Typography>
            
            <FormControl fullWidth error={!!errors.department}>
              <InputLabel>Departamento</InputLabel>
              <Select
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                label="Departamento"
                sx={{ 
                  bgcolor: errors.department ? '#FFF3F3' : 'white',
                  '&.Mui-focused': {
                    bgcolor: 'white'
                  }
                }}
              >
                <MenuItem value="">Selecione um departamento</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
              {errors.department && (
                <FormHelperText>{errors.department}</FormHelperText>
              )}
            </FormControl>
          </Box>
        )}

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={() => activeStep === 0 ? setCurrentView('list') : handleBack()}
            sx={{ color: '#666' }}
            disabled={loading}
          >
            Voltar
          </Button>
          
          {activeStep === 0 ? (
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
                '&:hover': { bgcolor: '#45a049' },
                minWidth: 120
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Concluir'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ 
              bgcolor: '#4CAF50', 
              width: 32, 
              height: 32, 
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1
            }}>
              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>
                F
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: '#333', fontWeight: 600 }}>
              Flugo
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton>
            <Avatar sx={{ width: 32, height: 32 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {currentView === 'list' ? <ListView /> : <FormView />}
      </Container>

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