# Research: Asaas Environment & Centralization (Spec 017)

## 1. Problema Atual
O usuário tentou colocar a chave de **Produção** do Asaas na tela de Integrações, mas o `asaas-ping-test` falhou com erro HTTP 400 e a mensagem `invalid_environment` informando que a chave não pertencia ao ambiente.
Isso ocorre porque nossa tela de integrações atual não possui um seletor explícito de Ambiente (Production vs Sandbox), e o banco de dados não está salvando essa flag no objeto `credentials`. Como fallback, o backend costuma forçar o uso de Sandbox.

## 2. Código Legado (Duplicação)
Encontramos 3 telas diferentes onde a API Key do Asaas pode ser teoricamente configurada, gerando confusão:
- `src/routes/admin/integracoes.tsx` (Tela Oficial Nova)
- `src/routes/admin/planos.tsx` (Linhas 23, 173 - Accordion de Configurações Asaas)
- `src/routes/admin/configuracoes.tsx` (Linhas 26, 101 - Seção de Asaas)

## 3. Estrutura do Banco
A tabela `integrations` armazena no provedor `asaas` uma coluna JSONB chamada `credentials`. Ela atualmente suporta: `{ apiKey, webhookToken }`. 
Adicionaremos a propriedade `environment` ("sandbox" ou "production") a esse JSONB. As Edge Functions (`asaas-ping-test` e as futuras `asaas-checkout`, `asaas-sync`) já possuem suporte interno para ler `credentials.environment` e alterar a base URL (`api.asaas.com` vs `sandbox.asaas.com`).

## 4. Conclusão da Pesquisa
É perfeitamente viável:
1. Centralizar tudo em `integracoes.tsx` adicionando um Toggle ou Select de Ambiente.
2. Apagar toda a seção de credenciais Asaas das telas `planos.tsx` e `configuracoes.tsx`.
