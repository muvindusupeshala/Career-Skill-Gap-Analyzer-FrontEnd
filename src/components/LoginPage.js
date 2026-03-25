import React, { useState } from 'react';

export default function LoginPage({ navigate, onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    setError('');

    try {
      const { loginUser } = await import('../api');
      const data = await loginUser(form.email, form.password);

      if (data.message) {
        setError(data.message);
        setLoading(false);
        return;
      }

      onLogin({
        name:  data.user.name,
        email: data.user.email,
        regNo: data.user.regNo,
        year:  data.user.year,
      });

    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'var(--bg-dark)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '400px', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div onClick={() => navigate('landing')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg,var(--primary),var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000000', fontWeight: 800, boxShadow: '0 0 16px rgba(79,70,229,0.5)' }}>C</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>CareerGap</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Welcome Back</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Sign in to your SLIIT account</p>
          </div>

          <form onSubmit={handleSubmit} style={{ background: '#c8faf9', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px' }}>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#ef4444', fontSize: '13px' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="your@sliit.lk" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Password</label>
              <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" style={inputStyle} />
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px',
              background: loading ? 'rgba(79,70,229,0.5)' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
              color: '#000000', border: 'none', borderRadius: '10px',
              fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 20px rgba(79,70,229,0.4)',
            }}>
              {loading ? '⟳ Signing In...' : 'Sign In →'}
            </button>

            <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>
              Don't have an account?{' '}
              <span onClick={() => navigate('register')} style={{ color: 'var(--primary-light)', cursor: 'pointer', fontWeight: 600 }}>Register</span>
            </p>
          </form>
        </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#000000', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '10px 14px', background: '#ffffff', border: '1px solid rgba(79,70,229,0.2)', borderRadius: '8px', color: '#000000', fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none' };
