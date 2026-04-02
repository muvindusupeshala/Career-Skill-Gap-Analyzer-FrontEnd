import React, { useState } from 'react';

const careerRequirements = {
  'Software Engineer': { 'JavaScript / TypeScript': 3, 'React / Angular / Vue': 3, 'Node.js / Backend Dev': 3, 'SQL / Databases': 2, 'Problem Solving': 4, 'Communication': 2 },
  'Data Analyst': { 'Python': 3, 'SQL / Databases': 4, 'Data Analysis': 4, 'Data Visualization': 3, 'Statistics & Probability': 3, 'Communication': 3 },
  'ML/AI Engineer': { 'Python': 4, 'Machine Learning / AI': 4, 'Data Analysis': 3, 'Statistics & Probability': 4, 'SQL / Databases': 2, 'Problem Solving': 4 },
  'DevOps Engineer': { 'Cloud Platforms (AWS/Azure/GCP)': 4, 'Docker & Kubernetes': 4, 'CI/CD Pipelines': 4, 'Linux / System Admin': 3, 'Problem Solving': 3 },
  'Full Stack Developer': { 'JavaScript / TypeScript': 4, 'React / Angular / Vue': 3, 'Node.js / Backend Dev': 3, 'SQL / Databases': 3, 'Python': 2, 'Problem Solving': 3 },
};

const levels = ['None', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
const gapLabel = (diff) => {
  if (diff <= 0) return { text: 'Met ✓', color: '#10b981' };
  if (diff === 1) return { text: '+1 Level', color: '#f59e0b' };
  if (diff === 2) return { text: '+2 Levels', color: '#f97316' };
  return { text: 'Critical', color: '#ef4444' };
};

export default function SkillGapIdentification({ navigate, assessmentData }) {
  const [targetCareer, setTargetCareer] = useState('Software Engineer');

  if (!assessmentData) {
    return (
      <div style={pageStyle}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>◎</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '12px' }}>Assessment Required</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Complete your skill assessment to see your skill gaps.</p>
          <button onClick={() => navigate('skill-assessment')} style={primaryBtn}>Take Assessment →</button>
        </div>
      </div>
    );
  }

  const skills = assessmentData.skills || {};
  const reqs = careerRequirements[targetCareer] || {};
  const gaps = Object.entries(reqs).map(([skill, required]) => ({
    skill, required, current: skills[skill] ?? 0, diff: required - (skills[skill] ?? 0),
  })).sort((a, b) => b.diff - a.diff);

  const totalGap = gaps.reduce((sum, g) => sum + Math.max(0, g.diff), 0);
  const readiness = Math.max(0, Math.round(100 - (totalGap / (Object.keys(reqs).length * 4)) * 100));

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 20px' }}>
        <button onClick={() => navigate('dashboard')} style={backBtn}>← Back to Dashboard</button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>Skill Gap Identification</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>Compare your skills against your target career requirements</p>

        {/* Career selector */}
        <div style={{ marginBottom: '28px' }}>
          <label style={lbl}>Select Target Career</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {Object.keys(careerRequirements).map(c => (
              <button key={c} onClick={() => setTargetCareer(c)} style={{
                padding: '8px 18px', borderRadius: '100px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 500,
                background: targetCareer === c ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(79,70,229,0.1)',
                color: targetCareer === c ? 'var(--text-primary)' : 'var(--primary-light)',
                transition: 'all 0.2s',
              }}>{c}</button>
            ))}
          </div>
        </div>

        {/* Readiness Score */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <StatCard label="Career Readiness" value={`${readiness}%`} color={readiness >= 70 ? '#10b981' : readiness >= 40 ? 'var(--primary-light)' : '#ef4444'} />
          <StatCard label="Skills to Improve" value={gaps.filter(g => g.diff > 0).length} color="#f59e0b" />
          <StatCard label="Skills on Track" value={gaps.filter(g => g.diff <= 0).length} color="#10b981" />
          <StatCard label="Total Gap Levels" value={totalGap} color="#ef4444" />
        </div>

        {/* Gap visualization */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>
            Skill Gap: <span style={{ color: 'var(--primary-light)' }}>{targetCareer}</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {gaps.map(({ skill, required, current, diff }) => {
              const gap = gapLabel(diff);
              return (
                <div key={skill}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#e2e8f0' }}>{skill}</span>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '12px', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Need: <b style={{ color: 'var(--text-secondary)' }}>{levels[required]}</b></span>
                      <span style={{ color: 'var(--text-muted)' }}>Have: <b style={{ color: 'var(--primary-light)' }}>{levels[current]}</b></span>
                      <span style={{ padding: '2px 8px', borderRadius: '100px', background: `${gap.color}22`, color: gap.color, fontWeight: 600, border: `1px solid ${gap.color}44` }}>{gap.text}</span>
                    </div>
                  </div>
                  <div style={{ height: 8, background: 'rgba(79,70,229,0.1)', borderRadius: 4, position: 'relative' }}>
                    {/* Required bar */}
                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${(required / 4) * 100}%`, background: 'rgba(129,140,248,0.2)', borderRadius: 4 }} />
                    {/* Current bar */}
                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${(current / 4) * 100}%`, background: diff <= 0 ? '#10b981' : diff === 1 ? '#f59e0b' : '#ef4444', borderRadius: 4, transition: 'width 0.6s ease' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ fontSize: '10px', color: '#475569' }}>None</span>
                    <span style={{ fontSize: '10px', color: '#475569' }}>Expert</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('learning-resources')} style={{ ...primaryBtn }}>Get Learning Resources →</button>
          <button onClick={() => navigate('career-recommendation')} style={{ ...secondaryBtn }}>View All Recommendations</button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color, marginBottom: '4px' }}>{value}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{label}</div>
    </div>
  );
}

const pageStyle = { minHeight: '100vh', background: 'var(--bg-dark)', padding: '40px 20px' };
const backBtn = { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 };
const lbl = { display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' };
const primaryBtn = { background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'var(--text-primary)', border: 'none', borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px', boxShadow: '0 4px 16px rgba(79,70,229,0.35)' };
const secondaryBtn = { background: 'transparent', color: 'var(--primary-light)', border: '1px solid rgba(79,70,229,0.3)', borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px' };
