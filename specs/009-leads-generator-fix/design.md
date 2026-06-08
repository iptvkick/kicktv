# Design (ID: 009-leads-generator-fix)

## Alterações de Prompt (Design Visual dos Sites B2B)

A causa raiz da "Ferrari" em todos os sites é o fato do Gemini/LLMs interpretarem de forma criativa URLs do Unsplash (e às vezes elas apontam para imagens recém-atualizadas).
Para a criação de Landings Pages B2B premium (Vidraçarias, Clínicas Veterinárias, Engenharias) de forma **completamente autônoma**, as diretrizes visuais devem seguir os princípios de **UIs Seguras e Universais**.

### 1. O "Hero" Seguro (Gradient Minimalista de 2026)
Ao invés de carregar imagens de fundo grandes, os novos sites usarão Hero Sections modernos baseados no estilo "Stripe / Vercel" de 2026:
- Fundo totalmente sólido em tom escuro (`bg-slate-950`) ou ultra claro (`bg-zinc-50`).
- Textos em destaque usando transparência e glassmorphism minimalista.
- Para adicionar "luxo", o prompt exigirá o uso do Tailwind: `bg-gradient-to-r from-gray-900 to-gray-800`.
**Resultado:** Zero risco de imagens bizarras. Conversão focada inteiramente na COPY (o texto da dor daquele nicho) e não em uma imagem de fundo genérica.

### 2. Imagens de Conteúdo Internas (Galeria/Serviços)
Se a empresa for uma clínica veterinária, ela não quer ver um prédio de advocacia. 
**Nova regra no Script:** 
- O prompt dirá para o Gemini injetar ícones vetorizados do pacote Lucide React para representar "serviços" em vez de fotos pesadas que ele inventa.
- Se for mandatório usar foto na galeria, usar a instrução de placeholders coloridos do `placehold.co` (Ex: `https://placehold.co/600x400/1e293b/ffffff?text=Nossos+Servicos`).

### 3. Integração das Mensagens para o Discord
A mensagem de sucesso (`SUCCESS_MSG` gerada no python) será despachada nativamente pelo Hermes para o Discord, sem depender da leitura assíncrona falha do arquivo `success_queue.txt`.
O formato será:
```markdown
🌟 **Novo Site Prontíssimo para Prospecção!**
🏢 {Nome do Lead} (Nicho: {Nicho})
📍 Cidade: {Cidade}
📱 WhatsApp: {Link Formatado}
🌐 Site Demonstração: {URL do Netlify}
```
Isso garante a "beleza e formatação" que o cliente deseja e facilita o disparo com o celular na mão.
