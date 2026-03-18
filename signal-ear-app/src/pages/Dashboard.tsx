import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import {
  TrendingUp,
  Eye,
  MessageCircle,
  Zap,
} from 'lucide-react';
import { SignalIndexGauge } from '../components/SignalIndexGauge';
import { SignalCard } from '../components/SignalCard';
import { MetricCard } from '../components/MetricCard';
import {
  signalIndex,
  signals,
  signalTrend,
  radarData,
  sentimentDistribution,
  brand24Stats,
} from '../utils/mockData';

const cardStyle: React.CSSProperties = {
  background: 'linear-gradient(145deg, rgba(26, 31, 78, 0.6), rgba(17, 22, 56, 0.8))',
  border: '1px solid rgba(99, 102, 241, 0.12)',
  borderRadius: 16,
  padding: 24,
};

export function Dashboard() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 8,
          }}
        >
          Signal Index
        </h1>
        <p style={{ color: 'var(--se-slate)', fontSize: 15 }}>
          Your brand's real-time health score across all listening channels
        </p>
      </div>

      {/* Top Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        <MetricCard label="Overall Score" value={signalIndex.overall} change={8} icon={TrendingUp} color="#6366f1" />
        <MetricCard label="Visibility" value={signalIndex.visibility} change={12} icon={Eye} color="#06b6d4" />
        <MetricCard label="Engagement" value={signalIndex.engagement} change={5} icon={MessageCircle} color="#8b5cf6" />
        <MetricCard label="Momentum" value={signalIndex.momentum} change={15} icon={Zap} color="#f59e0b" />
      </div>

      {/* Signal Index Gauge + Radar + Trend */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr 1fr',
          gap: 24,
          marginBottom: 32,
        }}
      >
        {/* Main Gauge */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <SignalIndexGauge value={signalIndex.overall} label="Signal Index" size={200} />
          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            <MiniStat label="Sentiment" value={signalIndex.sentiment} color="#10b981" />
            <MiniStat label="Authority" value={signalIndex.authority} color="#f59e0b" />
          </div>
        </div>

        {/* Radar Chart */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 16 }}>
            Signal Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(99, 102, 241, 0.15)" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <Radar
                dataKey="value"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Line */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 16 }}>
            14-Day Signal Trend
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={signalTrend}>
              <defs>
                <linearGradient id="signalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                tickFormatter={d => d.slice(5)}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[50, 100]}
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a1f4e',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#signalGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sentiment + Sources Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          marginBottom: 32,
        }}
      >
        {/* Sentiment Breakdown */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 16 }}>
            Sentiment Distribution
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={sentimentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sentimentDistribution.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sentimentDistribution.map(item => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                  <span style={{ fontSize: 13, color: 'var(--se-slate)' }}>
                    {item.name}: <span style={{ color: '#fff', fontWeight: 600 }}>{item.value}%</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Source Breakdown */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 16 }}>
            Mentions by Source
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={brand24Stats.topSources} layout="vertical">
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={80}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a1f4e',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Signal Feed */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Live Signal Feed</h2>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px rgba(16,185,129,0.5)',
            }}
          />
          <span style={{ fontSize: 12, color: 'var(--se-slate)' }}>
            {signals.length} signals detected
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {signals.map(signal => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: 'var(--se-font-display)' }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: 'var(--se-slate)', textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </div>
    </div>
  );
}
