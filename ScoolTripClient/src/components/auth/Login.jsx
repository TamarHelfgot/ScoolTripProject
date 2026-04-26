import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../axios/userAxios';
import BackgroundSlider from '../shared/BackgroundSlider';

function Login({ onLogin }) {
    const [id, setId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
        <div className="min-vh-100" dir="rtl">
            <BackgroundSlider />

           <nav className="navbar px-4 sticky-top shadow" dir="rtl"
             style={{ backgroundColor: 'rgba(30,41,59,0.85)', backdropFilter: 'blur(12px)', borderRadius: '0 0 16px 16px', minHeight: '68px', zIndex: 100 }}>
            <img src="/images/Logo.png" alt="בנות משה" height={72} style={{ mixBlendMode: 'screen', filter: 'brightness(1.15)' }} />
            <div className="d-flex align-items-center gap-3 ms-auto">
    
                <button onClick={() => navigate('/')} className="btn btn-sm btn-outline-light text-nowrap">
                    חזרה
                </button>
            </div>
        </nav>
          
            <div className="d-flex align-items-center justify-content-center px-3"
                style={{ position: 'relative', zIndex: 2, minHeight: 'calc(100vh - 68px)' }}>
                <div style={{ width: '100%', maxWidth: 370 }}>

                    <div className="text-center mb-4">
                        <h1 className="fw-bold text-white">כניסה למערכת</h1>
                        <p className="text-white-50 small">טיול שנתי — בנות משה</p>
                    </div>

                    <div className="card bg-dark bg-opacity-50 border-0 shadow-lg rounded-4"
                        style={{ backdropFilter: 'blur(24px)' }}>
                        <div className="card-body p-4">

                            <label className="text-white-50 small mb-1">ת"ז</label>
                            <input
                                type="text"
                                className={`form-control mb-3 text-end bg-dark text-white border-secondary ${error ? 'is-invalid' : ''}`}
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                placeholder='הכניסי ת"ז'
                                maxLength={9}
                            />

                            {error && (
                                <div className="alert alert-danger py-2 text-center">
                                    {error}
                                </div>
                            )}

                            <button
                                className="btn btn-outline-light w-100 fw-bold"
                                onClick={handleLogin}
                                disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        מתחבר...
                                    </>
                                ) : 'כניסה'}
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;