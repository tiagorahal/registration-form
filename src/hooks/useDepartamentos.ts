// src/hooks/useDepartamentos.ts
import { useEffect, useState, useCallback } from 'react';
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

export function useDepartamentos() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const coll = collection(db, 'departamentos');

  const mapSnapToDepartamento = (d: any): Departamento => {
    const data = d.data ? d.data() : d; // aceita tanto DocSnap quanto objeto puro
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
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addDepartamento = async (data: NewDepartamento) => {
    // grava e garante field id
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
    // 2) persiste o próprio id como campo (útil para listagens)
    await setDoc(doc(db, 'departamentos', docRef.id), { id: docRef.id }, { merge: true });

    return docRef.id;
  };

  const updateDepartamento = async (id: string, data: Partial<NewDepartamento>) => {
    const ref = doc(db, 'departamentos', id);
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
    // opcional: validação para impedir exclusão com colaboradores
    await updateDoc(doc(db, 'departamentos', id), {
      // se quiser “soft delete”, adicione um flag:
      deletedAt: serverTimestamp(),
    });
    // ou, se realmente quiser deletar:
    // await deleteDoc(doc(db, 'departamentos', id));
  };

  /**
   * Transfere um colaborador de um departamento origem -> destino.
   * Garante consistência com transação.
   */
  const transferColaborador = async (colabId: string, deptoOrigemId: string, deptoDestinoId: string) => {
    if (!colabId || !deptoOrigemId || !deptoDestinoId || deptoOrigemId === deptoDestinoId) return;

    const origemRef = doc(db, 'departamentos', deptoOrigemId);
    const destinoRef = doc(db, 'departamentos', deptoDestinoId);

    await runTransaction(db, async (tx) => {
      const origemSnap = await tx.get(origemRef);
      const destinoSnap = await tx.get(destinoRef);

      if (!origemSnap.exists() || !destinoSnap.exists()) {
        throw new Error('Departamento de origem ou destino não existe');
      }

      const origem = origemSnap.data() as Departamento;
      const destino = destinoSnap.data() as Departamento;

      const origemList = Array.isArray(origem.colaboradoresIds) ? origem.colaboradoresIds : [];
      const destinoList = Array.isArray(destino.colaboradoresIds) ? destino.colaboradoresIds : [];

      // remove do origem
      const novaOrigem = origemList.filter((id) => id !== colabId);
      // adiciona no destino (sem duplicar)
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
