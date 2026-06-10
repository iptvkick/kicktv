# Spec 006: Asaas Deep Integration & Admin Fixes - Research (RPI-R)

## O Problema do Vídeo (Admin Travado)
Assisti ao vídeo e identifiquei perfeitamente as duas catástrofes simultâneas deixadas pelas execuções passadas:
1. **Erro de Backend (403 Forbidden):** O painel direito do DevTools está inundado de erros vermelhos do Supabase. As policies de RLS foram configuradas de forma errada pelo `database-engineer` ou o seu usuário não foi inserido na tabela `user_roles` como `'admin'`. Logo, o banco bloqueia a leitura das listas.
2. **Erro de Frontend (Read-Only Form):** O console exibe o erro explícito: `You provided a 'value' prop to a form field without an 'onChange' handler`. O `frontend-engineer` removeu os mocks de arrays, mas falhou em adicionar os setters no React.

## Pesquisa: Arquitetura Asaas (REST API v3)
Baseado na documentação oficial (`https://docs.asaas.com/reference/comece-por-aqui`), faremos a integração profunda via **Supabase Edge Functions**:
1. **Customers:** O Trial Grátis de 4 horas roda 100% no KickTV (local). Mas, quando o usuário decidir assinar de fato, chamamos `POST /v3/customers` passando `{ name, email, cpfCnpj }`.
2. **Subscriptions:** Quando o usuário comprar o plano, acionamos `POST /v3/subscriptions` passando `{ customer, value, cycle: "MONTHLY", nextDueDate }`.
3. **Sincronização Bidirecional:** Se o usuário cancelar no Asaas, o Supabase recebe um **Webhook** e atualiza o acesso da TV. Se o Admin deletar um Plano no KickTV, uma Edge Function pausa as assinaturas daquele plano no Asaas.
