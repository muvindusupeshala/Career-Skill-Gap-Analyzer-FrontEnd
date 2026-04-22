import React, { useEffect, useMemo, useState } from 'react';
import { generateSkillGap, getAiSkillGapInsight, getAllCareerPaths } from '../api';

const levels = ['None', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
const gapLabel = (diff) => {
  if (diff <= 0) return { text: 'Met ✓', color: '#10b981' };
  if (diff === 1) return { text: '+1 Level', color: '#f59e0b' };
  if (diff === 2) return { text: '+2 Levels', color: '#f97316' };
  return { text: 'Critical', color: '#ef4444' };
};

export default function SkillGapIdentification({ navigate, assessmentData }) {
  const [careers, setCareers] = useState([]);
  const [targetCareer, setTargetCareer] = useState('');
  const [gapResult, setGapResult] = useState(null);
  const [loadingCareers, setLoadingCareers] = useState(true);
  const [loadingGap, setLoadingGap] = useState(false);
  const [aiInsight, setAiInsight] = useState(null);

  useEffect(() => {
    let mounted = true;
    getAllCareerPaths()
      .then((data) => {
        if (!mounted) return;
        const items = Array.isArray(data) ? data : [];
        setCareers(items);
        if (items.length > 0) setTargetCareer(items[0].title);
      })
      .catch((err) => {
        console.error('Failed to load careers for gap analysis:', err);
      })
      .finally(() => {
        if (mounted) setLoadingCareers(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!targetCareer || !assessmentData) return;
    let mounted = true;
    setLoadingGap(true);
    setAiInsight(null);
    generateSkillGap(targetCareer)
      .then((data) => {
        if (!mounted) return;
        setGapResult(data || null);

        getAiSkillGapInsight(targetCareer)
          .then((insight) => {
            if (mounted) setAiInsight(insight);
          })
          .catch((aiErr) => {
            console.error('AI skill-gap insight unavailable:', aiErr);
          });
      })
      .catch((err) => {
        console.error('Failed to generate skill gap:', err);
        if (mounted) setGapResult(null);
      })
      .finally(() => {
        if (mounted) setLoadingGap(false);
      });

    return () => {
      mounted = false;
    };
  }, [targetCareer, assessmentData]);

  const gaps = useMemo(() => {
    const list = Array.isArray(gapResult?.gaps) ? gapResult.gaps : [];
    return [...list].sort((a, b) => (b.gap || 0) - (a.gap || 0));
  }, [gapResult]);

  const totalGap = gaps.reduce((sum, g) => sum + Math.max(0, g.gap || 0), 0);
  const readiness = gapResult?.readinessScore ?? 0;

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

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 20px' }}>
        <button onClick={() => navigate('dashboard')} style={backBtn}>← Back to Dashboard</button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>Skill Gap Identification</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>Compare your skills against your target career requirements</p>

        <div style={{ marginBottom: '28px' }}>
          <label style={lbl}>Select Target Career</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {careers.map((c) => (
              <button
                key={c._id}
                onClick={() => setTargetCareer(c.title)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '100px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 500,
                  background: targetCareer === c.title ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(79,70,229,0.1)',
                  color: targetCareer === c.title ? 'var(--text-primary)' : 'var(--primary-light)',
                  transition: 'all 0.2s',
                }}
              >
                {c.title}
              </button>
            ))}
          </div>
          {loadingCareers && <div style={{ marginTop: '10px', color: 'var(--text-muted)', fontSize: '12px' }}>Loading careers...</div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <StatCard label="Career Readiness" value={`${readiness}%`} color={readiness >= 70 ? '#10b981' : readiness >= 40 ? 'var(--primary-light)' : '#ef4444'} />
          <StatCard label="Skills to Improve" value={gaps.filter((g) => (g.gap || 0) > 0).length} color="#f59e0b" />
          <StatCard label="Skills on Track" value={gaps.filter((g) => (g.gap || 0) <= 0).length} color="#10b981" />
          <StatCard label="Total Gap Levels" value={totalGap} color="#ef4444" />
        </div>

        {aiInsight && (
          <div style={{ marginBottom: '22px', background: 'rgba(8,47,73,0.45)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '16px', padding: '18px 20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>AI Gap Coach</div>
            <p style={{ margin: 0, color: '#dbeafe', fontSize: '14px' }}>{aiInsight.prioritySummary}</p>

            {Array.isArray(aiInsight.milestones) && aiInsight.milestones.length > 0 && (
              <ul style={{ margin: '10px 0 0 0', paddingLeft: '18px', color: '#cbd5e1', fontSize: '13px' }}>
                {aiInsight.milestones.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </div>
        )}

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>
            Skill Gap: <span style={{ color: 'var(--primary-light)' }}>{targetCareer || 'N/A'}</span>
          </h2>

          {loadingGap && <div style={{ color: 'var(--text-muted)' }}>Generating gap analysis...</div>}

          {!loadingGap && gaps.length === 0 && (
            <div style={{ color: 'var(--text-muted)' }}>No skill gap data available for this career yet.</div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {gaps.map(({ skill, requiredLevel, currentLevel, gap }) => {
              const diff = gap || 0;
              const required = requiredLevel || 0;
              const current = currentLevel || 0;
              const label = gapLabel(diff);
              return (
                <div key={skill}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#274f83' }}>{skill}</span>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '12px', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Need: <b style={{ color: 'var(--text-secondary)' }}>{levels[required]}</b></span>
                      <span style={{ color: 'var(--text-muted)' }}>Have: <b style={{ color: 'var(--primary-light)' }}>{levels[current]}</b></span>
                      <span style={{ padding: '2px 8px', borderRadius: '100px', background: `${label.color}22`, color: label.color, fontWeight: 600, border: `1px solid ${label.color}44` }}>{label.text}</span>
                    </div>
                  </div>
                  <div style={{ height: 8, background: 'rgba(79,70,229,0.1)', borderRadius: 4, position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${(required / 4) * 100}%`, background: 'rgba(129,140,248,0.2)', borderRadius: 4 }} />
                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${(current / 4) * 100}%`, background: diff <= 0 ? '#10b981' : diff === 1 ? '#f59e0b' : '#ef4444', borderRadius: 4, transition: 'width 0.6s ease' }} />
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
