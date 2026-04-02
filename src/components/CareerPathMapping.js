import React, { useState } from 'react';

const careerPaths = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    icon: '⬡',
    color: 'var(--primary)',
    colorHex: '#4f46e5',
    desc: 'Build software systems that power modern applications across all industries.',
    stages: [
      { level: 'Junior', years: '0–2 yrs', skills: ['HTML/CSS', 'JavaScript', 'Git', 'Basic Algorithms'], salary: '$55k–$80k' },
      { level: 'Mid-Level', years: '2–5 yrs', skills: ['React/Vue', 'Node.js', 'Databases', 'REST APIs', 'Testing'], salary: '$80k–$120k' },
      { level: 'Senior', years: '5–8 yrs', skills: ['System Design', 'Architecture', 'Performance', 'Mentoring'], salary: '$120k–$160k' },
      { level: 'Lead / Principal', years: '8+ yrs', skills: ['Tech Strategy', 'Cross-team Collaboration', 'Engineering Culture'], salary: '$160k+' },
    ],
    roadmapLink: 'https://roadmap.sh/software-design-architecture',
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    icon: '◎',
    color: 'var(--secondary)',
    colorHex: '#7c3aed',
    desc: 'Transform raw data into actionable business insights using statistical tools.',
    stages: [
      { level: 'Junior Analyst', years: '0–2 yrs', skills: ['Excel', 'SQL', 'Basic Statistics', 'Power BI/Tableau'], salary: '$45k–$65k' },
      { level: 'Data Analyst', years: '2–5 yrs', skills: ['Python', 'Advanced SQL', 'Data Visualization', 'ETL'], salary: '$65k–$95k' },
      { level: 'Senior Analyst', years: '5–8 yrs', skills: ['Predictive Analytics', 'Dashboard Design', 'Stakeholder Mgmt'], salary: '$95k–$130k' },
      { level: 'Analytics Lead', years: '8+ yrs', skills: ['Data Strategy', 'Team Leadership', 'Business Intelligence'], salary: '$130k+' },
    ],
    roadmapLink: 'https://roadmap.sh/data-analyst',
  },
  {
    id: 'ml-ai-engineer',
    title: 'ML/AI Engineer',
    icon: '✦',
    color: '#6d28d9',
    colorHex: '#6d28d9',
    desc: 'Build intelligent systems that learn from data and improve over time.',
    stages: [
      { level: 'ML Intern / Jr.', years: '0–2 yrs', skills: ['Python', 'NumPy/Pandas', 'Scikit-learn', 'Math/Stats'], salary: '$60k–$90k' },
      { level: 'ML Engineer', years: '2–5 yrs', skills: ['TensorFlow/PyTorch', 'Deep Learning', 'Model Deployment', 'MLOps'], salary: '$90k–$140k' },
      { level: 'Senior ML Eng.', years: '5–8 yrs', skills: ['LLMs', 'Research', 'Architecture', 'Production ML'], salary: '$140k–$200k' },
      { level: 'AI Lead / Research', years: '8+ yrs', skills: ['AI Strategy', 'Paper Research', 'Team Direction'], salary: '$200k+' },
    ],
    roadmapLink: 'https://roadmap.sh/ai-data-scientist',
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    icon: '⟁',
    color: '#1d4ed8',
    colorHex: '#1d4ed8',
    desc: 'Automate infrastructure and streamline software delivery pipelines.',
    stages: [
      { level: 'Jr. DevOps', years: '0–2 yrs', skills: ['Linux', 'Bash/Shell', 'Git', 'Basic CI/CD'], salary: '$60k–$85k' },
      { level: 'DevOps Engineer', years: '2–5 yrs', skills: ['Docker', 'Kubernetes', 'Terraform', 'AWS/GCP'], salary: '$85k–$125k' },
      { level: 'Sr. DevOps / SRE', years: '5–8 yrs', skills: ['Platform Engineering', 'Security', 'FinOps', 'Observability'], salary: '$125k–$165k' },
      { level: 'Cloud Architect', years: '8+ yrs', skills: ['Enterprise Architecture', 'Multi-cloud', 'CTO Discussions'], salary: '$165k+' },
    ],
    roadmapLink: 'https://roadmap.sh/devops',
  },
];

export default function CareerPathMapping({ navigate, assessmentData }) {
  const [selected, setSelected] = useState(null);

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
        <button onClick={() => navigate('dashboard')} style={backBtn}>← Back to Dashboard</button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>Career Path Mapping</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>Explore detailed roadmaps for in-demand IT careers and see what it takes to advance</p>

        {/* Career Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px', marginBottom: '32px' }}>
          {careerPaths.map(career => (
            <button
              key={career.id}
              onClick={() => setSelected(selected?.id === career.id ? null : career)}
              style={{
                background: selected?.id === career.id ? `${career.colorHex}22` : 'var(--bg-card)',
                border: `1px solid ${selected?.id === career.id ? career.colorHex + '66' : 'rgba(79,70,229,0.2)'}`,
                borderRadius: '14px', padding: '20px', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.25s ease', color: 'var(--text-primary)',
              }}
              onMouseEnter={e => { if (selected?.id !== career.id) { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
              onMouseLeave={e => { if (selected?.id !== career.id) { e.currentTarget.style.borderColor = 'rgba(79,70,229,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; } }}
            >
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>{career.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>{career.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{career.stages.length} stages</div>
            </button>
          ))}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{ background: 'var(--bg-card)', border: `1px solid ${selected.colorHex}44`, borderRadius: '20px', padding: '32px', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: 56, height: 56, borderRadius: '14px', background: `${selected.colorHex}22`, border: `1px solid ${selected.colorHex}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                  {selected.icon}
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700 }}>{selected.title}</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>{selected.desc}</p>
                </div>
              </div>
              <a href={selected.roadmapLink} target="_blank" rel="noopener noreferrer" style={{ ...primaryBtn, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '10px 18px' }}>
                Full Roadmap ↗
              </a>
            </div>

            {/* Stages Timeline */}
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '20px' }}>
              ⟁ Career Progression
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {selected.stages.map((stage, i) => (
                <div key={i} style={{ display: 'flex', gap: '20px' }}>
                  {/* Timeline dot */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${selected.colorHex}${i === 0 ? 'ff' : '33'}`, border: `2px solid ${selected.colorHex}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: i === 0 ? '#fff' : selected.colorHex, flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    {i < selected.stages.length - 1 && (
                      <div style={{ width: 2, flex: 1, minHeight: 24, background: `${selected.colorHex}33`, margin: '4px 0' }} />
                    )}
                  </div>
                  {/* Stage content */}
                  <div style={{ paddingBottom: i < selected.stages.length - 1 ? '20px' : 0, flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700 }}>{stage.level}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{stage.years}</div>
                      </div>
                      <span style={{ background: `${selected.colorHex}22`, border: `1px solid ${selected.colorHex}44`, color: selected.colorHex === 'var(--primary)' ? 'var(--primary-light)' : '#a78bfa', borderRadius: '100px', padding: '3px 12px', fontSize: '12px', fontWeight: 600 }}>
                        {stage.salary}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {stage.skills.map(s => (
                        <span key={s} style={{ background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: '6px', padding: '3px 10px', fontSize: '12px', color: 'var(--text-secondary)' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!selected && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '14px' }}>
            ↑ Select a career above to view the detailed progression path
          </div>
        )}
      </div>
    </div>
  );
}

const pageStyle = { minHeight: '100vh', background: 'var(--bg-dark)', padding: '40px 20px' };
const backBtn = { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 };
const primaryBtn = { background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'var(--text-primary)', border: 'none', borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px', boxShadow: '0 4px 16px rgba(79,70,229,0.35)' };
