# 📧 CONFIGURAÇÃO DE EMAIL CUSTOMIZADO - SUPABASE

## 🎯 OBJETIVO

Configurar o email **contato@empresazul.com** como remetente de todos os emails do sistema:
- Redefinição de senha
- Confirmação de email
- Links de acesso
- Convites de usuários

## 📋 PRÉ-REQUISITOS

### 1. Domínio Configurado
- ✅ Domínio: empresazul.com
- ✅ Email: contato@empresazul.com
- ✅ Senha do email

### 2. Servidor SMTP
Você precisa das informações do seu provedor de email:
- Host SMTP
- Porta SMTP
- Usuário SMTP
- Senha SMTP

## 🔧 CONFIGURAÇÃO NO SUPABASE DASHBOARD

### Passo 1: Acessar o Dashboard

1. Acesse: https://supabase.com/dashboard
2. Faça login
3. Selecione seu projeto FluxoAzul

### Passo 2: Configurar SMTP

1. No menu lateral, vá em: **Settings** (⚙️)
2. Clique em: **Auth**
3. Role até: **SMTP Settings**
4. Clique em: **Enable Custom SMTP**

### Passo 3: Preencher Dados SMTP

#### Opção A: Gmail (Recomendado para testes)
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: contato@empresazul.com
SMTP Password: [senha de app do Gmail]
Sender Email: contato@empresazul.com
Sender Name: FluxoAzul - Gestão Financeira
```

**Nota:** Para Gmail, você precisa criar uma "Senha de App":
1. Acesse: https://myaccount.google.com/apppasswords
2. Crie uma senha de app para "Mail"
3. Use essa senha no campo SMTP Password

#### Opção B: Provedor de Email Profissional
```
SMTP Host: mail.empresazul.com (ou smtp.empresazul.com)
SMTP Port: 587 (TLS) ou 465 (SSL)
SMTP User: contato@empresazul.com
SMTP Password: [sua senha]
Sender Email: contato@empresazul.com
Sender Name: FluxoAzul - Gestão Financeira
```

#### Opção C: SendGrid (Recomendado para produção)
```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Password: [sua API key do SendGrid]
Sender Email: contato@empresazul.com
Sender Name: FluxoAzul - Gestão Financeira
```

#### Opção D: Mailgun
```
SMTP Host: smtp.mailgun.org
SMTP Port: 587
SMTP User: postmaster@mg.empresazul.com
SMTP Password: [sua senha do Mailgun]
Sender Email: contato@empresazul.com
Sender Name: FluxoAzul - Gestão Financeira
```

### Passo 4: Configurar Templates de Email

1. No menu **Auth**, role até: **Email Templates**
2. Você verá 4 templates:
   - Confirm signup
   - Invite user
   - Magic Link
   - Reset password

3. Para cada template:
   - Clique em **Edit**
   - Copie o conteúdo do arquivo correspondente em `supabase/templates/`
   - Cole no editor
   - Clique em **Save**

#### Mapeamento dos Templates:

| Template no Dashboard | Arquivo Local |
|----------------------|---------------|
| Confirm signup | `email-confirmation.html` |
| Invite user | `email-invite.html` |
| Magic Link | `email-magic-link.html` |
| Reset password | `email-reset-password.html` |

### Passo 5: Testar Configuração

1. No Dashboard, vá em: **Auth** > **Users**
2. Clique em: **Invite user**
3. Digite um email de teste
4. Clique em: **Send invite**
5. Verifique se o email chegou com o remetente correto

## 🧪 TESTE COMPLETO

### Teste 1: Redefinição de Senha

1. Acesse o app: http://localhost:8080
2. Clique em "Esqueci minha senha"
3. Digite seu email
4. Clique em "Enviar Link"
5. Verifique:
   - ✅ Email chegou
   - ✅ Remetente: contato@empresazul.com
   - ✅ Nome: FluxoAzul - Gestão Financeira
   - ✅ Link funciona

### Teste 2: Confirmação de Email

1. Crie uma nova conta
2. Verifique o email de confirmação
3. Confirme:
   - ✅ Email chegou
   - ✅ Remetente correto
   - ✅ Template bonito
   - ✅ Link funciona

### Teste 3: Convite de Usuário

1. No Dashboard, convide um usuário
2. Verifique o email
3. Confirme:
   - ✅ Email chegou
   - ✅ Remetente correto
   - ✅ Template bonito
   - ✅ Link funciona

## 🔒 SEGURANÇA

### Boas Práticas

1. **Nunca commite senhas no código**
   - ✅ Configuração via Dashboard
   - ✅ Variáveis de ambiente seguras

2. **Use senhas de app**
   - ✅ Gmail: Senha de app
   - ✅ Outros: API keys

3. **Monitore envios**
   - ✅ Verifique logs no Dashboard
   - ✅ Configure alertas

4. **Limite de envios**
   - ✅ Configure rate limiting
   - ✅ Evite spam

## 📊 MONITORAMENTO

### Ver Logs de Email

1. No Dashboard, vá em: **Logs**
2. Filtre por: **Auth**
3. Procure por: **email_sent**
4. Verifique:
   - Status de envio
   - Erros
   - Destinatários

### Métricas Importantes

- Taxa de entrega
- Taxa de abertura
- Taxa de cliques
- Bounces (emails devolvidos)
- Spam reports

## 🚨 TROUBLESHOOTING

### Email não chega

**Problema:** Email não é recebido

**Soluções:**
1. Verifique a pasta de spam
2. Verifique as credenciais SMTP
3. Teste com outro email
4. Verifique logs no Dashboard
5. Confirme que o domínio está verificado

### Email vai para spam

**Problema:** Emails caem na pasta de spam

**Soluções:**
1. Configure SPF record no DNS
2. Configure DKIM no DNS
3. Configure DMARC no DNS
4. Use um provedor confiável (SendGrid, Mailgun)
5. Evite palavras de spam no assunto

### Erro de autenticação SMTP

**Problema:** Erro ao conectar no SMTP

**Soluções:**
1. Verifique usuário e senha
2. Verifique a porta (587 ou 465)
3. Verifique se TLS/SSL está correto
4. Para Gmail, use senha de app
5. Verifique firewall

## 📝 CONFIGURAÇÃO DNS (Opcional mas Recomendado)

### SPF Record
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com ~all
```

### DKIM Record
```
Type: TXT
Name: default._domainkey
Value: [fornecido pelo seu provedor]
```

### DMARC Record
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:contato@empresazul.com
```

## 🎯 CHECKLIST FINAL

- [ ] SMTP configurado no Supabase Dashboard
- [ ] Email de remetente: contato@empresazul.com
- [ ] Nome de remetente: FluxoAzul - Gestão Financeira
- [ ] Templates atualizados (4 templates)
- [ ] Teste de redefinição de senha OK
- [ ] Teste de confirmação de email OK
- [ ] Teste de convite de usuário OK
- [ ] Emails não vão para spam
- [ ] DNS configurado (SPF, DKIM, DMARC)
- [ ] Monitoramento ativo

## 📧 TEMPLATES DISPONÍVEIS

Os templates já estão prontos em:
- `supabase/templates/email-confirmation.html`
- `supabase/templates/email-invite.html`
- `supabase/templates/email-magic-link.html`
- `supabase/templates/email-reset-password.html`

Todos com:
- ✅ Design profissional
- ✅ Marca FluxoAzul
- ✅ Responsivos
- ✅ Acessíveis
- ✅ Texto em português

## 🎉 RESULTADO ESPERADO

Após a configuração:
- ✅ Todos os emails saem de: contato@empresazul.com
- ✅ Nome exibido: FluxoAzul - Gestão Financeira
- ✅ Templates bonitos e profissionais
- ✅ Alta taxa de entrega
- ✅ Não vão para spam
- ✅ Links funcionam perfeitamente

---

**Configuração profissional de emails! 📧✨**
