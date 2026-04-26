import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import { getStudentStatus } from '../../axios/locationAxios';
import Header from '../shared/Header';
import BackgroundSlider from '../shared/BackgroundSlider';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, shadowUrl: iconShadow });

const greenIcon = new L.Icon({
    iconUrl: '/images/marker-icon-green.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
});

const redIcon = new L.Icon({
    iconUrl: '/images/marker-icon-red.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
});

const blueIcon = new L.Icon({
    iconUrl: '/images/marker-icon-blue.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
});

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
    const [teacherLoc, setTeacherLoc] = useState(null);

    const fetchData = async () => {
        try {
            const res = await getStudentStatus(user.id);
                setStatus(res.data.student);
                setTeacherLoc(res.data.teacher?.location);
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


const allPoints = [
    ...(status?.location ? [[status.location.latitude, status.location.longitude]] : []),
    ...(teacherLoc ? [[teacherLoc.latitude, teacherLoc.longitude]] : [])
];

  return (
        <div className="min-vh-100" dir="rtl">
            <BackgroundSlider />

            <div style={{ position: 'relative', zIndex: 2 }}>
                <Header user={user} onLogout={onLogout} />
            </div>

            <div className="container py-4" style={{ position: 'relative', zIndex: 2, maxWidth: 900 }}>

                {loading && (
                    <div className="text-center mt-5">
                        <div className="spinner-border text-warning" />
                    </div>
                )}

                {!loading && status && (
                    <>
                       
                        <div className="text-center mb-3">
                            <span className={`badge rounded-pill fs-6 fw-bold px-4 py-2 ${status.isFar ? 'bg-danger' : 'bg-success'}`}>
                                {status.isFar
                                    ? `🔴 רחוקה מהמורה ${status.distance.toFixed(1)} ק"מ`
                                    : `🟢 קרובה למורה ${status.distance.toFixed(1)} ק"מ`}
                            </span>
                        </div>

                    
                        <div className="card bg-dark bg-opacity-50 border-0 rounded-3 mb-3"
                            style={{ backdropFilter: 'blur(12px)' }}>
                            <div className="card-body py-2 px-3 d-flex align-items-center gap-3 flex-wrap">
                                <span className="text-white-50 small">מקרא:</span>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="rounded-circle bg-success" style={{ width: 12, height: 12 }} />
                                    <span className="text-white small">קרובה</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="rounded-circle bg-danger" style={{ width: 12, height: 12 }} />
                                    <span className="text-white small">רחוקה</span>
                                </div>
                            </div>
                        </div>

                    
                        <div className="rounded-4 overflow-hidden shadow-lg">
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
                                {teacherLoc && (
                                    <Marker
                                        position={[teacherLoc.latitude, teacherLoc.longitude]}
                                        icon={blueIcon}>
                                        <Tooltip permanent>המורה</Tooltip>
                                        <Popup><strong>המורה</strong></Popup>
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
