#!/bin/bash

echo "🚀 Iniciando setup do projeto Flugo Employee Registration..."

# Criar estrutura de pastas
echo "📁 Criando estrutura de pastas..."
mkdir -p src

# Criar arquivos básicos
echo "📝 Criando arquivos do projeto..."

# Verificar se os arquivos já existem
if [ ! -f "package.json" ]; then
    echo "✅ Criando package.json"
    # Copie o conteúdo do package.json básico aqui
fi

if [ ! -f "src/App.tsx" ]; then
    echo "✅ Criando App.tsx"
    # Copie o conteúdo do App.tsx básico aqui
fi

if [ ! -f "src/main.tsx" ]; then
    echo "✅ Criando main.tsx"
    # Copie o conteúdo do main.tsx aqui
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Inicializar git
if [ ! -d ".git" ]; then
    echo "🎯 Inicializando repositório Git..."
    git init
    git add .
    git commit -m "Initial commit - Basic React setup with Vite and TypeScript"
fi

echo "✨ Setup completo! Execute 'npm run dev' para iniciar o projeto."