import {
  Globe,
  TrendingUp,
  AlertTriangle,
  Zap,
  Users,
  MessageSquare,
  Star,
} from 'lucide-react';
import type { Signal } from '../types';

const typeIcons: Record<string, React.ElementType> = {
  mention: MessageSquare,
  sentiment: Star,
  trend: TrendingUp,
  competitor: AlertTriangle,
  opportunity: Zap,
  risk: AlertTriangle,
};

const sourceColors: Record<string, string> = {
  brand24: '#6366f1',
  outersignal: '#06b6d4',
  social: '#8b5cf6',
  news: '#f59e0b',
  review: '#f43f5e',
};

function getSentimentColor(s: number) {
  if (s > 0.3) return '#10b981';
  if (s < -0.3) return '#f43f5e';
  return '#94a3b8';
}

function formatReach(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export function SignalCard({ signal }: { signal: Signal }) {
  const Icon = typeIcons[signal.type] || Globe;
  const sentColor = getSentimentColor(signal.sentiment);

  return (
    <div
      className="fade-in"
      style={{
        background: 'var(--se-gradient-card)',
        border: '1px solid rgba(99, 102, 241, 0.15)',
        borderRadius: 'var(--se-radius)',
        padding: 20,
        display: 'flex',
        gap: 16,
        transition: 'all 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99, 102, 241, 0.4)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99, 102, 241, 0.15)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: `${sourceColors[signal.source]}15`,
          border: `1px solid ${sourceColors[signal.source]}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={20} color={sourceColors[signal.source]} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: sourceColors[signal.source],
              background: `${sourceColors[signal.source]}15`,
              padding: '2px 8px',
              borderRadius: 4,
            }}
          >
            {signal.source}
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: 'var(--se-slate)',
            }}
          >
            {signal.type}
          </span>
          {signal.platform && (
            <span style={{ fontSize: 11, color: 'var(--se-slate)' }}>
              via {signal.platform}
            </span>
          )}
        </div>

        <h4 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 6 }}>
          {signal.title}
        </h4>

        <p style={{ fontSize: 13, color: 'var(--se-slate)', lineHeight: 1.5, marginBottom: 10 }}>
          {signal.description}
        </p>

        {/* Metrics Row */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Sentiment */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: sentColor,
                boxShadow: `0 0 6px ${sentColor}80`,
              }}
            />
            <span style={{ fontSize: 12, color: sentColor, fontWeight: 500 }}>
              {signal.sentiment > 0 ? '+' : ''}{(signal.sentiment * 100).toFixed(0)}%
            </span>
          </div>

          {/* Strength */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Zap size={12} color="var(--se-amber)" />
            <span style={{ fontSize: 12, color: 'var(--se-slate)' }}>
              {signal.strength} strength
            </span>
          </div>

          {/* Reach */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Users size={12} color="var(--se-cyan)" />
            <span style={{ fontSize: 12, color: 'var(--se-slate)' }}>
              {formatReach(signal.reach)} reach
            </span>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {signal.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                style={{
                  fontSize: 10,
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: 'var(--se-slate)',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Strength Bar */}
      <div
        style={{
          width: 4,
          borderRadius: 2,
          background: 'rgba(99, 102, 241, 0.1)',
          alignSelf: 'stretch',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: `${signal.strength}%`,
            borderRadius: 2,
            background: `linear-gradient(to top, ${sourceColors[signal.source]}, ${sourceColors[signal.source]}80)`,
            transition: 'height 1s ease-out',
          }}
        />
      </div>
    </div>
  );
}
