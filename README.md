# Sistema de Gestão de Colaboradores

Sistema completo de gestão de recursos humanos com cadastro, edição e exclusão de colaboradores, desenvolvido com React, TypeScript, Material-UI e Firebase.

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
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Uso](#-uso)
- [Deploy](#-deploy)

[**Demo ao vivo**](https://registration-form-omega-seven.vercel.app/)

## ✨ Funcionalidades

### Implementadas ✅

#### Cadastro Completo
- **Stepper de 4 etapas** com validação progressiva:
  1. **Dados Pessoais**: Nome, email, CPF, telefone, data de nascimento
  2. **Informações Profissionais**: Cargo, admissão, nível hierárquico, gestor, salário
  3. **Endereço**: CEP, logradouro, número, bairro, cidade, estado
  4. **Revisão**: Conferência antes de salvar

#### Gestão de Colaboradores
- ✅ **Listagem completa** com avatares personalizados
- ✅ **Edição de dados** com formulário pré-preenchido
- ✅ **Exclusão individual** com confirmação
- ✅ **Atualização automática** após operações

#### Funcionalidades Profissionais
- ✅ **Níveis hierárquicos**: Júnior, Pleno, Sênior, Gestor
- ✅ **Vínculo com gestor** via autocomplete inteligente
- ✅ **Departamentos**: Design, TI, Marketing, Produto, Vendas, RH, Financeiro, Operações
- ✅ **Status**: Ativo, Inativo, Férias, Afastado

#### Interface & UX
- ✅ **Design responsivo** com Material-UI
- ✅ **Feedback visual** com snackbars
- ✅ **Loading states** durante operações
- ✅ **Validações em tempo real**
- ✅ **Dialog de confirmação** para exclusões

### Em Desenvolvimento 🚧
- [ ] Autenticação com Firebase Auth (JWT)
- [ ] Exclusão em massa
- [ ] Filtros de busca avançados
- [ ] Gestão de departamentos
- [ ] Página 404 customizada
- [ ] Sistema de permissões

## 🛠 Tecnologias

### Core
- **React 18.2** - Biblioteca UI
- **TypeScript 5.0** - Type safety
- **Vite 5.0** - Build tool

### UI/UX
- **Material-UI 5.14** - Componentes
- **Material Icons** - Ícones
- **Emotion** - Styled components

### Backend
- **Firebase Firestore** - Database NoSQL
- **Firebase Auth** - Autenticação (planejado)

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta Firebase

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

3. **Configure o Firebase**

Crie um projeto no [Firebase Console](https://console.firebase.google.com) e ative o Firestore.

4. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz:
```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

5. **Execute o projeto**
```bash
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

## 📁 Estrutura do Projeto

```
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx        # Barra lateral
│   │   │   └── TopBar.tsx         # Barra superior
│   │   └── colaboradores/
│   │       ├── StepperCadastro.tsx # Form multi-step
│   │       └── ListaColaboradores.tsx # Tabela
│   ├── config/
│   │   └── firebase.ts            # Config Firebase
│   ├── hooks/
│   │   └── useColaboradores.ts    # Hook principal
│   ├── types/
│   │   └── colaborador.ts         # Tipos TypeScript
│   ├── App.tsx                    # Componente raiz
│   └── main.tsx                   # Entry point
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔧 Uso

### Cadastrar Colaborador
1. Clique em "Novo Colaborador"
2. Preencha os dados em 4 etapas
3. Revise e salve

### Editar Colaborador
1. Clique no ícone de edição (lápis azul)
2. Modifique os dados necessários
3. Clique em "Atualizar"

### Excluir Colaborador
1. Clique no ícone de lixeira (vermelho)
2. Confirme no dialog
3. Colaborador removido

## 📊 Modelo de Dados

```typescript
interface Colaborador {
  id?: string;
  // Dados Pessoais
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  
  // Informações Profissionais
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
  
  // Administrativo
  departamento: string;
  status: 'ativo' | 'inativo' | 'ferias' | 'afastado';
}
```

## 🚀 Deploy

### Vercel (Recomendado)

1. **Via CLI**:
```bash
npm i -g vercel
vercel
```

2. **Via GitHub**:
- Importe o projeto no Vercel
- Configure as variáveis de ambiente
- Deploy automático!

### Build Local
```bash
npm run build
npm run preview
```

## 🔒 Segurança

### Regras Firestore para Produção
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /colaboradores/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
        && request.auth.token.admin == true;
    }
  }
}
```

## 💻 Scripts

```bash
npm run dev      # Desenvolvimento
npm run build    # Build produção
npm run preview  # Preview build
npm run lint     # Linter
```

## 🧪 Testes

### Funcionalidades para testar:
1. ✅ Cadastro completo com todos os campos
2. ✅ Validações em cada etapa
3. ✅ Autocomplete de gestor
4. ✅ Edição mantém dados
5. ✅ Exclusão com confirmação
6. ✅ Lista atualiza automaticamente

## 🐛 Troubleshooting

### Firebase não conecta
- Verifique o arquivo `.env`
- Confirme que variáveis começam com `VITE_`
- Verifique se Firestore está ativo

### Dados não aparecem
- Verifique console (F12)
- Nome da coleção: `colaboradores`
- Verifique regras do Firestore

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 👥 Autor

**Tiago Rahal**
- GitHub: [@tiagorahal](https://github.com/tiagorahal)
- LinkedIn: [tiagorahal](https://www.linkedin.com/in/tiagorahal/)
- Email: rahal.aires@gmail.com

---
