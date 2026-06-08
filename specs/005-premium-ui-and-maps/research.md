# Research: Premium UI, Placeholder Cards, Maps & Rate Limits

## Contexto Atual
O sistema gera landing pages B2B usando um prompt master (em `run-gemini-job.sh`). 

### Pontos de Dor Mapeados
1. **Falta do "Fator Premium":** Embora o prompt exija um "Nível Agência Premium", os modelos LLM tendem a gerar designs Tailwind muito seguros e genéricos (flat design). O usuário sente falta das tendências modernas discutidas previamente (Liquid Glass, Maximalismo, animações avançadas).
2. **Imagens Quebradas/Incoerentes:** O uso de `LoremFlickr` resulta em imagens muitas vezes fora de contexto, de baixa qualidade ou com links quebrados. Isso quebra a imersão de um site "high-ticket".
3. **Ausência de Geolocalização (Google Maps):** O `briefing` fornece latitude e longitude do negócio, mas o prompt não instrui o agente a criar um mapa incorporado (iframe) na seção de Contato/Localização.
4. **Rate Limits & Fallback (Gemini API):** O log colado pelo usuário revela erros de `429 Quota Exceeded` para o modelo `gemini-2.5-flash` devido a limites restritos (15 RPM) no Free-Tier. Atualmente, a CLI do Gemini tenta retries internos, mas acaba falhando catastroficamente se a cota diária/por minuto esgotar completamente, travando a fábrica.

## Análise de Soluções
- **Placeholder Cards Animados:** Remover a exigência de `LoremFlickr` do prompt e instruir a criação de um componente React `<ImagePlaceholder text="Recomendado: Foto da Oficina" />`. Esse componente deve ter fundo gradiente animado, proporções reais (aspect-video) e ícones (Lucide), parecendo um wireframe premium.
- **Integração de Mapas:** Adicionar uma diretriz no prompt para embutir um iframe do Google Maps usando a URL de busca padrão com as coordenadas: `https://maps.google.com/maps?q={lat},{long}&z=15&output=embed`.
- **Injeção de UX 2026:** Forçar o prompt a incorporar as heurísticas da skill `ux-ui-architect-2026`: Efeitos de *glassmorphism* (backdrop-blur), bordas translúcidas (`border-white/10`), sombras suaves múltiplas e cores HSL ricas.
- **Gestão de Quota / Modelo:** O script bash deve implementar um fallback manual. Se `gemini --model gemini-2.5-flash` falhar com erro 429, o bash intercepta e tenta novamente rodando com um modelo mais leve (ex: `gemini-1.5-flash` ou `gemini-2.0-flash-lite`).
