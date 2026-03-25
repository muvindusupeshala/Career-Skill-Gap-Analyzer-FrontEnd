import React, { useState, useRef, useEffect } from 'react';

const QUESTIONS = [
  {
    id: 'welcome',
    bot: "👋 Hi! I'm GURU, your Career Guide Assistant. I'll ask you some questions about your skills and background to build your personal career profile. This will take about 3 minutes. Ready?",
    type: 'choice',
    choices: ["Yes, let's go! 🚀", "Sure, I'm ready ✅"],
    next: 'career_goal'
  },
  {
    id: 'career_goal',
    bot: "Great! 🎯 First, what is your main career interest?",
    type: 'choice',
    field: 'careerGoal',
    choices: [
      '💻 Software Development',
      '📊 Data Science & Analytics',
      '🤖 AI / Machine Learning',
      '☁️ DevOps & Cloud',
      '🌐 Full Stack Development',
      '🤷 Not sure yet'
    ],
    next: 'js_heard'
  },
  {
    id: 'js_heard',
    bot: "Got it! Now let's go through your technical skills. 💻\n\nHave you heard of or used JavaScript before?",
    type: 'choice',
    field: 'js_heard',
    choices: ['Yes, I use it regularly', 'Yes, tried it a little', 'Heard of it but never used', 'Never heard of it'],
    next: 'js_level'
  },
  {
    id: 'js_level',
    bot: "How would you rate your JavaScript skill level?",
    type: 'choice',
    field: 'JavaScript / TypeScript',
    choices: ['🔴 Beginner', '🟡 Intermediate', '🟢 Advanced', '⭐ Expert'],
    next: 'js_project'
  },
  {
    id: 'js_project',
    bot: "Have you built any projects using JavaScript?",
    type: 'choice',
    field: 'js_project',
    choices: ['Yes — multiple projects', 'Yes — one small project', 'Only tutorials/practice', 'No projects yet'],
    next: 'python_heard'
  },
  {
    id: 'python_heard',
    bot: "Now let's talk about Python 🐍\n\nHave you worked with Python?",
    type: 'choice',
    field: 'python_heard',
    choices: ['Yes, I use it regularly', 'Yes, tried it a little', 'Heard of it but never used', 'Never heard of it'],
    next: 'python_level'
  },
  {
    id: 'python_level',
    bot: "How would you rate your Python skill level?",
    type: 'choice',
    field: 'Python',
    choices: ['🔴 Beginner', '🟡 Intermediate', '🟢 Advanced', '⭐ Expert'],
    next: 'python_use'
  },
  {
    id: 'python_use',
    bot: "What have you used Python for?",
    type: 'choice',
    field: 'python_use',
    choices: ['Data analysis / ML', 'Web development', 'Automation / scripts', 'Just learning basics', 'Never used it'],
    next: 'react_level'
  },
  {
    id: 'react_level',
    bot: "How about frontend frameworks? ⚛️\n\nRate your React / Angular / Vue skill:",
    type: 'choice',
    field: 'React / Angular / Vue',
    choices: ['🔴 Beginner', '🟡 Intermediate', '🟢 Advanced', '⭐ Expert'],
    next: 'node_level'
  },
  {
    id: 'node_level',
    bot: "How about backend development? 🖥️\n\nRate your Node.js / Backend skill:",
    type: 'choice',
    field: 'Node.js / Backend Dev',
    choices: ['🔴 Beginner', '🟡 Intermediate', '🟢 Advanced', '⭐ Expert'],
    next: 'sql_heard'
  },
  {
    id: 'sql_heard',
    bot: "Now databases! 🗄️\n\nHave you used SQL or any database before?",
    type: 'choice',
    field: 'sql_heard',
    choices: ['Yes — comfortable with it', 'Yes — basic queries only', 'Tried it once or twice', 'Never used databases'],
    next: 'sql_level'
  },
  {
    id: 'sql_level',
    bot: "Rate your SQL / Database skill level:",
    type: 'choice',
    field: 'SQL / Databases',
    choices: ['🔴 Beginner', '🟡 Intermediate', '🟢 Advanced', '⭐ Expert'],
    next: 'data_level'
  },
  {
    id: 'data_level',
    bot: "How about Data Analysis? 📊\n\nRate your skill in analyzing data:",
    type: 'choice',
    field: 'Data Analysis',
    choices: ['🔴 Beginner', '🟡 Intermediate', '🟢 Advanced', '⭐ Expert'],
    next: 'ml_level'
  },
  {
    id: 'ml_level',
    bot: "Have you explored Machine Learning or AI? 🤖\n\nRate your ML / AI skill:",
    type: 'choice',
    field: 'Machine Learning / AI',
    choices: ['🔴 Beginner', '🟡 Intermediate', '🟢 Advanced', '⭐ Expert'],
    next: 'cloud_level'
  },
  {
    id: 'cloud_level',
    bot: "Cloud Platforms ☁️ (AWS, Azure, GCP)\n\nRate your cloud skill:",
    type: 'choice',
    field: 'Cloud Platforms (AWS/Azure/GCP)',
    choices: ['🔴 Beginner', '🟡 Intermediate', '🟢 Advanced', '⭐ Expert'],
    next: 'docker_level'
  },
  {
    id: 'docker_level',
    bot: "Docker & Kubernetes 🐳\n\nHave you used containerization tools?",
    type: 'choice',
    field: 'Docker & Kubernetes',
    choices: ['🔴 Never used', '🟡 Basic understanding', '🟢 Used in projects', '⭐ Advanced'],
    next: 'cicd_level'
  },
  {
    id: 'cicd_level',
    bot: "CI/CD Pipelines ⚙️ (GitHub Actions, Jenkins etc.)\n\nRate your DevOps skill:",
    type: 'choice',
    field: 'CI/CD Pipelines',
    choices: ['🔴 Beginner', '🟡 Basic knowledge', '🟢 Set up pipelines', '⭐ Expert'],
    next: 'linux_level'
  },
  {
    id: 'linux_level',
    bot: "Linux / System Administration 🐧\n\nHow comfortable are you with Linux?",
    type: 'choice',
    field: 'Linux / System Admin',
    choices: ['🔴 Never used', '🟡 Basic commands', '🟢 Comfortable', '⭐ Advanced admin'],
    next: 'soft_intro'
  },
  {
    id: 'soft_intro',
    bot: "Great job! 🎉 Technical skills done!\n\nNow let's talk about your soft skills. These are just as important for your career! 💼",
    type: 'choice',
    choices: ["Ok, let's continue →"],
    next: 'problem_solving'
  },
  {
    id: 'problem_solving',
    bot: "Problem Solving 🧠\n\nHow would you rate your ability to solve complex problems?",
    type: 'choice',
    field: 'Problem Solving',
    choices: ['🔴 Need improvement', '🟡 Average', '🟢 Good', '⭐ Excellent'],
    next: 'communication'
  },
  {
    id: 'communication',
    bot: "Communication 🗣️\n\nHow well can you explain ideas and present your work?",
    type: 'choice',
    field: 'Communication',
    choices: ['🔴 Need improvement', '🟡 Average', '🟢 Good', '⭐ Excellent'],
    next: 'teamwork'
  },
  {
    id: 'teamwork',
    bot: "Teamwork & Collaboration 🤝\n\nHow well do you work in a team?",
    type: 'choice',
    field: 'Teamwork & Collaboration',
    choices: ['🔴 Prefer working alone', '🟡 Can work in teams', '🟢 Good team player', '⭐ Natural collaborator'],
    next: 'time_management'
  },
  {
    id: 'time_management',
    bot: "Time Management ⏰\n\nHow well do you manage deadlines and tasks?",
    type: 'choice',
    field: 'Time Management',
    choices: ['🔴 Struggle with deadlines', '🟡 Usually on time', '🟢 Good at planning', '⭐ Excellent planner'],
    next: 'leadership'
  },
  {
    id: 'leadership',
    bot: "Leadership 👑\n\nHave you led any projects, teams or events?",
    type: 'choice',
    field: 'Leadership',
    choices: ['🔴 Not yet', '🟡 Small group tasks', '🟢 Led team projects', '⭐ Regular leader'],
    next: 'academic_intro'
  },
  {
    id: 'academic_intro',
    bot: "Almost done! 📚 Just a couple of academic questions left.",
    type: 'choice',
    choices: ["Ok, let's finish →"],
    next: 'gpa'
  },
  {
    id: 'gpa',
    bot: "What is your current GPA / CGPA?\n(Type a number like 3.20 or type 'Not sure')",
    type: 'input',
    field: 'gpa',
    placeholder: 'e.g. 3.20',
    next: 'certs'
  },
  {
    id: 'certs',
    bot: "Do you have any certifications or extra qualifications?\n(e.g. AWS Certificate, Google Analytics — or type 'None')",
    type: 'input',
    field: 'quals',
    placeholder: 'e.g. AWS Cloud Practitioner, or None',
    next: 'done'
  },
  {
    id: 'done',
    bot: "✅ That's everything! Let me build your skill profile now...",
    type: 'summary'
  }
];

const levelMap = {
  '🔴 Beginner': 1, '🟡 Intermediate': 2, '🟢 Advanced': 3, '⭐ Expert': 4,
  '🔴 Never used': 0, '🟡 Basic understanding': 1, '🟢 Used in projects': 3, '⭐ Advanced': 4,
  '🔴 Never used it': 0, '🟡 Basic commands': 1, '🟢 Comfortable': 3, '⭐ Advanced admin': 4,
  '🔴 Need improvement': 1, '🟡 Average': 2, '🟢 Good': 3, '⭐ Excellent': 4,
  '🔴 Prefer working alone': 1, '🟡 Can work in teams': 2, '🟢 Good team player': 3, '⭐ Natural collaborator': 4,
  '🔴 Struggle with deadlines': 1, '🟡 Usually on time': 2, '🟢 Good at planning': 3, '⭐ Excellent planner': 4,
  '🔴 Not yet': 1, '🟡 Small group tasks': 2, '🟢 Led team projects': 3, '⭐ Regular leader': 4,
  '🟡 Basic knowledge': 1, '🟢 Set up pipelines': 3,
};

const SKILL_FIELDS = [
  'JavaScript / TypeScript', 'Python', 'React / Angular / Vue',
  'Node.js / Backend Dev', 'SQL / Databases', 'Data Analysis',
  'Machine Learning / AI', 'Cloud Platforms (AWS/Azure/GCP)',
  'Docker & Kubernetes', 'CI/CD Pipelines', 'Linux / System Admin',
  'Problem Solving', 'Communication', 'Teamwork & Collaboration',
  'Time Management', 'Leadership',
];

export default function OnboardingChatBot({ onComplete, userName }) {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [answers, setAnswers] = useState({});
  const [inputVal, setInputVal] = useState('');
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const bottomRef = useRef();

  useEffect(() => {
    const first = QUESTIONS.find(q => q.id === 'welcome');
    setTimeout(() => addBotMessage(first), 600);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (q) => {
    setMessages(prev => [...prev, {
      from: 'bot', text: q.bot, type: q.type,
      choices: q.choices, placeholder: q.placeholder, id: q.id
    }]);
  };

  const handleAnswer = (answer, questionId) => {
    const question = QUESTIONS.find(q => q.id === questionId);
    if (!question) return;

    setMessages(prev => [...prev, { from: 'user', text: answer }]);
    setInputVal('');

    if (question.field) {
      const numericValue = levelMap[answer];
      setAnswers(prev => ({
        ...prev,
        [question.field]: numericValue !== undefined ? numericValue : answer
      }));
      if (SKILL_FIELDS.includes(question.field)) {
        setProgress(prev => Math.min(100, prev + Math.round(100 / SKILL_FIELDS.length)));
      }
    }

    setTimeout(() => {
      const nextQ = QUESTIONS.find(q => q.id === question.next);
      if (!nextQ) return;
      if (nextQ.type === 'summary') setDone(true);
      addBotMessage(nextQ);
    }, 500);
  };

  const calcScore = (skills, keys) =>
    Math.round((keys.reduce((sum, k) => sum + (skills[k] || 0), 0) / (keys.length * 4)) * 100);

  const handleConfirm = async () => {
    const skills = {};
    SKILL_FIELDS.forEach(skill => {
      skills[skill] = typeof answers[skill] === 'number' ? answers[skill] : 1;
    });
    skills['Data Visualization'] = skills['Data Analysis'] >= 2 ? skills['Data Analysis'] - 1 : 1;
    skills['Statistics & Probability'] = skills['Machine Learning / AI'] >= 2 ? skills['Machine Learning / AI'] - 1 : 1;

    const total = Object.values(skills).reduce((a, b) => a + b, 0);
    const overallScore = Math.round((total / (Object.keys(skills).length * 4)) * 100);

    const careerScores = {
      'Software Engineer':    calcScore(skills, ['JavaScript / TypeScript', 'React / Angular / Vue', 'Node.js / Backend Dev', 'Problem Solving']),
      'Data Analyst':         calcScore(skills, ['Data Analysis', 'SQL / Databases', 'Statistics & Probability', 'Python']),
      'ML/AI Engineer':       calcScore(skills, ['Machine Learning / AI', 'Python', 'Data Analysis', 'Statistics & Probability']),
      'DevOps Engineer':      calcScore(skills, ['Cloud Platforms (AWS/Azure/GCP)', 'Docker & Kubernetes', 'CI/CD Pipelines', 'Linux / System Admin']),
      'Full Stack Developer': calcScore(skills, ['JavaScript / TypeScript', 'React / Angular / Vue', 'SQL / Databases', 'Node.js / Backend Dev']),
    };

    const topCareer = Object.entries(careerScores).sort((a, b) => b[1] - a[1])[0][0];
    const gapCount  = Object.values(skills).filter(v => v < 2).length;

    const assessmentData = {
      skills,
      overallScore,
      careerScores,
      topCareer,
      gapCount,
      gpa:   answers.gpa,
      quals: answers.quals,
    };

    // ── Save to MongoDB ──────────────────────────
    try {
      const { saveAssessment, generateRecommendation } = await import('../api');
      await saveAssessment(assessmentData);
      await generateRecommendation();
      console.log('✅ Assessment saved to MongoDB');
    } catch (err) {
      console.log('⚠️ Could not save to database:', err.message);
    }

    onComplete(assessmentData);
  };

  const answeredSkills = SKILL_FIELDS.filter(s => typeof answers[s] === 'number');
  const levelLabels = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const levelColors = ['', '#ef4444', '#f59e0b', 'var(--primary-light)', '#10b981'];

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed', bottom: 30, right: 30, zIndex: 2000,
            width: 60, height: 60, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: 'var(--text-primary)', fontSize: '28px', border: 'none',
            boxShadow: '0 8px 32px rgba(79,70,229,0.5)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          🤖
        </button>
      )}

      {isOpen && (
        <div style={{
          position: 'fixed', bottom: 30, right: 30, zIndex: 2000,
          width: '100%', maxWidth: 400,
          background: 'var(--bg-card)',
          border: '1px solid rgba(79,70,229,0.3)',
          borderRadius: '24px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column',
          height: '600px', maxHeight: '80vh', overflow: 'hidden',
          animation: 'slideUp 0.3s ease-out'
        }}>
          {/* Header */}
          <div style={{ padding: '18px 24px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', flexShrink: 0, position: 'relative' }}>
            <button 
              onClick={() => setIsOpen(false)} 
              style={{ position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '18px', opacity: 0.8 }}
            >
              ✕
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', paddingRight: '20px' }}>
              <div style={{ fontSize: '26px' }}>🤖</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', fontSize: '15px' }}>GURU</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
                  {done ? 'Profile Complete! ✅' : 'Building your skill profile...'}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{progress}%</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>Complete</div>
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'var(--text-primary)', borderRadius: 2, transition: 'width 0.4s ease' }} />
            </div>
          </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {messages.map((msg, i) => {
            const isLast = i === messages.length - 1;
            return (
              <div key={i}>

                {/* Bot message */}
                {msg.from === 'bot' && (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0, marginTop: 2 }}>🤖</div>
                    <div style={{ flex: 1 }}>

                      {/* Bot text bubble */}
                      <div style={{ background: 'rgba(79,70,229,0.15)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: '4px 14px 14px 14px', padding: '12px 16px', fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                        {msg.text}
                      </div>

                      {/* Choice buttons — only show on last message */}
                      {msg.type === 'choice' && isLast && !done && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                          {msg.choices?.map(choice => (
                            <button
                              key={choice}
                              onClick={() => handleAnswer(choice, msg.id)}
                              style={{
                                padding: '9px 16px', borderRadius: '10px',
                                border: '1px solid rgba(79,70,229,0.25)',
                                background: 'rgba(79,70,229,0.08)', color: '#c4b5fd',
                                cursor: 'pointer', fontSize: '13px', textAlign: 'left',
                                fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(79,70,229,0.25)'; e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(79,70,229,0.08)'; e.currentTarget.style.borderColor = 'rgba(79,70,229,0.25)'; }}
                            >
                              {choice}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Text input — only show on last message */}
                      {msg.type === 'input' && isLast && !done && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                          <input
                            autoFocus
                            value={inputVal}
                            onChange={e => setInputVal(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAnswer(inputVal, msg.id)}
                            placeholder={msg.placeholder}
                            style={{
                              flex: 1, padding: '10px 14px',
                              background: 'rgba(15,15,42,0.9)',
                              border: '1px solid rgba(79,70,229,0.25)',
                              borderRadius: '10px', color: 'var(--text-primary)',
                              fontFamily: 'var(--font-body)', fontSize: '13px', outline: 'none'
                            }}
                          />
                          <button
                            onClick={() => handleAnswer(inputVal, msg.id)}
                            style={{ padding: '10px 16px', background: 'linear-gradient(135deg,var(--primary),var(--secondary))', border: 'none', borderRadius: '10px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '15px' }}
                          >→</button>
                        </div>
                      )}

                      {/* Summary card */}
                      {msg.type === 'summary' && done && (
                        <div style={{ marginTop: '12px', background: 'rgba(15,15,42,0.8)', border: '1px solid rgba(79,70,229,0.25)', borderRadius: '16px', padding: '20px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-light)', marginBottom: '14px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            📋 Your Skill Profile Summary
                          </div>

                          {/* Skill bars */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                            {answeredSkills.map(skill => {
                              const val = answers[skill];
                              return (
                                <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div style={{ flex: 1, fontSize: '12px', color: 'var(--text-secondary)' }}>{skill}</div>
                                  <div style={{ height: 4, width: 80, background: 'rgba(79,70,229,0.1)', borderRadius: 2 }}>
                                    <div style={{ height: '100%', width: `${(val / 4) * 100}%`, background: levelColors[val], borderRadius: 2 }} />
                                  </div>
                                  <div style={{ fontSize: '11px', fontWeight: 600, color: levelColors[val], width: 72, textAlign: 'right' }}>
                                    {levelLabels[val]}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Academic info */}
                          <div style={{ borderTop: '1px solid rgba(79,70,229,0.15)', paddingTop: '12px', marginBottom: '16px' }}>
                            {answers.gpa && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>📚 GPA</span>
                                <span style={{ color: '#c4b5fd', fontWeight: 600 }}>{answers.gpa}</span>
                              </div>
                            )}
                            {answers.quals && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>🏆 Certifications</span>
                                <span style={{ color: '#c4b5fd', fontWeight: 600, maxWidth: '60%', textAlign: 'right' }}>{answers.quals}</span>
                              </div>
                            )}
                          </div>

                          {/* Confirm button */}
                          <button
                            onClick={handleConfirm}
                            style={{
                              width: '100%', padding: '14px',
                              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                              color: 'var(--text-primary)', border: 'none', borderRadius: '12px',
                              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px',
                              cursor: 'pointer', boxShadow: '0 4px 20px rgba(79,70,229,0.4)',
                            }}
                          >
                            ✅ Save My Profile & Go to Dashboard →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* User message */}
                {msg.from === 'user' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{
                      maxWidth: '72%',
                      background: 'linear-gradient(135deg,var(--primary),var(--secondary))',
                      borderRadius: '14px 4px 14px 14px',
                      padding: '10px 16px', fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5
                    }}>
                      {msg.text}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>
      )}
    </>
  );
}
