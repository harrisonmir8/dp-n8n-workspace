// ── Signal Ear Types ──

export interface Signal {
  id: string;
  source: 'brand24' | 'outersignal' | 'social' | 'news' | 'review';
  type: 'mention' | 'sentiment' | 'trend' | 'competitor' | 'opportunity' | 'risk';
  title: string;
  description: string;
  sentiment: number; // -1 to 1
  strength: number; // 0 to 100
  reach: number;
  timestamp: string;
  tags: string[];
  url?: string;
  author?: string;
  platform?: string;
}

export interface SignalIndex {
  overall: number;
  sentiment: number;
  visibility: number;
  engagement: number;
  authority: number;
  momentum: number;
}

export interface ContentOpportunity {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'blog' | 'social' | 'video' | 'pr' | 'email' | 'ad' | 'seo';
  estimatedImpact: number;
  signals: string[]; // signal IDs that informed this
  suggestedActions: string[];
  status: 'new' | 'in_progress' | 'completed' | 'dismissed';
}

export interface Brand24Mention {
  id: string;
  content: string;
  source: string;
  sourceUrl: string;
  author: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  reach: number;
  importance: number;
  date: string;
  tags: string[];
}

export interface Brand24Stats {
  totalMentions: number;
  positiveMentions: number;
  negativeMentions: number;
  neutralMentions: number;
  totalReach: number;
  avgSentiment: number;
  topSources: { name: string; count: number }[];
  mentionTrend: { date: string; count: number }[];
}

export interface OuterSignalProfile {
  id: string;
  name: string;
  email?: string;
  company?: string;
  title?: string;
  industry?: string;
  interests: string[];
  engagementScore: number;
  socialProfiles: { platform: string; url: string; followers: number }[];
  enrichedAt: string;
}

export interface OuterSignalInsight {
  id: string;
  type: 'audience_segment' | 'interest_cluster' | 'engagement_pattern' | 'demographic';
  label: string;
  description: string;
  confidence: number;
  size: number;
  profiles: string[];
}

export interface DashboardFilter {
  dateRange: { start: string; end: string };
  sources: string[];
  sentimentRange: [number, number];
  signalTypes: string[];
}

export interface TrendPoint {
  date: string;
  value: number;
  label?: string;
}
