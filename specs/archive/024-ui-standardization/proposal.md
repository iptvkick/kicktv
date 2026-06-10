# Spec 024: Padronização Visual das Telas Principais

## Objetivo
Garantir que todas as telas principais do Bottom Navigation possuam exatamente o mesmo layout de cabeçalho, seguindo o padrão estabelecido na tela de Perfil (ícone dentro de uma caixa estilizada, ao lado do título e subtítulo).

## BDD Scenarios

### Cenário: Cabeçalho Unificado
- **Given:** O usuário acessa as telas de Assinatura ou Suporte.
- **When:** A página renderiza o cabeçalho.
- **Then:** Ele deve visualizar o padrão exato da tela de Perfil (um div de 64x64px com bordas arredondadas `rounded-[24px]` contendo o ícone principal), garantindo transição coesa entre as abas.
