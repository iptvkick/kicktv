# Design Spec 024

## Padrão Estrutural do Cabeçalho

Todo o componente principal deve usar a seguinte estrutura para o cabeçalho (Header):

```tsx
<header className="pb-8 flex items-center gap-4">
  <div className="w-16 h-16 rounded-[24px] bg-card border border-border shadow-sm flex items-center justify-center">
    <IconComponent className="w-8 h-8 text-foreground/50" />
  </div>
  <div className="flex flex-col">
    <h1 className="text-2xl font-bold tracking-tight text-foreground">Título Principal</h1>
    <p className="text-sm text-foreground/60 font-medium">Subtítulo secundário descritivo</p>
  </div>
</header>
```

As telas de Assinatura e Suporte receberão esse exato markup de HTML/Tailwind para se igualar à tela de Perfil.
