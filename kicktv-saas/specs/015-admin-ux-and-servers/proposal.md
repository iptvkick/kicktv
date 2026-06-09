# Proposta (015-admin-ux-and-servers)

## Requisitos
1. **Refatoração do PageTransition**: O comportamento horizontal de mobile deve ser restrito à área do `/cliente` (ou removido/adaptado caso a rota atual inicie com `/admin`). O Admin deve ter uma transição "Fade In/Out" sutil, sem movimento no eixo X.
2. **Skeleton e Loading States**: Adicionar arquivo `loading.tsx` na raiz do `/admin` para exibir esqueletos de interfaces instantaneamente enquanto as conexões do Supabase SSR são resolvidas. Isso resolve a sensação de congelamento de tela ("demora mo tempao pra carregar").
3. **Migração do Banco de Dados**: Criar a tabela `servers` no Supabase com os campos para gestão de painéis Xtream.
4. **Dashboard Conectada**: O widget "Status dos Servidores" no `/admin/dashboard/page.tsx` passará a consumir a tabela real `servers` do Supabase em vez dos Mocks atuais (12ms ping, etc).
5. **Implementação Básica da Tela de Servidores**: Atualizar `/admin/servidores/page.tsx` para listar os servidores puxando do banco de dados (mesmo que a funcionalidade de criar novos ainda fique pendente ou simplificada, tirando a página do estado de "desenvolvimento").

## User Stories
- **Como Administrador**, quero poder clicar em uma página e ver a interface carregar imediatamente (com esqueletos) para não sentir que a plataforma travou.
- **Como Administrador**, quero transições de tela com estilo web corporativo, sem aquele deslizamento para os lados que parece um aplicativo de celular.
- **Como Administrador**, quero que meu dashboard exiba meus servidores reais cadastrados no banco de dados.

## Critérios de Aceite
- Ao clicar em "Servidores" na sidebar, a tela muda imediatamente para um Skeleton Loader enquanto aguarda os dados da nova rota.
- O `PageTransition` detecta se a rota atual é `/admin/*` e aplica apenas opacidade (Fade), ignorando o slide.
- O Banco de Dados possui a nova tabela `servers`.
- A Dashboard puxa os servidores com ping simulado ou salvo no banco.

## BDD Scenarios

### Cenário: Navegação Imediata e Fluida
- **Given (Dado):** O Administrador está no Dashboard.
- **When (Quando):** Ele clica na aba "Servidores".
- **Then (Então):** A tela transita com Fade-in sutil. Imediatamente o `loading.tsx` renderiza um skeleton visual mantendo o header/sidebar fixos.
- **And (E):** Após a resolução do servidor, os dados preenchem as caixas.

### Cenário: Dashboard Lendo Servidores Reais
- **Given (Dado):** A tabela `servers` possui o "Servidor BR Principal" configurado.
- **When (Quando):** O Administrador carrega o Dashboard.
- **Then (Então):** O bloco de servidores exibe o servidor do banco em vez do mockup "Servidor Xtream A".
