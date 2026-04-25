import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import { getStudentStatus } from '../../axios/locationAxios';
import Header from '../shared/Header';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, shadowUrl: iconShadow });

const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: iconShadow,
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
});

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: iconShadow,
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
});

const SLIDES = [1,2,3,4,5,6,7,8,9,10].map(i => `/images/img${i}.jpg`);

function FitBounds({ points }) {
    const map = useMap();
    useEffect(() => {
        if (points.length > 1) {
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [80, 80] });
        } else if (points.length === 1) {
            map.setView(points[0], 15);
        }
    }, [points]);
    return null;
}

function StudentScreen({ user, onLogout }) {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const intervalRef = useRef(null);
    const [current, setCurrent] = useState(0);

    const fetchData = async () => {
        try {
            const res = await getStudentStatus(user.id);
            setStatus(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        intervalRef.current = setInterval(fetchData, 60000);
        return () => clearInterval(intervalRef.current);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setCurrent(p => (p + 1) % SLIDES.length), 30000);
        return () => clearInterval(interval);
    }, []);

    const allPoints = status?.location
        ? [[status.location.latitude, status.location.longitude]]
        : [];

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
                <Header user={user} onLogout={onLogout} />
            </div>

            <div style={{ position: 'relative', zIndex: 2, padding: '2rem 1.5rem', maxWidth: 900, margin: '0 auto' }}>

                {loading && (
                    <div className="text-center mt-5">
                        <div className="spinner-border" style={{ color: '#f0dfa0' }} />
                    </div>
                )}

                {!loading && status && (
                    <>
                        <div className="text-center mb-3">
                            <div style={{
                                display: 'inline-block',
                                padding: '10px 24px',
                                borderRadius: 50,
                                fontWeight: 700,
                                fontSize: '1rem',
                                background: status.isFar ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)',
                                border: `1px solid ${status.isFar ? 'rgba(239,68,68,0.5)' : 'rgba(34,197,94,0.5)'}`,
                                color: status.isFar ? '#fca5a5' : '#86efac',
                            }}>
                                {status.isFar
                                    ? `🔴  רחוקה מהמורה  ${status.distance.toFixed(1)} ק"מ`
                                    : `🟢  קרובה למורה  ${status.distance.toFixed(1)} ק"מ`}
                            </div>
                        </div>

                        <div className="d-flex gap-4 align-items-center flex-wrap mb-3" style={{
                            background: 'rgba(255,255,255,0.06)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.13)',
                            borderRadius: 12, padding: '12px 20px',
                        }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>מקרא:</span>
                            <div className="d-flex align-items-center gap-2">
                                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#22C55E' }} />
                                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>קרובה</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#EF4444' }} />
                                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}> רחוקה</span>
                            </div>
                        </div>

                        <div style={{
                            borderRadius: 16, overflow: 'hidden',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}>
                            <MapContainer
                                center={status.location
                                    ? [status.location.latitude, status.location.longitude]
                                    : [31.7718, 35.2170]}
                                zoom={15}
                                style={{ height: '450px', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <FitBounds points={allPoints} />

                                {status.location && (
                                    <Marker
                                        position={[status.location.latitude, status.location.longitude]}
                                        icon={status.isFar ? redIcon : greenIcon}>
                                        <Tooltip permanent>{user.firstName} {user.lastName}</Tooltip>
                                        <Popup>
                                            <strong>המיקום שלי</strong><br />
                                            מרחק מהמורה: {status.distance.toFixed(1)} ק"מ
                                        </Popup>
                                    </Marker>
                                )}
                            </MapContainer>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default StudentScreen;