import React, { useEffect, useRef, useState } from 'react';
import { chatWithAiAssistant, getAiChatHistory, getAiMasterPlan } from '../api';

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

const renderMessageContent = (content) => {
  const lines = String(content || '').split('\n');

  return lines.map((line, lineIndex) => {
    const parts = line.split(URL_REGEX);
    return (
      <React.Fragment key={`line-${lineIndex}`}>
        {parts.map((part, partIndex) => {
          if (/^https?:\/\//.test(part)) {
            return (
              <a
                key={`part-${lineIndex}-${partIndex}`}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#7dd3fc', textDecoration: 'underline', wordBreak: 'break-all' }}
              >
                {part}
              </a>
            );
          }
          return <React.Fragment key={`part-${lineIndex}-${partIndex}`}>{part}</React.Fragment>;
        })}
        {lineIndex < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
};

export default function AICareerAssistant({ isVisible }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    if (!open || !isVisible) return;

    let mounted = true;
    setLoadingHistory(true);

    Promise.all([getAiChatHistory().catch(() => null), getAiMasterPlan(false).catch(() => null)])
      .then(([historyData, planData]) => {
        if (!mounted) return;

        const initialMessages = Array.isArray(historyData?.messages) ? historyData.messages : [];
        if (initialMessages.length > 0) {
          setMessages(initialMessages);
        } else {
          setMessages([
            {
              role: 'assistant',
              content: 'Hi! I am your AI career assistant. Ask me for career recommendations, learning resources, or your step-by-step upskilling plan.',
            },
          ]);
        }

        setPlan(planData || historyData?.plan || null);
      })
      .finally(() => {
        if (mounted) setLoadingHistory(false);
      });

    return () => {
      mounted = false;
    };
  }, [open, isVisible]);

  if (!isVisible) return null;

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const optimistic = [...messages, { role: 'user', content: text }];
    setMessages(optimistic);
    setInput('');
    setLoading(true);

    try {
      const result = await chatWithAiAssistant(text);
      const assistantMessage = {
        role: 'assistant',
        content: result?.reply || 'I could not generate a reply right now.',
      };
      setMessages([...optimistic, assistantMessage]);

      if (Array.isArray(result?.recommendedCareers) || Array.isArray(result?.recommendedResources)) {
        setPlan((prev) => ({
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
      setMessages([
        ...optimistic,
        {
          role: 'assistant',
          content: err?.message || 'Assistant is temporarily unavailable. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            right: 28,
            bottom: 24,
            zIndex: 2200,
            width: 58,
            height: 58,
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            fontSize: 24,
            color: '#f8fafc',
            background: 'linear-gradient(145deg, #0ea5e9, #2563eb)',
            boxShadow: '0 14px 28px rgba(2,132,199,0.4)',
          }}
          title="AI Career Assistant"
        >
          AI
        </button>
      )}

      {open && (
        <div
          style={{
            position: 'fixed',
            right: 22,
            bottom: 20,
            zIndex: 2200,
            width: 'min(460px, calc(100vw - 26px))',
            height: 'min(76vh, 680px)',
            borderRadius: 18,
            border: '1px solid rgba(56,189,248,0.35)',
            background: 'linear-gradient(180deg, #0b1220, #111827)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 22px 60px rgba(2,6,23,0.75)',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(56,189,248,0.25)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(145deg, #0284c7, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#e0f2fe', fontWeight: 700 }}>AI</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>Career Assistant</div>
              <div style={{ fontSize: 11, color: '#93c5fd' }}>Recommendations and learning plans saved to database</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 18 }}>x</button>
          </div>

          {plan && (
            <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(56,189,248,0.15)', background: 'rgba(2,132,199,0.09)' }}>
              {plan.overview && <div style={{ fontSize: 12, color: '#dbeafe', marginBottom: 8 }}>{plan.overview}</div>}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(plan.careers || []).slice(0, 3).map((c) => (
                  <span key={c.careerTitle} style={{ fontSize: 11, color: '#e0f2fe', background: 'rgba(14,116,144,0.35)', border: '1px solid rgba(56,189,248,0.25)', borderRadius: 999, padding: '3px 10px' }}>
                    {c.careerTitle} ({c.matchScore}%)
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {loadingHistory && <div style={{ color: '#93c5fd', fontSize: 12 }}>Loading your AI plan and history...</div>}
            {messages.map((m, i) => (
              <div key={`${m.role}-${i}`} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
                <div style={{ fontSize: 10, color: m.role === 'user' ? '#bfdbfe' : '#7dd3fc', marginBottom: 3 }}>{m.role === 'user' ? 'You' : 'Assistant'}</div>
                <div style={{ padding: '10px 12px', borderRadius: 12, lineHeight: 1.5, fontSize: 13, color: '#e2e8f0', background: m.role === 'user' ? 'rgba(37,99,235,0.42)' : 'rgba(15,23,42,0.95)', border: '1px solid rgba(56,189,248,0.2)' }}>
                  {renderMessageContent(m.content)}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div style={{ borderTop: '1px solid rgba(56,189,248,0.18)', padding: 10, display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
              placeholder="Ask for career steps, resources, or a weekly plan"
              style={{
                flex: 1,
                borderRadius: 10,
                border: '1px solid rgba(56,189,248,0.3)',
                background: 'rgba(15,23,42,0.85)',
                color: '#e2e8f0',
                padding: '10px 12px',
                fontSize: 13,
                outline: 'none',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                border: 'none',
                borderRadius: 10,
                padding: '10px 14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                background: loading ? 'rgba(14,116,144,0.45)' : 'linear-gradient(145deg, #0284c7, #2563eb)',
                color: '#f8fafc',
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
