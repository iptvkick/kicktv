# Pesquisa e Contexto: UX do Admin e Gestão de Servidores

## Arquivos e Escopo (RPI-R)
O usuário relatou 3 problemas principais que degradam a experiência do Admin:
1. **Lentidão e Falta de Loading State**: A navegação entre páginas demora porque a renderização server-side (`await supabase...`) bloqueia a UI, e não existe um `loading.tsx` para apresentar um skeleton imediato (o que dá a impressão de "congelamento").
2. **Animação Inadequada**: O componente `PageTransition` (`src/components/ui/PageTransition.tsx`) está usando o efeito slide horizontal (deslizamento), que é um padrão forte para PWA/Mobile (cliente), mas para dashboards web de Admin parece que a página inteira "voa pros lados", gerando náusea visual ou estranheza.
3. **Mocks de Servidor**: O Dashboard ainda aponta mocks para o "Status dos Servidores". Precisamos popular a tela `/admin/servidores` com dados reais e integrar esses dados ao Dashboard.

## Dependências de Dados
Atualmente, não existe tabela explícita `servers`. O `url_servidor` existe em `iptv_subscriptions`, mas a contagem de ping e status global dos servidores (Xtream A, Xtream B) não tem uma fonte de verdade no banco.
- **Solução Proposta**: Criar uma migração `create table public.servers` contendo id, nome, url, porta, status (online/offline), ping, limite_usuarios.

## Benchmarking Visual e UX
Para dashboards em 2026:
- Transições de tela em "Fade com leve Scale" (Fade in/out + subida de 5px) ou apenas Crossfade imediato garantem sensação de velocidade, sem deslocamentos horizontais.
- Skeletons UI que replicam a estrutura da página devem aparecer em milissegundos antes dos dados.
- O Layout precisa ter uma estrutura onde a Sidebar seja preservada e o Header (como no topo da página) também seja parte do layout para evitar saltos.
