// src/hooks/useDepartamentos.ts
import { useEffect, useState, useCallback, useRef } from 'react';
import type { Firestore } from 'firebase/firestore';
import {
  collection,
  addDoc,
  setDoc,
  updateDoc,
  getDocs,
  doc,
  runTransaction,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Departamento } from '../types/departamento';

type NewDepartamento = Omit<Departamento, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
};

// Garante Firestore definido e “converte” o tipo para Firestore (não undefined)
function getDb(): Firestore {
  if (!db) {
    throw new Error('Firebase Firestore não configurado. Verifique src/config/firebase.ts e variáveis VITE_FIREBASE_*');
  }
  return db as Firestore;
}

export function useDepartamentos() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fdb = getDb();
  const coll = collection(fdb, 'departamentos');

  const mapSnapToDepartamento = (d: any): Departamento => {
    const data = d.data ? d.data() : d;
    return {
      id: data.id ?? d.id,
      nome: data.nome ?? '',
      descricao: data.descricao ?? '',
      orcamento: typeof data.orcamento === 'number' ? data.orcamento : undefined,
      gestorResponsavelId: data.gestorResponsavelId ?? '',
      colaboradoresIds: Array.isArray(data.colaboradoresIds) ? data.colaboradoresIds : [],
      createdAt: data.createdAt ?? null,
      updatedAt: data.updatedAt ?? null,
    };
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(coll, orderBy('nome', 'asc'));
      const snap = await getDocs(q);
      const items = snap.docs.map((d) => mapSnapToDepartamento(d));
      setDepartamentos(items);
    } catch (e: any) {
      setError(e?.message || 'Falha ao carregar departamentos');
    } finally {
      setLoading(false);
    }
  }, [coll]);

  // ✅ Guard contra double-mount do StrictMode (evita flicker)
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    load();
  }, [load]);

  const addDepartamento = async (data: NewDepartamento) => {
    const payload = {
      nome: data.nome,
      descricao: data.descricao ?? '',
      orcamento: typeof data.orcamento === 'number' ? data.orcamento : null,
      gestorResponsavelId: data.gestorResponsavelId,
      colaboradoresIds: Array.isArray(data.colaboradoresIds) ? data.colaboradoresIds : [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // 1) cria doc (gera id)
    const docRef = await addDoc(coll, payload);
    // 2) grava o próprio id
    await setDoc(doc(fdb, 'departamentos', docRef.id), { id: docRef.id }, { merge: true });

    return docRef.id;
  };

  const updateDepartamento = async (id: string, data: Partial<NewDepartamento>) => {
    const ref = doc(fdb, 'departamentos', id);
    const patch: any = {
      updatedAt: serverTimestamp(),
    };
    if (data.nome !== undefined) patch.nome = data.nome;
    if (data.descricao !== undefined) patch.descricao = data.descricao;
    if (data.orcamento !== undefined) patch.orcamento = data.orcamento;
    if (data.gestorResponsavelId !== undefined) patch.gestorResponsavelId = data.gestorResponsavelId;
    if (data.colaboradoresIds !== undefined) patch.colaboradoresIds = data.colaboradoresIds;

    await updateDoc(ref, patch);
  };

  const deleteDepartamento = async (id: string) => {
    // Exemplo de soft delete (mantenho para referência)
    await updateDoc(doc(fdb, 'departamentos', id), {
      deletedAt: serverTimestamp(),
    });
    // Se quiser apagar de verdade, use deleteDoc aqui.
  };

  const transferColaborador = async (colabId: string, deptoOrigemId: string, deptoDestinoId: string) => {
    if (!colabId || !deptoOrigemId || !deptoDestinoId || deptoOrigemId === deptoDestinoId) return;

    const origemRef = doc(fdb, 'departamentos', deptoOrigemId);
    const destinoRef = doc(fdb, 'departamentos', deptoDestinoId);

    await runTransaction(fdb, async (tx) => {
      const origemSnap = await tx.get(origemRef);
      const destinoSnap = await tx.get(destinoRef);

      if (!origemSnap.exists() || !destinoSnap.exists()) {
        throw new Error('Departamento de origem ou destino não existe');
      }

      const origem = origemSnap.data() as Departamento;
      const destino = destinoSnap.data() as Departamento;

      const origemList = Array.isArray(origem.colaboradoresIds) ? origem.colaboradoresIds : [];
      const destinoList = Array.isArray(destino.colaboradoresIds) ? destino.colaboradoresIds : [];

      const novaOrigem = origemList.filter((id) => id !== colabId);
      const novoDestino = destinoList.includes(colabId) ? destinoList : [...destinoList, colabId];

      tx.update(origemRef, { colaboradoresIds: novaOrigem, updatedAt: serverTimestamp() });
      tx.update(destinoRef, { colaboradoresIds: novoDestino, updatedAt: serverTimestamp() });
    });
  };

  const reloadDepartamentos = async () => {
    await load();
  };

  return {
    departamentos,
    loading,
    error,
    addDepartamento,
    updateDepartamento,
    deleteDepartamento,
    transferColaborador,
    reloadDepartamentos,
  };
}
