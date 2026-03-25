import React, { useState } from 'react';

export default function RegisterPage({ navigate, onRegister }) {
  const [form, setForm] = useState({
    name: '', regNo: '', email: '', phone: '', year: '3rd Year', stream: '', password: '', confirm: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.regNo.trim()) e.regNo = 'Registration number is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (form.password.length < 8) e.password = 'Min 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);

    try {
      const { registerUser } = await import('../api');
      const data = await registerUser(form);

      if (data.message) {
        setErrors({ general: data.message });
        setLoading(false);
        return;
      }

      onRegister({ name: form.name, regNo: form.regNo, email: form.email, year: form.year });

    } catch (err) {
      setErrors({ general: 'Something went wrong. Please try again.' });
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'var(--bg-dark)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '20%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '480px', zIndex: 1, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div onClick={() => navigate('landing')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg,var(--primary),var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000000', fontWeight: 800, boxShadow: '0 0 16px rgba(79,70,229,0.5)' }}>C</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>CareerGap</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Create Your Account</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Join as a SLIIT undergraduate</p>
          </div>

          <form onSubmit={handleSubmit} style={{ background: '#c8faf9', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px' }}>
            {errors.general && (
  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#ef4444', fontSize: '13px' }}>
    {errors.general}
  </div>
)}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <Field label="Full Name" type="text" value={form.name} onChange={set('name')} error={errors.name} placeholder="e.g. Malewana G.I.D.M" />
            <Field label="Reg. Number" type="text" value={form.regNo} onChange={set('regNo')} error={errors.regNo} placeholder="IT24XXXXXX" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Field label="Email Address" type="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="student@students.sliit.lk" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <Field label="Phone" type="tel" value={form.phone} onChange={set('phone')} error={errors.phone} placeholder="07X-XXXXXXX" />
            <div>
              <label style={labelStyle}>Year of Study</label>
              <select value={form.year} onChange={set('year')} style={inputStyle}>
                {['1st Year','2nd Year','3rd Year','4th Year'].map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Field label="Specialization / Stream" type="text" value={form.stream} onChange={set('stream')} error={errors.stream} placeholder="e.g. IT, SE, CS, DS" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <Field label="Password" type="password" value={form.password} onChange={set('password')} error={errors.password} placeholder="Min 8 characters" />
            <Field label="Confirm Password" type="password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} placeholder="Repeat password" />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px',
            background: loading ? 'rgba(79,70,229,0.5)' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: '#000000', border: 'none', borderRadius: '10px',
            fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 20px rgba(79,70,229,0.4)',
            transition: 'all 0.2s ease',
          }}>
            {loading ? '⟳ Creating Account...' : 'Create Account →'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>
            Already have an account?{' '}
            <span onClick={() => navigate('login')} style={{ color: 'var(--primary-light)', cursor: 'pointer', fontWeight: 600 }}>Sign in</span>
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, error, placeholder }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ ...inputStyle, borderColor: error ? '#ef4444' : 'rgba(79,70,229,0.2)' }}
      />
      {error && <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{error}</div>}
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#000000', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' };

const inputStyle = {
  width: '100%', padding: '10px 14px',
  background: '#ffffff',
  border: '1px solid rgba(79,70,229,0.2)',
  borderRadius: '8px', color: '#000000',
  fontFamily: 'var(--font-body)', fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s',
};
