import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../axios/userAxios';
import { getAllClasses } from '../../axios/classAxios';
import Header from '../shared/Header';
import BackgroundSlider from '../shared/BackgroundSlider';



function AllUsers({ user, onBack }) {
    const [users, setUsers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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



    const getClassName = (classId) => {
        const cls = classes.find(c => c.id === classId);
        return cls ? cls.className : classId;
    };

    const teachers = users.filter(u => u.userRole === 2);
    const students = users.filter(u => u.userRole === 3);


    return (
        <div className="min-vh-100" dir="rtl">
            
            <BackgroundSlider />

            <div style={{ position: 'relative', zIndex: 2 }}>
                <Header user={user} onLogout={onBack} />
            </div>

            <div className="container py-4" style={{ position: 'relative', zIndex: 2, maxWidth: 900 }}>

            <div className="d-flex align-items-center mb-4 gap-2">
                <h2 className="fw-bold text-white mb-0">כל המשתמשים</h2>
            </div>
                {loading && (
                    <div className="text-center mt-5">
                        <div className="spinner-border text-warning" />
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger text-center">{error}</div>
                )}

                {!loading && <>

                  
                    <div className="card bg-dark bg-opacity-50 border-0 shadow-lg rounded-4 mb-4"
                        style={{ backdropFilter: 'blur(24px)' }}>
                        <div className="card-body p-3">
                            <h5 className="text-end fw-bold text-warning mb-3">מורות</h5>
                            <div className="table-responsive">
                                <table className="table table-dark table-borderless table-hover text-end mb-0">
                                    <thead className="text-white-50 small">
                                        <tr>
                                            <th>ת"ז</th>
                                            <th>שם</th>
                                            <th>כיתה</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teachers.map(t => (
                                            <tr key={t.id}>
                                                <td>{t.id}</td>
                                                <td>{t.firstName} {t.lastName}</td>
                                                <td>{getClassName(t.classId)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                 
                    <div className="card bg-dark bg-opacity-50 border-0 shadow-lg rounded-4 mb-4"
                        style={{ backdropFilter: 'blur(24px)' }}>
                        <div className="card-body p-3">
                            <h5 className="text-end fw-bold text-warning mb-3">תלמידות</h5>
                            <div className="table-responsive">
                                <table className="table table-dark table-borderless table-hover text-end mb-0">
                                    <thead className="text-white-50 small">
                                        <tr>
                                            <th>ת"ז</th>
                                            <th>שם</th>
                                            <th>כיתה</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map(s => (
                                            <tr key={s.id}>
                                                <td>{s.id}</td>
                                                <td>{s.firstName} {s.lastName}</td>
                                                <td>{getClassName(s.classId)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </>}
            </div>
        </div>
    );
}

export default AllUsers;