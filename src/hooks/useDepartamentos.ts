import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
  writeBatch,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Departamento } from '../types/departamento';
import { useAuth } from '../contexts/AuthContext';

export const useDepartamentos = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadDepartamentos = async () => {
    if (!db) {
      setError('Firebase não configurado');
      setLoading(false);
      return;
    }

    if (!user) {
      setError('Usuário não autenticado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const q = query(
        collection(db, 'departamentos'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const lista: Departamento[] = [];
      
      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          ...doc.data()
        } as Departamento);
      });
      
      setDepartamentos(lista);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar departamentos:', err);
      setError('Erro ao carregar departamentos');
    } finally {
      setLoading(false);
    }
  };

  const addDepartamento = async (departamento: Omit<Departamento, 'id'>) => {
    if (!db) throw new Error('Firebase não configurado');
    if (!user) throw new Error('Usuário não autenticado');

    const docRef = await addDoc(collection(db, 'departamentos'), {
      ...departamento,
      userId: user.uid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    await loadDepartamentos();
    return docRef.id;
  };

  const updateDepartamento = async (id: string, departamento: Partial<Departamento>) => {
    if (!db) throw new Error('Firebase não configurado');
    if (!user) throw new Error('Usuário não autenticado');

    const docRef = doc(db, 'departamentos', id);
    await updateDoc(docRef, {
      ...departamento,
      updatedAt: Timestamp.now()
    });

    await loadDepartamentos();
  };

  const deleteDepartamento = async (id: string) => {
    if (!db) throw new Error('Firebase não configurado');
    if (!user) throw new Error('Usuário não autenticado');

    // Verificar se há colaboradores no departamento
    const depto = departamentos.find(d => d.id === id);
    if (depto && depto.colaboradoresIds.length > 0) {
      throw new Error('Não é possível excluir um departamento com colaboradores. Transfira-os primeiro.');
    }

    await deleteDoc(doc(db, 'departamentos', id));
    await loadDepartamentos();
  };

  const addColaboradorToDepartamento = async (departamentoId: string, colaboradorId: string) => {
    if (!db) throw new Error('Firebase não configurado');
    
    const depto = departamentos.find(d => d.id === departamentoId);
    if (!depto) throw new Error('Departamento não encontrado');
    
    if (!depto.colaboradoresIds.includes(colaboradorId)) {
      await updateDepartamento(departamentoId, {
        colaboradoresIds: [...depto.colaboradoresIds, colaboradorId]
      });
    }
  };

  const removeColaboradorFromDepartamento = async (departamentoId: string, colaboradorId: string) => {
    if (!db) throw new Error('Firebase não configurado');
    
    const depto = departamentos.find(d => d.id === departamentoId);
    if (!depto) throw new Error('Departamento não encontrado');
    
    await updateDepartamento(departamentoId, {
      colaboradoresIds: depto.colaboradoresIds.filter(id => id !== colaboradorId)
    });
  };

  const transferColaborador = async (
    colaboradorId: string, 
    fromDepartamentoId: string, 
    toDepartamentoId: string
  ) => {
    if (!db) throw new Error('Firebase não configurado');
    
    const batch = writeBatch(db!);
    
    // Remove do departamento antigo
    const fromDepto = departamentos.find(d => d.id === fromDepartamentoId);
    if (fromDepto) {
      const fromRef = doc(db!, 'departamentos', fromDepartamentoId);
      batch.update(fromRef, {
        colaboradoresIds: fromDepto.colaboradoresIds.filter(id => id !== colaboradorId),
        updatedAt: Timestamp.now()
      });
    }
    
    // Adiciona ao novo departamento
    const toDepto = departamentos.find(d => d.id === toDepartamentoId);
    if (toDepto) {
      const toRef = doc(db!, 'departamentos', toDepartamentoId);
      batch.update(toRef, {
        colaboradoresIds: [...toDepto.colaboradoresIds, colaboradorId],
        updatedAt: Timestamp.now()
      });
    }
    
    // Atualiza o departamento no colaborador
    const colaboradorRef = doc(db!, 'colaboradores', colaboradorId);
    batch.update(colaboradorRef, {
      departamentoId: toDepartamentoId,
      updatedAt: Timestamp.now()
    });
    
    await batch.commit();
    await loadDepartamentos();
  };

  useEffect(() => {
    if (user) {
      loadDepartamentos();
    }
  }, [user]);

  return {
    departamentos,
    loading,
    error,
    addDepartamento,
    updateDepartamento,
    deleteDepartamento,
    addColaboradorToDepartamento,
    removeColaboradorFromDepartamento,
    transferColaborador,
    reloadDepartamentos: loadDepartamentos
  };
};
