# Funcionalidade: 001-Hyper-Personalization (Fator "UAU" para Fechamento B2B)

## Requisitos e Contexto
**Problema:** O prospector do WhatsApp envia o link do site gerado. O lead clica, acha bonito, mas percebe (inconscientemente) que pode ser um template genérico adaptado, e não fecha negócio. Há falta de "ancoragem real" com a empresa dele.
**Solução:** Introduzir uma camada de "Hiper-Personalização" que prove, nos primeiros 3 segundos de scroll, que o site foi arquitetado *cirurgicamente* para o negócio e a região dele, utilizando dados reais do Google Maps.

## User Stories
1. **Como [Lead B2B]**, eu quero abrir o site gerado e ver minha nota exata do Google e número de avaliações, para sentir que o desenvolvedor integrou minha autoridade real.
2. **Como [Lead B2B]**, eu quero ver o nome do meu bairro ou rua em um mapa interativo, para sentir confiança de que a estrutura é focada nos clientes da minha região.
3. **Como [Vendedor]**, eu quero que o site gere um "Choque de Exclusividade", com uma seção dedicada ao dono (Nome do Negócio) sendo enaltecido como líder na sua região (Cidade).

## BDD Scenarios

### Cenário: Choque de Realidade no Hero
- **Given (Dado):** O lead abre o link gerado pelo Hermes.
- **When (Quando):** Ele visualiza o Hero Header.
- **Then (Então):** Ele deve ler algo muito específico, não apenas "Melhor Estética Automotiva", mas sim "A Estética Automotiva Nº1 em [Cidade], aprovada por mais de [Rating Count] clientes (⭐ [Rating])."

### Cenário: Seção de "Sua Empresa em Destaque"
- **Given (Dado):** O lead rola a página para baixo.
- **When (Quando):** Ele atinge a segunda ou terceira seção.
- **Then (Então):** Ele encontra um componente UI espelhando a ficha do Google Meu Negócio dele, com a exata Latitude/Longitude renderizada, mostrando "Por que a [Nome da Empresa] domina a região".
