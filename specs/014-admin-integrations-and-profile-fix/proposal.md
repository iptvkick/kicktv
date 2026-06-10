# Proposal: Admin Integrations & Profile Fix (Spec 014)

## Requisitos
- **REQ-01 (DB Fix):** Adicionar a coluna `full_name` em `profiles` para curar o erro de schema cache ao atualizar o Perfil do cliente.
- **REQ-02 (UX Admin):** Criar a rota `/admin/integracoes` no Admin Panel.
- **REQ-03 (Guia Asaas):** Incluir nesta tela um guia interativo (com base na pesquisa do subagente browser) instruindo como localizar a Access Token (API Key) e configurar os Webhooks no Asaas.
- **REQ-04 (Ping Test):** Incluir na tela `/admin/integracoes` um painel de Teste que fará um fetch real para um endpoint simples do Asaas (ex: GET `/v3/customers?limit=1`) usando a API Key salva no banco, retornando para o Admin se a chave é Válida ou Inválida.

## User Stories
1. **Como Cliente**, quero poder editar meu nome completo e CPF no meu perfil e clicar em Salvar sem tomar erros de banco de dados.
2. **Como Administrador**, quero ter um painel dedicado a "Integrações" onde eu veja um checklist claro de tudo que preciso colar lá do Asaas para o sistema funcionar, e ter um botão de "Testar Conexão" para não descobrir que a chave tá errada só quando o cliente for pagar.
