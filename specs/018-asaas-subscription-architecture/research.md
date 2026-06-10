# Research: Arquitetura de Planos e Assinaturas (Spec 018)

## Contexto do Problema
O sistema KickTV precisa cobrar clientes recorrentemente (mensal, trimestral, etc). O valor não é fixo: ele depende do plano base escolhido pelo cliente (ex: R$ 49,90) mais o número de "Telas/Usuários Adicionais" (ex: + R$ 10,00 por tela). O cliente pode gerenciar e adicionar telas ao longo do tempo.

## Como o Asaas lida com Recorrência?
Ao contrário do Stripe (que possui uma forte separação entre `Product`, `Price` e `Subscription Item`), a API do Asaas é mais enxuta e focada na "Cobrança". No Asaas, não é obrigatório pré-cadastrar um "Catálogo de Planos" na plataforma deles. Você simplesmente cria uma **Assinatura (Subscription)** informando um `value` dinâmico e o `cycle` (MONTHLY). 

## Comparação de Arquiteturas

### Arquitetura 1: Catalogo Sincronizado (Plano no Asaas)
- **Como funciona:** O KickTV cria uma entidade "Plano" e envia via API pro Asaas gerar um Link de Pagamento de Assinatura atrelado àquele plano fixo.
- **Limitação Crítica:** O valor de um link de plano Asaas costuma ser rígido. Se o cliente adicionar 2 telas extras, seria muito complexo atrelar "Adicionais" a uma assinatura padrão fechada.

### Arquitetura 2: Motor de Preço Interno, Assinatura Dinâmica no Asaas (RECOMENDADO)
- **Como funciona:** O banco de dados do KickTV (`Supabase`) é a fonte absoluta da verdade. Ele contém a tabela `plans` (onde o admin edita preços) e `subscriptions` (que ata o cliente ao plano). Quando o cliente assina:
  1. O sistema soma Plano Base + (Telas Extras * Preço da Tela).
  2. O sistema pede à API do Asaas: "Crie uma assinatura mensal de R$ 69,90 para o cliente X".
  3. O Asaas retorna o ID da Assinatura (`sub_1234`). Nós salvamos esse ID no banco.
- **Atualizações:** Se o cliente contratar mais uma tela amanhã, o nosso backend chama a API do Asaas e diz: "Atualize o valor da assinatura `sub_1234` para R$ 79,90". A próxima fatura gerada já sairá com o novo valor.
- **Pro:** Flexibilidade total, fácil de gerenciar "Créditos", "Telas Extras", "Descontos". O sistema detém o controle e o Asaas é apenas o motor de execução.

## Conclusão
Devido à necessidade de cobrança de itens dinâmicos (Usuários Adicionais), a **Arquitetura 2 (Motor de Preço Interno)** é imperativa para evitar gambiarras ou emissões de múltiplos boletos separados para o cliente.
