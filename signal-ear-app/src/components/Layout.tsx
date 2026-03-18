import { useState } from 'react';
import {
  Radio,
  BarChart3,
  Globe,
  Users,
  Lightbulb,
  Settings,
  Menu,
  X,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Signal Index', icon: BarChart3 },
  { id: 'brand24', label: 'Brand24', icon: Globe },
  { id: 'outersignal', label: 'OuterSignal', icon: Users },
  { id: 'opportunities', label: 'Opportunities', icon: Lightbulb },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Layout({ children, activePage, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? 240 : 72,
          background: 'linear-gradient(180deg, #111638 0%, #0a0e27 100%)',
          borderRight: '1px solid rgba(99, 102, 241, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '20px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
            minHeight: 72,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Radio size={22} color="#fff" />
          </div>
          {sidebarOpen && (
            <span
              style={{
                fontFamily: 'var(--se-font-display)',
                fontWeight: 700,
                fontSize: 18,
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                whiteSpace: 'nowrap',
              }}
            >
              Signal Ear
            </span>
          )}
        </div>

        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: 'none',
            color: 'var(--se-slate)',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarOpen ? 'flex-end' : 'center',
          }}
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.1))'
                    : 'transparent',
                  color: isActive ? '#fff' : 'var(--se-slate)',
                  transition: 'all 0.2s',
                  border: isActive ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                  whiteSpace: 'nowrap',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <Icon size={20} style={{ flexShrink: 0 }} />
                {sidebarOpen && item.label}
              </button>
            );
          })}
        </nav>

        {/* Status */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid rgba(99, 102, 241, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
            }}
          />
          {sidebarOpen && (
            <span style={{ fontSize: 12, color: 'var(--se-slate)' }}>
              Live Monitoring
            </span>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? 240 : 72,
          transition: 'margin-left 0.3s ease',
          padding: '24px 32px',
          minHeight: '100vh',
        }}
      >
        {children}
      </main>
    </div>
  );
}
