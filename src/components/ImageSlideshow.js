import React, { useState, useEffect } from 'react';

const slides = [
  {
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80',
    title: 'Collaborative Learning',
    desc: 'Empowering IT students to work together'
  },
  {
    url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80',
    title: 'Career Advancement',
    desc: 'Navigate your path to success'
  },
  {
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80',
    title: 'Code Your Future',
    desc: 'Identify and bridge your skill gaps'
  }
];

export default function ImageSlideshow({ style }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }}>
      {slides.map((slide, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: current === index ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            backgroundImage: `url(${slide.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 100%)',
          }} />
          
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            right: '40px',
            color: 'white',
            transform: current === index ? 'translateY(0)' : 'translateY(20px)',
            opacity: current === index ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
          }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, marginBottom: '8px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {slide.title}
            </h2>
            <p style={{ fontSize: '16px', opacity: 0.9, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {slide.desc}
            </p>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div style={{ display: 'flex', gap: '8px', position: 'absolute', bottom: '20px', left: '40px' }}>
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: current === i ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: current === i ? 'var(--primary-light)' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
