import React, { useState } from 'react';
import SkillifyLogo from './SkillifyLogo';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '⬡' },
  { id: 'skill-assessment', label: 'Skill Assessment', icon: '◈' },
  { id: 'career-path', label: 'Career Paths', icon: '⤳' },
  { id: 'career-recommendation', label: 'Recommendations', icon: '✦' },
  { id: 'skill-gap', label: 'Skill Gap Analysis', icon: '◎' },
  { id: 'learning-resources', label: 'Learning Resources', icon: '⊛' },
  { id: 'progress', label: 'Progress & Analytics', icon: '⟁' },
];

export default function Sidebar({ currentPage, navigate, user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const basicDetails = [
    { label: 'Name', value: user?.name || 'N/A' },
    { label: 'Reg No', value: user?.regNo || 'N/A' },
    { label: 'Email', value: user?.email || 'N/A' },
    { label: 'Year', value: user?.year || 'N/A' },
    { label: 'Stream', value: user?.stream || 'N/A' },
  ];

  return (
    <aside style={{
      position: 'fixed',
      left: 0, top: 0, bottom: 0,
      width: collapsed ? '72px' : '260px',
      background: '#c8faf9',
      borderRight: '1px solid rgba(79,70,229,0.2)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      transition: 'width 0.3s ease',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(79,70,229,0.15)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <SkillifyLogo
          size={36}
          textSize={18}
          showText={!collapsed}
          subtitle={!collapsed ? 'SLIIT ITP Project' : undefined}
        />
        <button
          onClick={() => {
            setCollapsed(!collapsed);
            setShowUserDetails(false);
          }}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px', padding: '4px', flexShrink: 0 }}
        >{collapsed ? '→' : '←'}</button>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(79,70,229,0.1)' }}>
          <button
            onClick={() => setShowUserDetails((prev) => !prev)}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              padding: 0,
            }}
            title="View basic profile details"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)',
            }}>{user.name?.charAt(0)?.toUpperCase() || 'U'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.regNo || 'SLIIT Student'}</div>
            </div>
              <div style={{ fontSize: 12, color: '#334155', fontWeight: 700 }}>{showUserDetails ? '▲' : '▼'}</div>
            </div>
          </button>

          {showUserDetails && (
            <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(79,70,229,0.18)', borderRadius: 10, padding: '10px 12px', display: 'grid', gap: 6 }}>
              {basicDetails.map((item) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, color: '#334155', fontWeight: 700, letterSpacing: '0.02em' }}>{item.label}</span>
                  <span style={{ fontSize: 11, color: '#0f172a', fontWeight: 600, textAlign: 'right', wordBreak: 'break-word' }}>{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
        {navItems.map(item => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              title={collapsed ? item.label : ''}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                padding: collapsed ? '12px' : '11px 14px',
                marginBottom: '4px',
                borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: isActive ? 'linear-gradient(135deg, rgba(79,70,229,0.3), rgba(124,58,237,0.2))' : 'transparent',
                color: 'black',
                fontFamily: 'var(--font-body)', fontSize: '13.5px', fontWeight: 'bold',
                textAlign: 'left',
                borderLeft: isActive ? '2px solid var(--primary-light)' : '2px solid transparent',
                transition: 'all 0.2s ease',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(79,70,229,0.1)'; e.currentTarget.style.color = 'black'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'black'; } }}
            >
              <span style={{ fontSize: '18px', flexShrink: 0, width: '20px', textAlign: 'center' }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(79,70,229,0.15)' }}>
        <button
          onClick={onLogout}
          title={collapsed ? 'Logout' : ''}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
            padding: collapsed ? '12px' : '11px 14px',
            borderRadius: '10px', border: 'none', cursor: 'pointer',
            background: 'transparent', color: '#ef4444',
            fontFamily: 'var(--font-body)', fontSize: '13.5px', fontWeight: 'bold',
            transition: 'all 0.2s ease',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <span style={{ fontSize: '18px', flexShrink: 0, width: '20px', textAlign: 'center' }}>⟵</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
