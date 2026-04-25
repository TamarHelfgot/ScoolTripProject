
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from '../components/auth/HomeScreen';
import Login from '../components/auth/Login';
import AdminScreen from '../components/admin/AdminScreen';
import TeacherMenu from '../components/teacher/TeacherMenu';
import StudentScreen from '../components/student/StudentScreen';

export const AppRouting = ({ user, onLogin, onLogout }) => {
    return (
        <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<Login onLogin={onLogin} />} />
            
            <Route path="/admin" element={
                user?.userRole === 1
                    ? <AdminScreen user={user} onLogout={onLogout} />
                    : <Navigate to="/" />
            } />

            <Route path="/teacher/*" element={
                user?.userRole === 2
                    ? <TeacherMenu user={user} onLogout={onLogout} />
                    : <Navigate to="/" />
            } />

            <Route path="/student" element={
                user?.userRole === 3
                    ? <StudentScreen user={user} onLogout={onLogout} />
                    : <Navigate to="/" />
            } />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};