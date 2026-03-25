import React from 'react';

const careerDetails = {
  'Software Engineer': { icon: '⬡', color: 'var(--primary)', roles: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile Developer'], desc: 'Design, develop, and maintain software systems. High demand across all industries.', link: 'https://roadmap.sh/software-design-architecture' },
  'Data Analyst': { icon: '◎', color: 'var(--secondary)', roles: ['Business Analyst', 'BI Developer', 'Reporting Analyst', 'Operations Analyst'], desc: 'Turn raw data into actionable business insights using statistical tools.', link: 'https://roadmap.sh/data-analyst' },
  'ML/AI Engineer': { icon: '✦', color: '#6d28d9', roles: ['ML Engineer', 'AI Researcher', 'NLP Engineer', 'Computer Vision Eng.'], desc: 'Build intelligent systems that learn from data and improve over time.', link: 'https://roadmap.sh/ai-data-scientist' },
  'DevOps Engineer': { icon: '⟁', color: '#1d4ed8', roles: ['Cloud Architect', 'SRE', 'Platform Engineer', 'Release Engineer'], desc: 'Streamline software delivery with automation, CI/CD, and cloud infrastructure.', link: 'https://roadmap.sh/devops' },
  'Full Stack Developer': { icon: '◈', color: '#059669', roles: ['Web Developer', 'App Developer', 'Tech Lead', 'Solutions Architect'], desc: 'Build complete web applications from database to user interface.', link: 'https://roadmap.sh/full-stack' },
};

export default function CareerRecommendation({ navigate, assessmentData }) {
  if (!assessmentData) {
    return (
      <div style={pageStyle}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>✦</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '12px' }}>No Assessment Data</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Complete your skill assessment first to get personalized career recommendations.</p>
          <button onClick={() => navigate('skill-assessment')} style={primaryBtn}>Take Assessment →</button>
        </div>
      </div>
    );
  }

  const scores = assessmentData.careerScores || {};
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top = ranked[0];

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px' }}>
        <button onClick={() => navigate('dashboard')} style={backBtn}>← Back to Dashboard</button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>Career Recommendations</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>Based on your skill assessment, here are your top career matches</p>

        {/* Top Recommendation */}
        <div style={{
          marginBottom: '32px', padding: '32px',
          background: 'linear-gradient(135deg, rgba(79,70,229,0.18), rgba(124,58,237,0.12))',
          border: '1px solid rgba(129,140,248,0.35)', borderRadius: '20px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.15), transparent)', pointerEvents: 'none' }} />
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-light)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>✦ Best Match</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '48px' }}>{careerDetails[top[0]]?.icon || '✦'}</div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, background: 'linear-gradient(135deg,var(--primary-light),var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{top[0]}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>{careerDetails[top[0]]?.desc}</p>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 800, color: 'var(--primary-light)', lineHeight: 1 }}>{top[1]}%</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Match Score</div>
            </div>
          </div>

          {/* Score Bar */}
          <div style={{ height: 8, background: 'rgba(79,70,229,0.15)', borderRadius: 4, marginBottom: '16px' }}>
            <div style={{ height: '100%', width: `${top[1]}%`, background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: 4, transition: 'width 0.8s ease' }} />
          </div>

          {careerDetails[top[0]] && (
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Possible Roles</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {careerDetails[top[0]].roles.map(r => (
                  <span key={r} style={{ background: 'rgba(79,70,229,0.2)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: '100px', padding: '4px 14px', fontSize: '12px', color: 'var(--secondary-light)', fontWeight: 500 }}>{r}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('skill-gap')} style={primaryBtn}>View Skill Gap Analysis →</button>
            {careerDetails[top[0]]?.link && (
              <a href={careerDetails[top[0]].link} target="_blank" rel="noopener noreferrer" style={{ ...primaryBtn, background: 'rgba(79,70,229,0.15)', color: 'var(--secondary-light)', border: '1px solid rgba(129,140,248,0.3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', boxShadow: 'none' }}>
                Explore Career Roadmap ↗
              </a>
            )}
          </div>
        </div>

        {/* All Rankings */}
        <h2 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>All Career Matches</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {ranked.map(([title, score], i) => {
            const detail = careerDetails[title] || { icon: '◈', color: 'var(--primary)' };
            const isTop = i === 0;
            return (
              <div key={title} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                background: 'var(--bg-card)', border: `1px solid ${isTop ? 'rgba(129,140,248,0.3)' : 'rgba(79,70,229,0.15)'}`,
                borderRadius: '14px', padding: '16px 20px',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: i === 0 ? 'var(--primary-light)' : '#475569', width: 28, textAlign: 'center', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ width: 36, height: 36, borderRadius: '10px', background: `${detail.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{detail.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-display)' }}>{title}</div>
                    {detail.link && (
                      <a href={detail.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--primary-light)', textDecoration: 'none', background: 'rgba(129,140,248,0.1)', padding: '2px 8px', borderRadius: '4px' }}>Map ↗</a>
                    )}
                  </div>
                  <div style={{ height: 4, background: 'rgba(79,70,229,0.1)', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${score}%`, background: score >= 70 ? '#10b981' : score >= 50 ? 'var(--primary-light)' : '#f59e0b', borderRadius: 2, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: score >= 70 ? '#10b981' : score >= 50 ? 'var(--primary-light)' : '#f59e0b', flexShrink: 0 }}>{score}%</div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(79,70,229,0.08)', borderRadius: '14px', border: '1px solid rgba(79,70,229,0.15)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <b style={{ color: 'var(--primary-light)' }}>ℹ How scores are calculated:</b> Each career score is computed by comparing your self-rated skill levels against the minimum required levels for key skills in that career. Higher scores indicate better alignment.
          </div>
        </div>
      </div>
    </div>
  );
}

const pageStyle = { minHeight: '100vh', background: 'var(--bg-dark)', padding: '40px 20px' };
const backBtn = { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 };
const primaryBtn = { background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'var(--text-primary)', border: 'none', borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px', boxShadow: '0 4px 16px rgba(79,70,229,0.35)' };
