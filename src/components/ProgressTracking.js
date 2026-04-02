import React from 'react';

export default function ProgressTracking({ navigate, user, assessmentData }) {
  const hasAssessment = !!assessmentData;
  // Mock data for progress
  const completedCourses = [
    { title: 'Python for Everybody', date: 'March 15, 2026', type: 'Course' },
    { title: 'Docker Getting Started', date: 'March 28, 2026', type: 'Tutorial' }
  ];

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px' }}>
        <button onClick={() => navigate('dashboard')} style={backBtn}>← Back to Dashboard</button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>Progress Tracking</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>Track your learning journey and skill improvements</p>

        {!hasAssessment ? (
           <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid rgba(79,70,229,0.2)' }}>
             <div style={{ fontSize: '48px', marginBottom: '16px' }}>⟁</div>
             <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '8px' }}>No Data Available</h2>
             <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Complete your assessment to start tracking your progress.</p>
             <button onClick={() => navigate('skill-assessment')} style={primaryBtn}>Take Assessment →</button>
           </div>
        ) : (
          <>
            {/* Overview Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
               <div style={statCard}>
                 <div style={{ fontSize: '24px', color: 'var(--primary-light)', marginBottom: '8px' }}>◈</div>
                 <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{assessmentData?.overallScore || 0}%</div>
                 <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Latest Assessment Score</div>
               </div>
               <div style={statCard}>
                 <div style={{ fontSize: '24px', color: '#10b981', marginBottom: '8px' }}>✓</div>
                 <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{completedCourses.length}</div>
                 <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Resources Completed</div>
               </div>
               <div style={statCard}>
                 <div style={{ fontSize: '24px', color: '#eab308', marginBottom: '8px' }}>◎</div>
                 <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{assessmentData?.gapCount || 0}</div>
                 <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Remaining Skill Gaps</div>
               </div>
            </div>

            {/* Recent Activity */}
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Recent Achievements</h2>
            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid rgba(79,70,229,0.2)', padding: '24px' }}>
               {completedCourses.map((course, idx) => (
                 <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: idx < completedCourses.length - 1 ? '1px solid rgba(79,70,229,0.1)' : 'none' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>✓</div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: '#e2e8f0' }}>{course.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{course.type} • Completed on {course.date}</div>
                    </div>
                 </div>
               ))}
            </div>
            
            <div style={{ marginTop: '32px', textAlign: 'center' }}>
               <button onClick={() => navigate('learning-resources')} style={ghostBtn}>Explore More Resources</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const pageStyle = { minHeight: '100vh', background: 'var(--bg-dark)', padding: '40px 20px' };
const backBtn = { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 };
const primaryBtn = { background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'var(--text-primary)', border: 'none', borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px', boxShadow: '0 4px 16px rgba(79,70,229,0.35)' };
const ghostBtn = { background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(129,140,248,0.25)', color: 'var(--secondary-light)', borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px' };
const statCard = { background: 'rgba(79,70,229,0.05)', border: '1px solid rgba(79,70,229,0.1)', borderRadius: '16px', padding: '24px', textAlign: 'center' };
