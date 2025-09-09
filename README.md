# Sistema de Gestão de Recursos Humanos

Sistema completo de gestão de RH com cadastro de colaboradores, gestão de departamentos, autenticação e controle de permissões, desenvolvido com React, TypeScript, Material-UI e Firebase.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue)
![MUI](https://img.shields.io/badge/MUI-5.14.0-purple)
![Firebase](https://img.shields.io/badge/Firebase-10.7.0-orange)
![Vite](https://img.shields.io/badge/Vite-5.0.0-purple)

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Uso](#-uso)
- [Deploy](#-deploy)

[**Demo ao vivo**](https://registration-form-omega-seven.vercel.app/)

## 🎯 Visão Geral

Sistema profissional de gestão de recursos humanos com funcionalidades avançadas de cadastro, controle de departamentos e permissões hierárquicas. Desenvolvido como solução completa para o desafio técnico da Flugo.

## ✨ Funcionalidades

### Autenticação e Segurança
- ✅ **Autenticação completa com Firebase Auth (JWT)**
- ✅ **Login com email e senha**
- ✅ **Registro de novos usuários**
- ✅ **Recuperação de senha por email**
- ✅ **Proteção de rotas privadas**
- ✅ **Logout seguro com limpeza de sessão**
- ✅ **Isolamento de dados por usuário**
- ✅ **Context API para estado global**

### Gestão de Conta do Usuário
- ✅ **Página de perfil completa** com informações detalhadas
- ✅ **Edição de dados pessoais** (nome de exibição)
- ✅ **Avatar personalizado** com cores baseadas no email
- ✅ **Informações da conta** (ID, verificação, datas)
- ✅ **Página de configurações** com preferências do sistema
- ✅ **Configurações de notificações** (email, push, atualizações)
- ✅ **Configurações de privacidade** (perfil público, coleta de dados)
- ✅ **Configurações de aparência** (modo escuro, animações)
- ✅ **Ações rápidas** (alterar senha, privacidade, histórico)
- ✅ **Navegação pelo TopBar** e Sidebar com menu dropdown

### Gestão de Colaboradores
- ✅ **Cadastro em 4 etapas** com validação progressiva
  - Dados Pessoais (nome, email, CPF, telefone, nascimento)
  - Informações Profissionais (cargo, admissão, nível, gestor, salário)
  - Endereço completo (CEP, logradouro, número, bairro, cidade, estado)
  - Revisão e confirmação dos dados
- ✅ **Edição completa** com formulário pré-preenchido
- ✅ **Exclusão individual** com confirmação
- ✅ **Exclusão em massa** com seleção múltipla
- ✅ **Validação de idade mínima** (18 anos)
- ✅ **Autocomplete inteligente** para seleção de gestor
- ✅ **Avatares personalizados** com emojis

### Gestão de Departamentos
- ✅ **CRUD completo de departamentos**
- ✅ **Atribuição de gestor responsável** (apenas gestores)
- ✅ **Gerenciamento de colaboradores por departamento**
- ✅ **Transferência automática entre departamentos**
- ✅ **Orçamento por departamento**
- ✅ **Validação de integridade** (colaborador sempre em um departamento)
- ✅ **Exclusão protegida** (não permite excluir com colaboradores)
- ✅ **Avatar groups** para visualização da equipe

### Sistema de Permissões
- ✅ **4 níveis hierárquicos**: Júnior, Pleno, Sênior, Gestor
- ✅ **Apenas gestores** podem ser responsáveis por departamentos
- ✅ **Controle de transferências** entre departamentos
- ✅ **Validações de integridade de dados**
- ✅ **Indicadores visuais** de permissões

### Busca e Filtros Avançados
- ✅ **Busca global** por nome, email, cargo ou CPF
- ✅ **Filtro por departamento**
- ✅ **Filtro por nível hierárquico**
- ✅ **Filtro por status** (ativo, inativo, férias, afastado)
- ✅ **Filtro por faixa salarial**
- ✅ **Interface expansível** para economizar espaço
- ✅ **Contador de resultados filtrados**
- ✅ **Limpar todos os filtros** com um clique

### Interface & UX
- ✅ **Design moderno e responsivo** com Material-UI
- ✅ **Página 404 customizada** com gradientes
- ✅ **Sidebar navegável** com indicador de página ativa e seção de conta
- ✅ **TopBar** com menu dropdown de usuário funcional
- ✅ **Feedback visual** com snackbars
- ✅ **Loading states** durante operações
- ✅ **Validações em tempo real**
- ✅ **Dialogs de confirmação** para ações críticas
- ✅ **Tema consistente** com cores e espaçamentos
- ✅ **Navegação intuitiva** entre páginas

## 🛠 Tecnologias

### Core
- **React 18.2** - Biblioteca UI
- **TypeScript 5.0** - Type safety
- **Vite 5.0** - Build tool ultrarrápida
- **React Router DOM 6** - Roteamento SPA

### UI/UX
- **Material-UI 5.14** - Componentes React
- **Material Icons** - Ícones consistentes
- **Emotion** - CSS-in-JS para estilos

### Backend
- **Firebase Firestore** - Database NoSQL em tempo real
- **Firebase Auth** - Autenticação segura
- **Firebase Batch Operations** - Operações em massa otimizadas

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ instalado
- NPM ou Yarn
- Conta no Firebase Console
- Git

### Passo a passo

1. **Clone o repositório**
```bash
git clone https://github.com/tiagorahal/registration-form.git
cd registration-form
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

4. **Execute o projeto**
```bash
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

## ⚙️ Configuração

### Firebase Console

1. **Criar Projeto**
   - Acesse [Firebase Console](https://console.firebase.google.com)
   - Crie um novo projeto ou selecione existente

2. **Ativar Authentication**
   - Menu lateral > Authentication > Get Started
   - Sign-in method > Email/Password > Enable

3. **Configurar Firestore**
   - Menu lateral > Firestore Database > Create Database
   - Start in production mode
   - Escolha localização mais próxima

4. **Criar Collections**
   - Collection `colaboradores`
   - Collection `departamentos`

5. **Configurar Regras de Segurança**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Colaboradores
    match /colaboradores/{document=**} {
      allow read: if request.auth != null 
        && (resource == null || resource.data.userId == request.auth.uid);
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null
        && resource.data.userId == request.auth.uid;
    }
    
    // Departamentos
    match /departamentos/{document=**} {
      allow read: if request.auth != null 
        && (resource == null || resource.data.userId == request.auth.uid);
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null
        && resource.data.userId == request.auth.uid;
    }
  }
}
```

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── colaboradores/   # Componentes de colaboradores
│   ├── departamentos/   # Componentes de departamentos
│   ├── layout/         # Layout (Sidebar, TopBar)
│   └── PrivateRoute.tsx # Proteção de rotas
├── config/             # Configurações
│   └── firebase.ts     # Config Firebase
├── contexts/           # Contexts do React
│   └── AuthContext.tsx # Contexto de autenticação
├── hooks/              # Custom hooks
│   ├── useColaboradores.ts
│   └── useDepartamentos.ts
├── pages/              # Páginas da aplicação
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── ForgotPassword.tsx
│   ├── NotFound.tsx
│   ├── UserProfile.tsx # Página de perfil do usuário
│   ├── Settings.tsx    # Página de configurações
│   └── Departamentos.tsx
├── types/              # TypeScript types
│   ├── colaborador.ts
│   └── departamento.ts
├── App.tsx             # Componente principal
└── main.tsx           # Entry point
```

## 🔧 Uso

### Primeiro Acesso
1. Clique em "Cadastre-se" na tela de login
2. Preencha seus dados
3. Confirme o cadastro
4. Faça login com suas credenciais

### Gerenciar Perfil do Usuário
1. **Via TopBar**: Clique no avatar → "Meu Perfil"
2. **Via Sidebar**: Seção "CONTA" → "Meu Perfil"
3. Edite seu nome de exibição clicando em "Editar"
4. Visualize informações da conta (verificação, datas, ID)

### Configurações do Sistema
1. **Via TopBar**: Clique no avatar → "Configurações"
2. **Via Sidebar**: Seção "CONTA" → "Configurações"
3. Configure notificações, privacidade e aparência
4. Salve as configurações ou restaure os padrões

### Cadastrar Colaborador
1. Clique em "Novo Colaborador"
2. Preencha os dados em 4 etapas
3. Revise as informações
4. Confirme o cadastro

### Criar Departamento
1. Acesse "Departamentos" no menu lateral
2. Clique em "Novo Departamento"
3. Defina nome, gestor e colaboradores
4. Salve o departamento

### Transferir Colaborador
1. Edite um departamento
2. Adicione colaboradores de outros departamentos
3. Note o indicador de transferência
4. Confirme para efetivar

## 🚀 Deploy

### Vercel (Recomendado)

1. **Via GitHub**
```bash
# Push para GitHub
git push origin main

# No Vercel
- Import Git Repository
- Configure Environment Variables
- Deploy
```

2. **Via CLI**
```bash
npm i -g vercel
vercel
```

### Build Local
```bash
npm run build
npm run preview
```

## 💻 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento com hot-reload
npm run build    # Build para produção
npm run preview  # Preview do build
```

## 📝 Modelo de Dados

### Colaborador
```typescript
interface Colaborador {
  id?: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  cargo: string;
  dataAdmissao: string;
  nivelHierarquico: 'junior' | 'pleno' | 'senior' | 'gestor';
  gestorResponsavel?: string;
  salarioBase: number;
  departamento: string;
  departamentoId?: string;
  status: 'ativo' | 'inativo' | 'ferias' | 'afastado';
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  userId?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
```

### Departamento
```typescript
interface Departamento {
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
```

## 🗺️ Rotas da Aplicação

### Rotas Públicas
- `/login` - Página de login
- `/register` - Cadastro de novos usuários
- `/forgot-password` - Recuperação de senha

### Rotas Privadas (Requer autenticação)
- `/` - Dashboard principal (lista de colaboradores)
- `/departamentos` - Gestão de departamentos
- `/perfil` - Página de perfil do usuário
- `/configuracoes` - Configurações do sistema
- `/404` - Página não encontrada

## 🐛 Troubleshooting

### Firebase não conecta
- Verifique as variáveis no `.env`
- Confirme que começam com `VITE_`
- Verifique se Authentication está ativo

### Erro ao criar usuário
- Verifique se Email/Password está habilitado
- Senha deve ter mínimo 6 caracteres
- Email deve ser válido

### Dados não aparecem
- Verifique as regras do Firestore
- Confirme o `userId` nos documentos
- Verifique console do navegador (F12)

### Perfil não atualiza
- Confirme que `updateUserProfile` está funcionando
- Verifique se o Firebase Auth permite alterações
- Recarregue a página após alterações

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autor

**Tiago Rahal Aires**
- GitHub: [@tiagorahal](https://github.com/tiagorahal)
- LinkedIn: [tiagorahal](https://www.linkedin.com/in/tiagorahal/)
- Email: rahal.aires@gmail.com

---

⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!