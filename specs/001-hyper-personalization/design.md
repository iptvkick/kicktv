# Design e UX/UI (001-Hyper-Personalization)

## Padrões Visuais (Apple Liquid Glass & UX 2026)
Para aumentar a taxa de conversão no WhatsApp, o site precisa gerar uma percepção de valor imediata.
Se o lead vende serviços de 100 reais, o site gerado deve fazer o negócio dele parecer que cobra 1000 reais.

### Componentes Chave para o Fator "UAU":
1. **Glassmorphism Review Card:** Um card flutuante renderizado com `backdrop-blur-xl` e `border-white/10` que mostra as estrelas reais do Google Meu Negócio do cliente. Ele deve flutuar por cima da imagem principal (Hero).
2. **Dynamic Map Bento Box:** Uma seção estilo Bento Box (grid moderno), onde um dos quadrados exibe o `<GoogleMap />` com o endereço do cliente, e o quadrado ao lado exibe um texto agressivo sobre o monopólio dele naquela cidade.
3. **CEO / Marca Badge:** Trocar textos genéricos por badges no topo informando "Desenvolvido para [Nome do Negócio]".

## Modelagem de Dados
O script Python (`capital_leads_prospector.py`) passará para o `briefing.md` os dados exatos do GMN (Google Meu Negócio):
- Nome da Empresa
- Nota (Rating) exata (ex: 4.8)
- Número de Avaliações exato (ex: 124)
- Cidade
- Coordenadas

O LLM (`run-gemini-job.sh`) será instruído a utilizar esses dados de forma proeminente na primeira visualização (Above the Fold) e na seção "Sobre Nós".
