import React, { useEffect, useMemo, useState } from 'react';
import { generateRecommendation, getAllSkills, saveAssessment, uploadCV } from '../api';

const levels = ['None', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function SkillAssessment({ navigate, onComplete, assessmentData }) {
  const [skillCategories, setSkillCategories] = useState([]);
  const [scores, setScores] = useState(assessmentData?.skills || {});
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [gpa, setGpa] = useState(assessmentData?.gpa || '');
  const [quals, setQuals] = useState(assessmentData?.quals || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAllSkills()
      .then((skills) => {
        if (!mounted) return;
        const groupedMap = skills.reduce((acc, skill) => {
          const category = skill.category || 'Other Skills';
          if (!acc[category]) acc[category] = [];
          acc[category].push(skill.skillName);
          return acc;
        }, {});

        const grouped = Object.keys(groupedMap).map((category) => ({
          category,
          skills: groupedMap[category],
        }));

        setSkillCategories(grouped);
      })
      .catch((err) => {
        console.error('Failed to load skills:', err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const totalSteps = useMemo(() => skillCategories.length + 1, [skillCategories.length]);
  const progress = Math.round((step / Math.max(totalSteps, 1)) * 100);

  const handleComplete = async () => {
    const allSkills = {};
    let total = 0;
    let count = 0;

    skillCategories.forEach((cat) => {
      cat.skills.forEach((s) => {
        const value = scores[s] ?? 0;
        allSkills[s] = value;
        total += value;
        count += 1;
      });
    });

    const overallScore = count > 0 ? Math.round((total / (count * 4)) * 100) : 0;
    const gapCount = Object.values(allSkills).filter((v) => v < 2).length;

    const payload = { skills: allSkills, overallScore, gapCount, gpa, quals, source: 'manual' };

    try {
      await saveAssessment(payload);
      await generateRecommendation();
    } catch (err) {
      console.error('Failed to persist assessment/recommendation:', err);
    }

    onComplete(payload);
    setDone(true);
  };

  if (done) {
    return (
      <div style={pageStyle}>
        <PageHeader title="Skill Assessment" subtitle="Your assessment is complete" navigate={navigate} back="dashboard" />
        <div style={{ maxWidth: 600, margin: '40px auto', textAlign: 'center', padding: '0 20px' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}>✦</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, marginBottom: '12px', background: 'linear-gradient(135deg,var(--primary-light),var(--secondary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Assessment Complete!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Your skill profile has been saved. Explore your career recommendations and identify gaps.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <NavBtn onClick={() => navigate('career-recommendation')} primary>View Recommendations →</NavBtn>
            <NavBtn onClick={() => { setDone(false); setStep(0); }}>Redo Assessment</NavBtn>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={pageStyle}>
        <PageHeader title="Skill Assessment" subtitle="Loading skills from backend..." navigate={navigate} back="dashboard" />
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <PageHeader title="Skill Assessment" subtitle="Rate your proficiency in each skill area" navigate={navigate} back="dashboard" />

      <div style={{ maxWidth: 700, margin: '0 auto 24px', padding: '0 20px', display: 'flex', justifyContent: 'flex-end' }}>
        <input
          type="file"
          id="cv-upload"
          style={{ display: 'none' }}
          accept=".pdf,.txt"
          onChange={async (e) => {
            if (!e.target.files[0]) return;
            try {
              const data = await uploadCV(e.target.files[0]);
              const parsedSkills = data.skills || data.detectedSkills || {};
              setScores((prev) => ({ ...prev, ...parsedSkills }));

              // Move users forward immediately after successful CV analysis.
              setStep((s) => Math.min(s + 1, totalSteps - 1));

              const count = Object.keys(parsedSkills).length;
              const cvPath = data.cvPath ? `\nSaved in project: ${data.cvPath}` : '';
              alert(`CV uploaded and AI analyzed successfully!\nDetected skills: ${count}${cvPath}`);
            } catch (err) {
              console.error('CV Upload Error:', err);
              alert('Failed to parse CV: ' + (err.message || 'Unknown error'));
            }
          }}
        />
        <label
          htmlFor="cv-upload"
          style={{
            background: 'rgba(79,70,229,0.1)',
            color: 'var(--primary)',
            padding: '10px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(79,70,229,0.3)',
          }}
        >
          Upload CV to Auto-fill
        </label>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto 32px', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Step {step + 1} of {totalSteps}</span>
          <span style={{ fontSize: '13px', color: 'var(--primary-light)', fontWeight: 600 }}>{progress}% Complete</span>
        </div>
        <div style={{ height: 6, background: 'rgba(79,70,229,0.15)', borderRadius: 3 }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: 3, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 20px' }}>
        {step < skillCategories.length ? (
          <SkillCategoryStep
            category={skillCategories[step]}
            scores={scores}
            onScore={(skill, val) => setScores((p) => ({ ...p, [skill]: val }))}
          />
        ) : (
          <AcademicStep gpa={gpa} setGpa={setGpa} quals={quals} setQuals={setQuals} />
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '32px', justifyContent: 'flex-end' }}>
          {step > 0 && <NavBtn onClick={() => setStep((s) => s - 1)}>← Back</NavBtn>}
          {step < totalSteps - 1 ? (
            <NavBtn onClick={() => setStep((s) => s + 1)} primary>Next →</NavBtn>
          ) : (
            <NavBtn onClick={handleComplete} primary>Complete Assessment ✦</NavBtn>
          )}
        </div>
      </div>
    </div>
  );
}

function SkillCategoryStep({ category, scores, onScore }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>{category.category}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>Rate your proficiency level for each skill.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {category.skills.map((skill) => (
          <div key={skill}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'black' }}>{skill}</span>
              <span style={{ fontSize: '13px', color: 'var(--primary-light)', fontWeight: 600 }}>{levels[scores[skill] || 0]}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[0, 1, 2, 3, 4].map((val) => (
                <button
                  key={val}
                  onClick={() => onScore(skill, val)}
                  style={{
                    flex: 1,
                    height: 36,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    background: (scores[skill] || 0) >= val ? `rgba(${79 + val * 20}, ${70 + val * 10}, 229, ${0.3 + val * 0.15})` : 'rgba(79,70,229,0.07)',
                    borderBottom: (scores[skill] || 0) === val ? '2px solid var(--primary-light)' : '2px solid transparent',
                    transition: 'all 0.2s',
                    fontSize: '11px',
                    color: (scores[skill] || 0) >= val ? 'var(--primary-light)' : '#475569',
                    fontWeight: (scores[skill] || 0) === val ? 700 : 400,
                  }}
                >
                  {['None', 'Beg.', 'Inter.', 'Adv.', 'Expert'][val]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AcademicStep({ gpa, setGpa, quals, setQuals }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Academic Information</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>Help us generate a more accurate CV and career profile.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={lbl}>Current GPA / CGPA</label>
          <input type="number" min="0" max="4" step="0.01" value={gpa} onChange={(e) => setGpa(e.target.value)} placeholder="e.g. 3.20" style={inp} />
        </div>
        <div>
          <label style={lbl}>Certifications & Extra Qualifications</label>
          <textarea value={quals} onChange={(e) => setQuals(e.target.value)} placeholder="e.g. AWS Cloud Practitioner, Google Data Analytics Certificate, Cisco CCNA..." rows={4} style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
        </div>
      </div>
    </div>
  );
}

function NavBtn({ children, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 24px',
        borderRadius: '10px',
        border: primary ? 'none' : '1px solid rgba(79,70,229,0.3)',
        background: primary ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
        color: primary ? 'var(--text-primary)' : 'var(--primary-light)',
        cursor: 'pointer',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: '14px',
        boxShadow: primary ? '0 4px 16px rgba(79,70,229,0.35)' : 'none',
      }}
    >
      {children}
    </button>
  );
}

function PageHeader({ title, subtitle, navigate, back }) {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto 32px', padding: '0 20px' }}>
      <button onClick={() => navigate(back)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}>
        ← Back to Dashboard
      </button>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>{title}</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{subtitle}</p>
    </div>
  );
}

const pageStyle = { minHeight: '100vh', background: 'var(--bg-dark)', padding: '40px 20px' };
const lbl = { display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' };
const inp = { width: '100%', padding: '12px 16px', background: 'rgba(15,15,42,0.8)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: '10px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none' };
