# Spec 007: RLS Absolute Fix & Asaas Engine - Proposal

## Requisitos do Sistema
1. **Fim do 403:** Nenhuma requisição `GET` para `subscription_plans`, `onboarding_devices`, `xtream_servers` e `onboarding_steps` pode retornar 403. O RLS deve permitir `SELECT` para todos os usuários autenticados (ou anônimos, se necessário para renderizar landing pages).
2. **Sincronização Asaas Total:** 
   - Quando um plano é apagado no Admin, as assinaturas vinculadas a ele no Asaas devem ser canceladas.
   - Quando um usuário novo se cadastra, os testes grátis (4 horas) não devem criar cobrança. Após 4h, ele entra na tela, escolhe um Plano e vira Cliente Asaas + Assinante Asaas.
3. **Formulários Desbloqueados:** Se o Frontend estava travando a digitação porque a lista não carregava, isso será sanado.

## BDD Scenarios

### Cenário: RLS Desbloqueado para o Admin
- **Given:** O sistema KickTV online.
- **When:** O admin abre o `/admin/dashboard`.
- **Then:** O console NÃO exibe `403 Forbidden`. A tabela do banco responde Status 200, retornando um array de planos ou array vazio.

### Cenário: Criação de Pagamento Asaas
- **Given:** O Trial do cliente expirou.
- **When:** O cliente escolhe o plano "Premium (R$ 35)" e envia o CPF.
- **Then:** A Edge Function cria o customer no Asaas, cria a subscription de R$ 35 e devolve a URL de pagamento.
