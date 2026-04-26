import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AppRouting } from './routing/AppRouting';
import './App.css';

function AppContent() {
    const [user, setUser] = useState(() => {
        const saved = sessionStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });
    const navigate = useNavigate();

const handleLogin = (loggedUser, token) => {
    setUser(loggedUser);
    sessionStorage.setItem('user', JSON.stringify(loggedUser));
    sessionStorage.setItem('token', token);
    switch (loggedUser.userRole) {
        case 1: navigate('/admin'); break;
        case 2: navigate('/teacher'); break;
        case 3: navigate('/student'); break;
        default: navigate('/');
    }
};

    const handleLogout = () => {
        setUser(null);
        sessionStorage.removeItem('user');
        navigate('/');
    };

    return (
        <AppRouting user={user} onLogin={handleLogin} onLogout={handleLogout} />
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;