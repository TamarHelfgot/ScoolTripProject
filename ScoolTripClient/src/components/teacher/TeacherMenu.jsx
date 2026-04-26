import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from '../shared/Header';
import AddStudent from './AddStudent';
import AllUsers from './AllUsers';
import MyStudents from './MyStudents';
import LocationMap from './LocationMap';
import BackgroundSlider from '../shared/BackgroundSlider';

function TeacherMenu({ user, onLogout }) {
    const navigate = useNavigate();

    const menuItems = [
        { key: 'map',        icon: '🗺️', label: 'מפת איכון' },
        { key: 'addStudent', icon: '➕', label: 'הוספת תלמידה' },
        { key: 'allUsers',   icon: '👥', label: 'כל המשתמשים' },
        { key: 'myStudents', icon: '🎒', label: 'תלמידות הכיתה שלי' },
    ];

    const Menu = (
        <div className="min-vh-100" dir="rtl">
            <BackgroundSlider />

            <div style={{ position: 'relative', zIndex: 2 }}>
                <Header user={user} onLogout={onLogout} />
            </div>

            <div className="d-flex align-items-center justify-content-center px-3"
                style={{ position: 'relative', zIndex: 2, minHeight: 'calc(100vh - 68px)' }}>
                <div style={{ width: '100%', maxWidth: 420 }}>

                    <div className="text-center mb-4">
                        <h1 className="fw-bold text-white">שלום, {user.firstName} 👋</h1>
                        <p className="text-white-50 small">מה תרצי לעשות היום?</p>
                    </div>

                    <div className="card bg-dark bg-opacity-50 border-0 shadow-lg rounded-4"
                        style={{ backdropFilter: 'blur(24px)' }}>
                        <div className="card-body p-4 d-flex flex-column gap-3">
                            {menuItems.map(item => (
                                <button
                                    key={item.key}
                                    className="btn btn-outline-light text-end fw-semibold"
                                    onClick={() => navigate(item.key)}>
                                    {item.icon} {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );

    return (
        <Routes>
            <Route path="/" element={Menu} />
            <Route path="/map" element={<LocationMap user={user} onBack={() => navigate('/teacher')} />} />
            <Route path="/addStudent" element={<AddStudent user={user} onBack={() => navigate('/teacher')} />} />
            <Route path="/allUsers" element={<AllUsers user={user} onBack={() => navigate('/teacher')} />} />
            <Route path="/myStudents" element={<MyStudents user={user} onBack={() => navigate('/teacher')} />} />
        </Routes>
    );
}

export default TeacherMenu;