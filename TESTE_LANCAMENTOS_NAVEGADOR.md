# 🧪 TESTE DE LANÇAMENTOS - NAVEGADOR

## 🎯 TESTE DIRETO NO CONSOLE DO NAVEGADOR

Vamos testar se o problema é no código ou no banco de dados.

### 📋 PASSO A PASSO

1. **Abra o app:**
   - Acesse: http://localhost:8080
   - Faça login

2. **Abra o Console:**
   - Pressione `F12`
   - Vá na aba **Console**

3. **Cole e execute este código:**

```javascript
// Teste de criação de lançamento
(async () => {
  console.log('🧪 Iniciando teste de lançamento...');
  
  // Pegar o supabase client
  const { supabase } = await import('/src/integrations/supabase/client.ts');
  
  // Verificar sessão
  const { data: { session } } = await supabase.auth.getSession();
  console.log('👤 User ID:', session?.user?.id);
  
  if (!session) {
    console.error('❌ Não está logado!');
    return;
  }
  
  // Dados do teste
  const lancamentoTeste = {
    data: new Date().toISOString().split('T')[0],
    tipo: 'receita',
    categoria: 'Vendas',
    valor: 1000.00,
    descricao: 'Teste via console',
    observacoes: 'Teste manual',
    user_id: session.user.id,
    status: 'confirmado',
    recorrente: false,
  };
  
  console.log('📦 Dados:', lancamentoTeste);
  
  // Tentar inserir
  const { data, error } = await supabase
    .from('lancamentos')
    .insert([lancamentoTeste])
    .select()
    .single();
  
  if (error) {
    console.error('❌ ERRO:', error);
    console.error('📋 Mensagem:', error.message);
    console.error('📋 Detalhes:', error.details);
    console.error('📋 Hint:', error.hint);
    console.error('📋 Code:', error.code);
  } else {
    console.log('✅ SUCESSO!', data);
  }
})();
```

4. **Analise o resultado:**

### ✅ SE DER SUCESSO

Você verá:
```
✅ SUCESSO! { id: "...", data: "...", ... }
```

**Significa:** O banco está OK, o problema é no código do formulário.

### ❌ SE DER ERRO

Você verá algo como:
```
❌ ERRO: { message: "...", code: "...", ... }
```

**Copie TODO o erro e me envie!**

## 🔍 ERROS COMUNS

### Erro: "column does not exist"
**Problema:** Coluna faltando na tabela
**Solução:** Migration não foi aplicada no Lovable

### Erro: "permission denied" ou "policy"
**Problema:** Política RLS bloqueando
**Solução:** Políticas RLS precisam ser atualizadas

### Erro: "violates check constraint"
**Problema:** Valor inválido em algum campo
**Solução:** Verificar constraints da tabela

### Erro: "null value in column"
**Problema:** Campo obrigatório está null
**Solução:** Verificar quais campos são NOT NULL

## 📝 DEPOIS DO TESTE

Me envie:
1. ✅ ou ❌ (funcionou ou não)
2. Se deu erro, copie TODO o erro
3. Print da tela se possível

Com isso vou saber exatamente onde está o problema!

---

**Faça o teste agora e me avise! 🚀**
