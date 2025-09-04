import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth não configurado');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error: any) {
      // Traduzir mensagens de erro comuns
      if (error.code === 'auth/user-not-found') {
        throw new Error('Usuário não encontrado');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Senha incorreta');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Email inválido');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Muitas tentativas. Tente novamente mais tarde');
      } else {
        throw new Error('Erro ao fazer login. Tente novamente');
      }
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    if (!auth) throw new Error('Firebase Auth não configurado');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Se nome foi fornecido, atualizar o perfil
      if (name && userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      
      setUser(userCredential.user);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Este email já está cadastrado');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Email inválido');
      } else {
        throw new Error('Erro ao criar conta. Tente novamente');
      }
    }
  };

  const logout = async () => {
    if (!auth) throw new Error('Firebase Auth não configurado');
    
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      throw new Error('Erro ao fazer logout');
    }
  };

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error('Firebase Auth não configurado');
    
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new Error('Usuário não encontrado');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Email inválido');
      } else {
        throw new Error('Erro ao enviar email de recuperação');
      }
    }
  };

  const updateUserProfile = async (displayName: string) => {
    if (!auth || !user) throw new Error('Usuário não autenticado');
    
    try {
      await updateProfile(user, { displayName });
      // Recarregar o usuário para obter as alterações
      setUser({ ...user, displayName });
    } catch (error) {
      throw new Error('Erro ao atualizar perfil');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};