import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getLocations } from '../../axios/locationAxios';
import Header from '../shared/Header';
import 'leaflet/dist/leaflet.css';

const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
});

const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
});

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
});

const SLIDES = [1,2,3,4,5,6,7,8,9,10].map(i => `/images/img${i}.jpg`);

function FitBounds({ points }) {
    const map = useMap();
    useEffect(() => {
        if (points.length > 0) {
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [points]);
    return null;
}

function FlyTo({ target }) {
    const map = useMap();
    useEffect(() => {
        if (target) {
            map.flyTo([target.lat, target.lng], 15, { duration: 1.5 });
        }
    }, [target]);
    return null;
}

function LocationMap({ user, onBack }) {
    const [locations, setLocations] = useState([]);
    const [teacherLocation, setTeacherLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [flyTarget, setFlyTarget] = useState(null);
    const intervalRef = useRef(null);
    const [current, setCurrent] = useState(0);

    const fetchLocations = async () => {
        try {
            const response = await getLocations(user.id);
            const data = response.data;
            const tLoc = data.find(d => d.user.userRole === 2);
            if (tLoc) setTeacherLocation(tLoc.location);
            setLocations(data.filter(d => d.user.userRole !== 2));
            setLoading(false);
        } catch (err) {
            setError('שגיאה בטעינת המיקומים');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
        intervalRef.current = setInterval(fetchLocations, 60000);
        return () => clearInterval(intervalRef.current);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setCurrent(p => (p + 1) % SLIDES.length), 30000);
        return () => clearInterval(interval);
    }, []);

    const allPoints = [
        ...(teacherLocation ? [[teacherLocation.latitude, teacherLocation.longitude]] : []),
        ...locations.filter(l => l.location).map(l => [l.location.latitude, l.location.longitude])
    ];

    const farStudents = locations.filter(l => l.isFar);
    const center = teacherLocation
        ? [teacherLocation.latitude, teacherLocation.longitude]
        : [31.7718, 35.2170];

    const tableRowStyle = {
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.85)',
        fontSize: '0.9rem',
        cursor: 'pointer',
    };

    return (
        <div style={{ minHeight: '100vh', fontFamily: "'Heebo', sans-serif" }}>

            {SLIDES.map((url, i) => (
                <div key={i} style={{
                    position: 'fixed', inset: 0,
                    backgroundImage: `url(${url})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    opacity: i === current ? 1 : 0,
                    transition: 'opacity 2.8s ease-in-out', zIndex: 0,
                }} />
            ))}

            <div style={{
                position: 'fixed', inset: 0, zIndex: 1,
                background: 'linear-gradient(135deg, rgba(10,25,60,0.75) 0%, rgba(15,30,58,0.68) 100%)',
                backdropFilter: 'blur(1.5px)',
            }} />

            <div style={{ position: 'relative', zIndex: 2 }}>
                <Header user={user} onLogout={onBack} />
            </div>

            <div style={{ position: 'relative', zIndex: 2, padding: '2rem 1.5rem', maxWidth: 1100, margin: '0 auto' }}>

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <button onClick={onBack} style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'rgba(255,255,255,0.7)',
                        borderRadius: 8, padding: '6px 16px',
                        cursor: 'pointer', fontSize: '0.9rem',
                    }}>חזרה</button>
                    <h2 style={{ color: '#fff', fontWeight: 900, margin: 0 }}>מפת איכון</h2>
                </div>

                {loading && (
                    <div className="text-center mt-5">
                        <div className="spinner-border" style={{ color: '#f0dfa0' }} />
                    </div>
                )}

                {error && (
                    <p style={{ color: '#ff8a8a', textAlign: 'center' }}>{error}</p>
                )}

                {!loading && (
                    <>
                       
                        <div className="d-flex gap-4 align-items-center flex-wrap mb-3" style={{
                            background: 'rgba(255,255,255,0.06)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.13)',
                            borderRadius: 12, padding: '12px 20px',
                        }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>מקרא:</span>
                            <div className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}
                                onClick={() => teacherLocation && setFlyTarget({
                                    lat: teacherLocation.latitude, lng: teacherLocation.longitude
                                })}>
                                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#1E3A8A' }} />
                                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>המורה</span>
                            </div>
                            <div className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    const close = locations.find(l => !l.isFar && l.location);
                                    if (close) setFlyTarget({ lat: close.location.latitude, lng: close.location.longitude });
                                }}>
                                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#22C55E' }} />
                                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>קרובה (עד 3 ק"מ)</span>
                            </div>
                            <div className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    const far = locations.find(l => l.isFar && l.location);
                                    if (far) setFlyTarget({ lat: far.location.latitude, lng: far.location.longitude });
                                }}>
                                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#EF4444' }} />
                                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>רחוקה (מעל 3 ק"מ)</span>
                            </div>
                        </div>

                      
                        <div style={{
                            borderRadius: 16, overflow: 'hidden',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            marginBottom: '1.5rem',
                        }}>
                            <MapContainer center={center} zoom={12}
                                style={{ height: '450px', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <FitBounds points={allPoints} />
                                <FlyTo target={flyTarget} />

                                {teacherLocation && (
                                    <Marker position={[teacherLocation.latitude, teacherLocation.longitude]} icon={blueIcon}>
                                        <Tooltip permanent>{user.firstName} {user.lastName}</Tooltip>
                                        <Popup><strong>המורה</strong><br />{user.firstName} {user.lastName}</Popup>
                                    </Marker>
                                )}

                                {locations.map((loc, i) => (
                                    loc.location && (
                                        <Marker key={i}
                                            position={[loc.location.latitude, loc.location.longitude]}
                                            icon={loc.isFar ? redIcon : greenIcon}>
                                            <Tooltip permanent>{loc.user.firstName} {loc.user.lastName}</Tooltip>
                                            <Popup>
                                                <strong>{loc.user.firstName} {loc.user.lastName}</strong><br />
                                                מרחק: {loc.distance.toFixed(1)} ק"מ<br />
                                                {loc.isFar ? '🔴 רחוקה' : '🟢 קרובה'}
                                            </Popup>
                                        </Marker>
                                    )
                                ))}
                            </MapContainer>
                        </div>

                       
                        {farStudents.length > 0 && (
                            <div style={{
                                background: 'rgba(255,255,255,0.06)',
                                backdropFilter: 'blur(24px)',
                                border: '1px solid rgba(239,68,68,0.3)',
                                borderRadius: 20, padding: '1.5rem',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                            }}>
                                <h5 className="text-end mb-3" style={{ color: '#fca5a5', fontWeight: 700 }}>
                                    🔴 תלמידות רחוקות ({farStudents.length})
                                </h5>
                                <div className="table-responsive">
                                    <table className="table mb-0 text-end">
                                        <thead>
                                            <tr style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>
                                                <th style={{ background: 'transparent', border: 'none' }}>שם</th>
                                                <th style={{ background: 'transparent', border: 'none' }}>מרחק</th>
                                                <th style={{ background: 'transparent', border: 'none' }}>עדכון אחרון</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {farStudents.map((loc, i) => (
                                                <tr key={i} style={tableRowStyle}
                                                    onClick={() => setFlyTarget({
                                                        lat: loc.location.latitude,
                                                        lng: loc.location.longitude
                                                    })}>
                                                    <td style={{ border: 'none' }}>{loc.user.firstName} {loc.user.lastName}</td>
                                                    <td style={{ border: 'none' }}>{loc.distance.toFixed(1)} ק"מ</td>
                                                    <td style={{ border: 'none' }}>{new Date(loc.location.time).toLocaleTimeString('he-IL')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default LocationMap;