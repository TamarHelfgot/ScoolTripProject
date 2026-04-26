import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getLocations } from '../../axios/locationAxios';
import Header from '../shared/Header';
import BackgroundSlider from '../shared/BackgroundSlider';
import 'leaflet/dist/leaflet.css';

const blueIcon = new L.Icon({
    iconUrl: '/images/marker-icon-blue.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
});

const greenIcon = new L.Icon({
    iconUrl: '/images/marker-icon-green.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
});

const redIcon = new L.Icon({
    iconUrl: '/images/marker-icon-red.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
});

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

function LocationMap({ user, onBack }) {
    const [locations, setLocations] = useState([]);
    const [teacherLocation, setTeacherLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const intervalRef = useRef(null);

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

    const allPoints = [
        ...(teacherLocation ? [[teacherLocation.latitude, teacherLocation.longitude]] : []),
        ...locations.filter(l => l.location).map(l => [l.location.latitude, l.location.longitude])
    ];

    const farStudents = locations.filter(l => l.isFar);
    const center = teacherLocation
        ? [teacherLocation.latitude, teacherLocation.longitude]
        : [31.7718, 35.2170];

    return (
        <div className="min-vh-100" dir="rtl">
            <BackgroundSlider />

            <div style={{ position: 'relative', zIndex: 2 }}>
                <Header user={user} onLogout={onBack} />
            </div>

            <div className="container py-4" style={{ position: 'relative', zIndex: 2, maxWidth: 1100 }}>

                <div className="d-flex align-items-center mb-4 gap-2">
                    <h2 className="fw-bold text-white mb-0">מפת איכון</h2>
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
                    <>
                       
                        <div className="card bg-dark bg-opacity-50 border-0 rounded-3 mb-3"
                            style={{ backdropFilter: 'blur(12px)' }}>
                            <div className="card-body py-2 px-3 d-flex align-items-center gap-3 flex-wrap">
                                <span className="text-white-50 small">מקרא:</span>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="rounded-circle" style={{ width: 12, height: 12, backgroundColor: '#1E3A8A' }} />
                                    <span className="text-white small">המורה</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="rounded-circle bg-success" style={{ width: 12, height: 12 }} />
                                    <span className="text-white small">קרובה (עד 3 ק"מ)</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="rounded-circle bg-danger" style={{ width: 12, height: 12 }} />
                                    <span className="text-white small">רחוקה (מעל 3 ק"מ)</span>
                                </div>
                            </div>
                        </div>

                     
                        <div className="rounded-4 overflow-hidden shadow-lg mb-4">
                            <MapContainer center={center} zoom={12}
                                style={{ height: '450px', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <FitBounds points={allPoints} />

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
                            <div className="card bg-dark bg-opacity-50 border border-danger border-opacity-50 shadow-lg rounded-4 mb-4"
                                style={{ backdropFilter: 'blur(24px)' }}>
                                <div className="card-body p-3">
                                    <h5 className="text-end fw-bold text-danger mb-3">
                                        🔴 תלמידות רחוקות ({farStudents.length})
                                    </h5>
                                    <div className="table-responsive">
                                        <table className="table table-dark table-borderless table-hover text-end mb-0">
                                            <thead className="text-white-50 small">
                                                <tr>
                                                    <th>שם</th>
                                                    <th>מרחק</th>
                                                    <th>עדכון אחרון</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {farStudents.map((loc, i) => (
                                                    <tr key={i}>
                                                        <td>{loc.user.firstName} {loc.user.lastName}</td>
                                                        <td>{loc.distance.toFixed(1)} ק"מ</td>
                                                        <td>{new Date(loc.location.time).toLocaleTimeString('he-IL')}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
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