import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundSlider from '../shared/BackgroundSlider';

function HomeScreen() {
    const navigate = useNavigate();

    return (
        <div className="min-vh-100" dir="rtl">
            <BackgroundSlider />

            <nav className="navbar px-4 sticky-top shadow"
                style={{ backgroundColor: 'rgba(30,41,59,0.85)', backdropFilter: 'blur(12px)', borderRadius: '0 0 16px 16px', minHeight: '68px', zIndex: 100 }}>
                <img src="/images/Logo.png" alt="בנות משה" height={72} style={{ mixBlendMode: 'screen', filter: 'brightness(1.15)' }} />
                <span className="text-white-50 small ms-auto">מערכת איכון תלמידות</span>
            </nav>

            <div className="d-flex align-items-center justify-content-center px-3"
                style={{ position: 'relative', zIndex: 2, minHeight: 'calc(100vh - 68px)' }}>
                <div style={{ width: '100%', maxWidth: 370 }}>

                    <div className="text-center mb-4">
                        <h1 className="fw-bold text-white">כניסה למערכת</h1>
                        <p className="text-white-50 small">טיול שנתי - בנות משה</p>
                    </div>

                    <div className="card bg-dark bg-opacity-50 border-0 shadow-lg rounded-4"
                        style={{ backdropFilter: 'blur(24px)' }}>
                        <div className="card-body p-4">
                            <button
                                className="btn btn-outline-light w-100 fw-bold"
                                onClick={() => navigate('/login')}>
                                כניסה למערכת
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default HomeScreen;