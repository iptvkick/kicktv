# Spec 010: Programmatic SEO & CrivoCerto v3 (Agressivo & Escalável)

## 1. Visão Geral
Esta proposta descreve a evolução do CrivoCerto de um blog tradicional de reviews para uma **Máquina de Programmatic SEO** agressiva e automatizada. O foco é dominar as buscas "long-tail" com milhares de páginas geradas dinamicamente baseadas na matriz de intenção: `[Categoria] × [Persona] × [Contexto/Dor]`.

### O Problema Atual
O gerador B2B de sites institucionais ("Fábrica de sites") não está convertendo como esperado. Em contrapartida, no passado havia um script Cron que enviava reviews para o antigo blog do CrivoCerto (baseado em WordPress via WP REST API). O mercado atual exige que esse sistema de reviews evolua para uma **Programmatic SEO** massiva focada em afiliados, mas executada de forma estruturada e dentro das regras do Google (evitando o "doorway abuse").

### A Solução
Desativar o captador de leads temporariamente e pivotar a inteligência do Hermes para o novo CrivoCerto v3 (abandonando o WordPress antigo).
Em vez de depender da API do WP, o Hermes vai injetar o conteúdo diretamente via Supabase Edge Functions (`hermes-gateway`). O frontend será uma "casca" burra construída em React/Vite que lê do banco e renderiza guias hiper-direcionados instantaneamente.

## 2. Requisitos de Negócio (Business Requirements)

1. **Supabase como Fonte Única da Verdade:** Os produtos, notas (Crivo Score), variações e links de afiliados devem viver inteiramente no Supabase.
2. **Páginas Dinâmicas:** Criação da rota dinâmica `/guias/:categoria/:persona/:contexto` que consulta a base e monta o conteúdo dinamicamente, sem precisar compilar um novo site.
3. **Múltiplos Marketplaces:** Todo produto listado deverá ter, sempre que possível, links para Amazon, Mercado Livre e Shopee.
4. **Conformidade de Imagens (ToS):** É estritamente proibido raspar ou "hotlinkar" imagens por conta própria. Todas as URLs de imagens deverão vir das APIs oficiais de afiliação (PAAPI da Amazon, Shopee API, Mercado Livre API).
5. **Copy Agressiva de Alta Conversão:** Títulos que atacam a dor + benefício, micro-CTAs personalizados para cada marketplace.
6. **Programmatic SEO Responsável:** As páginas não podem ser apenas "doorway pages" (texto girado). O Hermes deve gerar um BDD (Best, Do, Don't) real, com contexto específico para aquela persona (ex: aspirador para pets, analisando o nível de ruído e facilidade de limpar pelo).

## 3. User Stories

- **Como um** comprador com uma dor muito específica (ex: programador procurando cadeira que não esquenta as costas), **eu quero** cair em um guia focado exatamente no meu perfil, **para que** eu sinta que a recomendação foi feita para mim e eu feche a compra imediatamente.
- **Como o** sistema autônomo (Hermes), **eu quero** usar uma matriz de SEO (Categoria/Persona/Contexto) para escolher qual será o próximo guia gerado, **para que** eu possa criar um ecossistema com dezenas de milhares de páginas indexadas sem supervisão manual.
- **Como o** operador do site (David), **eu quero** medir o CTR e o EPC via `clicks_tracking` para cada botão (Amazon vs Shopee vs ML), **para que** a inteligência possa impulsionar os produtos com melhor conversão orgânica.

## 4. Acceptance Criteria

- [ ] A rota `src/routes/guias.$categoria.$persona.$contexto.tsx` deve existir no CrivoCerto e renderizar baseada em dados do Supabase.
- [ ] O banco de dados (Supabase) deve conter a nova entidade/tabela de `products` suportando URLs oficiais de imagens e o JSON de links de afiliado.
- [ ] Uma nova tabela (ou adaptação da `posts`) chamada `guides` ou `listicles` deve mapear as chaves de Programmatic SEO (categoria, persona, contexto) com seu texto agressivo gerado pelo LLM.
- [ ] O sistema não pode depender do Git/Netlify para criar novas páginas (as páginas nascem ao inserir no DB).
- [ ] Os cards dos produtos devem ter botões de CTA personalizados e trackeados (`clicks_tracking`).

## 5. BDD Scenarios

### Cenário: Navegando para um guia de nicho (Programmatic Long-Tail)
- **Given:** O banco tem produtos da categoria "aspirador-vertical" com `crivo_score` avaliado para "pets".
- **When:** O usuário acessa a URL `/guias/aspirador-vertical/donos-de-pet/apartamento-pequeno`.
- **Then:** O sistema renderiza uma página com um título agressivo focado no nicho.
- **And:** A seção "Top 5" mostra os aspiradores ordenados pela nota e adequação (score_breakdown).
- **And:** Cada card de produto possui os links de afiliado (Amazon, ML, Shopee) com copy de urgência e chamadas personalizadas para ação.

### Cenário: Hermes Injetando um Novo Guia Autonomamente
- **Given:** O Hermes identificou que o volume de busca para "cadeiras ergonômicas para gamers com dor na lombar" está subindo.
- **When:** O Hermes gera o conteúdo via Gemini e chama o `hermes-gateway` com a ação `insert_guide`.
- **Then:** O Supabase cria o novo registro no banco.
- **And:** O Vercel/Frontend disponibiliza a rota instantaneamente.
- **And:** Nenhum processo de build ou deploy externo é necessário.
