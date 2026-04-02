import React, { useState } from 'react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const mockHistory = [
  { month: 'Jan', overall: 45, programming: 50, data: 30, infra: 20, soft: 65 },
  { month: 'Feb', overall: 52, programming: 58, data: 38, infra: 25, soft: 70 },
  { month: 'Mar', overall: 58, programming: 63, data: 45, infra: 32, soft: 73 },
  { month: 'Apr', overall: 63, programming: 68, data: 52, infra: 40, soft: 75 },
  { month: 'May', overall: 70, programming: 74, data: 60, infra: 48, soft: 78 },
];

export default function ProgressTracking({ navigate, user, assessmentData }) {
  const [activeMetric, setActiveMetric] = useState('overall');

  const history = assessmentData ? [...mockHistory, {
    month: 'Current',
    overall: assessmentData.overallScore || 72,
    programming: computeCategory(assessmentData.skills, ['JavaScript / TypeScript', 'Python', 'React / Angular / Vue', 'Node.js / Backend Dev', 'SQL / Databases']),
    data: computeCategory(assessmentData.skills, ['Data Analysis', 'Machine Learning / AI', 'Data Visualization', 'Statistics & Probability']),
    infra: computeCategory(assessmentData.skills, ['Cloud Platforms (AWS/Azure/GCP)', 'Docker & Kubernetes', 'CI/CD Pipelines', 'Linux / System Admin']),
    soft: computeCategory(assessmentData.skills, ['Problem Solving', 'Communication', 'Teamwork & Collaboration', 'Time Management', 'Leadership']),
  }] : mockHistory;

  const latest = history[history.length - 1];
  const prev = history.length > 1 ? history[history.length - 2] : null;
  const change = prev ? latest[activeMetric] - prev[activeMetric] : 0;

  const metrics = [
    { key: 'overall', label: 'Overall', color: 'var(--primary-light)' },
    { key: 'programming', label: 'Programming', color: 'var(--primary)' },
    { key: 'data', label: 'Data & Analytics', color: 'var(--secondary)' },
    { key: 'infra', label: 'Infrastructure', color: '#06b6d4' },
    { key: 'soft', label: 'Soft Skills', color: '#10b981' },
  ];

  const maxVal = Math.max(...history.map(h => h[activeMetric] || 0), 100);
  const active = metrics.find(m => m.key === activeMetric);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
        <button onClick={() => navigate('dashboard')} style={backBtn}>← Back to Dashboard</button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>Progress & Analytics</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>Track your skill development over time</p>

        {/* Score cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '32px' }}>
          {metrics.map(m => (
            <button key={m.key} onClick={() => setActiveMetric(m.key)} style={{
              background: activeMetric === m.key ? 'rgba(79,70,229,0.2)' : 'var(--bg-card)',
              border: `1px solid ${activeMetric === m.key ? 'rgba(129,140,248,0.5)' : 'rgba(79,70,229,0.2)'}`,
              borderRadius: '14px', padding: '18px', cursor: 'pointer', textAlign: 'center',
              transition: 'all 0.2s',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: m.color }}>{latest[m.key]}%</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{m.label}</div>
            </button>
          ))}
        </div>

        {/* Chart */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}>{active.label} Progress</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>6-month trend</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: active.color }}>{latest[activeMetric]}%</span>
              {change !== 0 && (
                <span style={{ fontSize: '13px', fontWeight: 600, color: change > 0 ? '#10b981' : '#ef4444', background: change > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '4px 10px', borderRadius: '100px' }}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
              )}
            </div>
          </div>

          {/* Bar chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: 180 }}>
            {history.map((h, i) => {
              const val = h[activeMetric] || 0;
              const height = (val / maxVal) * 160;
              const isLast = i === history.length - 1;
              return (
                <div key={h.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '11px', color: active.color, fontWeight: isLast ? 700 : 400 }}>{val}%</div>
                  <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                      width: '80%', height: `${height}px`,
                      background: isLast ? `linear-gradient(180deg, ${active.color}, ${active.color}88)` : `${active.color}33`,
                      borderRadius: '6px 6px 2px 2px',
                      border: isLast ? `1px solid ${active.color}88` : 'none',
                      transition: 'height 0.6s ease',
                      boxShadow: isLast ? `0 0 16px ${active.color}44` : 'none',
                    }} />
                  </div>
                  <div style={{ fontSize: '11px', color: isLast ? 'var(--primary-light)' : '#475569', fontWeight: isLast ? 700 : 400 }}>{h.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill breakdown */}
        {assessmentData && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', marginBottom: '28px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Individual Skill Scores</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {Object.entries(assessmentData.skills || {}).map(([skill, score]) => (
                <div key={skill}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                    <span style={{ color: '#e2e8f0' }}>{skill}</span>
                    <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{['None','Beginner','Intermediate','Advanced','Expert'][score]}</span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(79,70,229,0.1)', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${(score / 4) * 100}%`, background: score >= 3 ? '#10b981' : score >= 2 ? 'var(--primary-light)' : '#f59e0b', borderRadius: 3, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Achievements</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { title: 'First Assessment', desc: 'Completed skill assessment', icon: '◈', earned: !!assessmentData },
              { title: 'Explorer', desc: 'Viewed career paths', icon: '⤳', earned: true },
              { title: 'Gap Hunter', desc: 'Identified skill gaps', icon: '◎', earned: !!assessmentData },
              { title: 'Learner', desc: 'Explored resources', icon: '⊛', earned: true },
              { title: 'Analyst', desc: 'Used progress tracker', icon: '⟁', earned: true },
              { title: 'All-Rounder', desc: 'All skills ≥ Intermediate', icon: '✦', earned: assessmentData ? Object.values(assessmentData.skills || {}).every(v => v >= 2) : false },
            ].map(a => (
              <div key={a.title} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: a.earned ? 'rgba(79,70,229,0.12)' : 'rgba(79,70,229,0.04)', border: `1px solid ${a.earned ? 'rgba(129,140,248,0.3)' : 'rgba(79,70,229,0.1)'}`, borderRadius: '12px', opacity: a.earned ? 1 : 0.4 }}>
                <div style={{ fontSize: '24px' }}>{a.icon}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: a.earned ? 'var(--text-primary)' : 'var(--text-muted)' }}>{a.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{a.desc}</div>
                </div>
                {a.earned && <div style={{ marginLeft: 'auto', color: '#10b981', fontSize: '14px' }}>✓</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function computeCategory(skills, keys) {
  if (!skills) return 50;
  const vals = keys.map(k => skills[k] ?? 0);
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.round((avg / 4) * 100);
}

const backBtn = { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 };
