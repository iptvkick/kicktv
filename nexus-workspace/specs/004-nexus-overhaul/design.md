# UI/UX & Database Design: Nexus Overhaul

## 1. Modificações na UI (Stitch MCP Style)

Adotando as diretrizes da skill `ux-ui-architect-2026`, o foco não é adicionar bibliotecas novas, mas ajustar o layout e usabilidade atual de acordo com o padrão Liquid Glass e Maximalismo Funcional.

### 1.1 AgentFlowCanvas (Componente Reativo)
**Problema Visual**: A atualização em tempo real quebra a usabilidade de arrastar nós.
**Solução de Arquitetura**: 
- A prop `agents` virá do componente pai (Agents.tsx), mas o `AgentFlowCanvas` manterá um estado *local* interno para o drag-and-drop.
- Quando a API disparar o `onConnect` ou `onUpdatePosition`, faremos a chamada em background e **não** ativaremos um refetch global forçado imediato que destrua o estado de drag ativo. 

### 1.2 Vault (Mente da Agência)
**Estrutura Nova**:
- `FileTree.tsx`: Deve consumir uma API `fetch('/api/vault/tree')` na montagem (`useEffect`), renderizando de forma recursiva os nós de pasta de verdade.
- Painel Direito: Em vez de manter o `MindGraph` bloqueando a área inteira com RAG search, faremos uma visualização dupla ou abas. 

### 1.3 Nova Página de Chats (`/chats`)
**Novo Layout**:
- **Sidebar**: Lista de agentes parecida com a lista de contatos do WhatsApp ou Discord.
- **Área Central**: Tela de chat com histórico e campo para inputs. 
- **Header**: Botão "Limpar Histórico" que recria a session no backend ou desvincula as mensagens antigas, oferecendo flexibilidade como no "OpenClaw".

## 2. Ajustes de Backend e Database (Supabase)

O banco de dados não exige migrations novas para essas correções, pois o prisma schema atual já suporta a maioria dos requisitos.
No entanto, o script `engine.ts` que lida com a CLI precisará ser modificado para capturar *melhor* o stdout.

### engine.ts (`runGeminiCli`)
```typescript
// Precisamos garantir que a Promise espere corretamente e resolva tudo, seja no stdout ou stderr, eliminando o fallback falso positivo "Sem resposta do motor".
```
