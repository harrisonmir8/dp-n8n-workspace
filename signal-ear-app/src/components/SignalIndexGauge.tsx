interface GaugeProps {
  value: number;
  label: string;
  size?: number;
  color?: string;
}

export function SignalIndexGauge({ value, label, size = 180, color = '#6366f1' }: GaugeProps) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;
  const dashOffset = circumference - progress;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(99, 102, 241, 0.1)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s ease-out',
              filter: `drop-shadow(0 0 8px ${color}40)`,
            }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--se-font-display)',
              fontSize: size * 0.28,
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1,
            }}
          >
            {value}
          </span>
          <span style={{ fontSize: 11, color: 'var(--se-slate)', marginTop: 4 }}>/ 100</span>
        </div>
      </div>
      <span
        style={{
          fontFamily: 'var(--se-font-display)',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--se-slate)',
          textTransform: 'uppercase',
          letterSpacing: 1.5,
        }}
      >
        {label}
      </span>
    </div>
  );
}
