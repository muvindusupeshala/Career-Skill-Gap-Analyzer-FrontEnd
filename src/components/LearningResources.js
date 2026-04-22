import React, { useState } from 'react';

const allResources = [
  { id: 1, skill: 'Python', type: 'Course', title: 'Python for Everybody', provider: 'Coursera', level: 'Beginner', duration: '4 months', free: false, link: 'https://www.coursera.org/specializations/python', icon: '🐍' },
  { id: 2, skill: 'Python', type: 'Tutorial', title: 'Python Official Docs Tutorial', provider: 'python.org', level: 'Beginner', duration: 'Self-paced', free: true, link: 'https://docs.python.org/3/tutorial/', icon: '🐍' },
  { id: 3, skill: 'JavaScript', type: 'Course', title: 'The Complete JS Course', provider: 'Udemy', level: 'Beginner', duration: '69 hrs', free: false, link: 'https://www.udemy.com/course/the-complete-javascript-course/', icon: '⚡' },
  { id: 4, skill: 'JavaScript', type: 'Interactive', title: 'freeCodeCamp JS Algorithms', provider: 'freeCodeCamp', level: 'Intermediate', duration: '300 hrs', free: true, link: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', icon: '⚡' },
  { id: 5, skill: 'React/Angular/Vue', type: 'Docs', title: 'React Official Tutorial', provider: 'react.dev', level: 'Beginner', duration: 'Self-paced', free: true, link: 'https://react.dev/learn', icon: '⚛️' },
  { id: 6, skill: 'React/Angular/Vue', type: 'Course', title: 'React - The Complete Guide', provider: 'Udemy', level: 'Intermediate', duration: '48 hrs', free: false, link: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', icon: '⚛️' },
  { id: 7, skill: 'Machine Learning', type: 'Course', title: 'Machine Learning Specialization', provider: 'Coursera (Andrew Ng)', level: 'Intermediate', duration: '3 months', free: false, link: 'https://www.coursera.org/specializations/machine-learning-introduction', icon: '🤖' },
  { id: 8, skill: 'Machine Learning', type: 'Book', title: 'Hands-On ML with Scikit-Learn', provider: "O'Reilly", level: 'Intermediate', duration: 'Self-paced', free: false, link: 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/', icon: '🤖' },
  { id: 9, skill: 'Docker', type: 'Tutorial', title: 'Docker Getting Started', provider: 'Docker Docs', level: 'Beginner', duration: 'Self-paced', free: true, link: 'https://docs.docker.com/get-started/', icon: '🐳' },
  { id: 10, skill: 'Docker', type: 'Course', title: 'Docker & Kubernetes: The Practical Guide', provider: 'Udemy', level: 'Intermediate', duration: '23 hrs', free: false, link: 'https://www.udemy.com/course/docker-kubernetes-the-practical-guide/', icon: '🐳' },
  { id: 11, skill: 'SQL', type: 'Course', title: 'SQL for Data Science', provider: 'Coursera', level: 'Beginner', duration: '4 weeks', free: false, link: 'https://www.coursera.org/learn/sql-for-data-science', icon: '🗄️' },
  { id: 12, skill: 'SQL', type: 'Interactive', title: 'SQLZoo', provider: 'SQLZoo', level: 'Beginner', duration: 'Self-paced', free: true, link: 'https://sqlzoo.net/', icon: '🗄️' },
  { id: 13, skill: 'Data Analysis', type: 'Course', title: 'Data Analyst with Python', provider: 'DataCamp', level: 'Beginner', duration: '36 hrs', free: false, link: 'https://www.datacamp.com/tracks/data-analyst-with-python', icon: '📊' },
  { id: 14, skill: 'AWS/Azure/GCP', type: 'Docs', title: 'AWS Free Tier + Tutorials', provider: 'AWS', level: 'Beginner', duration: 'Self-paced', free: true, link: 'https://aws.amazon.com/getting-started/', icon: '☁️' },
  { id: 15, skill: 'Linux', type: 'Course', title: 'Linux Fundamentals', provider: 'Linux Foundation', level: 'Beginner', duration: '6 hrs', free: false, link: 'https://training.linuxfoundation.org/training/introduction-to-linux/', icon: '🐧' },
];

const skills = [...new Set(allResources.map(r => r.skill))];
const types = [...new Set(allResources.map(r => r.type))];

export default function LearningResources({ navigate, assessmentData }) {
  const [filterSkill, setFilterSkill] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [freeOnly, setFreeOnly] = useState(false);

  // Prioritise gaps if assessment present
  const prioritySkills = assessmentData
    ? Object.entries(assessmentData.ratings || {})
        .filter(([, level]) => level < 3)
        .map(([skill]) => skill)
    : [];

  const filtered = allResources.filter(r => {
    if (filterSkill !== 'All' && r.skill !== filterSkill) return false;
    if (filterType !== 'All' && r.type !== filterType) return false;
    if (freeOnly && !r.free) return false;
    return true;
  });

  const chipStyle = (active) => ({
    padding: '6px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
    border: active ? '1px solid rgba(129,140,248,0.6)' : '1px solid rgba(79,70,229,0.2)',
    background: active ? 'rgba(79,70,229,0.2)' : 'transparent',
    color: active ? 'var(--primary-light)' : 'var(--text-muted)',
    transition: 'all 0.2s ease',
  });

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
        <button onClick={() => navigate('dashboard')} style={backBtn}>← Back to Dashboard</button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>Learning Resources</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px' }}>Curated courses, tutorials and docs to close your skill gaps</p>

        {/* Priority gaps banner */}
        {prioritySkills.length > 0 && (
          <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(79,70,229,0.08))', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', color: '#f87171', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>⚠ Priority Skills — Gaps Detected</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {prioritySkills.map(s => (
                <button key={s} onClick={() => setFilterSkill(s)} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', borderRadius: '100px', padding: '3px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: 500 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '24px' }}>
          <button style={chipStyle(filterSkill === 'All')} onClick={() => setFilterSkill('All')}>All Skills</button>
          {skills.map(s => <button key={s} style={chipStyle(filterSkill === s)} onClick={() => setFilterSkill(s)}>{s}</button>)}
          <div style={{ width: 1, height: 20, background: 'rgba(79,70,229,0.2)', margin: '0 4px' }} />
          {types.map(t => <button key={t} style={chipStyle(filterType === t)} onClick={() => setFilterType(filterType === t ? 'All' : t)}>{t}</button>)}
          <div style={{ width: 1, height: 20, background: 'rgba(79,70,229,0.2)', margin: '0 4px' }} />
          <button
            style={{ ...chipStyle(freeOnly), background: freeOnly ? 'rgba(16,185,129,0.2)' : 'transparent', borderColor: freeOnly ? 'rgba(16,185,129,0.5)' : 'rgba(79,70,229,0.2)', color: freeOnly ? '#34d399' : 'var(--text-muted)' }}
            onClick={() => setFreeOnly(f => !f)}
          >
            🆓 Free Only
          </button>
        </div>

        {/* Count */}
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Showing <b style={{ color: 'var(--primary-light)' }}>{filtered.length}</b> resource{filtered.length !== 1 ? 's' : ''}
        </div>

        {/* Resource Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {filtered.map(res => (
            <a key={res.id} href={res.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div
                style={{ background: 'var(--bg-card)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: '14px', padding: '20px', height: '100%', boxSizing: 'border-box', transition: 'all 0.25s ease', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.4)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 14px 28px rgba(0,0,0,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(79,70,229,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '24px' }}>{res.icon}</span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '11px', background: 'rgba(79,70,229,0.15)', color: 'var(--primary-light)', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>{res.type}</span>
                    <span style={{ fontSize: '11px', background: res.free ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: res.free ? '#34d399' : '#fbbf24', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
                      {res.free ? 'Free' : 'Paid'}
                    </span>
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px', lineHeight: 1.3 }}>{res.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>{res.provider}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(79,70,229,0.08)', padding: '2px 8px', borderRadius: '4px' }}>{res.level}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(79,70,229,0.08)', padding: '2px 8px', borderRadius: '4px' }}>⏱ {res.duration}</span>
                  <span style={{ fontSize: '11px', color: '#a78bfa', background: 'rgba(124,58,237,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{res.skill}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
            <div>No resources match the current filters.</div>
          </div>
        )}
      </div>
    </div>
  );
}

const pageStyle = { minHeight: '100vh', background: 'var(--bg-dark)', padding: '40px 20px' };
const backBtn = { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 };
