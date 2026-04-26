import React, { useState, useEffect } from 'react';
import { addUser } from '../../axios/userAxios';
import { getAllClasses, addClass } from '../../axios/classAxios';
import Header from '../shared/Header';
import BackgroundSlider from '../shared/BackgroundSlider';

function AdminScreen({ user, onLogout }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [id, setId] = useState('');
    const [classId, setClassId] = useState('');
    const [classes, setClasses] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // הוספת כיתה
    const [newClassName, setNewClassName] = useState('');
    const [classError, setClassError] = useState('');
    const [classSuccess, setClassSuccess] = useState('');
    const [classLoading, setClassLoading] = useState(false);

    const fetchClasses = async () => {
        try {
            const res = await getAllClasses();
            setClasses(res.data);
            if (res.data.length > 0) setClassId(res.data[0].id);
        } catch (err) {
            setError('שגיאה בטעינת הכיתות');
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

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

    const handleAdd = async () => {
        setError('');
        setSuccess('');
        if (!isValidId(id)) { setError('ת"ז לא תקינה'); return; }
        if (!firstName || !lastName) { setError('יש למלא את כל השדות'); return; }
        if (!classId) { setError('יש לבחור כיתה'); return; }

        setLoading(true);
        try {
            await addUser({
                id, firstName, lastName,
                classId: parseInt(classId),
                userRole: 2
            }, user.id);
            setSuccess('המורה נוספה בהצלחה!');
            setId(''); setFirstName(''); setLastName('');
        } catch (err) {
            setError('שגיאה בהוספת המורה');
        } finally {
            setLoading(false);
        }
    };

    const handleAddClass = async () => {
        setClassError('');
        setClassSuccess('');
        if (!newClassName) { setClassError('יש להזין שם כיתה'); return; }

        setClassLoading(true);
        try {
            await addClass(newClassName);
            setClassSuccess('הכיתה נוספה בהצלחה!');
            setNewClassName('');
            await fetchClasses();
        } catch (err) {
            setClassError('שגיאה בהוספת הכיתה');
        } finally {
            setClassLoading(false);
        }
    };

    return (
        <div className="min-vh-100" dir="rtl">
            <BackgroundSlider />

            <div style={{ position: 'relative', zIndex: 2 }}>
                <Header user={user} onLogout={onLogout} />
            </div>

            <div className="container py-5" style={{ position: 'relative', zIndex: 2 }}>
                <div className="row justify-content-center g-4">

                    
                    <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                        <div className="text-center mb-4">
                            <h1 className="fw-bold text-white">הוספת מורה</h1>
                            <p className="text-white-50">ניהול מערכת - בנות משה</p>
                        </div>

                        <div className="card bg-dark bg-opacity-50 border-0 shadow-lg rounded-4"
                            style={{ backdropFilter: 'blur(24px)' }}>
                            <div className="card-body p-4">
                                <label className="text-white-50 small mb-1">ת"ז</label>
                                <input
                                    className="form-control mb-3 text-end bg-dark text-white border-secondary"
                                    placeholder='ת"ז'
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                    maxLength={9}
                                />
                                <label className="text-white-50 small mb-1">שם פרטי</label>
                                <input
                                    className="form-control mb-3 text-end bg-dark text-white border-secondary"
                                    placeholder="שם פרטי"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <label className="text-white-50 small mb-1">שם משפחה</label>
                                <input
                                    className="form-control mb-3 text-end bg-dark text-white border-secondary"
                                    placeholder="שם משפחה"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                <label className="text-white-50 small mb-1">כיתה</label>
                                <select
                                    className="form-select mb-3 text-end bg-dark text-white border-secondary"
                                    value={classId}
                                    onChange={(e) => setClassId(e.target.value)}
                                >
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.className}</option>
                                    ))}
                                </select>

                                {error && <div className="alert alert-danger py-2 text-center">{error}</div>}
                                {success && <div className="alert alert-success py-2 text-center">{success}</div>}

                                <button
                                    className="btn btn-outline-light w-100 fw-bold"
                                    onClick={handleAdd}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            מוסיף...
                                        </>
                                    ) : 'הוספה'}
                                </button>
                            </div>
                        </div>
                    </div>

                  
                    <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                        <div className="text-center mb-4">
                            <h1 className="fw-bold text-white">הוספת כיתה</h1>
                            <p className="text-white-50">הוספת כיתה חדשה למערכת</p>
                        </div>

                        <div className="card bg-dark bg-opacity-50 border-0 shadow-lg rounded-4"
                            style={{ backdropFilter: 'blur(24px)' }}>
                            <div className="card-body p-4">
                                <label className="text-white-50 small mb-1">שם הכיתה</label>
                                <input
                                    className="form-control mb-3 text-end bg-dark text-white border-secondary"
                                    placeholder="לדוגמה: ו1"
                                    value={newClassName}
                                    onChange={(e) => setNewClassName(e.target.value)}
                                />

                                {classError && <div className="alert alert-danger py-2 text-center">{classError}</div>}
                                {classSuccess && <div className="alert alert-success py-2 text-center">{classSuccess}</div>}

                                <button
                                    className="btn btn-outline-light w-100 fw-bold"
                                    onClick={handleAddClass}
                                    disabled={classLoading}
                                >
                                    {classLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            מוסיף...
                                        </>
                                    ) : 'הוספת כיתה'}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AdminScreen;