# ⚡ AÇÃO IMEDIATA - Configurar Email Customizado

## 🎯 OBJETIVO

Configurar **contato@empresazul.com** como remetente de todos os emails do sistema.

## 📋 VOCÊ PRECISA FAZER (10 minutos)

### Passo 1: Acessar Supabase (2 min)

1. Acesse: https://supabase.com/dashboard
2. Faça login
3. Selecione seu projeto

### Passo 2: Configurar SMTP (5 min)

1. Vá em: **Settings** > **Auth**
2. Role até: **SMTP Settings**
3. Clique em: **Enable Custom SMTP**
4. Preencha:

#### Se usar Gmail:
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: contato@empresazul.com
SMTP Password: [senha de app do Gmail]
Sender Email: contato@empresazul.com
Sender Name: FluxoAzul - Gestão Financeira
```

**Como criar senha de app no Gmail:**
1. Acesse: https://myaccount.google.com/apppasswords
2. Crie senha para "Mail"
3. Use essa senha

#### Se usar outro provedor:
```
SMTP Host: [seu servidor SMTP]
SMTP Port: 587
SMTP User: contato@empresazul.com
SMTP Password: [sua senha]
Sender Email: contato@empresazul.com
Sender Name: FluxoAzul - Gestão Financeira
```

5. Clique em: **Save**

### Passo 3: Atualizar Templates (3 min)

1. No menu **Auth**, role até: **Email Templates**
2. Para cada template (4 no total):
   - Clique em **Edit**
   - Copie o conteúdo do arquivo em `supabase/templates/`
   - Cole no editor
   - Clique em **Save**

**Templates:**
- Confirm signup → `email-confirmation.html`
- Invite user → `email-invite.html`
- Magic Link → `email-magic-link.html`
- Reset password → `email-reset-password.html`

### Passo 4: Testar (2 min)

1. No app, clique em "Esqueci minha senha"
2. Digite seu email
3. Verifique se o email chegou
4. Confirme:
   - ✅ Remetente: contato@empresazul.com
   - ✅ Nome: FluxoAzul - Gestão Financeira
   - ✅ Template bonito
   - ✅ Link funciona

## 🚨 SE DER ERRO

### Email não chega

1. Verifique spam
2. Verifique credenciais SMTP
3. Veja logs no Dashboard (Logs > Auth)
4. Teste com outro email

### Erro de autenticação

1. Para Gmail: use senha de app
2. Verifique usuário e senha
3. Verifique porta (587 ou 465)
4. Tente outro provedor

## 📝 INFORMAÇÕES NECESSÁRIAS

Você precisa ter:
- [ ] Email: contato@empresazul.com
- [ ] Senha do email (ou senha de app)
- [ ] Servidor SMTP do seu provedor
- [ ] Porta SMTP (geralmente 587)

## 🎯 RESULTADO

Após configurar:
- ✅ Emails saem de: contato@empresazul.com
- ✅ Nome: FluxoAzul - Gestão Financeira
- ✅ Templates profissionais
- ✅ Funcionando perfeitamente

## 📚 DOCUMENTAÇÃO COMPLETA

Para mais detalhes, veja:
- `CONFIGURACAO_EMAIL_SUPABASE.md` - Guia completo
- `supabase/templates/` - Templates prontos

---

**Configure agora e tenha emails profissionais! 📧✨**

**Tempo total: ~10 minutos**
