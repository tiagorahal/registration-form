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
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Colaborador } from '../types/colaborador';

export const useColaboradores = () => {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadColaboradores = async () => {
    if (!db) {
      setError('Firebase não configurado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const q = query(collection(db, 'colaboradores'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const lista: Colaborador[] = [];
      
      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          ...doc.data()
        } as Colaborador);
      });
      
      setColaboradores(lista);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar colaboradores:', err);
      setError('Erro ao carregar colaboradores');
    } finally {
      setLoading(false);
    }
  };

  const addColaborador = async (colaborador: Omit<Colaborador, 'id'>) => {
    if (!db) throw new Error('Firebase não configurado');

    const docRef = await addDoc(collection(db, 'colaboradores'), {
      ...colaborador,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    // Recarrega a lista após adicionar
    await loadColaboradores();
    return docRef.id;
  };

  const updateColaborador = async (id: string, colaborador: Partial<Colaborador>) => {
    if (!db) throw new Error('Firebase não configurado');

    const docRef = doc(db, 'colaboradores', id);
    await updateDoc(docRef, {
      ...colaborador,
      updatedAt: Timestamp.now()
    });

    // Recarrega a lista após atualizar
    await loadColaboradores();
  };

  const deleteColaborador = async (id: string) => {
    if (!db) throw new Error('Firebase não configurado');

    await deleteDoc(doc(db, 'colaboradores', id));
    
    // Recarrega a lista após deletar
    await loadColaboradores();
  };

  const deleteColaboradoresBulk = async (ids: string[]) => {
    if (!db) throw new Error('Firebase não configurado');
    
    if (ids.length === 0) return;

    const batch = writeBatch(db);
    
    ids.forEach(id => {
      const docRef = doc(db!, 'colaboradores', id);
      batch.delete(docRef);
    });
    
    await batch.commit();
    
    await loadColaboradores();
  };

  useEffect(() => {
    loadColaboradores();
  }, []);

  return {
    colaboradores,
    loading,
    error,
    addColaborador,
    updateColaborador,
    deleteColaborador,
    deleteColaboradoresBulk, // Exporta a nova função
    reloadColaboradores: loadColaboradores
  };
};