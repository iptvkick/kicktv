# Proposal: Arquitetura de Planos e Assinaturas (Spec 018)

## Requisitos Core (Motor de Pagamentos)
1. O banco de dados Supabase é a fonte da verdade para Catálogos (Planos, Ciclos de Cobrança e Extras).
2. Asaas é utilizado puramente como gateway de pagamentos (Motor de Cobrança). A criação de "Planos" no Admin afeta apenas o banco local.
3. Quando um cliente se inscreve, o Backend calcula o valor total (Plano + N Adicionais), respeita a periodicidade do plano (Mensal, Trimestral, Anual) e cria uma `Assinatura Genérica` no Asaas com esse valor final.

## Requisitos de Gerenciamento de Clientes
1. **Histórico 360º:** O administrador deve possuir uma tela dedicada (`/admin/clientes`) que lista todos os assinantes, permitindo clicar em um cliente para ver o Perfil Completo.
2. **Espelhamento de Faturas:** O painel deve listar o Histórico de Pagamentos (Faturas) do cliente. Esse espelhamento será alimentado pelo Webhook do Asaas (ex: quando o Asaas cobrar e o PIX cair, o Webhook avisa nosso backend, que salva a "Fatura Paga" no banco).
3. **Gestão do Assinante:** O administrador poderá, dentro do Perfil do Cliente, adicionar/remover Telas Extras ou até mesmo cancelar a assinatura em andamento. Ao fazer isso, o Backend faz um PUT no Asaas ajustando o valor dinamicamente ou cancelando a recorrência.

## BDD Scenarios

### Cenário 1: Assinatura com Ciclo e Telas Extras
- **Given:** O plano "Anual" custa R$ 500 (cobrado anualmente). O preço por tela adicional é R$ 100/ano.
- **When:** Um cliente contrata o plano Anual com 2 telas adicionais.
- **Then:** O sistema comanda a API do Asaas a criar uma Assinatura `YEARLY` no valor de R$ 700.

### Cenário 2: Sincronização de Pagamentos via Webhook
- **Given:** O sistema de pagamentos Asaas debitou o cartão do cliente.
- **When:** O webhook do Asaas dispara o evento `PAYMENT_CONFIRMED`.
- **Then:** Nosso backend atualiza o status da assinatura local para `ACTIVE` e insere um registro na tabela `invoices` com status `PAID`, que aparecerá imediatamente na aba de "Histórico de Pagamentos" do cliente no painel Admin.
