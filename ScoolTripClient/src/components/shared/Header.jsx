import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ user, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    return (
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
            <img src="/images/Logo.png" alt="בנות משה" height={90}
                className="my-n2"
                style={{ mixBlendMode: 'screen', filter: 'brightness(1.15)' }} />

            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }} className="text-nowrap">
                שלום, {user.firstName} {user.lastName}
            </span>

            <button
                onClick={handleLogout}
                className="btn btn-sm text-nowrap"
                style={{
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'rgba(255,255,255,0.8)',
                    borderRadius: 8,
                }}>
                התנתקות
            </button>
        </nav>
    );
}

export default Header;