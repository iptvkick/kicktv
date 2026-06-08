# Proposal: UI Premium 2026, Placeholder Cards e Fallback de API

## Visão Geral
Elevar drasticamente o nível visual dos sites gerados, substituindo o uso instável de imagens de banco de dados aleatórias (LoremFlickr) por um sistema de *Wireframing Premium Animado*. Adicionar a localização via iframe do Google Maps, e implementar uma esteira de tolerância a falhas na CLI do Gemini que faz rotação de modelos caso o Free-Tier esgote.

## Requirements
1. **Componente de Placeholder Animado:**
   - O agente deve criar um componente React `<ImagePlaceholder />` que receba um texto (ex: `"Imagem: Recepcionista Sorrindo"`).
   - O visual deve usar gradientes animados, ícone central do Lucide-React e efeito glassmorphism.
2. **Integração Google Maps:**
   - Extrair a `latitude` e `longitude` do arquivo `briefing.md`.
   - Gerar um iframe responsivo apontando para o Maps na seção de Localização.
3. **Upgrade de Design (UX 2026):**
   - Forçar o modelo a utilizar micro-interações (`framer-motion`), botões com brilho interno (`box-shadow: inset`), e estética de alto luxo (Apple Liquid Glass).
4. **Auto-Routing e Fallback (Gemini):**
   - O `run-gemini-job.sh` deve rodar o Gemini CLI tentando primeiro um modelo avançado/pesado (se houver quota).
   - Se ocorrer falha (exit code 1) que contenha "429" ou "Quota", ele deve fazer fallback automático para um modelo menor/backup (ex: Gemini 2.0 Flash) e tentar novamente sem abortar o script bash.

## User Stories
- **Como** vendedor, **eu quero** que as páginas não tenham fotos genéricas de cachorro quando for um petshop premium, **para** que o site não pareça amador e a venda seja facilitada pela estrutura visual.
- **Como** dono de negócio, **eu quero** um mapa real na minha página, **para** que o cliente visitante consiga calcular a rota instantaneamente.
- **Como** orquestrador de fábrica de sites, **eu quero** que o sistema troque de modelo de IA sozinho quando o Google me dar bloqueio temporário, **para** não perder a produtividade daquele horário.

## BDD Scenarios

### Cenário: Fallback de API Limitada
- **Given (Dado):** O Bash inicia a geração com o modelo principal (`gemini-2.5-pro` ou `gemini-1.5-pro`).
- **When (Quando):** A CLI retorna erro de "Quota Exceeded".
- **Then (Então):** O Bash intercepta o erro, avisa no log, troca a flag `--model` para `gemini-2.0-flash` e tenta novamente.

### Cenário: Geração do Placeholder Animado
- **Given (Dado):** O LLM está gerando a Seção Hero.
- **When (Quando):** Ele precisa colocar uma imagem de fundo.
- **Then (Então):** Em vez de chamar o LoremFlickr, ele insere `<ImagePlaceholder text="Recomendado: Foto da fachada da clínica em alta resolução" className="w-full h-full" />`.
