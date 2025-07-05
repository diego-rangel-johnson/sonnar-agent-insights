#!/bin/bash
# 🚀 Script de Deploy para GitHub - Sonnar Agent Insights

echo "🚀 Iniciando deploy para GitHub..."

# Verificar se há mudanças
if [[ -z $(git status -s) ]]; then
    echo "❌ Nenhuma mudança detectada"
    exit 1
fi

# Adicionar arquivos
echo "📦 Adicionando arquivos..."
git add .

# Solicitar mensagem de commit
echo "💬 Digite a mensagem do commit:"
read -r commit_message

# Fazer commit
echo "✅ Fazendo commit..."
git commit -m "$commit_message"

# Push para GitHub
echo "📤 Enviando para GitHub..."
git push origin main

echo "🎉 Deploy concluído com sucesso!"
echo "🔗 Repositório: https://github.com/diego-rangel-johnson/sonnar-agent-insights"
