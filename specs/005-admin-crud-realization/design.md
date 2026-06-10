# Spec 005: Admin CRUD Realization - Design

## 1. Padrão de Componentes de Formulário (UI)
As rotas de Admin já possuem a estética Solid/Monocromática, mas a interatividade falha.
Para corrigir:
- **Inputs:** Devem possuir a classe `focus:ring-2 focus:ring-foreground` e `disabled:opacity-50`. Devem estar ligados a um `useState`.
- **Botões de Ação:** O texto `(mock)` deve ser extirpado. Se a operação estiver em curso no banco de dados, o botão deve alterar o texto para "Salvando..." e desativar-se temporariamente para evitar duplo clique.

## 2. Padrão de Lista
A lista renderizada na tela (`.map()`) deve vir exclusivamente do estado da aplicação preenchido pela API. Nunca usar dados estáticos fallback que iludem o usuário.
