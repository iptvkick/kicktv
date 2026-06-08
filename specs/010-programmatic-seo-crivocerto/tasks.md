# Spec 010: Execution Tasks

1. **Database Migrations (Supabase)**
   - [ ] Criar a tabela `products` com suporte a `affiliate_links` (JSONB) e `primary_image_url`.
   - [ ] Criar a tabela `guides` para as páginas dinâmicas (categoria, persona, contexto).
   - [ ] Criar a tabela associativa `guide_products` com a posição no rank e o pitch de copy agressiva.
   - [ ] Atualizar as políticas de RLS para que `products` e `guides` possam ser lidas pelo público.

2. **Edge Function Updates (`hermes-gateway`)**
   - [ ] Mapear a Action `upsert_product` para o Hermes inserir produtos crus com URLs vindas da PAAPI/Shopee/ML.
   - [ ] Mapear a Action `insert_guide` para o Hermes submeter o "esqueleto" do Guia.
   - [ ] Mapear a Action `link_product_to_guide` para relacionar produtos ao Guia gerado com a copy específica.

3. **Frontend: Rota e Dados (CrivoCerto v3)**
   - [ ] Criar a rota dinâmica em `src/routes/guias.$categoria.$persona.$contexto.tsx`.
   - [ ] Configurar a função `loader` da rota (TanStack Router) para fazer o SELECT com JOIN nas tabelas `guides`, `guide_products` e `products`, ordenando pela posição.

4. **Frontend: UX/UI (Maximalismo Tátil 2026)**
   - [ ] Desenhar o Componente "Hero Storytelling" que exibe o `headline` e `intro_text` do guia.
   - [ ] Desenhar o "Bento Box Top 5" com Liquid Glass e grid assimétrico para os 5 melhores ranqueados.
   - [ ] Desenhar o "Card do Produto" incluindo o botão de CTA agressivo (h-12, contraste alto) que dispara registro no `clicks_tracking` e abre o link na nova aba.
   - [ ] Desenhar o "Top 10 Grid" para os produtos da 6ª à 10ª posição.

5. **Hermes (Prompt & Orquestração)**
   - [ ] Pausar/Desativar o script `capital_leads_prospector.py` do Task Scheduler.
   - [ ] Redigir a matriz inicial de Categorias × Personas para o prompt do agente Hermes.
   - [ ] Testar e validar a geração de 1 guia end-to-end com o Hermes batendo no Gateway e renderizando a página sem quebrar o ToS de imagens da Amazon/ML.
