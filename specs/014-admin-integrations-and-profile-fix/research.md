# Research: Admin Integrations & Profile Fix (Spec 014)

## Bug Report
O usuário apontou que ao editar o perfil ocorre o erro: `Could not find the 'full_name' column of 'profiles' in the schema cache`.
**Causa:** Na Spec anterior, a UI do perfil incluiu o campo `full_name` para edição, mas a tabela `profiles` no Supabase não continha essa coluna nativamente (o nome estava em `raw_user_meta_data` ou simplesmente não existia).
**Resolução:** Adicionar a coluna `full_name` (VARCHAR) em `profiles` através de uma migration e atualizar `types.ts`.

## Novo Requisito
O usuário solicitou uma página específica no painel Administrativo voltada para Integrações.
Esta página servirá para:
1. Explicar passo-a-passo onde ele pega as chaves do Asaas (Sandbox e Produção).
2. Explicar como configurar o Webhook do Asaas para se conectar com nossa Edge Function.
3. Disponibilizar botões de teste que farão "Pings" reais na API do Asaas usando a chave salva, de forma a confirmar que a conta está autenticada corretamente antes de ir para produção.

## Research Async
O subagente `/browser` foi acionado em background para ler as documentações oficiais do Asaas (docs.asaas.com) e montar o tutorial atualizado de extração de API Key e Webhooks, garantindo que daremos as instruções corretas para o usuário.
