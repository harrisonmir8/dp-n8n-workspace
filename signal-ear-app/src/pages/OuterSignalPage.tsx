import { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  Target,
  BarChart3,
  Linkedin,
  Twitter,
  Youtube,
  Mail,
  Building2,
  Briefcase,
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { outerSignalService } from '../services/outersignal';
import type { OuterSignalProfile, OuterSignalInsight } from '../types';
import { outerSignalProfiles as defaultProfiles, outerSignalInsights as defaultInsights } from '../utils/mockData';

const cardStyle: React.CSSProperties = {
  background: 'linear-gradient(145deg, rgba(26, 31, 78, 0.6), rgba(17, 22, 56, 0.8))',
  border: '1px solid rgba(99, 102, 241, 0.12)',
  borderRadius: 16,
  padding: 24,
};

const insightColors: Record<string, string> = {
  audience_segment: '#6366f1',
  interest_cluster: '#8b5cf6',
  engagement_pattern: '#06b6d4',
  demographic: '#10b981',
};

const platformIcons: Record<string, React.ElementType> = {
  LinkedIn: Linkedin,
  'Twitter/X': Twitter,
  YouTube: Youtube,
};

export function OuterSignalPage() {
  const [profiles, setProfiles] = useState<OuterSignalProfile[]>(defaultProfiles);
  const [insights, setInsights] = useState<OuterSignalInsight[]>(defaultInsights);

  useEffect(() => {
    async function loadData() {
      const [p, i] = await Promise.all([
        outerSignalService.getProfiles(),
        outerSignalService.getInsights(),
      ]);
      setProfiles(p);
      setInsights(i);
    }
    loadData();
  }, []);

  const totalProfiles = profiles.length;
  const avgEngagement = Math.round(profiles.reduce((a, p) => a + p.engagementScore, 0) / totalProfiles);
  const totalSegments = insights.length;
  const totalAudienceSize = insights.reduce((a, i) => a + i.size, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #06b6d4, #10b981)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Users size={24} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
            OuterSignal Enrichment
          </h1>
          <p style={{ color: 'var(--se-slate)', fontSize: 14 }}>
            Customer data enrichment and audience intelligence
            {!outerSignalService.isConfigured() && (
              <span style={{ color: 'var(--se-amber)', marginLeft: 8 }}>
                (Demo Mode — Add VITE_OUTERSIGNAL_API_KEY for live data)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        <MetricCard label="Enriched Profiles" value={totalProfiles} icon={UserCheck} color="#06b6d4" />
        <MetricCard label="Avg Engagement" value={`${avgEngagement}%`} change={6} icon={BarChart3} color="#8b5cf6" />
        <MetricCard label="Segments Found" value={totalSegments} icon={Target} color="#10b981" />
        <MetricCard label="Total Audience" value={totalAudienceSize.toLocaleString()} change={18} icon={Users} color="#f59e0b" />
      </div>

      {/* Audience Insights */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 20 }}>
          Audience Insights
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 16,
          }}
        >
          {insights.map(insight => (
            <div
              key={insight.id}
              className="fade-in"
              style={{
                ...cardStyle,
                borderLeft: `3px solid ${insightColors[insight.type]}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    color: insightColors[insight.type],
                    background: `${insightColors[insight.type]}15`,
                    padding: '3px 8px',
                    borderRadius: 4,
                  }}
                >
                  {insight.type.replace('_', ' ')}
                </span>
                <span style={{ fontSize: 11, color: 'var(--se-slate)' }}>
                  {Math.round(insight.confidence * 100)}% confidence
                </span>
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
                {insight.label}
              </h4>
              <p style={{ fontSize: 13, color: 'var(--se-slate)', lineHeight: 1.5, marginBottom: 12 }}>
                {insight.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 12, color: 'var(--se-slate)' }}>
                  <strong style={{ color: '#fff' }}>{insight.size.toLocaleString()}</strong> contacts
                </span>
                {/* Confidence bar */}
                <div style={{ flex: 1, height: 4, background: 'rgba(99,102,241,0.1)', borderRadius: 2 }}>
                  <div
                    style={{
                      width: `${insight.confidence * 100}%`,
                      height: '100%',
                      background: insightColors[insight.type],
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enriched Profiles */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 20 }}>
          Enriched Profiles
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {profiles.map(profile => (
            <div
              key={profile.id}
              className="fade-in"
              style={{
                ...cardStyle,
                display: 'flex',
                gap: 20,
                padding: 20,
                alignItems: 'center',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                {profile.name.split(' ').map(n => n[0]).join('')}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{profile.name}</span>
                  {profile.email && (
                    <Mail size={12} color="var(--se-slate)" />
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  {profile.title && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--se-slate)' }}>
                      <Briefcase size={12} /> {profile.title}
                    </span>
                  )}
                  {profile.company && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--se-slate)' }}>
                      <Building2 size={12} /> {profile.company}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {profile.interests.map(interest => (
                    <span
                      key={interest}
                      style={{
                        fontSize: 10,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: 'rgba(6, 182, 212, 0.1)',
                        color: '#06b6d4',
                        border: '1px solid rgba(6, 182, 212, 0.2)',
                      }}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Profiles */}
              <div style={{ display: 'flex', gap: 8 }}>
                {profile.socialProfiles.map(sp => {
                  const PlatformIcon = platformIcons[sp.platform] || Users;
                  return (
                    <div
                      key={sp.platform}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 8,
                        background: 'rgba(99, 102, 241, 0.08)',
                        border: '1px solid rgba(99, 102, 241, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <PlatformIcon size={14} color="var(--se-slate)" />
                      <span style={{ fontSize: 11, color: 'var(--se-slate)' }}>
                        {(sp.followers / 1000).toFixed(1)}K
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Engagement Score */}
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--se-font-display)',
                    fontSize: 24,
                    fontWeight: 700,
                    color: profile.engagementScore >= 80 ? '#10b981' : profile.engagementScore >= 60 ? '#f59e0b' : '#f43f5e',
                  }}
                >
                  {profile.engagementScore}
                </div>
                <div style={{ fontSize: 10, color: 'var(--se-slate)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Engagement
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
