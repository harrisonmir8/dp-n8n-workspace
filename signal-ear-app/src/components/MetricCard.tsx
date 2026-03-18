import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  color?: string;
}

export function MetricCard({ label, value, change, icon: Icon, color = '#6366f1' }: MetricCardProps) {
  return (
    <div
      style={{
        background: 'var(--se-gradient-card)',
        border: '1px solid rgba(99, 102, 241, 0.12)',
        borderRadius: 'var(--se-radius)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: `${color}12`,
          border: `1px solid ${color}25`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={22} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 12, color: 'var(--se-slate)', marginBottom: 2, fontWeight: 500 }}>
          {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span
            style={{
              fontFamily: 'var(--se-font-display)',
              fontSize: 24,
              fontWeight: 700,
              color: '#fff',
            }}
          >
            {value}
          </span>
          {change !== undefined && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: change >= 0 ? '#10b981' : '#f43f5e',
              }}
            >
              {change >= 0 ? '+' : ''}{change}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
