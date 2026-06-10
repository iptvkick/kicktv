# Spec 006: Asaas Deep Integration & Admin Fixes - Proposal

## Requisitos
1. **Desbloqueio de RLS e Correção UI:** Corrigir imediatamente o erro `403 Forbidden` garantindo que o admin consiga ler e escrever, e arrumar os `onChange` do React para que a digitação funcione no formulário.
2. **Integração Real Asaas:**
   - Trial Grátis (4h): Sem cobrança no Asaas, gerenciado puramente pela tabela `profiles`.
   - Assinatura Real: Usuário pode escolher um Plano no painel Cliente, ser redirecionado para pagamento (ou pagar via componente In-App gerando o Checkout do Asaas).
3. **Webhooks Asaas:** O Asaas deve avisar nosso Supabase quando o pagamento for aprovado (via `POST /functions/v1/asaas-webhook`), para liberarmos a TV automaticamente.

## BDD Scenarios

### Cenário: Formulários do Admin Finalmente Funcionando
- **Given:** O admin entra na tela de Planos.
- **When:** Ele digita "Plano Família", define "R$ 49,90" e clica em Salvar.
- **Then:** O React atualiza o input normalmente sem erro no console. O RLS permite a inserção (Status 201), e o plano aparece na lista real.

### Cenário: Assinatura Real de Cliente
- **Given:** Um usuário cujo trial de 4h expirou.
- **When:** Ele clica em "Assinar" e paga o Boleto/Pix via Asaas.
- **Then:** O webhook recebe o pagamento aprovado, busca o usuário e estende sua `subscription_end_date` no Supabase por 30 dias.
