import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ user, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    return (
   <nav className="navbar px-4 sticky-top shadow" dir="rtl"
             style={{ backgroundColor: 'rgba(30,41,59,0.85)', backdropFilter: 'blur(12px)', borderRadius: '0 0 16px 16px', minHeight: '68px', zIndex: 100 }}>
            <img src="/images/Logo.png" alt="בנות משה" height={72} style={{ mixBlendMode: 'screen', filter: 'brightness(1.15)' }} />
            <div className="d-flex align-items-center gap-3 ms-auto">
                <span className="text-white-50 text-nowrap small">
                    שלום, {user.firstName} {user.lastName}
                </span>
                <button onClick={handleLogout} className="btn btn-sm btn-outline-light text-nowrap">
                    התנתקות
                </button>
            </div>
        </nav>
    );    
}

export default Header;