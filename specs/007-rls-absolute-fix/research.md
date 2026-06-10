# Spec 007: RLS Absolute Fix & Asaas Engine - Research

## 1. O Fracasso do 403 (RLS)
O `database-engineer` reportou que rodou a migration, mas a realidade (comprovada pelo vídeo) é que o `403 Forbidden` no DevTools permanece intocável ao acessar `/admin/planos` ou o Dashboard. 
**A Causa:** O push da CLI do Supabase falhou silenciosamente devido a permissões de rede/Management API ou falta de Docker. O banco remoto **nunca recebeu** as novas políticas de leitura (`SELECT`).
**A Solução:** Forçar a aplicação da SQL diretamente via String de Conexão Postgres (`--db-url`) ou re-autenticar o CLI vigorosamente para garantir a entrega da migration.

## 2. A Arquitetura Asaas (Mapeamento de Planos)
O usuário ordenou: *"cada plano que eu gerar aq, novo ou excluir, crie um novo no asaas e exclua atbm, o mesmo acontece com usuarios novos"*.
**Achados sobre a API do Asaas:**
No Asaas, diferentemente do Stripe, não existe um catálogo central global de "Planos" que os usuários apenas "assinam". O fluxo correto para SaaS no Asaas é:
1. Criar o Cliente (`POST /v3/customers`).
2. Criar uma Assinatura para aquele cliente (`POST /v3/subscriptions`) especificando o valor (`value`) e a periodicidade (`cycle: MONTHLY`).
3. Para simular a exigência do usuário, as rotas do KickTV vão armazenar os Planos no Supabase. Quando o usuário "Excluir um Plano" no painel, o Supabase vai cancelar (`DELETE /v3/subscriptions/{id}`) todas as assinaturas ativas vinculadas àquele plano no Asaas.
