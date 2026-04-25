import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SLIDES = [1,2,3,4,5,6,7,8,9,10].map(i => `/images/img${i}.jpg`);

function HomeScreen() {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setCurrent(p => (p + 1) % SLIDES.length), 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', fontFamily: "'Heebo', sans-serif" }}>

            {SLIDES.map((url, i) => (
                <div key={i} style={{
                    position: 'fixed', inset: 0,
                    backgroundImage: `url(${url})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    opacity: i === current ? 1 : 0,
                    transition: 'opacity 2.8s ease-in-out', zIndex: 0,
                }} />
            ))}

            <div style={{
                position: 'fixed', inset: 0, zIndex: 1,
                background: 'linear-gradient(135deg, rgba(10,25,60,0.75) 0%, rgba(15,30,58,0.68) 100%)',
                backdropFilter: 'blur(1.5px)',
            }} />

            <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            <nav className="px-4 d-flex align-items-center justify-content-between"
                 style={{
                     backgroundColor: 'rgba(30,41,59,0.85)',
                     backdropFilter: 'blur(12px)',
                     borderRadius: '0 0 16px 16px',
                     boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                     minHeight: '68px',
                     position: 'sticky',
                     top: 0,
                     zIndex: 100,
                 }}>
                    <img
                        src="/images/Logo.png"
                        alt="בנות משה"
                        style={{ height: 72, mixBlendMode: 'screen', filter: 'brightness(1.15)' }}
                    />
                    <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.68rem', letterSpacing: '2.5px' }}>
                        מערכת איכון תלמידות
                    </div>
                </nav>

                <div className="flex-grow-1 d-flex align-items-center justify-content-center px-3">
                    <div style={{ width: '100%', maxWidth: 370 }}>
                        <div className="text-center mb-4">
                            <h1 style={{ color: '#fff', fontSize: '1.9rem', fontWeight: 900, letterSpacing: '0.5px' }}>
                                כניסה למערכת
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.82rem', fontWeight: 300, letterSpacing: '2.5px' }}>
                                טיול שנתי - בנות משה
                            </p>
                        </div>

                        <div style={{
                            background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(24px)',
                            border: '1px solid rgba(255,255,255,0.13)', borderRadius: 24,
                            padding: '2.5rem 2rem', boxShadow: '0 28px 64px rgba(0,0,0,0.4)',
                        }}>
                            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: '1.4rem' }} />
                            <button
                                onClick={() => navigate('/login')}
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, #f0dfa0 0%, #d4b96a 100%)',
                                    color: '#0f1e3a', fontWeight: 800, fontSize: '1rem',
                                    padding: 13, borderRadius: 12, border: 'none', letterSpacing: 1,
                                    boxShadow: '0 6px 24px rgba(212,185,106,0.35)', cursor: 'pointer',
                                    transition: 'all 0.3s',
                                }}>
                                כניסה למערכת
                            </button>
                            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '1.4rem 0 0.5rem' }} />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ position: 'fixed', bottom: 22, left: '50%', transform: 'translateX(-50%)', zIndex: 3, display: 'flex', gap: 8 }}>
                {SLIDES.map((_, i) => (
                    <div key={i} onClick={() => setCurrent(i)} style={{
                        width: i === current ? 20 : 6, height: 6,
                        borderRadius: i === current ? 3 : '50%',
                        background: i === current ? '#f0dfa0' : 'rgba(255,255,255,0.25)',
                        transition: 'all 0.4s', cursor: 'pointer',
                    }} />
                ))}
            </div>
        </div>
    );
}

export default HomeScreen;