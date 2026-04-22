const BASE = 'http://localhost:5000/api';

const saveToken = (token) => localStorage.setItem('token', token);
const getToken = () => localStorage.getItem('token');
const clearToken = () => localStorage.removeItem('token');

const authHeaders = (includeJson = true) => {
  const headers = {};
  if (includeJson) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const parseJson = async (res) => {
  if (!res.ok) {
    const txt = await res.text();
    let msg = txt || res.statusText;
    try {
      const parsed = JSON.parse(txt);
      if (parsed?.message) msg = parsed.message;
    } catch (_err) {
      // Keep raw text fallback when response is not JSON.
    }
    throw new Error(msg);
  }
  return res.json();
};

export const registerUser = async (formData) => {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  const data = await parseJson(res);
  if (data.token) saveToken(data.token);
  return data;
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await parseJson(res);
  if (data.token) saveToken(data.token);
  return data;
};

export const logoutUser = () => clearToken();

export const saveAssessment = async (assessmentData) => {
  const res = await fetch(`${BASE}/assessment/save`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(assessmentData),
  });
  return parseJson(res);
};

export const getMyAssessment = async () => {
  const res = await fetch(`${BASE}/assessment/me`, {
    headers: authHeaders(false),
  });
  return parseJson(res);
};

export const generateRecommendation = async () => {
  const res = await fetch(`${BASE}/recommendation/generate`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return parseJson(res);
};

export const getMyRecommendation = async () => {
  const res = await fetch(`${BASE}/recommendation/me`, {
    headers: authHeaders(false),
  });
  return parseJson(res);
};

export const generateSkillGap = async (targetCareer) => {
  const res = await fetch(`${BASE}/skillgap/generate`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ targetCareer }),
  });
  return parseJson(res);
};

export const getMySkillGaps = async () => {
  const res = await fetch(`${BASE}/skillgap/me`, {
    headers: authHeaders(false),
  });
  return parseJson(res);
};

export const getAllResources = async () => {
  const res = await fetch(`${BASE}/resources`);
  return parseJson(res);
};

export const getResourcesBySkill = async (skillName) => {
  const res = await fetch(`${BASE}/resources/skill/${encodeURIComponent(skillName)}`);
  return parseJson(res);
};

export const saveProgress = async (progressData) => {
  const res = await fetch(`${BASE}/progress/save`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(progressData),
  });
  return parseJson(res);
};

export const getMyProgress = async () => {
  const res = await fetch(`${BASE}/progress/me`, {
    headers: authHeaders(false),
  });
  return parseJson(res);
};

export const getAiCareerRecommendationInsight = async () => {
  const res = await fetch(`${BASE}/ai/career-recommendation`, {
    headers: authHeaders(false),
  });
  return parseJson(res);
};

export const getAiCareerPathInsight = async (careerTitle) => {
  const res = await fetch(`${BASE}/ai/career-path/${encodeURIComponent(careerTitle)}`, {
    headers: authHeaders(false),
  });
  return parseJson(res);
};

export const getAiSkillGapInsight = async (careerTitle) => {
  const res = await fetch(`${BASE}/ai/skill-gap/${encodeURIComponent(careerTitle)}`, {
    headers: authHeaders(false),
  });
  return parseJson(res);
};

export const getAiLearningResourceSuggestions = async () => {
  const res = await fetch(`${BASE}/ai/learning-resources`, {
    headers: authHeaders(false),
  });
  return parseJson(res);
};

export const getAiProgressInsight = async () => {
  const res = await fetch(`${BASE}/ai/progress`, {
    headers: authHeaders(false),
  });
  return parseJson(res);
};

export const getAiMasterPlan = async (refresh = false) => {
  const suffix = refresh ? '?refresh=true' : '';
  const res = await fetch(`${BASE}/ai/plan${suffix}`, {
    headers: authHeaders(false),
  });
  return parseJson(res);
};

export const getAiChatHistory = async () => {
  const res = await fetch(`${BASE}/ai/chat/history`, {
    headers: authHeaders(false),
  });
  return parseJson(res);
};

export const clearAiChatHistory = async () => {
  const res = await fetch(`${BASE}/ai/chat/history`, {
    method: 'DELETE',
    headers: authHeaders(false),
  });
  return parseJson(res);
};

export const chatWithAiAssistant = async (message) => {
  const res = await fetch(`${BASE}/ai/chat`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ message }),
  });
  return parseJson(res);
};

export const uploadCV = async (file) => {
  const formData = new FormData();
  formData.append('cv', file);
  const res = await fetch(`${BASE}/assessment/upload-cv`, {
    method: 'POST',
    headers: authHeaders(false),
    body: formData,
  });
  return parseJson(res);
};

export const getAllCareerPaths = async () => {
  const res = await fetch(`${BASE}/careerpaths`);
  return parseJson(res);
};

export const getAllSkills = async () => {
  const res = await fetch(`${BASE}/skills`);
  return parseJson(res);
};
