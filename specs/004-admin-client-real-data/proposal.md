# Spec 004: Real Data & Clean UI - Proposal

## Requisitos do Sistema
1. **Fim dos Mocks:** Todo o Painel Admin (Planos, Tutoriais, Suporte, Servidores) deve fazer CRUD direto no Supabase. Nada de arrays fixos.
2. **Configurações de Integração:** O Painel Admin deve ganhar uma aba "Integrações" ou "Configurações" para o administrador inserir e salvar a API Key do Asaas.
3. **Painel do Cliente Real:** O dashboard do cliente deve refletir seus dados de assinatura reais, listar planos reais puxados do Supabase e possuir um visual 100% atualizado com a estética Instrument Sans, sem componentes quebrados/velhos.
4. **Remoção do Verde:** A cor de destaque verde deve ser substituída por tons neutros (preto/branco/cinza) para manter a paleta extremamente clean.

## BDD Scenarios

### Cenário: Atualizando Tutoriais no Admin
- **Given (Dado):** que o Administrador acessa `/admin/onboarding`.
- **When (Quando):** ele clica em "Adicionar Passo" e preenche os dados do tutorial.
- **Then (Então):** a informação é salva na tabela `onboarding_steps` no Supabase, e a tabela da UI atualiza automaticamente refletindo a mudança.

### Cenário: Configurando Asaas
- **Given (Dado):** que o Administrador precisa receber pagamentos.
- **When (Quando):** ele acessa `/admin/configuracoes`, insere a sua `ASAAS_API_KEY` e clica em Salvar.
- **Then (Então):** a chave é armazenada com segurança no banco, permitindo que a Edge Function `create-trial` funcione integradamente.

### Cenário: Painel do Cliente Clean
- **Given (Dado):** que um cliente loga em `/cliente`.
- **When (Quando):** ele visualiza seu plano atual.
- **Then (Então):** a UI exibe os dados reais do Supabase, formatados perfeitamente no novo design Solid, sem nenhum tom de verde e sem componentes desatualizados.
