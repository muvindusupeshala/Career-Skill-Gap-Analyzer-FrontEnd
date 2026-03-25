import React, { useState } from 'react';

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
        <div style={{
          width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)',
          boxShadow: '0 0 20px rgba(79,70,229,0.5)',
        }}>S</div>
        {!collapsed && (
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.2 }}>Skillify</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>SLIIT ITP Project</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px', padding: '4px', flexShrink: 0 }}
        >{collapsed ? '→' : '←'}</button>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(79,70,229,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)',
            }}>{user.name?.charAt(0)?.toUpperCase() || 'U'}</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.regNo || 'SLIIT Student'}</div>
            </div>
          </div>
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
