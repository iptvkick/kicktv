# Proposal & Design: Asaas Environment & Centralization (Spec 017)

## Requisitos
1. **REQ-01 (Seletor de Ambiente):** A tela `/admin/integracoes.tsx` deverá conter um Radio Group, Toggle ou Select Moderno para o usuário definir qual ambiente do Asaas está configurando: `Sandbox` (Testes) ou `Production` (Real).
2. **REQ-02 (Centralização de UI):** Telas satélites como `/admin/planos.tsx` e `/admin/configuracoes.tsx` que porventura contenham cópias dos formulários do Asaas (API Key e Ping) devem ter essas seções **completamente apagadas** para evitar que o usuário preencha dados em duas telas ao mesmo tempo e gere inconsistência.
3. **REQ-03 (Armazenamento):** A propriedade `environment` ("sandbox" | "production") deve ser salva dentro do JSONB `credentials` da tabela `integrations`, ao lado da `apiKey` e do `webhookToken`.

## BDD Scenarios

### Cenário 1: Troca de Ambiente sem confusão
- **Given:** O usuário acessa a tela de Integrações.
- **When:** Ele preenche a API Key de Produção e seleciona o Switch para "Produção", clicando em salvar.
- **Then:** O sistema grava no banco de dados o `environment: 'production'`, e o Ping Test automaticamente atinge a URL `api.asaas.com` com sucesso (retornando status 200).

### Cenário 2: Prevenção de Configuração Dupla
- **Given:** O admin tenta configurar a API do Asaas em outra tela.
- **When:** Ele navega para `/admin/planos.tsx`.
- **Then:** Ele não encontra mais campos de configuração de chaves Asaas ali. Apenas a gestão nativa de planos e faturas, e no máximo um aviso/botão para "Gerenciar chaves na tela de Integrações".
