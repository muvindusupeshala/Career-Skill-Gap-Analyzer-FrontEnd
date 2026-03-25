import React from 'react';

const quickActions = [
  { id: 'skill-assessment', label: 'Take Assessment', icon: '◈', color: 'var(--primary)', desc: 'Evaluate your skills' },
  { id: 'career-recommendation', label: 'Get Recommended', icon: '✦', color: 'var(--secondary)', desc: 'Find your best career' },
  { id: 'skill-gap', label: 'View Skill Gaps', icon: '◎', color: '#6d28d9', desc: 'See what to improve' },
  { id: 'learning-resources', label: 'Start Learning', icon: '⊛', color: '#4338ca', desc: 'Access courses' },
  { id: 'career-path', label: 'Career Paths', icon: '⤳', color: '#5b21b6', desc: 'Explore IT roles' },
  { id: 'progress', label: 'View Progress', icon: '⟁', color: '#7e22ce', desc: 'Track your growth' },
];

export default function Dashboard({ navigate, user, assessmentData }) {
  const hasAssessment = !!assessmentData;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', padding: '40px', position: 'relative' }}>
      {/* Glow */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: 600, height: 400, background: 'radial-gradient(circle at 80% 0%, rgba(124,58,237,0.08), transparent)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ marginBottom: '36px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, marginBottom: '4px' }}>
          Welcome back, <span style={{ background: 'linear-gradient(135deg, var(--primary-light), var(--secondary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
          {hasAssessment ? 'Your assessment is complete. Explore your career insights.' : 'Start your skill assessment to get personalized career guidance.'}
        </p>
      </div>

      {/* Status Banner */}
      {!hasAssessment && (
        <div style={{
          marginBottom: '32px', padding: '20px 24px',
          background: 'linear-gradient(135deg, rgba(79,70,229,0.15), rgba(124,58,237,0.1))',
          border: '1px solid rgba(129,140,248,0.3)',
          borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
          position: 'relative', zIndex: 1,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>
              ◈ Complete Your Skill Assessment
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Answer a quick questionnaire to unlock career recommendations and gap analysis.</div>
          </div>
          <button onClick={() => navigate('skill-assessment')} style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'var(--text-primary)', border: 'none', borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px', boxShadow: '0 4px 16px rgba(79,70,229,0.4)', whiteSpace: 'nowrap' }}>
            Start Now →
          </button>
        </div>
      )}

      {/* Stats Row */}
      {hasAssessment && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
          {[
            { label: 'Overall Score', value: `${assessmentData?.overallScore || 72}%`, icon: '◈', trend: '+5%' },
            { label: 'Best Match', value: assessmentData?.topCareer || 'Software Eng.', icon: '✦', trend: '87%' },
            { label: 'Skill Gaps', value: assessmentData?.gapCount || '4', icon: '◎', trend: 'Skills' },
            { label: 'Resources', value: '12', icon: '⊛', trend: 'Available' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontSize: '20px', marginBottom: '10px' }}>{stat.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--primary-light)', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '12px' }}>
          ✦ Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {quickActions.map(action => (
            <ActionCard key={action.id} {...action} onClick={() => navigate(action.id)} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ marginTop: '40px', position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontSize: '12px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          ⟁ Recent Activity
        </h2>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
          {[
            { action: 'Account Created', time: 'Just now', icon: '✓' },
            { action: hasAssessment ? 'Skill Assessment Completed' : 'Skill Assessment — Pending', time: hasAssessment ? 'Recently' : 'Not started', icon: hasAssessment ? '◈' : '○' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderBottom: i === 0 ? '1px solid rgba(79,70,229,0.1)' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(79,70,229,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: 'var(--primary-light)', flexShrink: 0 }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#e2e8f0' }}>{item.action}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActionCard({ label, icon, color, desc, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: '14px', padding: '22px',
      cursor: 'pointer', textAlign: 'left',
      transition: 'all 0.25s ease', color: 'var(--text-primary)',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.4)'; e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.3)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(79,70,229,0.2)'; e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ width: 40, height: 40, borderRadius: '10px', background: `${color}22`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{icon}</div>
        <span style={{ fontSize: '18px', color: '#475569' }}>→</span>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{desc}</div>
    </button>
  );
}
