import React, { useState } from 'react';

const careerRequirements = {
  'Software Engineer':    { Python: 3, JavaScript: 4, Java: 3, 'HTML/CSS': 3, 'React/Angular/Vue': 3, 'REST APIs': 3, Databases: 3, 'CI/CD Pipelines': 2 },
  'Data Analyst':         { Python: 3, SQL: 4, 'Data Analysis': 4, Statistics: 3, 'Data Visualization': 4 },
  'ML/AI Engineer':       { Python: 5, 'Machine Learning': 4, Statistics: 4, 'Data Analysis': 3, 'Big Data': 3 },
  'DevOps Engineer':      { Docker: 4, Kubernetes: 4, 'AWS/Azure/GCP': 4, 'CI/CD Pipelines': 5, Linux: 4 },
  'Full Stack Developer': { JavaScript: 4, 'HTML/CSS': 4, 'React/Angular/Vue': 4, 'Node.js': 4, Databases: 3, 'REST APIs': 4 },
};

const resourceLinks = {
  Python: 'https://roadmap.sh/python',
  JavaScript: 'https://roadmap.sh/javascript',
  'React/Angular/Vue': 'https://roadmap.sh/react',
  Docker: 'https://roadmap.sh/docker',
  Kubernetes: 'https://roadmap.sh/kubernetes',
  'Machine Learning': 'https://roadmap.sh/ai-data-scientist',
  SQL: 'https://roadmap.sh/sql',
};

function GapBar({ skill, userLevel, required }) {
  const gap = Math.max(0, required - userLevel);
  const pct = Math.min((userLevel / required) * 100, 100);
  const color = pct >= 100 ? '#10b981' : pct >= 60 ? '#eab308' : '#ef4444';
  const labels = ['', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <div style={{ background: 'rgba(79,70,229,0.05)', border: '1px solid rgba(79,70,229,0.12)', borderRadius: '12px', padding: '14px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#e2e8f0' }}>{skill}</span>
          {resourceLinks[skill] && gap > 0 && (
            <a href={resourceLinks[skill]} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: 'var(--primary-light)', textDecoration: 'none', background: 'rgba(129,140,248,0.12)', padding: '2px 8px', borderRadius: '4px' }}>
              Learn ↗
            </a>
          )}
        </div>
        <div style={{ fontSize: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>You: <b style={{ color: color }}>{labels[userLevel] || 'None'}</b></span>
          <span style={{ color: '#475569' }}>·</span>
          <span style={{ color: 'var(--text-muted)' }}>Need: <b style={{ color: 'var(--primary-light)' }}>{labels[required]}</b></span>
          {gap > 0 && <span style={{ background: '#ef444422', color: '#ef4444', borderRadius: '100px', padding: '1px 8px', fontSize: '11px', fontWeight: 600 }}>Gap: {gap}</span>}
          {gap === 0 && <span style={{ background: '#10b98122', color: '#10b981', borderRadius: '100px', padding: '1px 8px', fontSize: '11px', fontWeight: 600 }}>✓</span>}
        </div>
      </div>
      <div style={{ height: 6, background: 'rgba(79,70,229,0.15)', borderRadius: 3 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.7s ease' }} />
      </div>
    </div>
  );
}

export default function SkillGapIdentification({ navigate, assessmentData }) {
  const [selectedCareer, setSelectedCareer] = useState(null);

  if (!assessmentData) {
    return (
      <div style={pageStyle}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>◎</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '12px' }}>No Assessment Data</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Complete your skill assessment to identify gaps for your target career.</p>
          <button onClick={() => navigate('skill-assessment')} style={primaryBtn}>Take Assessment →</button>
        </div>
      </div>
    );
  }

  const ratings = assessmentData.ratings || {};
  const topCareer = assessmentData.topCareer;
  const activeCareer = selectedCareer || topCareer;
  const reqs = careerRequirements[activeCareer] || {};

  const gaps = Object.entries(reqs)
    .map(([skill, req]) => ({ skill, required: req, userLevel: ratings[skill] || 0, gap: Math.max(0, req - (ratings[skill] || 0)) }))
    .sort((a, b) => b.gap - a.gap);

  const gapCount = gaps.filter(g => g.gap > 0).length;
  const metCount = gaps.length - gapCount;
  const readiness = Math.round((metCount / gaps.length) * 100);

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>
        <button onClick={() => navigate('dashboard')} style={backBtn}>← Back to Dashboard</button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>Skill Gap Analysis</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>See exactly which skills to improve to reach your target career</p>

        {/* Career Selector */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {Object.keys(careerRequirements).map(career => (
            <button
              key={career}
              onClick={() => setSelectedCareer(career)}
              style={{
                padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                border: activeCareer === career ? '1px solid rgba(129,140,248,0.6)' : '1px solid rgba(79,70,229,0.2)',
                background: activeCareer === career ? 'rgba(79,70,229,0.2)' : 'rgba(79,70,229,0.05)',
                color: activeCareer === career ? 'var(--primary-light)' : 'var(--text-muted)',
                transition: 'all 0.2s ease',
              }}
            >
              {career === topCareer ? `✦ ${career}` : career}
            </button>
          ))}
        </div>

        {/* Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '28px' }}>
          {[
            { label: 'Career Readiness', value: `${readiness}%`, color: readiness >= 70 ? '#10b981' : readiness >= 50 ? '#eab308' : '#ef4444' },
            { label: 'Skills Met', value: `${metCount} / ${gaps.length}`, color: '#10b981' },
            { label: 'Gaps to Close', value: gapCount, color: '#ef4444' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: stat.color, marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Radial Readiness */}
        <div style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.12), rgba(124,58,237,0.08))', border: '1px solid rgba(129,140,248,0.25)', borderRadius: '16px', padding: '24px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
            <svg viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(79,70,229,0.15)" strokeWidth="8" />
              <circle cx="40" cy="40" r="32" fill="none"
                stroke={readiness >= 70 ? '#10b981' : readiness >= 50 ? '#eab308' : '#ef4444'}
                strokeWidth="8"
                strokeDasharray={`${(readiness / 100) * 201} 201`}
                strokeLinecap="round"
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {readiness}%
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, marginBottom: '4px' }}>
              {readiness >= 80 ? '🟢 You\'re nearly ready!' : readiness >= 50 ? '🟡 Good progress – keep going' : '🔴 Focus required to close gaps'}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Target: <b style={{ color: 'var(--primary-light)' }}>{activeCareer}</b> · {gapCount > 0 ? `Close ${gapCount} gap${gapCount > 1 ? 's' : ''} to qualify` : 'All required skills met!'}
            </div>
          </div>
        </div>

        {/* Skill Gaps */}
        <h2 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>
          ◎ Required Skills Breakdown
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
          {gaps.map(({ skill, required, userLevel }) => (
            <GapBar key={skill} skill={skill} userLevel={userLevel} required={required} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('learning-resources')} style={primaryBtn}>Find Learning Resources →</button>
          <button onClick={() => navigate('skill-assessment')} style={ghostBtn}>Retake Assessment</button>
        </div>
      </div>
    </div>
  );
}

const pageStyle = { minHeight: '100vh', background: 'var(--bg-dark)', padding: '40px 20px' };
const backBtn = { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 };
const primaryBtn = { background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'var(--text-primary)', border: 'none', borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px', boxShadow: '0 4px 16px rgba(79,70,229,0.35)' };
const ghostBtn = { background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(129,140,248,0.25)', color: 'var(--secondary-light)', borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px' };
