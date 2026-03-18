import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Globe,
  MessageCircle,
  Users,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Search,
  ExternalLink,
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { brand24Service } from '../services/brand24';
import type { Brand24Mention, Brand24Stats } from '../types';
import { brand24Stats as defaultStats, brand24Mentions as defaultMentions } from '../utils/mockData';

const cardStyle: React.CSSProperties = {
  background: 'linear-gradient(145deg, rgba(26, 31, 78, 0.6), rgba(17, 22, 56, 0.8))',
  border: '1px solid rgba(99, 102, 241, 0.12)',
  borderRadius: 16,
  padding: 24,
};

const sentimentIcons = {
  positive: ThumbsUp,
  negative: ThumbsDown,
  neutral: Minus,
};

const sentimentColors = {
  positive: '#10b981',
  negative: '#f43f5e',
  neutral: '#94a3b8',
};

function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function Brand24Page() {
  const [stats, setStats] = useState<Brand24Stats>(defaultStats);
  const [mentions, setMentions] = useState<Brand24Mention[]>(defaultMentions);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    async function loadData() {
      const [s, m] = await Promise.all([
        brand24Service.getStats(),
        brand24Service.getMentions(),
      ]);
      setStats(s);
      setMentions(m);
    }
    loadData();
  }, []);

  const filteredMentions = searchQuery
    ? mentions.filter(m =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mentions;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Globe size={24} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
            Brand24 Listening
          </h1>
          <p style={{ color: 'var(--se-slate)', fontSize: 14 }}>
            Real-time brand mention monitoring across the web
            {!brand24Service.isConfigured() && (
              <span style={{ color: 'var(--se-amber)', marginLeft: 8 }}>
                (Demo Mode — Add VITE_BRAND24_API_KEY for live data)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        <MetricCard label="Total Mentions" value={formatNumber(stats.totalMentions)} change={14} icon={MessageCircle} color="#6366f1" />
        <MetricCard label="Total Reach" value={formatNumber(stats.totalReach)} change={22} icon={Users} color="#06b6d4" />
        <MetricCard label="Positive" value={stats.positiveMentions} change={8} icon={ThumbsUp} color="#10b981" />
        <MetricCard label="Negative" value={stats.negativeMentions} change={-3} icon={ThumbsDown} color="#f43f5e" />
      </div>

      {/* Mention Trend */}
      <div style={{ ...cardStyle, marginBottom: 32 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 20 }}>
          Mention Volume (14 Days)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={stats.mentionTrend}>
            <defs>
              <linearGradient id="mentionGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              tickFormatter={d => d.slice(5)}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: '#1a1f4e',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 8,
                color: '#fff',
                fontSize: 12,
              }}
            />
            <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} fill="url(#mentionGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Mentions Feed */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Recent Mentions</h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(26, 31, 78, 0.6)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: 8,
              padding: '8px 12px',
              width: 280,
            }}
          >
            <Search size={16} color="var(--se-slate)" />
            <input
              type="text"
              placeholder="Search mentions..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: 13,
                width: '100%',
                fontFamily: 'var(--se-font-body)',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredMentions.map(mention => {
            const SentIcon = sentimentIcons[mention.sentiment];
            const sentColor = sentimentColors[mention.sentiment];
            return (
              <div
                key={mention.id}
                className="fade-in"
                style={{
                  ...cardStyle,
                  display: 'flex',
                  gap: 16,
                  padding: 20,
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.35)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.12)'; }}
              >
                {/* Sentiment Indicator */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: `${sentColor}15`,
                    border: `1px solid ${sentColor}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <SentIcon size={18} color={sentColor} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
                      {mention.author}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--se-slate)' }}>
                      on {mention.source}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--se-slate)' }}>
                      {new Date(mention.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--se-light)', lineHeight: 1.5, marginBottom: 8 }}>
                    {mention.content}
                  </p>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--se-slate)' }}>
                      Reach: {formatNumber(mention.reach)}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--se-slate)' }}>
                      Importance: {mention.importance}/10
                    </span>
                    {mention.tags.map(tag => (
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

                <ExternalLink size={16} color="var(--se-slate)" style={{ flexShrink: 0, marginTop: 4 }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
