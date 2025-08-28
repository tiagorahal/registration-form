import React, { useState } from 'react';

interface Employee {
  name: string;
  email: string;
  department: string;
  active: boolean;
}

function App() {
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [currentStep, setCurrentStep] = useState(1);
  const [employees, setEmployees] = useState<Employee[]>([
    { name: 'João Silva', email: 'joao@example.com', department: 'TI', active: true },
    { name: 'Maria Santos', email: 'maria@example.com', department: 'RH', active: true }
  ]);
  const [formData, setFormData] = useState<Employee>({
    name: '',
    email: '',
    department: '',
    active: true
  });

  const handleSubmit = () => {
    setEmployees([...employees, formData]);
    setFormData({ name: '', email: '', department: '', active: true });
    setCurrentStep(1);
    setCurrentView('list');
    alert('Colaborador cadastrado com sucesso!');
  };

  const handleInputChange = (field: keyof Employee, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Flugo - Sistema de Cadastro</h1>
      
      {currentView === 'list' ? (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ display: 'inline' }}>Colaboradores</h2>
            <button 
              onClick={() => setCurrentView('form')}
              style={{ 
                float: 'right', 
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Novo Colaborador
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Nome</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Departamento</th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={index}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{emp.name}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{emp.email}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{emp.department}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    <span style={{ 
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: emp.active ? '#d4edda' : '#f8d7da',
                      color: emp.active ? '#155724' : '#721c24'
                    }}>
                      {emp.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <button onClick={() => setCurrentView('list')} style={{ marginRight: '10px' }}>
              ← Voltar
            </button>
            <span>Colaboradores {'>'} Cadastrar Colaborador</span>
          </div>

          <div style={{ backgroundColor: 'white', padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
            {/* Progress Bar */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#e0e0e0', height: '4px', borderRadius: '2px' }}>
                <div style={{ 
                  backgroundColor: '#4CAF50', 
                  height: '100%', 
                  width: `${currentStep * 50}%`,
                  borderRadius: '2px',
                  transition: 'width 0.3s'
                }}></div>
              </div>
              <p style={{ textAlign: 'right', fontSize: '12px', marginTop: '5px' }}>{currentStep * 50}%</p>
            </div>

            {/* Step Indicators */}
            <div style={{ display: 'flex', marginBottom: '30px' }}>
              <div style={{ marginRight: '30px' }}>
                <span style={{ 
                  display: 'inline-block',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: currentStep >= 1 ? '#4CAF50' : '#e0e0e0',
                  color: 'white',
                  textAlign: 'center',
                  lineHeight: '30px',
                  marginRight: '10px'
                }}>
                  1
                </span>
                Infos Básicas
              </div>
              <div>
                <span style={{ 
                  display: 'inline-block',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: currentStep >= 2 ? '#4CAF50' : '#e0e0e0',
                  color: currentStep >= 2 ? 'white' : '#666',
                  textAlign: 'center',
                  lineHeight: '30px',
                  marginRight: '10px'
                }}>
                  2
                </span>
                Infos Profissionais
              </div>
            </div>

            {/* Form Steps */}
            {currentStep === 1 ? (
              <div>
                <h3>Informações Básicas</h3>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Nome</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="João da Silva"
                    style={{ 
                      width: '100%', 
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>E-mail</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="joao@example.com"
                    style={{ 
                      width: '100%', 
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => handleInputChange('active', e.target.checked)}
                      style={{ marginRight: '5px' }}
                    />
                    Ativar ao criar
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <h3>Informações Profissionais</h3>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Departamento</label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="">Selecione um departamento</option>
                    <option value="Design">Design</option>
                    <option value="TI">TI</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Produto">Produto</option>
                    <option value="RH">RH</option>
                  </select>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
              <button
                onClick={() => currentStep === 1 ? setCurrentView('list') : setCurrentStep(1)}
                style={{ 
                  padding: '8px 16px',
                  backgroundColor: '#f0f0f0',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Voltar
              </button>
              
              {currentStep === 1 ? (
                <button
                  onClick={() => setCurrentStep(2)}
                  style={{ 
                    padding: '8px 16px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Próximo
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  style={{ 
                    padding: '8px 16px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Concluir
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;