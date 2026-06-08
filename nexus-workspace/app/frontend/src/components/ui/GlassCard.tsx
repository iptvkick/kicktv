import { type ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: 'teal' | 'amber' | 'none';
  onClick?: () => void;
  as?: 'div' | 'button' | 'article';
}

export default function GlassCard({
  children,
  className = '',
  glow = 'none',
  onClick,
  as: Tag = 'div',
}: GlassCardProps) {
  const glowStyle =
    glow === 'teal'  ? { borderColor: 'rgba(0,245,230,0.3)', boxShadow: '0 0 24px rgba(0,245,230,0.08), var(--shadow-glass)' } :
    glow === 'amber' ? { borderColor: 'rgba(255,191,0,0.3)', boxShadow: '0 0 24px rgba(255,191,0,0.08), var(--shadow-glass)' } :
    {};

  return (
    <Tag
      className={`glass-panel rounded-2xl ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={glowStyle}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
}
