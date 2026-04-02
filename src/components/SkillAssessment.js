import React, { useState } from 'react';

const skillCategories = [
  {
    category: 'Programming',
    icon: '⬡',
    skills: ['Python', 'JavaScript', 'Java', 'C/C++', 'SQL'],
  },
  {
    category: 'Data & Analytics',
    icon: '◎',
    skills: ['Data Analysis', 'Machine Learning', 'Statistics', 'Data Visualization', 'Big Data'],
  },
  {
    category: 'DevOps & Cloud',
    icon: '⟁',
    skills: ['Docker', 'Kubernetes', 'AWS/Azure/GCP', 'CI/CD Pipelines', 'Linux'],
  },
  {
    category: 'Web Development',
    icon: '◈',
    skills: ['HTML/CSS', 'React/Angular/Vue', 'Node.js', 'REST APIs', 'Databases'],
  },
];

const careerRequirements = {
  'Software Engineer':    { Python: 3, JavaScript: 4, Java: 3, 'HTML/CSS': 3, 'React/Angular/Vue': 3, 'REST APIs': 3, Databases: 3, 'CI/CD Pipelines': 2 },
  'Data Analyst':         { Python: 3, SQL: 4, 'Data Analysis': 4, 'Statistics': 3, 'Data Visualization': 4 },
  'ML/AI Engineer':       { Python: 5, 'Machine Learning': 4, 'Statistics': 4, 'Data Analysis': 3, 'Big Data': 3 },
  'DevOps Engineer':      { Docker: 4, Kubernetes: 4, 'AWS/Azure/GCP': 4, 'CI/CD Pipelines': 5, Linux: 4 },
  'Full Stack Developer': { JavaScript: 4, 'HTML/CSS': 4, 'React/Angular/Vue': 4, 'Node.js': 4, Databases: 3, 'REST APIs': 4 },
};

function computeScores(ratings) {
  const scores = {};
  for (const [career, reqs] of Object.entries(careerRequirements)) {
    const keys = Object.keys(reqs);
    let total = 0;
    for (const skill of keys) {
      const userLevel = ratings[skill] || 0;
      const reqLevel = reqs[skill];
      total += Math.min(userLevel / reqLevel, 1);
    }
    scores[career] = Math.round((total / keys.length) * 100);
  }
  return scores;
}

export default function SkillAssessment({ navigate, user, onComplete, assessmentData }) {
  const [step, setStep] = useState(0);
  const [ratings, setRatings] = useState({});

  const cat = skillCategories[step];
  const totalSteps = skillCategories.length;
  const progress = ((step) / totalSteps) * 100;

  const handleRate = (skill, level) => {
    setRatings(prev => ({ ...prev, [skill]: level }));
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(s => s + 1);
    } else {
      const careerScores = computeScores(ratings);
      const sorted = Object.entries(careerScores).sort((a, b) => b[1] - a[1]);
      const result = {
        ratings,
        careerScores,
        topCareer: sorted[0][0],
        overallScore: Math.round(sorted.reduce((sum, [, s]) => sum + s, 0) / sorted.length),
        gapCount: Object.values(ratings).filter(v => v < 3).length,
        completedAt: new Date().toISOString(),
      };
      onComplete(result);
      navigate('career-recommendation');
    }
  };

  if (assessmentData) {
    return (
      <div style={pageStyle}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>◈</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '12px' }}>Assessment Already Completed</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>You've already completed your skill assessment. View your results or retake it.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('career-recommendation')} style={primaryBtn}>View Recommendations →</button>
            <button onClick={() => { onComplete(null); setStep(0); setRatings({}); }} style={ghostBtn}>Retake Assessment</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 20px' }}>
        <button onClick={() => navigate('dashboard')} style={backBtn}>← Back to Dashboard</button>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>Skill Assessment</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Rate your proficiency in each skill from 1 (Beginner) to 5 (Expert)</p>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>Step {step + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div style={{ height: 6, background: 'rgba(79,70,229,0.15)', borderRadius: 3 }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: 3, transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            {skillCategories.map((c, i) => (
              <div key={i} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: i < step ? 'var(--primary)' : i === step ? 'var(--secondary)' : 'rgba(79,70,229,0.15)',
                transition: 'background 0.3s ease',
              }} />
            ))}
          </div>
        </div>

        {/* Category Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(129,140,248,0.25)', borderRadius: '20px', padding: '32px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(79,70,229,0.15)', border: '1px solid rgba(129,140,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              {cat.icon}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700 }}>{cat.category}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{cat.skills.length} skills to rate</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cat.skills.map(skill => (
              <SkillRater key={skill} skill={skill} value={ratings[skill] || 0} onChange={level => handleRate(skill, level)} />
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            style={{ ...ghostBtn, opacity: step === 0 ? 0.4 : 1, cursor: step === 0 ? 'not-allowed' : 'pointer' }}
          >
            ← Previous
          </button>
          <button onClick={handleNext} style={primaryBtn}>
            {step === totalSteps - 1 ? 'Complete Assessment ✓' : 'Next Category →'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SkillRater({ skill, value, onChange }) {
  const labels = ['', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'];
  const colors = ['', '#ef4444', '#f59e0b', '#eab308', '#3b82f6', '#10b981'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#e2e8f0' }}>{skill}</span>
        {value > 0 && (
          <span style={{ fontSize: '12px', color: colors[value], fontWeight: 600, background: `${colors[value]}18`, padding: '2px 10px', borderRadius: '100px' }}>
            {labels[value]}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {[1, 2, 3, 4, 5].map(level => (
          <button
            key={level}
            onClick={() => onChange(level)}
            style={{
              flex: 1, height: 36, borderRadius: '8px', cursor: 'pointer',
              border: value >= level ? 'none' : '1px solid rgba(79,70,229,0.2)',
              background: value >= level
                ? `linear-gradient(135deg, ${colors[level]}, ${colors[Math.min(level + 1, 5)]})`
                : 'rgba(79,70,229,0.05)',
              color: value >= level ? '#fff' : 'var(--text-muted)',
              fontSize: '13px', fontWeight: 600,
              transition: 'all 0.2s ease',
              transform: value === level ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}

const pageStyle = { minHeight: '100vh', background: 'var(--bg-dark)', padding: '40px 20px' };
const backBtn = { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 };
const primaryBtn = { background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'var(--text-primary)', border: 'none', borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px', boxShadow: '0 4px 16px rgba(79,70,229,0.35)' };
const ghostBtn = { background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(129,140,248,0.25)', color: 'var(--secondary-light)', borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px' };
