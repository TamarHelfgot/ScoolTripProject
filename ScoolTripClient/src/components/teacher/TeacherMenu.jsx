import React, { useState, useEffect } from 'react';
import Header from '../shared/Header';
import AddStudent from './AddStudent';
import AllUsers from './AllUsers';
import MyStudents from './MyStudents';
import LocationMap from './LocationMap';

const SLIDES = [1,2,3,4,5,6,7,8,9,10].map(i => `/images/img${i}.jpg`);

function TeacherMenu({ user, onLogout }) {
    const [screen, setScreen] = useState('menu');
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setCurrent(p => (p + 1) % SLIDES.length), 30000);
        return () => clearInterval(interval);
    }, []);

    if (screen === 'addStudent')
        return <AddStudent user={user} onBack={() => setScreen('menu')} />;
    if (screen === 'allUsers')
        return <AllUsers user={user} onBack={() => setScreen('menu')} />;
    if (screen === 'myStudents')
        return <MyStudents user={user} onBack={() => setScreen('menu')} />;
    if (screen === 'map')
        return <LocationMap user={user} onBack={() => setScreen('menu')} />;

    const menuItems = [
        { key: 'map',        icon: '🗺️', label: 'מפת איכון' },
        { key: 'addStudent', icon: '➕', label: 'הוספת תלמידה' },
        { key: 'allUsers',   icon: '👥', label: 'כל המשתמשים' },
        { key: 'myStudents', icon: '🎒', label: 'תלמידות הכיתה שלי' },
    ];

    return (
        <div style={{ minHeight: '100vh', fontFamily: "'Heebo', sans-serif" }}>

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

            <div style={{ position: 'relative', zIndex: 2 }}>
                <Header user={user} onLogout={onLogout} />
            </div>

            <div style={{
                position: 'relative', zIndex: 2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: 'calc(100vh - 68px)', padding: '2rem 1rem',
            }}>
                <div style={{ width: '100%', maxWidth: 420 }}>
                    <div className="text-center mb-4">
                        <h1 style={{ color: '#fff', fontSize: '1.9rem', fontWeight: 900 }}>
                            שלום, {user.firstName} 👋
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.82rem', fontWeight: 300, letterSpacing: '2.5px' }}>
                            מה תרצי לעשות היום?
                        </p>
                    </div>

                    <div style={{
                        background: 'rgba(255,255,255,0.06)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255,255,255,0.13)',
                        borderRadius: 24, padding: '2rem',
                        boxShadow: '0 28px 64px rgba(0,0,0,0.4)',
                    }}>
                        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: '1.4rem' }} />
                        <div className="d-flex flex-column gap-3">
                            {menuItems.map(item => (
                                <button
                                    key={item.key}
                                    onClick={() => setScreen(item.key)}
                                    style={{
                                        background: 'rgba(255,255,255,0.07)',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        borderRadius: 12, color: '#fff',
                                        padding: '14px 20px', fontSize: '1rem',
                                        textAlign: 'right', cursor: 'pointer',
                                        transition: 'all 0.25s', fontWeight: 600,
                                        letterSpacing: '0.5px',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #f0dfa0 0%, #d4b96a 100%)';
                                        e.currentTarget.style.color = '#0f1e3a';
                                        e.currentTarget.style.borderColor = 'transparent';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(212,185,106,0.35)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                                        e.currentTarget.style.color = '#fff';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    {item.icon} {item.label}
                                </button>
                            ))}
                        </div>
                        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginTop: '1.4rem' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeacherMenu;