type BadgeVariant = 'running' | 'idle' | 'online' | 'error' | 'done';

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  dot?: boolean;
}

const DOT_COLORS: Record<BadgeVariant, string> = {
  running: '#FFBF00',
  idle:    '#52525b',
  online:  '#00F5E6',
  error:   '#f87171',
  done:    '#4ade80',
};

const DEFAULT_LABELS: Record<BadgeVariant, string> = {
  running: 'Running',
  idle:    'Idle',
  online:  'Online',
  error:   'Error',
  done:    'Concluído',
};

export default function Badge({ variant, label, dot = true }: BadgeProps) {
  return (
    <span className={`badge badge-${variant}`}>
      {dot && (
        <span
          className="inline-block rounded-full"
          style={{
            width: 6, height: 6,
            background: DOT_COLORS[variant],
            boxShadow: `0 0 6px ${DOT_COLORS[variant]}`,
            flexShrink: 0,
          }}
        />
      )}
      {label ?? DEFAULT_LABELS[variant]}
    </span>
  );
}
