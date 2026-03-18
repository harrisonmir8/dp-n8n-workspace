/**
 * OuterSignal API Integration Service
 *
 * OuterSignal is a customer data enrichment tool that provides deep
 * insights into audience segments, contact enrichment, intent signals,
 * and engagement patterns.
 *
 * To use with real data, set VITE_OUTERSIGNAL_API_KEY in your .env file.
 */

import type { OuterSignalProfile, OuterSignalInsight } from '../types';
import { outerSignalProfiles, outerSignalInsights } from '../utils/mockData';

const API_BASE = 'https://api.outersignal.com/v1';

interface OuterSignalConfig {
  apiKey: string;
  workspaceId?: string;
}

function getConfig(): OuterSignalConfig | null {
  const apiKey = import.meta.env.VITE_OUTERSIGNAL_API_KEY;
  if (!apiKey) return null;
  return {
    apiKey,
    workspaceId: import.meta.env.VITE_OUTERSIGNAL_WORKSPACE_ID,
  };
}

async function fetchOuterSignal<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const config = getConfig();
  if (!config) throw new Error('OuterSignal API key not configured');

  const url = new URL(`${API_BASE}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: {
      'X-API-Key': config.apiKey,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error(`OuterSignal API error: ${res.status}`);
  return res.json();
}

export async function getProfiles(): Promise<OuterSignalProfile[]> {
  const config = getConfig();
  if (!config) return outerSignalProfiles;

  try {
    const data = await fetchOuterSignal<{ profiles: OuterSignalProfile[] }>('/profiles', {
      workspaceId: config.workspaceId || '',
    });
    return data.profiles;
  } catch {
    console.warn('OuterSignal API unavailable, using mock data');
    return outerSignalProfiles;
  }
}

export async function getInsights(): Promise<OuterSignalInsight[]> {
  const config = getConfig();
  if (!config) return outerSignalInsights;

  try {
    const data = await fetchOuterSignal<{ insights: OuterSignalInsight[] }>('/insights', {
      workspaceId: config.workspaceId || '',
    });
    return data.insights;
  } catch {
    console.warn('OuterSignal API unavailable, using mock data');
    return outerSignalInsights;
  }
}

export async function enrichContact(email: string): Promise<OuterSignalProfile | null> {
  const config = getConfig();
  if (!config) {
    return outerSignalProfiles.find(p => p.email === email) || null;
  }

  try {
    const data = await fetchOuterSignal<OuterSignalProfile>('/enrich', { email });
    return data;
  } catch {
    console.warn('OuterSignal API unavailable');
    return null;
  }
}

export const outerSignalService = {
  getProfiles,
  getInsights,
  enrichContact,
  isConfigured: () => !!getConfig(),
};
