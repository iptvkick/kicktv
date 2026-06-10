# Spec 006: Asaas Deep Integration & Admin Fixes - Design

## 1. UX de Assinatura (Checkout)
No Painel do Cliente (`/cliente`), após o plano expirar, teremos:
- Um modal / tela de checkout solicitando **CPF/CNPJ** (obrigatório para criar Customer no Asaas).
- Seleção de Forma de Pagamento (PIX, Cartão de Crédito).
- Se for PIX, exibiremos o QR Code diretamente na UI puxando do Asaas.

## 2. Modelagem do Banco para Pagamentos
Tabela: `asaas_customers`
- `id` (uuid)
- `profile_id` (uuid)
- `asaas_customer_id` (text, ex: `cus_000005...`)

Tabela: `subscriptions_log`
- Registra histórico de pagamentos aprovados do Asaas.
