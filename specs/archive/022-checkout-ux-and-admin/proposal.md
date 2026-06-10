# Spec 022: UX Pós-Pagamento, Sandbox Mode & Admin Details

## Objetivo
Implementar funcionalidades robustas para o pós-pagamento via PIX, permitindo que a interface reaja em tempo real ao pagamento. Adicionar ferramentas de sandbox para testes fáceis (Simular Pagamento/Falha). Criar uma página de Suporte arrojada, modernizar o Login e adicionar o "Raio-X" (Página de Detalhes) de clientes no Painel Admin.

## BDD Scenarios

### Cenário: Realtime Payment Feedback
- **Given:** O cliente gerou o PIX e está aguardando na tela de checkout com o cronômetro rodando.
- **When:** O webhook do Asaas confirma o pagamento ou o Admin clica em "Simular Pagamento Confirmado".
- **Then:** O frontend escuta a mudança no Supabase, exibe um modal/efeito de sucesso e o botão "Ir para a TV" é ativado imediatamente, sem refresh.

### Cenário: Timer Expiration
- **Given:** O cliente gerou um PIX de 35 reais.
- **When:** Passam-se 10 minutos sem confirmação de pagamento.
- **Then:** O QR Code é ocultado, indicando "Expirado", e um botão "Gerar novo PIX" aparece.

### Cenário: Sandbox Mode Simulation
- **Given:** A aplicação está rodando localmente com `VITE_SANDBOX_MODE=true`.
- **When:** O desenvolvedor clica em "Simular Pagamento".
- **Then:** O sistema bate em uma Edge Function `asaas-simulate` que altera o status do Invoice para RECEIVED no banco, disparando toda a cadeia (Realtime, liberar subscrição).

### Cenário: Admin X-Ray
- **Given:** O administrador está na lista de clientes.
- **When:** Ele clica em um usuário específico.
- **Then:** Ele é redirecionado para `admin/clientes/$id` onde vê dados completos, a assinatura atual e o histórico de todas as faturas geradas (Invoices), com a possibilidade de aprovar/cancelar manualmente.
