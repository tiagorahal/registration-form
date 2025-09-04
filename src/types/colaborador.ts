import { Timestamp } from 'firebase/firestore';

export interface Colaborador {
  id?: string;
  // Informações básicas
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  
  // Informações profissionais
  cargo: string;
  dataAdmissao: string;
  nivelHierarquico: 'junior' | 'pleno' | 'senior' | 'gestor';
  gestorResponsavel?: string;
  salarioBase: number;
  
  // Endereço
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  
  // Departamento e status
  departamento: string;
  status: 'ativo' | 'inativo' | 'ferias' | 'afastado';
  
  // Metadata
  userId?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}