import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserTravelLog } from '../services/db';

const TravelLog = () => {
    const [completedMissions, setCompletedMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (currentUser) {
            getUserTravelLog(currentUser.uid)
                .then(setCompletedMissions)
                .catch(console.error)
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    if (loading) {
        return <div className="animate-in fade-in" style={{ textAlign: 'center', padding: '2rem' }}>Loading logbook...</div>;
    }

    if (!currentUser) {
        return (
            <div className="animate-in fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <h3 style={{ color: 'var(--text-muted)' }}>Classified Access Only</h3>
                <p>Please log in to view to your personal travel logs.</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in">
            <h1 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar color="var(--primary)" />
                Expedition Logbook
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {completedMissions.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ color: 'var(--text-muted)' }}>Your travel log is empty. Complete some assignments to see them here.</p>
                    </div>
                ) : (
                    completedMissions.map((log) => {
                        const dateStr = log.completedAt?.toDate ? log.completedAt.toDate().toLocaleDateString() : 'Unknown Date';
                        return (
                            <div key={log.fsId || log.id} className="glass-panel" style={{ position: 'relative', paddingLeft: '2.5rem' }}>

                                {/* Timeline element */}
                                <div style={{ position: 'absolute', left: '1.2rem', top: '1.5rem', bottom: '-1.5rem', width: '2px', background: 'var(--border-light)', zIndex: 1 }}></div>
                                <div style={{ position: 'absolute', left: '0.9rem', top: '1.5rem', width: '12px', height: '12px', borderRadius: '50%', background: log.status === 'Success' ? 'var(--success)' : 'var(--warning)', zIndex: 2, boxShadow: '0 0 10px rgba(0,255,136,0.5)' }}></div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>{log.title}</h3>
                                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {dateStr}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> T+0 Days</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`badge`} style={{
                                            background: log.status === 'Success' ? 'rgba(0,255,136,0.1)' : 'rgba(255,184,0,0.1)',
                                            color: log.status === 'Success' ? 'var(--success)' : 'var(--warning)',
                                            border: `1px solid ${log.status === 'Success' ? 'var(--success)' : 'var(--warning)'}`
                                        }}>
                                            <CheckCircle size={12} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />
                                            {log.status}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                    <strong style={{ color: 'var(--text-muted)' }}>Captain's Notes:</strong> Mission objectives accomplished. Earned {log.reward} credits.
                                </div>
                            </div>
                        );
                    })
                )}

                {/* End of timeline marker */}
                <div style={{ position: 'relative', height: '1rem' }}></div>
            </div>
        </div>
    );
};

export default TravelLog;
