import { useState } from 'react';
import {
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Share2,
  Video,
  Megaphone,
  Mail,
  Target,
  Search as SearchIcon,
  Zap,
} from 'lucide-react';
import type { ContentOpportunity } from '../types';
import { contentOpportunities as defaultOpportunities } from '../utils/mockData';

const cardStyle: React.CSSProperties = {
  background: 'linear-gradient(145deg, rgba(26, 31, 78, 0.6), rgba(17, 22, 56, 0.8))',
  border: '1px solid rgba(99, 102, 241, 0.12)',
  borderRadius: 16,
  padding: 24,
};

const categoryIcons: Record<string, React.ElementType> = {
  blog: FileText,
  social: Share2,
  video: Video,
  pr: Megaphone,
  email: Mail,
  ad: Target,
  seo: SearchIcon,
};

const categoryColors: Record<string, string> = {
  blog: '#6366f1',
  social: '#8b5cf6',
  video: '#f43f5e',
  pr: '#06b6d4',
  email: '#f59e0b',
  ad: '#10b981',
  seo: '#ec4899',
};

const priorityColors = {
  high: '#f43f5e',
  medium: '#f59e0b',
  low: '#10b981',
};

const statusIcons: Record<string, React.ElementType> = {
  new: Lightbulb,
  in_progress: Clock,
  completed: CheckCircle2,
  dismissed: XCircle,
};

export function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<ContentOpportunity[]>(defaultOpportunities);
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all'
    ? opportunities
    : opportunities.filter(o => o.priority === filter || o.category === filter || o.status === filter);

  function updateStatus(id: string, status: ContentOpportunity['status']) {
    setOpportunities(prev =>
      prev.map(o => (o.id === id ? { ...o, status } : o))
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #f59e0b, #f43f5e)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Lightbulb size={24} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
            Content Opportunities & Next Steps
          </h1>
          <p style={{ color: 'var(--se-slate)', fontSize: 14 }}>
            AI-recommended actions based on your signal intelligence
          </p>
        </div>
      </div>

      {/* Summary Bar */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}
      >
        {['all', 'high', 'medium', 'low'].map(f => {
          const count = f === 'all' ? opportunities.length : opportunities.filter(o => o.priority === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                background: filter === f
                  ? (f === 'all' ? 'linear-gradient(135deg, #6366f1, #06b6d4)' : `${priorityColors[f as keyof typeof priorityColors]}20`)
                  : 'rgba(26, 31, 78, 0.6)',
                color: filter === f ? '#fff' : 'var(--se-slate)',
                border: filter === f
                  ? '1px solid rgba(99,102,241,0.4)'
                  : '1px solid rgba(99,102,241,0.12)',
                transition: 'all 0.2s',
                textTransform: 'capitalize',
              }}
            >
              {f === 'all' ? 'All' : f} ({count})
            </button>
          );
        })}
      </div>

      {/* Opportunities Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {filtered.map(opp => {
          const CatIcon = categoryIcons[opp.category] || FileText;
          const StatusIcon = statusIcons[opp.status];
          const catColor = categoryColors[opp.category];

          return (
            <div
              key={opp.id}
              className="fade-in"
              style={{
                ...cardStyle,
                borderLeft: `3px solid ${priorityColors[opp.priority]}`,
              }}
            >
              {/* Top Row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: `${catColor}15`,
                    border: `1px solid ${catColor}25`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CatIcon size={20} color={catColor} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        color: priorityColors[opp.priority],
                        background: `${priorityColors[opp.priority]}15`,
                        padding: '2px 8px',
                        borderRadius: 4,
                      }}
                    >
                      {opp.priority} priority
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        color: catColor,
                      }}
                    >
                      {opp.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                    {opp.title}
                  </h3>

                  <p style={{ fontSize: 14, color: 'var(--se-slate)', lineHeight: 1.6 }}>
                    {opp.description}
                  </p>
                </div>

                {/* Impact Score */}
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div
                    style={{
                      fontFamily: 'var(--se-font-display)',
                      fontSize: 28,
                      fontWeight: 800,
                      color: opp.estimatedImpact >= 80 ? '#10b981' : opp.estimatedImpact >= 60 ? '#f59e0b' : '#94a3b8',
                    }}
                  >
                    {opp.estimatedImpact}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--se-slate)', textTransform: 'uppercase', letterSpacing: 1 }}>
                    Impact
                  </div>
                </div>
              </div>

              {/* Suggested Actions */}
              <div
                style={{
                  background: 'rgba(10, 14, 39, 0.5)',
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <h5 style={{ fontSize: 12, fontWeight: 600, color: 'var(--se-cyan)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Suggested Next Steps
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {opp.suggestedActions.map((action, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ArrowRight size={14} color="var(--se-electric)" />
                      <span style={{ fontSize: 13, color: 'var(--se-light)' }}>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                {opp.status === 'new' && (
                  <>
                    <button
                      onClick={() => updateStatus(opp.id, 'in_progress')}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 8,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Zap size={14} /> Start Working
                    </button>
                    <button
                      onClick={() => updateStatus(opp.id, 'dismissed')}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 8,
                        background: 'rgba(99,102,241,0.08)',
                        border: '1px solid rgba(99,102,241,0.15)',
                        color: 'var(--se-slate)',
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      Dismiss
                    </button>
                  </>
                )}
                {opp.status === 'in_progress' && (
                  <button
                    onClick={() => updateStatus(opp.id, 'completed')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <CheckCircle2 size={14} /> Mark Complete
                  </button>
                )}
                {(opp.status === 'completed' || opp.status === 'dismissed') && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <StatusIcon size={16} color={opp.status === 'completed' ? '#10b981' : '#94a3b8'} />
                    <span style={{ fontSize: 12, color: opp.status === 'completed' ? '#10b981' : '#94a3b8', textTransform: 'capitalize' }}>
                      {opp.status.replace('_', ' ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
