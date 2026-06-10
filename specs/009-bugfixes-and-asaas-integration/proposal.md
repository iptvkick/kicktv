# Proposal: Bugfixes e Integração Asaas

## Requisitos de Sistema (System Requirements)
- **REQ-01 (DB/Integração Asaas):** Modificar a tabela `integrations` para armazenar de forma segregada a `sandbox_key`, a `production_key` e o `environment` (enum: 'sandbox' | 'production').
- **REQ-02 (Admin/Asaas):** O `ConfigsAdminPage` (`/admin/configuracoes.tsx`) deve apresentar campos distintos para Sandbox e Production, um Radio Group (ou Toggle) para selecionar o ambiente ativo, e um botão "Testar Conexão" que consumirá uma Edge Function do Supabase.
- **REQ-03 (Admin/Onboarding):** A página `OnboardingAdminPage` (`/admin/onboarding.tsx`) deve consumir os dados da tabela `onboarding_steps`. Ao selecionar um aparelho (Device), o lado direito da tela deve carregar os passos exclusivos daquele ID. Deve ser possível Adicionar, Editar e Deletar passos (CRUD completo), e eles devem possuir a coluna `device_id`.
- **REQ-04 (DB/Trial):** Ao invés de o cliente acessar o painel e estar "Expirado", o banco de dados deve atribuir a ele 4 horas exatas de uso gratuito no momento de criação do perfil. Se a tabela `subscriptions` gerencia o acesso, um trigger deve inserir uma linha de assinatura "trialing" atrelada ao plano base, com `expires_at = NOW() + interval '4 hours'`.
- **REQ-05 (Client/UI Tabs):** Refatorar `src/routes/cliente/dashboard.tsx` para usar Tabs (Pills), criando as visualizações "Dados Pessoais", "Métodos de Pagamento" e "Segurança". 

## BDD Scenarios

### Cenário 1: Teste de Conexão com Asaas
- **Given (Dado):** O Administrador digitou uma API Key de Sandbox na tela de Configurações.
- **When (Quando):** Ele clica no botão "Testar Integração".
- **Then (Então):** O Frontend chama a function `asaas-ping`, que verifica o endpoint real `/v3/customers` usando a chave enviada. Se a chave for válida, a UI exibe "Conexão Bem-Sucedida". Caso contrário, exibe o erro retornado pela API.

### Cenário 2: Gestão de Passos de um Dispositivo
- **Given (Dado):** O Administrador clica no dispositivo "Roku" na lista lateral.
- **When (Quando):** Ele clica em "Adicionar Passo", preenche Título e Descrição, e clica em "Salvar Passo".
- **Then (Então):** Um insert é feito na tabela `onboarding_steps` passando o `device_id` do Roku, e a UI se atualiza imediatamente refletindo o novo card do passo (sem necessidade de reload).

### Cenário 3: Ativação Automática do Trial (4 Horas)
- **Given (Dado):** Um usuário novato acabou de preencher o form de `/auth/register`.
- **When (Quando):** O Supabase Auth cria a conta e dispara o trigger do banco de dados.
- **Then (Então):** No primeiro login do cliente, o `dashboard.tsx` buscará a assinatura e encontrará o status `trialing` vencendo em 4 horas, exibindo um contador regressivo na cor verde ao invés do card vermelho de "Expirado".

### Cenário 4: Navegação no Dashboard do Cliente
- **Given (Dado):** O Cliente está no seu Dashboard.
- **When (Quando):** Ele clica na aba "Métodos de Pagamento".
- **Then (Então):** A view altera instantaneamente (sem reload da rota) exibindo as opções de faturas e o botão "Gerar PIX", ocultando a visualização de Dados Pessoais.
