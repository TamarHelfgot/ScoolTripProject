import React, { useState } from 'react';
import { addUser } from '../../axios/userAxios';
import Header from '../shared/Header';
import BackgroundSlider from '../shared/BackgroundSlider';


function AddStudent({ user, onBack }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [id, setId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);


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

        setLoading(true);
        try {
            await addUser({
                id, firstName, lastName,
                classId: user.classId,
                userRole: 3
            }, user.id);
            setSuccess('התלמידה נוספה בהצלחה!');
            setId(''); setFirstName(''); setLastName('');
            setTimeout(() => onBack(), 1500);
        } catch (err) {
            setError('שגיאה בהוספת התלמידה');
        } finally {
            setLoading(false);
        }
    };


return (
        <div className="min-vh-100" dir="rtl">
            <BackgroundSlider />

            <div style={{ position: 'relative', zIndex: 2 }}>
                <Header user={user} onLogout={onBack} />
            </div>

            <div className="container py-5" style={{ position: 'relative', zIndex: 2 }}>
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-8 col-md-6 col-lg-4">

                        <div className="text-center mb-4">
                            <h1 className="fw-bold text-white">הוספת תלמידה</h1>
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

                                {error && (
                                    <div className="alert alert-danger py-2 text-center">
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="alert alert-success py-2 text-center">
                                        {success}
                                    </div>
                                )}

                                <button
                                    className="btn btn-outline-light w-100 fw-bold mb-2"
                                    onClick={handleAdd}
                                    disabled={loading}>
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            מוסיף...
                                        </>
                                    ) : 'הוספה'}
                                </button>

                                <button
                                    className="btn btn-outline-secondary w-100"
                                    onClick={onBack}>
                                    חזרה
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddStudent;
