# Tasks (020-monochrome-redesign)

## 1. Alteração do CSS Raiz (Globals)
- [x] Editar `src/app/globals.css`.
- [x] Alterar as variáveis `--primary` para preto puro/chumbo (`240 5.9% 10%`).
- [x] Alterar `--background` para cinza claro sólido (`210 40% 98%`).
- [x] Remover sombras coloridas ou `drop-shadow` de componentes globais.

## 2. Refatoração da Landing Page
- [x] No `src/app/page.tsx`, remover o drop-shadow azul na palavra "Reinventada".
- [x] Remover qualquer animação de `box-shadow` (`animate-cta-pulse`).

## 3. Refatoração do Perfil de Cliente
- [x] Editar `src/app/cliente/perfil/page.tsx`.
- [x] Remover botões de saída com fundo rosa claro / vermelho que não respeitem a paleta.
- [x] Converter textos "Carregando..." verde limão para `text-zinc-500` e carregar o esqueleto (skeleton) se possível.
- [x] Ajustar as fontes escondidas ou sobrepostas.
- [x] Adotar os "cartões brancos super curvos" na listagem de dados.
