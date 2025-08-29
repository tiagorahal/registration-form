# Flugo - Sistema de Cadastro de Funcionários

Sistema de cadastro de funcionários com formulário multi-step desenvolvido em ReactJS com TypeScript e Material UI.

## 🚀 Tecnologias Utilizadas

- ReactJS 18
- TypeScript
- Material UI v5
- Vite

## 📋 Pré-requisitos

- Node.js (v16 ou superior)
- npm ou yarn

## 🔧 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/tiagorahal/registration-form.git
cd registration-form
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute o projeto
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## 🎨 Funcionalidades Implementadas

- ✅ Listagem de funcionários
- ✅ Formulário multi-step com 2 etapas
  - Etapa 1: Informações Básicas (Nome, Email, Status)
  - Etapa 2: Informações Profissionais (Departamento)
- ✅ Validação de campos obrigatórios
- ✅ Feedback visual de erros
- ✅ Indicador de progresso visual
- ✅ Interface com Material UI
- ✅ Design responsivo
- ✅ Tema customizado

## 📁 Estrutura do Projeto

```
src/
├── App.tsx          # Componente principal com toda a lógica
├── main.tsx         # Ponto de entrada da aplicação
└── index.html       # HTML base
```

## 🎯 Próximas Implementações

- [ ] Integração com Firebase para persistência de dados
- [ ] Loading states durante operações
- [ ] Notificações toast/snackbar
- [ ] Edição de funcionários
- [ ] Exclusão de funcionários
- [ ] Filtros e busca na lista

## 💻 Scripts Disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Cria a versão de produção
npm run preview  # Visualiza a versão de produção localmente
```

## 🔄 Status do Projeto

**Versão:** 0.5.0  
**Status:** Em desenvolvimento

Este projeto está em fase de desenvolvimento. A interface está completa com Material UI, mas ainda utiliza dados mockados localmente. A próxima fase incluirá integração com Firebase para persistência real dos dados.

## 👨‍💻 Autor

[Seu Nome]

## 📄 Licença

Este projeto foi desenvolvido como desafio técnico para a Flugo.
