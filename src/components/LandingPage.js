import React, { useEffect, useRef } from 'react';
import ImageSlideshow from './ImageSlideshow';

const features = [
  { icon: '◈', title: 'Skill Assessment', desc: 'Evaluate your technical & soft skills through smart questionnaires and self-ratings.' },
  { icon: '⤳', title: 'Career Path Mapping', desc: 'Explore IT career paths like Software Engineer, Data Analyst and their skill requirements.' },
  { icon: '✦', title: 'Career Recommendation', desc: 'Get matched to the most suitable career based on your assessed skill scores.' },
  { icon: '◎', title: 'Skill Gap Analysis', desc: 'Identify missing or weak skills compared to your target career requirements.' },
  { icon: '⊛', title: 'Learning Resources', desc: 'Access curated courses and learning paths to bridge your skill gaps.' },
  { icon: '⟁', title: 'Progress Tracking', desc: 'Monitor your skill development over time with visual charts and analytics.' },
];

export default function LandingPage({ navigate }) {
  const heroRef = useRef();

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.style.opacity = 0;
    el.style.transform = 'translateY(30px)';
    setTimeout(() => {
      el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    }, 100);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', position: 'relative', overflow: 'hidden' }}>
      {/* Background blobs */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%', width: '700px', height: '700px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '-15%', width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 60px', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 38, height: 38, borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)',
            boxShadow: '0 0 20px rgba(79,70,229,0.6)',
          }}>S</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)' }}>Skillify</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('login')} style={btnSecondary}>Sign In</button>
          <button onClick={() => navigate('register')} style={btnPrimary}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '80px 60px', position: 'relative', zIndex: 1, gap: '40px' }}>
        <div style={{ flex: 1, maxWidth: '600px', textAlign: 'left' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(79,70,229,0.12)', border: '1px solid rgba(129,140,248,0.3)',
            borderRadius: '100px', padding: '6px 16px', marginBottom: '28px',
            fontSize: '12px', color: 'var(--secondary-light)', fontWeight: 500, letterSpacing: '0.05em',
          }}>
            ✦ SLIIT ITP Project — IT24 Group 02
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.03em' }}>
            Discover Your<br />
            <span style={{ background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--secondary-light) 50%, var(--accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Career Potential
            </span>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '560px', marginBottom: '40px', lineHeight: 1.7, fontWeight: 300 }}>
            Assess your skills, discover ideal IT career paths, identify gaps, and get personalized learning recommendations — all in one platform.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('register')} style={{ ...btnPrimary, padding: '14px 36px', fontSize: '15px' }}>
              Start Free Assessment →
            </button>
            <button onClick={() => navigate('login')} style={{ ...btnSecondary, padding: '14px 36px', fontSize: '15px' }}>
              Sign In
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '32px', marginTop: '64px', flexWrap: 'wrap' }}>
            {[['6', 'Core Features'], ['20+', 'Career Paths'], ['100+', 'Learning Resources'], ['Real-time', 'Analytics']].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: 'var(--primary-light)' }}>{val}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', letterSpacing: '0.05em' }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ flex: 1, minHeight: '500px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '1px solid rgba(129,140,248,0.2)' }}>
          <ImageSlideshow />
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '60px 60px 100px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>
            Everything You Need to <span style={{ color: 'var(--primary-light)' }}>Grow</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Six powerful features designed for SLIIT undergraduates</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', maxWidth: '1100px', margin: '0 auto' }}>
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 80} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '80px 40px', background: 'linear-gradient(135deg, rgba(79,70,229,0.08) 0%, rgba(124,58,237,0.08) 100%)', borderTop: '1px solid rgba(79,70,229,0.15)', position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>Ready to Close Your <span style={{ color: 'var(--secondary-light)' }}>Skill Gap?</span></h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '16px' }}>Join and start your personalized career journey today.</p>
        <button onClick={() => navigate('register')} style={{ ...btnPrimary, padding: '16px 48px', fontSize: '16px' }}>
          Create Free Account
        </button>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    const t = setTimeout(() => {
      el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    }, 400 + delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div ref={ref} style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: '16px', padding: '28px',
      transition: 'all 0.3s ease',
      cursor: 'default',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.4)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(79,70,229,0.15)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(79,70,229,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: '12px', marginBottom: '16px',
        background: 'linear-gradient(135deg, rgba(79,70,229,0.2), rgba(124,58,237,0.2))',
        border: '1px solid rgba(129,140,248,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
      }}>{icon}</div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

const btnPrimary = {
  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
  color: 'var(--text-primary)', border: 'none', borderRadius: '10px',
  padding: '10px 24px', fontSize: '14px', fontWeight: 600,
  cursor: 'pointer', fontFamily: 'var(--font-body)',
  boxShadow: '0 4px 20px rgba(79,70,229,0.4)',
  transition: 'all 0.2s ease',
};

const btnSecondary = {
  background: 'rgba(79,70,229,0.1)',
  color: 'var(--primary-light)', border: '1px solid rgba(129,140,248,0.3)',
  borderRadius: '10px', padding: '10px 24px', fontSize: '14px', fontWeight: 600,
  cursor: 'pointer', fontFamily: 'var(--font-body)',
  transition: 'all 0.2s ease',
};
