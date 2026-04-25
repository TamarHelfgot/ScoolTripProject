import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../axios/userAxios';
import { getAllClasses } from '../../axios/classAxios';
import Header from '../shared/Header';

const SLIDES = [1,2,3,4,5,6,7,8,9,10].map(i => `/images/img${i}.jpg`);

function AllUsers({ user, onBack }) {
    const [users, setUsers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, classesRes] = await Promise.all([
                    getAllUsers(user.id),
                    getAllClasses()
                ]);
                setUsers(usersRes.data);
                setClasses(classesRes.data);
            } catch (err) {
                setError('שגיאה בטעינת הנתונים');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setCurrent(p => (p + 1) % SLIDES.length), 30000);
        return () => clearInterval(interval);
    }, []);

    const getClassName = (classId) => {
        const cls = classes.find(c => c.id === classId);
        return cls ? cls.className : classId;
    };

    const teachers = users.filter(u => u.userRole === 2);
    const students = users.filter(u => u.userRole === 3);

    const tableHeadStyle = {
        background: 'rgba(255,255,255,0.08)',
        color: 'rgba(255,255,255,0.6)',
        fontSize: '0.82rem',
        letterSpacing: '1px',
    };

    const tableRowStyle = {
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.85)',
        fontSize: '0.9rem',
    };

    const cardStyle = {
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.13)',
        borderRadius: 20,
        padding: '1.5rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        marginBottom: '1.5rem',
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

            <div style={{ position: 'relative', zIndex: 2, padding: '2rem 1.5rem', maxWidth: 900, margin: '0 auto' }}>

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <button
                        onClick={onBack}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'rgba(255,255,255,0.7)',
                            borderRadius: 8, padding: '6px 16px',
                            cursor: 'pointer', fontSize: '0.9rem',
                        }}>
                        חזרה
                    </button>
                    <h2 style={{ color: '#fff', fontWeight: 900, margin: 0 }}>כל המשתמשים</h2>
                </div>

                {loading && (
                    <div className="text-center mt-5">
                        <div className="spinner-border" style={{ color: '#f0dfa0' }} />
                    </div>
                )}

                {error && (
                    <p style={{ color: '#ff8a8a', textAlign: 'center' }}>{error}</p>
                )}

                {!loading && <>
                    <div style={cardStyle}>
                        <h5 className="text-end mb-3" style={{ color: '#f0dfa0', fontWeight: 700 }}> מורות</h5>
                        <div className="table-responsive">
                            <table className="table mb-0 text-end">
                                <thead>
                                    <tr style={tableHeadStyle}>
                                        <th style={{ background: 'transparent', border: 'none' }}>ת"ז</th>
                                        <th style={{ background: 'transparent', border: 'none' }}>שם</th>
                                        <th style={{ background: 'transparent', border: 'none' }}>כיתה</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teachers.map(t => (
                                        <tr key={t.id} style={tableRowStyle}>
                                            <td style={{ border: 'none' }}>{t.id}</td>
                                            <td style={{ border: 'none' }}>{t.firstName} {t.lastName}</td>
                                            <td style={{ border: 'none' }}>{getClassName(t.classId)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h5 className="text-end mb-3" style={{ color: '#f0dfa0', fontWeight: 700 }}> תלמידות</h5>
                        <div className="table-responsive">
                            <table className="table mb-0 text-end">
                                <thead>
                                    <tr style={tableHeadStyle}>
                                        <th style={{ background: 'transparent', border: 'none' }}>ת"ז</th>
                                        <th style={{ background: 'transparent', border: 'none' }}>שם</th>
                                        <th style={{ background: 'transparent', border: 'none' }}>כיתה</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(s => (
                                        <tr key={s.id} style={tableRowStyle}>
                                            <td style={{ border: 'none' }}>{s.id}</td>
                                            <td style={{ border: 'none' }}>{s.firstName} {s.lastName}</td>
                                            <td style={{ border: 'none' }}>{getClassName(s.classId)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>}
            </div>
        </div>
    );
}

export default AllUsers;