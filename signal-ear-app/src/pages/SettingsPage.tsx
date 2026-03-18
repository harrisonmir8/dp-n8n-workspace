import { useState } from 'react';
import { Settings, Key, Globe, Users, Check, AlertCircle } from 'lucide-react';
import { brand24Service } from '../services/brand24';
import { outerSignalService } from '../services/outersignal';

const cardStyle: React.CSSProperties = {
  background: 'linear-gradient(145deg, rgba(26, 31, 78, 0.6), rgba(17, 22, 56, 0.8))',
  border: '1px solid rgba(99, 102, 241, 0.12)',
  borderRadius: 16,
  padding: 24,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 8,
  background: 'rgba(10, 14, 39, 0.6)',
  border: '1px solid rgba(99, 102, 241, 0.2)',
  color: '#fff',
  fontSize: 14,
  fontFamily: 'var(--se-font-body)',
  outline: 'none',
};

export function SettingsPage() {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div style={{ maxWidth: 700 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #94a3b8, #64748b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Settings size={24} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
            Settings
          </h1>
          <p style={{ color: 'var(--se-slate)', fontSize: 14 }}>
            Configure API integrations and app preferences
          </p>
        </div>
      </div>

      {/* Brand24 Config */}
      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <Globe size={20} color="#6366f1" />
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>Brand24 Integration</h3>
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: brand24Service.isConfigured() ? '#10b981' : '#f59e0b',
            }}
          >
            {brand24Service.isConfigured() ? <Check size={14} /> : <AlertCircle size={14} />}
            {brand24Service.isConfigured() ? 'Connected' : 'Not configured'}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--se-slate)', display: 'block', marginBottom: 6, fontWeight: 500 }}>
              API Key (VITE_BRAND24_API_KEY)
            </label>
            <input
              type="password"
              placeholder="Enter your Brand24 API key..."
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--se-slate)', display: 'block', marginBottom: 6, fontWeight: 500 }}>
              Project ID (VITE_BRAND24_PROJECT_ID)
            </label>
            <input
              type="text"
              placeholder="Enter your Brand24 project ID..."
              style={inputStyle}
            />
          </div>
          <p style={{ fontSize: 12, color: 'var(--se-slate)', lineHeight: 1.5 }}>
            Brand24 monitors online mentions of your brand across social media, news, blogs, forums, and more.
            Get your API key from{' '}
            <a href="https://app.brand24.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--se-cyan)' }}>
              app.brand24.com
            </a>.
            Set these values in your <code style={{ background: 'rgba(99,102,241,0.1)', padding: '2px 6px', borderRadius: 4, color: '#fff', fontSize: 11 }}>.env</code> file for persistent configuration.
          </p>
        </div>
      </div>

      {/* OuterSignal Config */}
      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <Users size={20} color="#06b6d4" />
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>OuterSignal Integration</h3>
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: outerSignalService.isConfigured() ? '#10b981' : '#f59e0b',
            }}
          >
            {outerSignalService.isConfigured() ? <Check size={14} /> : <AlertCircle size={14} />}
            {outerSignalService.isConfigured() ? 'Connected' : 'Not configured'}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--se-slate)', display: 'block', marginBottom: 6, fontWeight: 500 }}>
              API Key (VITE_OUTERSIGNAL_API_KEY)
            </label>
            <input
              type="password"
              placeholder="Enter your OuterSignal API key..."
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--se-slate)', display: 'block', marginBottom: 6, fontWeight: 500 }}>
              Workspace ID (VITE_OUTERSIGNAL_WORKSPACE_ID)
            </label>
            <input
              type="text"
              placeholder="Enter your OuterSignal workspace ID..."
              style={inputStyle}
            />
          </div>
          <p style={{ fontSize: 12, color: 'var(--se-slate)', lineHeight: 1.5 }}>
            OuterSignal enriches customer data with social profiles, interests, engagement scores, and audience segments.
            Set these values in your <code style={{ background: 'rgba(99,102,241,0.1)', padding: '2px 6px', borderRadius: 4, color: '#fff', fontSize: 11 }}>.env</code> file.
          </p>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        style={{
          padding: '12px 32px',
          borderRadius: 10,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
        }}
      >
        <Key size={16} />
        {saved ? 'Saved!' : 'Save Configuration'}
      </button>

      {saved && (
        <p style={{ marginTop: 12, fontSize: 13, color: '#10b981' }}>
          Configuration saved. For API keys, add them to your .env file and restart the app.
        </p>
      )}
    </div>
  );
}
