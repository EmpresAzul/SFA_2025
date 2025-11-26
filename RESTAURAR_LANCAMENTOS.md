# 🔄 Como Restaurar os Lançamentos Financeiros

## Problema Identificado
O banco de dados está vazio - não há nenhum lançamento cadastrado. Por isso a aba está mostrando tudo zerado.

## Solução: Restaurar Lançamentos

### Opção 1: Usar o Script Automático (Recomendado)

1. Abra o terminal na pasta do projeto
2. Execute o comando:
   ```bash
   node restaurar_lancamentos.js
   ```
3. Digite seu email e senha quando solicitado
4. O script irá criar 7 lançamentos de exemplo:
   - 5 receitas (total: R$ 43.500,00)
   - 2 despesas (total: R$ 35.000,00)
   - Saldo: R$ 8.250,00

### Opção 2: Criar Manualmente no Supabase

1. Acesse o Supabase Dashboard
2. Vá em "SQL Editor"
3. Copie e cole o conteúdo do arquivo `criar_lancamentos_exemplo.sql`
4. **IMPORTANTE:** Substitua `'SEU_USER_ID_AQUI'` pelo seu User ID real
5. Para pegar seu User ID:
   - Execute primeiro: `SELECT id, email FROM auth.users LIMIT 5;`
   - Copie o ID correspondente ao seu email
6. Execute o script

### Opção 3: Criar Através da Interface

1. Acesse a aba "Lançamentos" no sistema
2. Clique em "Novo Lançamento"
3. Preencha os dados e salve
4. Repita para criar vários lançamentos

## Verificar se Funcionou

Após restaurar os lançamentos:

1. Recarregue a página de Lançamentos (F5)
2. Você deverá ver:
   - Total de Lançamentos: 7
   - Receitas: R$ 43.250,00
   - Despesas: R$ 35.000,00
   - Saldo Atual: R$ 8.250,00

## Scripts Disponíveis

- `verificar_lancamentos_db.js` - Verifica quantos lançamentos existem no banco
- `restaurar_lancamentos.js` - Restaura lançamentos de exemplo
- `criar_lancamentos_exemplo.sql` - SQL para criar lançamentos manualmente

## Logs de Debug

Os logs de debug foram adicionados temporariamente para investigar o problema.
Após confirmar que está funcionando, eles serão removidos.

## Próximos Passos

Depois de restaurar os lançamentos:
1. Teste criar um novo lançamento
2. Teste editar um lançamento existente
3. Teste excluir um lançamento
4. Verifique se o Dashboard está sendo atualizado automaticamente
