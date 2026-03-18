/**
 * Brand24 API Integration Service
 *
 * Brand24 is a brand listening/monitoring tool that tracks online mentions,
 * sentiment, and brand visibility across social media, news, blogs, forums, etc.
 *
 * API Docs: https://developers.brand24.com/
 *
 * To use with real data, set VITE_BRAND24_API_KEY in your .env file.
 */

import type { Brand24Mention, Brand24Stats } from '../types';
import { brand24Mentions, brand24Stats } from '../utils/mockData';

const API_BASE = 'https://api.brand24.com/v3';

interface Brand24Config {
  apiKey: string;
  projectId?: string;
}

function getConfig(): Brand24Config | null {
  const apiKey = import.meta.env.VITE_BRAND24_API_KEY;
  if (!apiKey) return null;
  return {
    apiKey,
    projectId: import.meta.env.VITE_BRAND24_PROJECT_ID,
  };
}

async function fetchBrand24<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const config = getConfig();
  if (!config) throw new Error('Brand24 API key not configured');

  const url = new URL(`${API_BASE}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error(`Brand24 API error: ${res.status}`);
  return res.json();
}

export async function getMentions(): Promise<Brand24Mention[]> {
  const config = getConfig();
  if (!config) return brand24Mentions; // Fallback to mock data

  try {
    const data = await fetchBrand24<{ mentions: Brand24Mention[] }>('/mentions', {
      projectId: config.projectId || '',
      limit: '50',
    });
    return data.mentions;
  } catch {
    console.warn('Brand24 API unavailable, using mock data');
    return brand24Mentions;
  }
}

export async function getStats(): Promise<Brand24Stats> {
  const config = getConfig();
  if (!config) return brand24Stats;

  try {
    const data = await fetchBrand24<Brand24Stats>('/stats', {
      projectId: config.projectId || '',
    });
    return data;
  } catch {
    console.warn('Brand24 API unavailable, using mock data');
    return brand24Stats;
  }
}

export async function searchMentions(query: string): Promise<Brand24Mention[]> {
  const config = getConfig();
  if (!config) {
    return brand24Mentions.filter(
      m => m.content.toLowerCase().includes(query.toLowerCase())
    );
  }

  try {
    const data = await fetchBrand24<{ mentions: Brand24Mention[] }>('/mentions/search', {
      query,
      projectId: config.projectId || '',
    });
    return data.mentions;
  } catch {
    console.warn('Brand24 API unavailable, using mock data');
    return brand24Mentions;
  }
}

export const brand24Service = {
  getMentions,
  getStats,
  searchMentions,
  isConfigured: () => !!getConfig(),
};
