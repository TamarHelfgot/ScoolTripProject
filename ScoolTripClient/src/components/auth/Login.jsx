import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../axios/userAxios';

const SLIDES = [1,2,3,4,5,6,7,8,9,10].map(i => `/images/img${i}.jpg`);

function Login({ onLogin }) {
    const [id, setId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setCurrent(p => (p + 1) % SLIDES.length), 30000);
        return () => clearInterval(interval);
    }, []);

    const isValidId = (id) => {
        if (id.length !== 9) return false;
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            let digit = parseInt(id[i]) * ((i % 2) + 1);
            if (digit > 9) digit -= 9;
            sum += digit;
        }
        return sum % 10 === 0;
    };

    const handleLogin = async () => {
        setError('');
        if (!isValidId(id)) { setError('ת"ז לא תקינה'); return; }

        setLoading(true);
        try {
            const response = await loginUser(id);
            onLogin(response.data);
        } catch (err) {
            setError('ת"ז לא נמצאה במערכת');
        } finally {
            setLoading(false);
        }
    };

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

        
        <div style={{ position: 'relative', zIndex: 2 }}>
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
                <img src="/images/Logo.png" alt="בנות משה"
                     style={{ height: 72, mixBlendMode: 'screen', filter: 'brightness(1.15)' }} />
                <button
                    onClick={() => navigate('/')}
                    style={{
                        border: '1px solid rgba(255,255,255,0.3)',
                        color: 'rgba(255,255,255,0.8)',
                        borderRadius: 8, padding: '6px 16px',
                        background: 'transparent', cursor: 'pointer',
                        fontSize: '0.9rem', whiteSpace: 'nowrap',
                    }}>
                    חזרה
                </button>
            </nav>
        </div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 68px)', padding: '2rem 1rem' }}>
            <div style={{ width: '100%', maxWidth: 370 }}>
                <div className="text-center mb-4">
                    <h1 style={{ color: '#fff', fontSize: '1.9rem', fontWeight: 900 }}>כניסה למערכת</h1>
                    <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.82rem', fontWeight: 300, letterSpacing: '2.5px' }}>
                        טיול שנתי — בנות משה
                    </p>
                </div>

                <div style={{
                    background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.13)', borderRadius: 24,
                    padding: '2.5rem 2rem', boxShadow: '0 28px 64px rgba(0,0,0,0.4)',
                }}>
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: '1.4rem' }} />

                    <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        placeholder='הכניסי ת"ז'
                        maxLength={9}
                        style={{
                            width: '100%', background: 'rgba(255,255,255,0.07)',
                            border: error ? '1px solid #ff6b6b' : '1px solid rgba(255,255,255,0.15)',
                            borderRadius: 12, color: '#fff', padding: '13px 16px',
                            fontSize: '1rem', textAlign: 'right', marginBottom: 12,
                            outline: 'none', transition: 'all 0.3s',
                        }}
                    />

                    {error && (
                        <p style={{ color: '#ff8a8a', fontSize: '0.8rem', textAlign: 'center', marginBottom: 10 }}>
                            {error}
                        </p>
                    )}

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        style={{
                            width: '100%',
                            background: loading ? 'rgba(240,223,160,0.4)' : 'linear-gradient(135deg, #f0dfa0 0%, #d4b96a 100%)',
                            color: '#0f1e3a', fontWeight: 800, fontSize: '1rem',
                            padding: 13, borderRadius: 12, border: 'none', letterSpacing: 1,
                            boxShadow: '0 6px 24px rgba(212,185,106,0.35)',
                            cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s',
                        }}>
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                מתחבר...
                            </>
                        ) : 'כניסה'}
                    </button>

                    <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '1.4rem 0 0.5rem' }} />
                    <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', letterSpacing: 1, textAlign: 'center', marginBottom: 0 }}>
                       
                    </p>
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

export default Login;