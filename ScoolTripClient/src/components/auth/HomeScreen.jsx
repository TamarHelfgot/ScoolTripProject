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
                <div className="text-center">

                  

                    <h1 className="display-3 fw-bold text-white mb-2">
                        בנות משה
                    </h1>

                    <h4 className="fw-light text-white-50 mb-4">
                        טיול שנתי
                    </h4>

                 

                    <button
                        className="btn btn-light btn-lg rounded-pill px-5 fw-bold shadow"
                        onClick={() => navigate('/login')}>
                        כניסה למערכת 
                    </button>

                    <p className="text-white-50 small mt-5">
                        בנות משה • טיול שנתי • מערכת איכון
                    </p>

                </div>
            </div>
        </div>
    );
}

export default HomeScreen;