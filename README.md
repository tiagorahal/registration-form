# 🚀 Flugo - Sistema de Cadastro de Funcionários

Sistema completo de cadastro de funcionários com formulário multi-step, desenvolvido em ReactJS com TypeScript, Material UI e Firebase Firestore.

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![React](https://img.shields.io/badge/React-18.2-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)
![Material-UI](https://img.shields.io/badge/Material--UI-5.14-purple.svg)
![Firebase](https://img.shields.io/badge/Firebase-10.7-orange.svg)

## ✨ Demonstração

### 🎨 Interface Principal
- **Lista de Colaboradores**: Visualização em tabela com avatares personalizados
- **Formulário Multi-step**: Cadastro em 2 etapas com validação em tempo real
- **Design Responsivo**: Interface adaptável para desktop e mobile
- **Feedback Visual**: Loading states, snackbar notifications e validações visuais

## 🛠 Tecnologias Utilizadas

- **[React 18](https://reactjs.org/)** - Biblioteca JavaScript para construção de interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[Material UI v5](https://mui.com/)** - Biblioteca de componentes React seguindo Material Design
- **[Firebase Firestore](https://firebase.google.com/docs/firestore)** - Banco de dados NoSQL em tempo real
- **[Vite](https://vitejs.dev/)** - Build tool rápido e moderno

## 📋 Funcionalidades

### ✅ Implementadas
- ✅ **Cadastro de Funcionários** com formulário multi-step intuitivo
- ✅ **Persistência de Dados** com Firebase Firestore
- ✅ **Validação em Tempo Real** com feedback visual
- ✅ **Loading States** durante operações assíncronas
- ✅ **Notificações Snackbar** para feedback de ações
- ✅ **Estado Vazio** quando não há funcionários cadastrados
- ✅ **Interface Responsiva** com Material UI
- ✅ **Avatares Coloridos** com iniciais dos nomes
- ✅ **Status Ativo/Inativo** com visual chips

### 📊 Dados do Funcionário
- **Nome**: Mínimo 3 caracteres
- **Email**: Validação de formato
- **Departamento**: Seleção obrigatória
- **Status**: Ativo ou Inativo

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 16+ instalado
- Conta no Firebase (gratuita)
- Git

### 1. Clone o Repositório
```bash
git clone https://github.com/tiagorahal/registration-form.git
cd registration-form
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure o Firebase

#### 3.1 Crie um Projeto no Firebase Console
1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em "Adicionar projeto"
3. Nome: `flugo-employee-registration`
4. Desative Google Analytics (não necessário)
5. Clique em "Criar projeto"

#### 3.2 Ative o Firestore Database
1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste"
4. Selecione localização: `southamerica-east1` (São Paulo)
5. Clique em "Ativar"

#### 3.3 Obtenha as Credenciais
1. Vá para Configurações do Projeto (⚙️)
2. Role até "Seus aplicativos"
3. Clique em "</>" para adicionar app Web
4. Registre com nome: `flugo-web`
5. Copie as configurações

### 4. Configure as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

### 5. Execute o Projeto
```bash
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

## 📁 Estrutura do Projeto

```
flugo-employee-registration/
├── src/
│   ├── App.tsx              # Componente principal (monolítico)
│   ├── main.tsx             # Ponto de entrada
│   └── vite-env.d.ts        # Tipos TypeScript para Vite
├── public/
├── .env                     # Variáveis de ambiente (não commitado)
├── .env.example             # Exemplo de variáveis
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🧪 Como Testar

### Teste Local
1. Execute `npm run dev`
2. Clique em "Novo Colaborador"
3. Preencha o formulário em 2 etapas
4. Verifique se salvou no Firebase Console

### Build de Produção
```bash
npm run build
npm run preview
```

## 🌐 Deploy

### Deploy no Vercel (Recomendado)

1. **Via Interface Web**:
   - Acesse [vercel.com](https://vercel.com)
   - Importe o projeto do GitHub
   - Configure as variáveis de ambiente
   - Deploy automático!

2. **Via CLI**:
   ```bash
   npm i -g vercel
   vercel
   ```

### Variáveis de Ambiente no Vercel
No dashboard do Vercel, adicione todas as variáveis `VITE_FIREBASE_*`

## 🔒 Segurança

### Regras do Firestore
Para produção, atualize as regras no Firebase Console:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /employees/{document=**} {
      allow read: if true;
      allow create: if request.resource.data.name is string &&
                      request.resource.data.name.size() >= 3 &&
                      request.resource.data.email.matches('.*@.*\\..*') &&
                      request.resource.data.department is string &&
                      request.resource.data.active is bool;
      allow update, delete: if false; // Desabilitado por enquanto
    }
  }
}
```

## 💻 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run preview  # Preview da build
npm run lint     # Linter
```

## 🎯 Requisitos Atendidos

- ✅ ReactJS com TypeScript
- ✅ Material UI para estilização
- ✅ Formulário multi-step funcional
- ✅ Persistência via Firebase
- ✅ Validações com feedback visual
- ✅ README com instruções claras
- ✅ Projeto hospedável em servidor remoto
- ✅ Repositório público no GitHub

## 🐛 Solução de Problemas

### Erro: "Property 'env' does not exist on type 'ImportMeta'"
Este é um erro conhecido do TypeScript com Vite. A solução está implementada no código usando `@ts-ignore`.

### Firebase não conecta
- Verifique se o arquivo `.env` existe
- Confirme que as variáveis começam com `VITE_`
- Verifique se o Firestore está ativado

### Dados não aparecem
- Verifique o console do navegador (F12)
- Confirme o nome da coleção: `employees`
- Verifique as regras do Firestore

## 👨‍💻 Desenvolvimento

### Commits Semânticos
O projeto segue o padrão de commits semânticos:
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Tarefas gerais

### Branches
- `main` - Produção
- `develop` - Desenvolvimento
- `feature/*` - Novas funcionalidades

## 📄 Licença

Este projeto foi desenvolvido como desafio técnico para a **Flugo**.

## 🙏 Agradecimentos

- **Flugo** - Pela oportunidade do desafio
- **Material UI** - Pelos componentes incríveis
- **Firebase** - Pela infraestrutura robusta
- **Vite** - Pela performance no desenvolvimento

## 📞 Contato

**[Seu Nome]**
- GitHub: [@seu-usuario](https://github.com/tiagorahal)
- LinkedIn: [seu-perfil](https://www.linkedin.com/in/tiagorahal/)
- Email: rahal.aires@gmail.com

---