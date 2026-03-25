const BASE = 'http://localhost:5000/api';

// ── Save token ───────────────────────────────────
const saveToken = (token) => localStorage.setItem('token', token);
const getToken  = ()      => localStorage.getItem('token');
const clearToken = ()     => localStorage.removeItem('token');

// ── Auth ─────────────────────────────────────────

export const registerUser = async (formData) => {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (data.token) saveToken(data.token);
  return data;
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.token) saveToken(data.token);
  return data;
};

export const logoutUser = () => clearToken();

// ── Assessment ───────────────────────────────────

export const saveAssessment = async (assessmentData) => {
  const res = await fetch(`${BASE}/assessment/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(assessmentData),
  });
  if (!res.ok) { const txt = await res.text(); throw new Error(txt || res.statusText); } return res.json();
};

export const getMyAssessment = async () => {
  const res = await fetch(`${BASE}/assessment/me`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  if (!res.ok) { const txt = await res.text(); throw new Error(txt || res.statusText); } return res.json();
};

// ── Career Recommendation ────────────────────────

export const generateRecommendation = async () => {
  const res = await fetch(`${BASE}/recommendation/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
  });
  if (!res.ok) { const txt = await res.text(); throw new Error(txt || res.statusText); } return res.json();
};

export const getMyRecommendation = async () => {
  const res = await fetch(`${BASE}/recommendation/me`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  if (!res.ok) { const txt = await res.text(); throw new Error(txt || res.statusText); } return res.json();
};

// ── Skill Gap ────────────────────────────────────

export const generateSkillGap = async (targetCareer) => {
  const res = await fetch(`${BASE}/skillgap/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ targetCareer }),
  });
  if (!res.ok) { const txt = await res.text(); throw new Error(txt || res.statusText); } return res.json();
};

export const getMySkillGaps = async () => {
  const res = await fetch(`${BASE}/skillgap/me`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  if (!res.ok) { const txt = await res.text(); throw new Error(txt || res.statusText); } return res.json();
};

// ── Learning Resources ───────────────────────────

export const getAllResources = async () => {
  const res = await fetch(`${BASE}/resources`);
  if (!res.ok) { const txt = await res.text(); throw new Error(txt || res.statusText); } return res.json();
};

export const getResourcesBySkill = async (skillName) => {
  const res = await fetch(`${BASE}/resources/skill/${skillName}`);
  if (!res.ok) { const txt = await res.text(); throw new Error(txt || res.statusText); } return res.json();
};

// ── Progress ─────────────────────────────────────

export const saveProgress = async (progressData) => {
  const res = await fetch(`${BASE}/progress/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(progressData),
  });
  if (!res.ok) { const txt = await res.text(); throw new Error(txt || res.statusText); } return res.json();
};

export const uploadCV = async (file) => { const formData = new FormData(); formData.append('cv', file); const res = await fetch(BASE + '/assessment/upload-cv', { method: 'POST', headers: { 'Authorization': 'Bearer ' + getToken() }, body: formData }); if (!res.ok) { const txt = await res.text(); throw new Error(txt || res.statusText); } return res.json(); };
