# 🔗 Integrações do Projeto SFA_2025

## ✅ Integrações Ativas

### 1. **GitHub** 
- **Repositório**: https://github.com/EmpresAzul/SFA_2025.git
- **Branch**: main
- **Função**: Versionamento e sincronização de código

### 2. **Lovable.dev**
- **Configuração**: `lovable.config.js` e `.lovable.json`
- **Função**: Sincronização automática e deploy
- **Comandos**: 
  - `npm run sync:lovable` - Sincronização manual
  - `npm run deploy:lovable` - Build + Deploy

## ❌ Integrações Removidas

### Vercel
- **Status**: Completamente removida
- **Arquivos removidos**:
  - `vercel.json`
  - `.vercel/`
  - `.github/workflows/deploy.yml`

## 🚫 Integrações Ignoradas

- **Netlify**: Configurado mas não ativo
- **Vercel**: Completamente removida
- **Outras plataformas**: Não configuradas

## 📋 Fluxo de Trabalho

1. **Desenvolvimento Local** → `npm run dev`
2. **Commit** → `git add . && git commit -m "mensagem"`
3. **Push GitHub** → `git push origin main`
4. **Sincronização Lovable** → Automática via GitHub

## 🔧 Comandos Importantes

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Sincronização com Lovable
npm run sync:lovable

# Deploy completo
npm run deploy:lovable
```

---

**Última atualização**: $(date)
**Status**: ✅ Apenas GitHub e Lovable.dev ativos 