import { type ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-8 py-5"
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(9,9,11,0.6)',
        backdropFilter: 'blur(12px)',
        minHeight: 'var(--header-h)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      <div>
        <h1
          className="font-space font-bold text-xl text-white leading-tight"
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </header>
  );
}
