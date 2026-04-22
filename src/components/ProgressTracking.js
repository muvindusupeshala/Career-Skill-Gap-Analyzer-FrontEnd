import React, { useEffect, useMemo, useState } from 'react';
import { getAiProgressInsight, getMyProgress } from '../api';

export default function ProgressTracking({ navigate, assessmentData }) {
  const [activeMetric, setActiveMetric] = useState('overall');
  const [historyFromApi, setHistoryFromApi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState(null);

  useEffect(() => {
    let mounted = true;

    getAiProgressInsight()
      .then((insight) => {
        if (mounted) setAiInsight(insight);
      })
      .catch((aiErr) => {
        console.error('AI progress insight unavailable:', aiErr);
      });

    getMyProgress()
      .then((rows) => {
        if (!mounted) return;
        const normalized = (Array.isArray(rows) ? rows : []).map((r) => ({
          month: r.month || new Date(r.createdAt || Date.now()).toLocaleString('default', { month: 'short' }),
          overall: r.overall ?? 0,
          programming: r.programming ?? 0,
          data: r.data ?? 0,
          infra: r.infra ?? 0,
          soft: r.softSkills ?? 0,
        }));
        setHistoryFromApi(normalized);
      })
      .catch((err) => {
        console.error('Failed to load progress history:', err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const currentSnapshot = assessmentData
    ? {
        month: 'Current',
        overall: assessmentData.overallScore || 0,
        programming: computeCategory(assessmentData.skills, ['JavaScript / TypeScript', 'Python', 'React / Angular / Vue', 'Node.js / Backend Dev', 'SQL / Databases']),
        data: computeCategory(assessmentData.skills, ['Data Analysis', 'Machine Learning / AI', 'Data Visualization', 'Statistics & Probability']),
        infra: computeCategory(assessmentData.skills, ['Cloud Platforms (AWS/Azure/GCP)', 'Docker & Kubernetes', 'CI/CD Pipelines', 'Linux / System Admin']),
        soft: computeCategory(assessmentData.skills, ['Problem Solving', 'Communication', 'Teamwork & Collaboration', 'Time Management', 'Leadership']),
      }
    : null;

  const history = useMemo(() => {
    const base = [...historyFromApi];
    if (currentSnapshot) {
      const last = base[base.length - 1];
      const duplicateCurrent = last && ['overall', 'programming', 'data', 'infra', 'soft'].every((k) => Number(last[k] || 0) === Number(currentSnapshot[k] || 0));
      if (!duplicateCurrent) base.push(currentSnapshot);
    }
    return base;
  }, [historyFromApi, currentSnapshot]);

  const metrics = [
    { key: 'overall', label: 'Overall', color: 'var(--primary-light)' },
    { key: 'programming', label: 'Programming', color: 'var(--primary)' },
    { key: 'data', label: 'Data & Analytics', color: 'var(--secondary)' },
    { key: 'infra', label: 'Infrastructure', color: '#06b6d4' },
    { key: 'soft', label: 'Soft Skills', color: '#10b981' },
  ];

  const latest = history[history.length - 1] || { overall: 0, programming: 0, data: 0, infra: 0, soft: 0 };
  const baseline = history.length > 0 ? history[0] : null;
  const prev = history.length > 1 ? history[history.length - 2] : null;
  const hasComparison = !!(baseline && latest && history.length > 1);
  const change = prev ? (latest[activeMetric] || 0) - (prev[activeMetric] || 0) : 0;
  const maxVal = Math.max(...history.map((h) => h[activeMetric] || 0), 100);
  const active = metrics.find((m) => m.key === activeMetric) || metrics[0];
  const baselineDate = baseline?.month || 'Initial';
  const latestDate = latest?.month || 'Current';

  const metricBars = metrics.map((m) => ({ key: m.key, label: m.label, color: m.color, value: Number(latest[m.key] || 0) }));
  const comparisonBars = metrics.map((m) => ({ key: m.key, label: m.label, color: m.color, before: Number(baseline?.[m.key] || 0), after: Number(latest?.[m.key] || 0) }));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
        <button onClick={() => navigate('dashboard')} style={backBtn}>← Back to Dashboard</button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>Progress & Analytics</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>Track your skill development over time</p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
          <button
            onClick={() => navigate('skill-assessment')}
            style={{
              border: 'none',
              borderRadius: 10,
              padding: '10px 14px',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              color: '#fff',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            Reassess Now
          </button>
          <button
            onClick={() => navigate('learning-resources')}
            style={{
              border: '1px solid rgba(79,70,229,0.25)',
              borderRadius: 10,
              padding: '10px 14px',
              cursor: 'pointer',
              background: 'rgba(79,70,229,0.08)',
              color: '#4338ca',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            View Recommended Resources
          </button>
        </div>

        {loading && <div style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Loading progress history...</div>}

        {history.length === 0 && !loading && (
          <div style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>No backend progress history found yet. Complete assessments to build your trend chart.</div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '32px' }}>
          {metrics.map((m) => (
            <button
              key={m.key}
              onClick={() => setActiveMetric(m.key)}
              style={{
                background: activeMetric === m.key ? 'rgba(79,70,229,0.2)' : 'var(--bg-card)',
                border: `1px solid ${activeMetric === m.key ? 'rgba(129,140,248,0.5)' : 'rgba(79,70,229,0.2)'}`,
                borderRadius: '14px',
                padding: '18px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: m.color }}>{latest[m.key] || 0}%</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{m.label}</div>
            </button>
          ))}
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}>Current Level Analysis</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Latest assessment/CV-based profile snapshot</p>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{latestDate}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', alignItems: 'end', minHeight: 220 }}>
            {metricBars.map((bar) => (
              <div key={bar.key} style={{ background: 'rgba(79,70,229,0.05)', border: '1px solid rgba(79,70,229,0.15)', borderRadius: 12, padding: '12px 10px' }}>
                <div style={{ fontSize: 11, color: '#334155', marginBottom: 8, fontWeight: 700 }}>{bar.label}</div>
                <div style={{ height: 130, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <div style={{ width: '56px', height: `${Math.max(8, Math.round((bar.value / 100) * 120))}px`, background: `linear-gradient(180deg, ${bar.color}, ${bar.color}aa)`, borderRadius: '8px 8px 3px 3px', transition: 'height 0.5s ease' }} />
                </div>
                <div style={{ textAlign: 'center', marginTop: 8, fontSize: 18, fontWeight: 800, color: bar.color }}>{bar.value}%</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}>Before vs After Reassessment</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Comparison between your first and latest snapshots</p>
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 12 }}>
              <span style={{ color: '#475569' }}>Before: {baselineDate}</span>
              <span style={{ color: 'var(--primary-light)' }}>After: {latestDate}</span>
            </div>
          </div>

          {!hasComparison ? (
            <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)', color: '#1e3a8a', fontSize: 13 }}>
              Complete at least one more assessment after following recommended learning resources to generate the comparison chart.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {comparisonBars.map((bar) => {
                const delta = bar.after - bar.before;
                return (
                  <div key={bar.key} style={{ background: 'rgba(79,70,229,0.05)', border: '1px solid rgba(79,70,229,0.12)', borderRadius: 12, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{bar.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: delta >= 0 ? '#16a34a' : '#dc2626', background: delta >= 0 ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.12)', borderRadius: 999, padding: '3px 10px' }}>
                        {delta >= 0 ? '+' : ''}{delta}%
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 5 }}>Before</div>
                        <div style={{ height: 10, borderRadius: 999, background: 'rgba(100,116,139,0.2)', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.max(0, Math.min(100, bar.before))}%`, height: '100%', background: 'linear-gradient(90deg, #64748b, #94a3b8)' }} />
                        </div>
                        <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{bar.before}%</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: '#2563eb', marginBottom: 5 }}>After</div>
                        <div style={{ height: 10, borderRadius: 999, background: 'rgba(37,99,235,0.15)', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.max(0, Math.min(100, bar.after))}%`, height: '100%', background: `linear-gradient(90deg, ${bar.color}, ${bar.color}cc)` }} />
                        </div>
                        <div style={{ fontSize: 11, color: '#1d4ed8', marginTop: 4 }}>{bar.after}%</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}>{active.label} Progress</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Historical trend from backend data</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: active.color }}>{latest[activeMetric] || 0}%</span>
              {change !== 0 && (
                <span style={{ fontSize: '13px', fontWeight: 600, color: change > 0 ? '#10b981' : '#ef4444', background: change > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '4px 10px', borderRadius: '100px' }}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: 180 }}>
            {history.map((h, i) => {
              const val = h[activeMetric] || 0;
              const height = (val / maxVal) * 160;
              const isLast = i === history.length - 1;
              return (
                <div key={`${h.month}-${i}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '11px', color: active.color, fontWeight: isLast ? 700 : 400 }}>{val}%</div>
                  <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '80%', height: `${height}px`, background: isLast ? `linear-gradient(180deg, ${active.color}, ${active.color}88)` : `${active.color}33`, borderRadius: '6px 6px 2px 2px', border: isLast ? `1px solid ${active.color}88` : 'none', transition: 'height 0.6s ease', boxShadow: isLast ? `0 0 16px ${active.color}44` : 'none' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: isLast ? 'var(--primary-light)' : '#475569', fontWeight: isLast ? 700 : 400 }}>{h.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {aiInsight && (
          <div style={{ background: 'rgba(2,44,34,0.55)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '16px', padding: '18px 20px', marginBottom: '28px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>AI Before vs After Analysis</div>
            <p style={{ margin: 0, color: '#d1fae5', fontSize: '13px' }}>{aiInsight.summary}</p>

            {Array.isArray(aiInsight.beforeVsAfter) && aiInsight.beforeVsAfter.length > 0 && (
              <ul style={{ margin: '10px 0 0 0', paddingLeft: '18px', color: '#a7f3d0', fontSize: '12px' }}>
                {aiInsight.beforeVsAfter.map((line) => <li key={line}>{line}</li>)}
              </ul>
            )}
          </div>
        )}

        {assessmentData && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', marginBottom: '28px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Individual Skill Scores</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {Object.entries(assessmentData.skills || {}).map(([skill, score]) => (
                <div key={skill}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                    <span style={{ color: 'black', fontWeight: 'bold' }}>{skill}</span>
                    <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{['None', 'Beginner', 'Intermediate', 'Advanced', 'Expert'][score]}</span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(79,70,229,0.1)', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${(score / 4) * 100}%`, background: score >= 3 ? '#10b981' : score >= 2 ? 'var(--primary-light)' : '#f59e0b', borderRadius: 3, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function computeCategory(skills, keys) {
  if (!skills) return 0;
  const vals = keys.map((k) => skills[k] ?? 0);
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.round((avg / 4) * 100);
}

const backBtn = { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 };
