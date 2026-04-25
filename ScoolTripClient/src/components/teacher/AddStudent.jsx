import React, { useState } from 'react';
import { addUser } from '../../axios/userAxios';
import Header from '../shared/Header';

const SLIDES = [1,2,3,4,5,6,7,8,9,10].map(i => `/images/img${i}.jpg`);

function AddStudent({ user, onBack }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [id, setId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState(0);

    React.useEffect(() => {
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

    const handleAdd = async () => {
        setError('');
        setSuccess('');
        if (!isValidId(id)) { setError('ת"ז לא תקינה'); return; }
        if (!firstName || !lastName) { setError('יש למלא את כל השדות'); return; }

        setLoading(true);
        try {
            await addUser({
                id, firstName, lastName,
                classId: user.classId,
                userRole: 3
            }, user.id);
            setSuccess('התלמידה נוספה בהצלחה!');
            setId(''); setFirstName(''); setLastName('');
            setTimeout(() => onBack(), 1500);
        } catch (err) {
            setError('שגיאה בהוספת התלמידה');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 12, color: '#fff', padding: '13px 16px',
        fontSize: '1rem', textAlign: 'right', marginBottom: 12,
        outline: 'none', transition: 'all 0.3s',
    };

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
                <Header user={user} onLogout={onBack} />
            </div>

            <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
                <div style={{ width: '100%', maxWidth: 420 }}>
                    <div className="text-center mb-4">
                        <h1 style={{ color: '#fff', fontSize: '1.9rem', fontWeight: 900 }}>הוספת תלמידה</h1>
                        <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.82rem', fontWeight: 300, letterSpacing: '2.5px' }}>
                            כיתה {user.classId} — בנות משה
                        </p>
                    </div>

                    <div style={{
                        background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255,255,255,0.13)', borderRadius: 24,
                        padding: '2.5rem 2rem', boxShadow: '0 28px 64px rgba(0,0,0,0.4)',
                    }}>
                        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: '1.4rem' }} />

                        <input style={inputStyle} placeholder='ת"ז' value={id}
                            onChange={(e) => setId(e.target.value)} maxLength={9} />
                        <input style={inputStyle} placeholder='שם פרטי' value={firstName}
                            onChange={(e) => setFirstName(e.target.value)} />
                        <input style={inputStyle} placeholder='שם משפחה' value={lastName}
                            onChange={(e) => setLastName(e.target.value)} />

                        {error && (
                            <p style={{ color: '#ff8a8a', fontSize: '0.8rem', textAlign: 'center', marginBottom: 10 }}>
                                {error}
                            </p>
                        )}
                        {success && (
                            <p style={{ color: '#a8f0b0', fontSize: '0.8rem', textAlign: 'center', marginBottom: 10 }}>
                                {success}
                            </p>
                        )}

                        <button
                            onClick={handleAdd}
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
                                    מוסיף...
                                </>
                            ) : 'הוספה'}
                        </button>

                        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '1.4rem 0 0.5rem' }} />
                        <button
                            onClick={onBack}
                            style={{
                                width: '100%', background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: 'rgba(255,255,255,0.6)', borderRadius: 12,
                                padding: '10px', cursor: 'pointer', fontSize: '0.9rem',
                                transition: 'all 0.3s',
                            }}>
                            חזרה
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddStudent;