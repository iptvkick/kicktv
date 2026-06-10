# Research: Spec 013 (Bugfixes & Profile CPF)

## Contexto
O usuário apontou que:
1. O Global Swipe não funciona na tela Início (dashboard.tsx), mas funciona nas outras.
2. Falta a capacidade de editar os Dados Pessoais (Nome e CPF) no perfil.
3. Precisam ser fornecidas instruções para testar o fluxo do Asaas em produção.

## Análise
1. **Swipe Issue:** A tela `dashboard.tsx` é a mais complexa. Ela não arrasta porque o `framer-motion` conflita com o scroll nativo do navegador sem as devidas propriedades CSS. Em `cliente.tsx`, a `motion.div` precisa de `style={{ touchAction: "pan-y" }}` e os filhos do dashboard precisam evitar `e.stopPropagation()` em pointer events. Além disso, no mobile, drags muito sensíveis são cancelados pelo scroll vertical.
2. **Edição de Perfil:** A tabela `profiles` atualmente (pela tipagem) não possui a coluna explícita `cpf` (que estava no design anterior mas não foi provisionada separadamente do JSONB credentials na fase de auth). Precisamos criar a migration: `ALTER TABLE profiles ADD COLUMN cpf VARCHAR(20)`. No arquivo `perfil.tsx`, em "Dados Pessoais", transformaremos o card estático num formulário controlado.
3. **Instruções de Produção:** O Asaas funciona com duas URLs base e chaves separadas. Responderemos ao usuário via chat os pré-requisitos exatos (Chave Prod, Endpoint, Webhooks) para ele virar a chave.
