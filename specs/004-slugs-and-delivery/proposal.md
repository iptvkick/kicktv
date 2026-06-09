# Proposal: Slugs Curtos & Entrega no Discord

## Visão Geral
Refatorar a engine de geração de links do projeto para criar slugs curtos, legíveis e com cara de startup/app real (e.g. `agudo-vidros.netlify.app`), em vez de traços gigantes. Além disso, modificar o orquestrador para garantir que o aviso no Discord carregue mais informações contextuais e que o arquivo gerado no PC do cliente tenha a nomenclatura correta (`nome do lead - data e hora.txt`).

## Requirements
1. **Short Slugs:** 
   - Apenas manter caracteres alfanuméricos.
   - Limitar o slug a no máximo 3 palavras lógicas.
   - Limite estrito de 25-30 caracteres absolutos.
2. **File Naming:** 
   - O arquivo em `Desktop/Leads_B2B/` deve se chamar explicitamente `[Nome do Negócio] [Data] [Hora].txt`.
3. **Discord Delivery:** 
   - O Embed de Sucesso no Discord precisa conter não só o link da URL, mas o bloco principal do *briefing* entregue (Telefone formatado, Nicho, Link).
   - Opcional: Se a descrição for curta o bastante, adicionar a *copy* completa dentro de um bloco de código Markdown.

## User Stories
- **Como** vendedor prospector, **eu quero** que o link do site do meu lead seja curto e agradável, **para** que não pareça spam ou vírus quando eu mandar no WhatsApp dele.
- **Como** gestor operacional, **eu quero** abrir meu Discord e ter todos os contatos (telefone, nicho e URL) na minha cara sem precisar baixar nenhum anexo, **para** fazer a abordagem na mesma hora pelo celular.
- **Como** arquivista, **eu quero** que os arquivos `.txt` salvos no meu Windows tenham o nome limpo e a data/hora precisas, **para** que fiquem fáceis de pesquisar no Explorer.

## BDD Scenarios

### Cenário: Geração de Slug Limpo
- **Given (Dado):** O lead encontrado se chama "Odontologia Premium Dr. João - Clínica de Implantes SP".
- **When (Quando):** A engine processar o slug...
- **Then (Então):** O slug retornado deve ser algo como `odontologia-premium-dr` (composto apenas pelas 3 primeiras palavras).

### Cenário: Salvamento Exato no Desktop
- **Given (Dado):** O orchestrator finaliza o processamento às 14:30 do dia 28/05/2026.
- **When (Quando):** O lead for "Agudo Vidros".
- **Then (Então):** O arquivo gerado deve se chamar exatamente `Agudo Vidros 28-05-2026 14-30.txt`.
