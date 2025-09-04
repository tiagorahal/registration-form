import { Timestamp } from 'firebase/firestore';

export interface Departamento {
  id?: string;
  nome: string;
  gestorResponsavelId: string;
  colaboradoresIds: string[];
  descricao?: string;
  orcamento?: number;
  
  userId?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
