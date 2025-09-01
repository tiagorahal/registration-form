import React, { useState, useEffect, useCallback } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
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
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
  People as PeopleIcon,
  ChevronRight as ChevronRightIcon,
  AccountCircle as AccountCircleIcon
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

// Firebase configuration with TypeScript error fix
// @ts-ignore - Vite env vars not recognized by TypeScript
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

// Validation for development
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.warn('⚠️ Firebase configuration incomplete!');
  console.warn('📝 Please check your .env file in the project root');
  console.warn('📋 Required: VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, etc.');
}

// Initialize Firebase
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log('✅ Firebase initialized successfully!');
  console.log('📊 Project ID:', firebaseConfig.projectId);
} catch (error) {
  console.error('❌ Error initializing Firebase:', error);
  console.error('Please check your Firebase configuration');
  app = {} as any;
  db = {} as any;
}

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

// Types
interface Employee {
  id?: string;
  name: string;
  email: string;
  department: string;
  active: boolean;
  createdAt?: Timestamp;
}

// Departments list
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

// Avatar emojis for variety
const avatarEmojis = ['👩‍💼', '👨‍💼', '👩‍💻', '👨‍💻', '👩‍🎨', '👨‍🎨', '👩‍🔧', '👨‍🔧'];

// Helper functions
const getAvatarEmoji = (name: string) => {
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

const getInitials = (name: string) => {
  const names = name.trim().split(' ');
  return names.length > 1 
    ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    : name.substring(0, 2).toUpperCase();
};

const drawerWidth = 280;

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

  // Load employees from Firebase on component mount
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    if (!db || Object.keys(db).length === 0) {
      console.warn('Firebase not initialized, using demo mode');
      setLoadingList(false);
      return;
    }

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
      console.log(`✅ Loaded ${employeesList.length} employees`);
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

    if (!db || Object.keys(db).length === 0) {
      showSnackbar('Firebase não configurado. Verifique o arquivo .env', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const docRef = await addDoc(collection(db, 'employees'), {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        department: formData.department,
        active: formData.active,
        createdAt: Timestamp.now()
      });
      
      console.log('✅ Employee added with ID:', docRef.id);
      showSnackbar('Colaborador cadastrado com sucesso!', 'success');
      
      setCurrentView('list');
      setActiveStep(0);
      setFormData({ name: '', email: '', department: '', active: true });
      setErrors({});
      
      await loadEmployees();
      
    } catch (error) {
      console.error('Error adding employee:', error);
      showSnackbar('Erro ao cadastrar colaborador. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = useCallback((field: keyof Employee, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev: any) => ({ ...prev, [field]: undefined }));
  }, []);

  // Sidebar Component
  const Sidebar = () => (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid #e0e0e0',
          bgcolor: 'white',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box sx={{ 
            bgcolor: '#4CAF50', 
            width: 40, 
            height: 40, 
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 1.5
          }}>
            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.4rem' }}>
              F
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>
            Flugo
          </Typography>
        </Box>
      </Box>
      
      <List sx={{ px: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            selected
            sx={{
              borderRadius: 2,
              mb: 1,
              '&.Mui-selected': {
                bgcolor: '#f5f5f5',
                '&:hover': {
                  bgcolor: '#eeeeee',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <PeopleIcon sx={{ color: '#666' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Colaboradores" 
              primaryTypographyProps={{ 
                fontSize: '0.95rem',
                fontWeight: 500
              }} 
            />
            <ChevronRightIcon sx={{ color: '#999', fontSize: 20 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Top Bar with User Icon */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            p: 2,
            bgcolor: 'white',
            borderBottom: '1px solid #e0e0e0'
          }}>
            <IconButton>
              <Avatar sx={{ width: 36, height: 36, bgcolor: '#4CAF50' }}>
                <AccountCircleIcon />
              </Avatar>
            </IconButton>
          </Box>

          {/* Content Area */}
          <Box sx={{ flexGrow: 1, p: 4 }}>
            {currentView === 'list' ? (
              /* List View */
              <Box>
                {/* Breadcrumb for form view */}
                {currentView === 'form' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PeopleIcon sx={{ mr: 1, color: '#666', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Colaboradores
                    </Typography>
                    <ChevronRightIcon sx={{ mx: 1, color: '#999', fontSize: 16 }} />
                  </Box>
                )}

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

                {loadingList ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                  </Box>
                ) : employees.length === 0 ? (
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
                      onClick={() => setCurrentView('form')}
                      sx={{ 
                        bgcolor: '#4CAF50',
                        borderRadius: 2,
                        '&:hover': { bgcolor: '#45a049' }
                      }}
                    >
                      Adicionar Primeiro Colaborador
                    </Button>
                  </Paper>
                ) : (
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
                          <TableCell sx={{ 
                            fontWeight: 500, 
                            color: '#666',
                            fontSize: '0.875rem',
                            py: 2.5
                          }}>
                            Nome ↓
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 500, 
                            color: '#666',
                            fontSize: '0.875rem',
                            py: 2.5
                          }}>
                            Email ↓
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 500, 
                            color: '#666',
                            fontSize: '0.875rem',
                            py: 2.5
                          }}>
                            Departamento ↓
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 500, 
                            color: '#666',
                            fontSize: '0.875rem',
                            py: 2.5
                          }}>
                            Status ↓
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {employees.map((employee) => (
                          <TableRow 
                            key={employee.id} 
                            sx={{ 
                              '&:hover': { bgcolor: '#fafafa' },
                              '&:last-child td': { border: 0 }
                            }}
                          >
                            <TableCell sx={{ py: 2.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar 
                                  sx={{ 
                                    mr: 2, 
                                    bgcolor: getAvatarColor(employee.name),
                                    width: 40,
                                    height: 40,
                                    fontSize: '1.2rem'
                                  }}
                                >
                                  {getAvatarEmoji(employee.name)}
                                </Avatar>
                                <Typography sx={{ fontSize: '0.95rem', color: '#333' }}>
                                  {employee.name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.95rem', color: '#666' }}>
                              {employee.email}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.95rem', color: '#666' }}>
                              {employee.department}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={employee.active ? 'Ativo' : 'Inativo'}
                                size="small"
                                sx={{ 
                                  fontWeight: 500,
                                  fontSize: '0.8rem',
                                  bgcolor: 'transparent',
                                  color: employee.active ? '#4CAF50' : '#F44336',
                                  border: 'none',
                                  px: 0
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
            ) : (
              /* Form View */
              <Box>
                {/* Breadcrumb */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <IconButton 
                    onClick={() => setCurrentView('list')} 
                    sx={{ mr: 1 }}
                  >
                    <ChevronRightIcon sx={{ transform: 'rotate(180deg)' }} />
                  </IconButton>
                  <PeopleIcon sx={{ mr: 1, color: '#666', fontSize: 20 }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666',
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                    onClick={() => setCurrentView('list')}
                  >
                    Colaboradores
                  </Typography>
                  <ChevronRightIcon sx={{ mx: 1, color: '#999', fontSize: 16 }} />
                  <Typography variant="body2" sx={{ color: '#333' }}>
                    Cadastrar Colaborador
                  </Typography>
                </Box>

                <Box sx={{ 
                  bgcolor: 'white', 
                  borderRadius: 3, 
                  p: 4,
                  border: '1px solid #e0e0e0'
                }}>
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

                  {/* Step Indicators */}
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
                        key="name-field"
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
                        key="email-field"
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
                          borderRadius: 2,
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
                          borderRadius: 2,
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
