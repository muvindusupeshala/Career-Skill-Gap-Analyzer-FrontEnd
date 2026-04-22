import React, { useEffect, useRef, useState } from 'react';
import {
  chatWithAiAssistant,
  clearAiChatHistory,
  generateRecommendation,
  getAiMasterPlan,
  saveAssessment,
} from '../api';

const QUESTIONS = [
  {
    id: 'welcome',
    bot: "Hi! I'm GURU, your Career Guide Assistant. I'll ask you some questions about your skills and background to build your personal career profile. This will take about 3 minutes. Ready?",
    type: 'choice',
    choices: ["Yes, let's go", "Sure, I'm ready"],
    next: 'career_goal'
  },
  {
    id: 'career_goal',
    bot: 'Great! First, what is your main career interest?',
    type: 'choice',
    field: 'careerGoal',
    choices: [
      'Software Development',
      'Data Science & Analytics',
      'AI / Machine Learning',
      'DevOps & Cloud',
      'Full Stack Development',
      'Not sure yet'
    ],
    next: 'js_heard'
  },
  {
    id: 'js_heard',
    bot: "Got it! Have you heard of or used JavaScript before?",
    type: 'choice',
    field: 'js_heard',
    choices: ['Yes, I use it regularly', 'Yes, tried it a little', 'Heard of it but never used', 'Never heard of it'],
    next: 'js_level'
  },
  {
    id: 'js_level',
    bot: 'How would you rate your JavaScript skill level?',
    type: 'choice',
    field: 'JavaScript / TypeScript',
    choices: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    next: 'js_project'
  },
  {
    id: 'js_project',
    bot: 'Have you built any projects using JavaScript?',
    type: 'choice',
    field: 'js_project',
    choices: ['Yes, multiple projects', 'Yes, one small project', 'Only tutorials/practice', 'No projects yet'],
    next: 'python_heard'
  },
  {
    id: 'python_heard',
    bot: "Now let's talk about Python. Have you worked with Python?",
    type: 'choice',
    field: 'python_heard',
    choices: ['Yes, I use it regularly', 'Yes, tried it a little', 'Heard of it but never used', 'Never heard of it'],
    next: 'python_level'
  },
  {
    id: 'python_level',
    bot: 'How would you rate your Python skill level?',
    type: 'choice',
    field: 'Python',
    choices: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    next: 'python_use'
  },
  {
    id: 'python_use',
    bot: 'What have you used Python for?',
    type: 'choice',
    field: 'python_use',
    choices: ['Data analysis / ML', 'Web development', 'Automation / scripts', 'Just learning basics', 'Never used it'],
    next: 'react_level'
  },
  {
    id: 'react_level',
    bot: 'Rate your React / Angular / Vue skill:',
    type: 'choice',
    field: 'React / Angular / Vue',
    choices: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    next: 'node_level'
  },
  {
    id: 'node_level',
    bot: 'Rate your Node.js / Backend skill:',
    type: 'choice',
    field: 'Node.js / Backend Dev',
    choices: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    next: 'sql_heard'
  },
  {
    id: 'sql_heard',
    bot: 'Have you used SQL or any database before?',
    type: 'choice',
    field: 'sql_heard',
    choices: ['Yes, comfortable with it', 'Yes, basic queries only', 'Tried it once or twice', 'Never used databases'],
    next: 'sql_level'
  },
  {
    id: 'sql_level',
    bot: 'Rate your SQL / Database skill level:',
    type: 'choice',
    field: 'SQL / Databases',
    choices: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    next: 'data_level'
  },
  {
    id: 'data_level',
    bot: 'Rate your Data Analysis skill level:',
    type: 'choice',
    field: 'Data Analysis',
    choices: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    next: 'ml_level'
  },
  {
    id: 'ml_level',
    bot: 'Rate your Machine Learning / AI skill level:',
    type: 'choice',
    field: 'Machine Learning / AI',
    choices: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    next: 'cloud_level'
  },
  {
    id: 'cloud_level',
    bot: 'Rate your cloud skill (AWS, Azure, GCP):',
    type: 'choice',
    field: 'Cloud Platforms (AWS/Azure/GCP)',
    choices: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    next: 'docker_level'
  },
  {
    id: 'docker_level',
    bot: 'Have you used Docker/Kubernetes?',
    type: 'choice',
    field: 'Docker & Kubernetes',
    choices: ['Never used', 'Basic understanding', 'Used in projects', 'Advanced'],
    next: 'cicd_level'
  },
  {
    id: 'cicd_level',
    bot: 'Rate your CI/CD skill:',
    type: 'choice',
    field: 'CI/CD Pipelines',
    choices: ['Beginner', 'Basic knowledge', 'Set up pipelines', 'Expert'],
    next: 'linux_level'
  },
  {
    id: 'linux_level',
    bot: 'How comfortable are you with Linux?',
    type: 'choice',
    field: 'Linux / System Admin',
    choices: ['Never used', 'Basic commands', 'Comfortable', 'Advanced admin'],
    next: 'soft_intro'
  },
  {
    id: 'soft_intro',
    bot: "Great job! Technical skills done. Let's cover soft skills.",
    type: 'choice',
    choices: ['Continue'],
    next: 'problem_solving'
  },
  {
    id: 'problem_solving',
    bot: 'Problem Solving: rate your ability.',
    type: 'choice',
    field: 'Problem Solving',
    choices: ['Need improvement', 'Average', 'Good', 'Excellent'],
    next: 'communication'
  },
  {
    id: 'communication',
    bot: 'Communication: rate your ability.',
    type: 'choice',
    field: 'Communication',
    choices: ['Need improvement', 'Average', 'Good', 'Excellent'],
    next: 'teamwork'
  },
  {
    id: 'teamwork',
    bot: 'Teamwork & Collaboration: rate your ability.',
    type: 'choice',
    field: 'Teamwork & Collaboration',
    choices: ['Need improvement', 'Average', 'Good', 'Excellent'],
    next: 'time_management'
  },
  {
    id: 'time_management',
    bot: 'Time Management: rate your ability.',
    type: 'choice',
    field: 'Time Management',
    choices: ['Need improvement', 'Average', 'Good', 'Excellent'],
    next: 'leadership'
  },
  {
    id: 'leadership',
    bot: 'Leadership: rate your experience.',
    type: 'choice',
    field: 'Leadership',
    choices: ['Not yet', 'Small group tasks', 'Led team projects', 'Regular leader'],
    next: 'academic_intro'
  },
  {
    id: 'academic_intro',
    bot: 'Almost done. Just two academic questions.',
    type: 'choice',
    choices: ['Continue'],
    next: 'gpa'
  },
  {
    id: 'gpa',
    bot: "What is your GPA / CGPA?",
    type: 'input',
    field: 'gpa',
    placeholder: 'e.g. 3.20',
    next: 'certs'
  },
  {
    id: 'certs',
    bot: "Any certifications or extra qualifications?",
    type: 'input',
    field: 'quals',
    placeholder: 'e.g. AWS Cloud Practitioner, or None',
    next: 'done'
  },
  {
    id: 'done',
    bot: "Done! I'll build your skill profile now.",
    type: 'summary'
  }
];

const levelMap = {
  'Beginner': 1,
  'Intermediate': 2,
  'Advanced': 3,
  'Expert': 4,
  'Never used': 0,
  'Basic understanding': 1,
  'Basic commands': 1,
  'Comfortable': 3,
  'Advanced admin': 4,
  'Need improvement': 1,
  'Average': 2,
  'Good': 3,
  'Excellent': 4,
  'Not yet': 1,
  'Small group tasks': 2,
  'Led team projects': 3,
  'Regular leader': 4,
  'Basic knowledge': 1,
  'Set up pipelines': 3,
};

const SKILL_FIELDS = [
  'JavaScript / TypeScript', 'Python', 'React / Angular / Vue',
  'Node.js / Backend Dev', 'SQL / Databases', 'Data Analysis',
  'Machine Learning / AI', 'Cloud Platforms (AWS/Azure/GCP)',
  'Docker & Kubernetes', 'CI/CD Pipelines', 'Linux / System Admin',
  'Problem Solving', 'Communication', 'Teamwork & Collaboration',
  'Time Management', 'Leadership',
];

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

function ChatBotIcon({ size = 18, color = '#ffffff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="4" y="6" width="16" height="11" rx="4" stroke={color} strokeWidth="1.8" />
      <circle cx="9" cy="11.5" r="1.1" fill={color} />
      <circle cx="15" cy="11.5" r="1.1" fill={color} />
      <path d="M9 15H15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 6V3.8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="2.8" r="1" fill={color} />
    </svg>
  );
}

const renderRichText = (content) => {
  const lines = String(content || '').split('\n');
  return lines.map((line, lineIndex) => {
    const parts = line.split(URL_REGEX);
    return (
      <React.Fragment key={`line-${lineIndex}`}>
        {parts.map((part, partIndex) => {
          if (/^https?:\/\//.test(part)) {
            return (
              <a
                key={`url-${lineIndex}-${partIndex}`}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#7dd3fc', textDecoration: 'underline', wordBreak: 'break-all' }}
              >
                {part}
              </a>
            );
          }
          return <React.Fragment key={`text-${lineIndex}-${partIndex}`}>{part}</React.Fragment>;
        })}
        {lineIndex < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
};

export default function OnboardingChatBot({ onComplete, userName, assessmentData }) {
  const hasAssessment = !!(
    assessmentData
    && typeof assessmentData === 'object'
    && assessmentData.skills
    && Object.keys(assessmentData.skills).length > 0
  );
  const [isOpen, setIsOpen] = useState(true);
  const [mode, setMode] = useState(hasAssessment ? 'assistant' : 'onboarding');

  const [messages, setMessages] = useState([]);
  const [answers, setAnswers] = useState({});
  const [inputVal, setInputVal] = useState('');
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [aiPlan, setAiPlan] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiLoadingHistory, setAiLoadingHistory] = useState(false);
  const [aiReady, setAiReady] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    setMode(hasAssessment ? 'assistant' : 'onboarding');
  }, [hasAssessment]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, aiMessages, isOpen]);

  useEffect(() => {
    if (mode !== 'onboarding' || messages.length > 0 || done) return;
    const first = QUESTIONS.find((q) => q.id === 'welcome');
    const timer = setTimeout(() => {
      if (first) {
        setMessages([{ from: 'bot', text: first.bot, type: first.type, choices: first.choices, placeholder: first.placeholder, id: first.id }]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [mode, messages.length, done]);

  useEffect(() => {
    if (!hasAssessment || !isOpen || aiReady || mode !== 'assistant') return;

    let mounted = true;
    setAiLoadingHistory(true);

    Promise.all([clearAiChatHistory().catch(() => null), getAiMasterPlan(false).catch(() => null)])
      .then(([, planData]) => {
        if (!mounted) return;
        setAiMessages([
          {
            role: 'assistant',
            content: `Hi ${userName || ''}! I am GURU. Ask me anything about your career recommendations, skills, or learning resources.`,
          },
        ]);
        setAiPlan(planData || null);
        setAiReady(true);
      })
      .finally(() => {
        if (mounted) setAiLoadingHistory(false);
      });

    return () => {
      mounted = false;
    };
  }, [hasAssessment, isOpen, aiReady, userName, mode]);

  const addBotMessage = (q) => {
    setMessages((prev) => [...prev, {
      from: 'bot', text: q.bot, type: q.type,
      choices: q.choices, placeholder: q.placeholder, id: q.id
    }]);
  };

  const handleAnswer = (answer, questionId) => {
    const question = QUESTIONS.find((q) => q.id === questionId);
    if (!question) return;

    setMessages((prev) => [...prev, { from: 'user', text: answer }]);
    setInputVal('');

    if (question.field) {
      const numericValue = levelMap[answer];
      setAnswers((prev) => ({
        ...prev,
        [question.field]: numericValue !== undefined ? numericValue : answer
      }));
      if (SKILL_FIELDS.includes(question.field)) {
        setProgress((prev) => Math.min(100, prev + Math.round(100 / SKILL_FIELDS.length)));
      }
    }

    setTimeout(() => {
      const nextQ = QUESTIONS.find((q) => q.id === question.next);
      if (!nextQ) return;
      if (nextQ.type === 'summary') setDone(true);
      addBotMessage(nextQ);
    }, 400);
  };

  const calcScore = (skills, keys) =>
    Math.round((keys.reduce((sum, k) => sum + (skills[k] || 0), 0) / (keys.length * 4)) * 100);

  const handleConfirm = async () => {
    const skills = {};
    SKILL_FIELDS.forEach((skill) => {
      skills[skill] = typeof answers[skill] === 'number' ? answers[skill] : 1;
    });

    skills['Data Visualization'] = skills['Data Analysis'] >= 2 ? skills['Data Analysis'] - 1 : 1;
    skills['Statistics & Probability'] = skills['Machine Learning / AI'] >= 2 ? skills['Machine Learning / AI'] - 1 : 1;

    const total = Object.values(skills).reduce((a, b) => a + b, 0);
    const overallScore = Math.round((total / (Object.keys(skills).length * 4)) * 100);

    const careerScores = {
      'Software Engineer': calcScore(skills, ['JavaScript / TypeScript', 'React / Angular / Vue', 'Node.js / Backend Dev', 'Problem Solving']),
      'Data Analyst': calcScore(skills, ['Data Analysis', 'SQL / Databases', 'Statistics & Probability', 'Python']),
      'ML/AI Engineer': calcScore(skills, ['Machine Learning / AI', 'Python', 'Data Analysis', 'Statistics & Probability']),
      'DevOps Engineer': calcScore(skills, ['Cloud Platforms (AWS/Azure/GCP)', 'Docker & Kubernetes', 'CI/CD Pipelines', 'Linux / System Admin']),
      'Full Stack Developer': calcScore(skills, ['JavaScript / TypeScript', 'React / Angular / Vue', 'SQL / Databases', 'Node.js / Backend Dev']),
    };

    const topCareer = Object.entries(careerScores).sort((a, b) => b[1] - a[1])[0][0];
    const gapCount = Object.values(skills).filter((v) => v < 2).length;

    const payload = {
      skills,
      overallScore,
      careerScores,
      topCareer,
      gapCount,
      gpa: answers.gpa,
      quals: answers.quals,
      source: 'chatbot',
    };

    try {
      await saveAssessment(payload);
      await generateRecommendation();
    } catch (err) {
      console.error('Could not save onboarding profile:', err.message);
    }

    onComplete(payload);
  };

  const sendAiMessage = async () => {
    const text = aiInput.trim();
    if (!text || aiLoading) return;

    const optimistic = [...aiMessages, { role: 'user', content: text }];
    setAiMessages(optimistic);
    setAiInput('');
    setAiLoading(true);

    try {
      const result = await chatWithAiAssistant(text);
      const reply = result?.reply || 'I could not answer that right now.';
      setAiMessages([...optimistic, { role: 'assistant', content: reply }]);

      if (Array.isArray(result?.recommendedCareers) || Array.isArray(result?.recommendedResources)) {
        setAiPlan((prev) => ({
          ...(prev || {}),
          careers: Array.isArray(result.recommendedCareers) && result.recommendedCareers.length > 0
            ? result.recommendedCareers
            : prev?.careers || [],
          resources: Array.isArray(result.recommendedResources) && result.recommendedResources.length > 0
            ? result.recommendedResources
            : prev?.resources || [],
        }));
      }
    } catch (err) {
      setAiMessages([...optimistic, { role: 'assistant', content: err?.message || 'Assistant is unavailable.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  const answeredSkills = SKILL_FIELDS.filter((s) => typeof answers[s] === 'number');
  const levelLabels = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const levelColors = ['', '#ef4444', '#f59e0b', '#8b5cf6', '#10b981'];

  return (
    <>
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 2200,
          width: '100%', maxWidth: 430, background: 'var(--bg-card)',
          border: '1px solid rgba(79,70,229,0.35)', borderRadius: '20px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)', display: 'flex',
          flexDirection: 'column', height: 'min(78vh, 680px)', overflow: 'hidden'
        }}>
          <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', flexShrink: 0, position: 'relative' }}>
            <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 18 }}>x</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingRight: 24 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChatBotIcon size={16} color="#ffffff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>GURU</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>
                  {hasAssessment ? 'Career assistant mode' : (done ? 'Profile complete' : 'Onboarding mode')}
                </div>
              </div>
              <div style={{
                padding: '3px 10px',
                borderRadius: 999,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#e2e8f0',
                background: hasAssessment ? 'rgba(56,189,248,0.25)' : 'rgba(250,204,21,0.2)',
                border: hasAssessment ? '1px solid rgba(56,189,248,0.45)' : '1px solid rgba(250,204,21,0.45)',
              }}>
                {hasAssessment ? 'Assistant' : 'Onboarding'}
              </div>
              {!hasAssessment && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{progress}%</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)' }}>Complete</div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              <button
                onClick={() => {
                  setMode('onboarding');
                  if (messages.length === 0) {
                    setDone(false);
                    setProgress(0);
                    setAnswers({});
                    setInputVal('');
                  }
                }}
                style={{
                  border: mode === 'onboarding' ? '1px solid rgba(250,204,21,0.6)' : '1px solid rgba(255,255,255,0.28)',
                  background: mode === 'onboarding' ? 'rgba(250,204,21,0.18)' : 'rgba(255,255,255,0.12)',
                  color: '#f8fafc',
                  borderRadius: 999,
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Onboarding
              </button>
              <button
                onClick={() => {
                  if (!hasAssessment) return;
                  setAiReady(false);
                  setMode('assistant');
                }}
                style={{
                  border: mode === 'assistant' ? '1px solid rgba(56,189,248,0.65)' : '1px solid rgba(255,255,255,0.28)',
                  background: mode === 'assistant' ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.12)',
                  color: hasAssessment ? '#f8fafc' : 'rgba(255,255,255,0.6)',
                  borderRadius: 999,
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: hasAssessment ? 'pointer' : 'not-allowed',
                }}
                disabled={!hasAssessment}
                title={hasAssessment ? 'Switch to assistant mode' : 'Complete onboarding first'}
              >
                Assistant
              </button>
            </div>
            {!hasAssessment && <div style={{ height: 4, marginTop: 10, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }}><div style={{ height: '100%', width: `${progress}%`, background: '#fff', borderRadius: 2 }} /></div>}
          </div>

          {mode === 'onboarding' ? (
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {messages.map((msg, i) => {
                const isLast = i === messages.length - 1;
                return (
                  <div key={i}>
                    {msg.from === 'bot' && (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ChatBotIcon size={14} color="#ffffff" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ background: 'rgba(79,70,229,0.14)', border: '1px solid rgba(79,70,229,0.25)', borderRadius: '8px 12px 12px 12px', padding: '10px 12px', fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                            {msg.text}
                          </div>

                          {msg.type === 'choice' && isLast && !done && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                              {msg.choices?.map((choice) => (
                                <button
                                  key={choice}
                                  onClick={() => handleAnswer(choice, msg.id)}
                                  style={{ padding: '9px 12px', borderRadius: 10, border: '1px solid rgba(79,70,229,0.3)', background: 'rgba(79,70,229,0.08)', color: '#c4b5fd', cursor: 'pointer', fontSize: 13, textAlign: 'left' }}
                                >
                                  {choice}
                                </button>
                              ))}
                            </div>
                          )}

                          {msg.type === 'input' && isLast && !done && (
                            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                              <input
                                value={inputVal}
                                onChange={(e) => setInputVal(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAnswer(inputVal, msg.id)}
                                placeholder={msg.placeholder}
                                style={{ flex: 1, padding: '10px 12px', background: 'rgba(15,15,42,0.9)', border: '1px solid rgba(79,70,229,0.25)', borderRadius: 10, color: '#ffffff', caretColor: '#ffffff', fontSize: 13, outline: 'none' }}
                              />
                              <button onClick={() => handleAnswer(inputVal, msg.id)} style={{ padding: '10px 14px', background: 'linear-gradient(135deg,var(--primary),var(--secondary))', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer' }}>Send</button>
                            </div>
                          )}

                          {msg.type === 'summary' && done && (
                            <div style={{ marginTop: 10, background: 'rgba(15,15,42,0.8)', border: '1px solid rgba(79,70,229,0.25)', borderRadius: 14, padding: 14 }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: '#a5b4fc', marginBottom: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Your Skill Profile</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                                {answeredSkills.map((skill) => {
                                  const val = answers[skill];
                                  return (
                                    <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <div style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)' }}>{skill}</div>
                                      <div style={{ height: 4, width: 70, background: 'rgba(79,70,229,0.1)', borderRadius: 2 }}>
                                        <div style={{ height: '100%', width: `${(val / 4) * 100}%`, background: levelColors[val], borderRadius: 2 }} />
                                      </div>
                                      <div style={{ fontSize: 11, fontWeight: 600, color: levelColors[val], width: 70, textAlign: 'right' }}>{levelLabels[val]}</div>
                                    </div>
                                  );
                                })}
                              </div>
                              <button
                                onClick={handleConfirm}
                                style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                              >
                                Save Profile and Switch to Assistant
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {msg.from === 'user' && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ maxWidth: '72%', background: 'linear-gradient(135deg,var(--primary),var(--secondary))', borderRadius: '12px 6px 12px 12px', padding: '9px 12px', fontSize: 13, color: '#fff', lineHeight: 1.5 }}>
                          {msg.text}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          ) : (
            <>
              {!hasAssessment && (
                <div style={{ padding: '14px 16px', color: '#fcd34d', fontSize: 13, borderBottom: '1px solid rgba(250,204,21,0.25)', background: 'rgba(120,53,15,0.2)' }}>
                  Complete onboarding and save your profile to unlock assistant mode.
                </div>
              )}

              {aiPlan && (
                <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(56,189,248,0.15)', background: 'rgba(2,132,199,0.09)' }}>
                  {aiPlan.overview && <div style={{ fontSize: 12, color: '#111111', marginBottom: 8 }}>{aiPlan.overview}</div>}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {(aiPlan.careers || []).slice(0, 3).map((c) => (
                      <span key={c.careerTitle} style={{ fontSize: 11, color: '#e0f2fe', background: 'rgba(14,116,144,0.35)', border: '1px solid rgba(56,189,248,0.25)', borderRadius: 999, padding: '3px 10px' }}>
                        {c.careerTitle} ({c.matchScore}%)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {aiLoadingHistory && <div style={{ color: '#93c5fd', fontSize: 12 }}>Loading your AI plan and history...</div>}
                {aiMessages.map((m, i) => (
                  <div key={`${m.role}-${i}`} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
                    <div style={{ fontSize: 10, color: m.role === 'user' ? '#bfdbfe' : '#7dd3fc', marginBottom: 3 }}>{m.role === 'user' ? 'You' : 'GURU'}</div>
                    <div style={{ padding: '10px 12px', borderRadius: 12, lineHeight: 1.5, fontSize: 13, color: '#e2e8f0', background: m.role === 'user' ? 'rgba(37,99,235,0.42)' : 'rgba(15,23,42,0.95)', border: '1px solid rgba(56,189,248,0.2)' }}>
                      {renderRichText(m.content)}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div style={{ borderTop: '1px solid rgba(56,189,248,0.18)', padding: 10, display: 'flex', gap: 8 }}>
                <input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') sendAiMessage();
                  }}
                  placeholder="Ask for career steps, resources, or a weekly plan"
                  disabled={!hasAssessment}
                  style={{ flex: 1, borderRadius: 10, border: '1px solid rgba(56,189,248,0.3)', background: 'rgba(15,23,42,0.85)', color: '#e2e8f0', padding: '10px 12px', fontSize: 13, outline: 'none' }}
                />
                <button
                  onClick={sendAiMessage}
                  disabled={aiLoading || !hasAssessment}
                  style={{ border: 'none', borderRadius: 10, padding: '10px 14px', cursor: aiLoading ? 'not-allowed' : 'pointer', background: aiLoading ? 'rgba(14,116,144,0.45)' : 'linear-gradient(145deg, #0284c7, #2563eb)', color: '#f8fafc', fontWeight: 700, fontSize: 12 }}
                >
                  {aiLoading ? '...' : 'Send'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
