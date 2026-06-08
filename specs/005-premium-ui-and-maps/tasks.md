# Tasks: UI Premium 2026, Placeholder Cards e Fallback de API

- [ ] `01-refactor-bash-prompt-premium`: Editar o arquivo `run-gemini-job.sh`. Atualizar a seção de `DIRETRIZES DE DESIGN E PERSONALIZAÇÃO` para incorporar regras severas do estilo 2026 (Liquid Glass, sombras ricas, animações suaves, maximalismo).
- [ ] `02-refactor-bash-prompt-images`: Remover completamente do prompt qualquer referência à API do LoremFlickr. Adicionar as regras detalhadas para a criação e uso obrigatório do componente `<ImagePlaceholder text="..." />` feito com Tailwind.
- [ ] `03-refactor-bash-prompt-maps`: Adicionar no prompt as regras para injetar o componente de iframe do Google Maps, extraindo lat/long do briefing.
- [ ] `04-implement-gemini-fallback`: Editar o arquivo `run-gemini-job.sh` na etapa de execução da CLI (onde ocorre a chamada `gemini -p ...`). Implementar o loop `if ! gemini...` com três camadas de modelos (gemini-2.5-flash -> gemini-1.5-flash -> gemini-2.0-flash-lite-preview) para criar tolerância a Rate Limits de conta Free-Tier.
