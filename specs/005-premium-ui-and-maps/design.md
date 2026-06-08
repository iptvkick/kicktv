# Design: UI Premium 2026, Placeholder Cards e Fallback de API

## Estrutura do Prompt Master (`run-gemini-job.sh`)
O prompt será atualizado para abolir o item de LoremFlickr e inserir a arquitetura de Placeholders.
**Novo bloco no prompt:**
```markdown
5. IMAGENS E MÍDIA (REGRA CRÍTICA):
   - É EXTREMAMENTE PROIBIDO usar imagens externas (ex: LoremFlickr, Unsplash, etc). 
   - No lugar de QUALQUER imagem (seja fundo do Hero, ícones de serviço ou galerias), você DEVE criar um componente React chamado `<ImagePlaceholder text="Sugestão de Imagem Aqui" />`.
   - O `<ImagePlaceholder />` deve ser desenhado nativamente usando div, Tailwind CSS, animação de pulse/gradient (ex: `animate-pulse bg-gradient-to-br from-neutral-800 to-neutral-900`), cantos arredondados, e exibir centralizado o texto explicativo sobre qual imagem o cliente deverá inserir ali no futuro.
   - Adicione suporte a ícones da Lucide-React dentro do placeholder (ex: ícone de câmera ou imagem).

6. LOCALIZAÇÃO E MAPAS:
   - Crie um componente `<GoogleMap />` e insira-o na seção de Contatos/Footer.
   - Use o seguinte padrão de iframe: `<iframe width="100%" height="400" style={{ border: 0 }} loading="lazy" allowFullScreen src="https://maps.google.com/maps?q={LATITUDE},{LONGITUDE}&z=15&output=embed"></iframe>`.
   - Substitua `{LATITUDE}` e `{LONGITUDE}` pelas coordenadas exatas providenciadas no briefing do negócio.
```

## Arquitetura de Fallbacks Auto-Gerenciada
O `run-gemini-job.sh` encapsulará a chamada do `gemini` CLI em um sistema de routing:
```bash
MODEL_1="gemini-2.5-flash"
MODEL_2="gemini-1.5-flash"
MODEL_3="gemini-2.0-flash-lite-preview"

echo "Tentando modelo principal ($MODEL_1)..."
if ! gemini -p "$(cat ../prompt.txt)" --model="$MODEL_1" --approval-mode=yolo --skip-trust < /dev/null > ../agent.log 2>&1; then
    echo "Falha no modelo principal. Tentando fallback para $MODEL_2..."
    if ! gemini -p "$(cat ../prompt.txt)" --model="$MODEL_2" --approval-mode=yolo --skip-trust < /dev/null > ../agent.log 2>&1; then
        echo "Falha no fallback secundário. Tentando modelo leve ($MODEL_3)..."
        gemini -p "$(cat ../prompt.txt)" --model="$MODEL_3" --approval-mode=yolo --skip-trust < /dev/null > ../agent.log 2>&1 || true
    fi
fi
```
Isso resolve instantaneamente os erros "Quota Exceeded" do Free-Tier espalhando o peso pelas diversas cotas gratuitas oferecidas para diferentes modelos da API.
