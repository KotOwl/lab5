import React, { useState, useEffect } from 'react';
import { Activity, Shield, Battery, Zap, AlertTriangle } from 'lucide-react';
import { getShipStatus, updateShipStatus } from '../services/db';
import Notification from './Notification';

const Ship = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [diagnosing, setDiagnosing] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const data = await getShipStatus();
                setStats(data);
            } catch (error) {
                console.error("Error fetching ship stats:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    useEffect(() => {
        if (!stats) return;

        // Simulate slight fluctuations in ship stats
        const interval = setInterval(() => {
            setStats(prev => {
                const newStats = {
                    ...prev,
                    shields: Math.min(100, Math.max(80, prev.shields + (Math.random() > 0.5 ? 1 : -1))),
                    energy: Math.min(100, Math.max(90, prev.energy + (Math.random() > 0.5 ? 1 : -1)))
                };

                // Only write to DB occasionally to save writes (e.g. 1 in 10 chance)
                if (Math.random() > 0.9) {
                    updateShipStatus(newStats).catch(console.error);
                }

                return newStats;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, [stats !== null]);

    if (loading || !stats) {
        return <div className="animate-in fade-in" style={{ textAlign: 'center', padding: '2rem' }}>Loading diagnostics...</div>;
    }

    const getStatusColor = (value) => {
        if (value > 70) return 'var(--success)';
        if (value > 30) return 'var(--warning)';
        return 'var(--danger)';
    };

    const handleDiagnostics = () => {
        setDiagnosing(true);
        // Simulate a scanning process
        setTimeout(() => {
            setDiagnosing(false);
            setNotification({
                message: "Diagnostics Complete: All systems nominal.",
                type: "success"
            });
        }, 3000);
    };

    return (
        <div className="animate-in fade-in">
            <h1 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Activity color="var(--primary)" />
                Vessel Diagnostics
            </h1>

            <div className="grid-2">
                <div className="glass-panel">
                    <h3>Core Systems</h3>
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <div className="stat-row">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={18} /> Deflector Shields</span>
                                <span style={{ color: getStatusColor(stats.shields), fontWeight: 'bold' }}>{stats.shields}%</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${stats.shields}%`, height: '100%', background: getStatusColor(stats.shields), transition: 'all 0.5s ease' }}></div>
                            </div>
                        </div>

                        <div className="stat-row">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={18} /> Plasma Energy</span>
                                <span style={{ color: getStatusColor(stats.energy), fontWeight: 'bold' }}>{stats.energy}%</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${stats.energy}%`, height: '100%', background: getStatusColor(stats.energy), transition: 'all 0.5s ease' }}></div>
                            </div>
                        </div>

                        <div className="stat-row">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Battery size={18} /> Quantum Fuel</span>
                                <span style={{ color: getStatusColor(stats.fuel), fontWeight: 'bold' }}>{stats.fuel}%</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${stats.fuel}%`, height: '100%', background: getStatusColor(stats.fuel), transition: 'all 0.5s ease' }}></div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <h3>Vessel Information</h3>
                        <div style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                            <p style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Class:</span> <strong style={{ color: '#fff' }}>Explorer Mk IV</strong>
                            </p>
                            <p style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Crew Capacity:</span> <strong style={{ color: '#fff' }}>12 Standard</strong>
                            </p>
                            <p style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Engine:</span> <strong style={{ color: '#fff' }}>FTL Hyper-drive v2</strong>
                            </p>
                            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0, 255, 136, 0.1)', borderLeft: '4px solid var(--success)', borderRadius: '4px' }}>
                                <h4 style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    System Status: {stats.status}
                                </h4>
                                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>All primary systems are functioning within normal parameters. Ready for departure.</p>
                            </div>
                        </div>
                    </div>
                    <button
                        className={`btn ${diagnosing ? 'btn-scanning' : ''}`}
                        style={{ width: '100%', marginTop: '2rem' }}
                        onClick={handleDiagnostics}
                        disabled={diagnosing}
                    >
                        {diagnosing ? 'Scanning Systems...' : 'Run Diagnostics'}
                    </button>
                </div>
            </div>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default Ship;
