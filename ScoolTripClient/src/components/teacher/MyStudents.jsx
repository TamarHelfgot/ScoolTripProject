import React, { useState, useEffect } from 'react';
import { getMyStudents } from '../../axios/userAxios';
import { getAllClasses } from '../../axios/classAxios';
import Header from '../shared/Header';
import BackgroundSlider from '../shared/BackgroundSlider';

function MyStudents({ user, onBack }) {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsRes, classesRes] = await Promise.all([
                    getMyStudents(user.id),
                    getAllClasses()
                ]);
                setStudents(studentsRes.data);
                setClasses(classesRes.data);
            } catch (err) {
                setError('שגיאה בטעינת התלמידות');
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

    return (
        <div className="min-vh-100" dir="rtl">
            <BackgroundSlider />

            <div style={{ position: 'relative', zIndex: 2 }}>
                <Header user={user} onLogout={onBack} />
            </div>

            <div className="container py-4" style={{ position: 'relative', zIndex: 2, maxWidth: 900 }}>

                <div className="d-flex align-items-center mb-4 gap-2">
                    <h2 className="fw-bold text-white mb-0">תלמידות הכיתה שלי</h2>
                </div>

                {loading && (
                    <div className="text-center mt-5">
                        <div className="spinner-border text-warning" />
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger text-center">{error}</div>
                )}

                {!loading && (
                    <div className="card bg-dark bg-opacity-50 border-0 shadow-lg rounded-4 mb-4"
                        style={{ backdropFilter: 'blur(24px)' }}>
                        <div className="card-body p-3">
                            <h5 className="text-end fw-bold text-white mb-3">
                                 תלמידות ({students.length})
                            </h5>
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
                            {students.length === 0 && (
                                <p className="text-white-50 text-center mt-3">אין תלמידות בכיתה</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyStudents;