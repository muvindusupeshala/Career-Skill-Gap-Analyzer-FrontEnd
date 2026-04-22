import React, { useEffect, useMemo, useState } from 'react';
import { getAiCareerPathInsight, getAllCareerPaths } from '../api';

const levels = ['None', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
const demandColor = { 'Very High': '#10b981', High: 'var(--primary-light)', Medium: '#f59e0b' };

export default function CareerPathMapping({ navigate, assessmentData }) {
  const [selectedId, setSelectedId] = useState(null);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState(null);

  useEffect(() => {
    let mounted = true;
    getAllCareerPaths()
      .then((data) => {
        if (!mounted) return;
        setCareers(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Failed to load career paths:', err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const selected = useMemo(() => careers.find((c) => c._id === selectedId) || null, [careers, selectedId]);

  useEffect(() => {
    let mounted = true;
    setAiInsight(null);

    if (!selected?.title || !assessmentData) {
      return () => {
        mounted = false;
      };
    }

    getAiCareerPathInsight(selected.title)
      .then((insight) => {
        if (mounted) setAiInsight(insight);
      })
      .catch((err) => {
        console.error('AI career path insight unavailable:', err);
      });

    return () => {
      mounted = false;
    };
  }, [selected?.title, assessmentData]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <button onClick={() => navigate('dashboard')} style={backBtn}>← Back to Dashboard</button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>IT Career Paths</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>Explore career paths and their skill requirements</p>

        {loading && <p style={{ color: 'var(--text-muted)' }}>Loading career paths...</p>}

        {!loading && careers.length === 0 && (
          <div style={{ color: 'var(--text-muted)' }}>No career paths available from backend.</div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {careers.map((career) => (
            <CareerCard
              key={career._id}
              career={career}
              onClick={() => setSelectedId(selectedId === career._id ? null : career._id)}
              isSelected={selectedId === career._id}
              assessmentData={assessmentData}
            />
          ))}
        </div>

        {selected && <CareerDetail career={selected} assessmentData={assessmentData} navigate={navigate} aiInsight={aiInsight} />}
      </div>
    </div>
  );
}

function CareerCard({ career, onClick, isSelected, assessmentData }) {
  const score = assessmentData?.careerScores?.[career.title];
  const color = career.color || 'var(--border)';
  const demand = career.demand || 'Unknown';
  const avatar = (career.title || '?').trim().charAt(0).toUpperCase();

  return (
    <button
      onClick={onClick}
      style={{
        background: isSelected ? 'rgba(79,70,229,0.15)' : 'var(--bg-card)',
        border: `1px solid ${isSelected ? 'rgba(129,140,248,0.5)' : 'rgba(79,70,229,0.2)'}`,
        borderRadius: '16px',
        padding: '24px',
        cursor: 'pointer',
        textAlign: 'left',
        color: 'var(--text-primary)',
        transition: 'all 0.25s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${color}22`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700 }}>{avatar}</div>
        <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '100px', background: `${(demandColor[demand] || '#f59e0b')}22`, color: demandColor[demand] || '#f59e0b', fontWeight: 600, border: `1px solid ${(demandColor[demand] || '#f59e0b')}44` }}>{demand}</span>
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{career.title}</h3>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>{career.description || 'Description not available from database.'}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
        <span style={{ color: '#0a19e7', fontWeight: 600 }}>{career.typicalSalaryRange || 'Not set'}</span>
        <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{career.growth || 'Not set'}</span>
      </div>
      {score !== undefined && (
        <div style={{ marginTop: '12px', height: 4, background: 'rgba(79,70,229,0.1)', borderRadius: 2 }}>
          <div style={{ height: '100%', width: `${score}%`, background: score > 70 ? '#0a19e7' : score > 40 ? 'var(--primary-light)' : '#f59e0b', borderRadius: 2, transition: 'width 0.5s ease' }} />
        </div>
      )}
      {score !== undefined && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Your match: {score}%</div>}
    </button>
  );
}

function CareerDetail({ career, assessmentData, navigate, aiInsight }) {
  const requiredSkills = Array.isArray(career.requiredSkills) ? career.requiredSkills : [];
  const avatar = (career.title || '?').trim().charAt(0).toUpperCase();

  return (
    <div style={{ marginTop: '32px', background: 'var(--bg-card)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: '20px', padding: '32px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>
        <span style={{ color: 'var(--primary-light)' }}>{avatar}</span> {career.title} - Required Skills
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {requiredSkills.map((entry) => {
          const skill = entry.skillName;
          const required = entry.requiredLevel ?? 0;
          const current = assessmentData?.skills?.[skill] ?? null;
          const met = current !== null && current >= required;
          return (
            <div key={skill}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{skill}</span>
                <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Required: <b style={{ color: 'var(--primary-light)' }}>{levels[required]}</b></span>
                  {current !== null && <span style={{ color: met ? '#0a45e7' : '#f59e0b' }}>You: {levels[current]} {met ? '✓' : '↑'}</span>}
                </div>
              </div>
              <div style={{ height: 6, background: 'rgba(79,70,229,0.1)', borderRadius: 3, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${(required / 4) * 100}%`, background: 'rgba(129,140,248,0.3)', borderRadius: 3 }} />
                {current !== null && <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${(current / 4) * 100}%`, background: met ? '#10b981' : '#f59e0b', borderRadius: 3, transition: 'width 0.5s ease' }} />}
              </div>
            </div>
          );
        })}
      </div>

      {aiInsight && (
        <div style={{ marginTop: '18px', background: 'rgba(8,47,73,0.45)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '12px', padding: '14px 16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>AI Career Fit Insight</div>
          <p style={{ margin: 0, color: '#dbeafe', fontSize: '13px' }}>{aiInsight.fitSummary}</p>
          {Array.isArray(aiInsight.topMissingSkills) && aiInsight.topMissingSkills.length > 0 && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#93c5fd' }}>Priority skills: {aiInsight.topMissingSkills.join(', ')}</div>
          )}
        </div>
      )}

      <button onClick={() => navigate('skill-gap')} style={{ marginTop: '24px', padding: '12px 24px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'var(--text-primary)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px' }}>
        View My Skill Gap →
      </button>
    </div>
  );
}

const backBtn = { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 };
