import React, { useState, useEffect } from 'react';
import { Filter, Crosshair, Users, Microscope } from 'lucide-react';
import { fetchMissions, saveMission } from '../services/api';
import Notification from './Notification';
import { useAuth } from '../contexts/AuthContext';

const getTypeIcon = (type) => {
    switch (type) {
        case 'research': return <Microscope size={16} />;
        case 'rescue': return <Crosshair size={16} />;
        case 'colonization': return <Users size={16} />;
        default: return null;
    }
};

const Missions = () => {
    const [missions, setMissions] = useState([]);
    const [acceptedIds, setAcceptedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');
    const [filterDifficulty, setFilterDifficulty] = useState('all');
    const [notification, setNotification] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // For now, we fetch current accepted missions from backend too
                const [userAccepted] = await Promise.all([
                    currentUser ? fetchMissions() : Promise.resolve([])
                ]);

                // MOCK available missions if backend doesn't provide them yet
                // In Task 2, we will fetch them from DB
                const availableMissions = [
                    { id: '3', title: 'Jupiter Probe', type: 'research', difficulty: 'hard', target: 'Jupiter', reward: 5000, description: 'Send a probe to the Great Red Spot.' },
                    { id: '4', title: 'Asteroid Mining', type: 'research', difficulty: 'medium', target: 'Belt', reward: 2000, description: 'Extract precious metals.' }
                ];

                setMissions(availableMissions);
                setAcceptedIds(userAccepted.map(m => m.id));
            } catch (err) {
                console.error("Failed to load data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentUser]);

    const handleAccept = async (mission) => {
        if (!currentUser) {
            setNotification({ message: "Please log in to accept missions!", type: "error" });
            return;
        }
        try {
            await saveMission({
                ...mission,
                startTime: new Date().toISOString()
            });
            setAcceptedIds(prev => [...prev, mission.id]);
            setNotification({ message: `Mission Accepted: ${mission.title}`, type: "success" });
        } catch (error) {
            setNotification({ message: error.message, type: "error" });
        }
    };

    const filteredMissions = missions.filter(m => {
        if (acceptedIds.includes(m.id)) return false;
        const matchType = filterType === 'all' || m.type === filterType;
        const matchDiff = filterDifficulty === 'all' || m.difficulty === filterDifficulty;
        return matchType && matchDiff;
    });

    if (loading) {
        return <div className="animate-in fade-in" style={{ textAlign: 'center', padding: '2rem' }}>Loading expeditions...</div>;
    }

    return (
        <div className="animate-in fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1>Available Expeditions</h1>

                <div className="filter-group" style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                        <Filter size={18} />
                        <span>Filters:</span>
                    </div>

                    <select
                        className="select-input"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">Any Type</option>
                        <option value="research">Research</option>
                        <option value="rescue">Rescue</option>
                        <option value="colonization">Colonization</option>
                    </select>

                    <select
                        className="select-input"
                        value={filterDifficulty}
                        onChange={(e) => setFilterDifficulty(e.target.value)}
                    >
                        <option value="all">Any Difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
            </div>

            <div className="grid-3">
                {filteredMissions.length > 0 ? (
                    filteredMissions.map(mission => (
                        <div key={mission.fsId || mission.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span className={`badge badge-${mission.type}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {getTypeIcon(mission.type)}
                                    {mission.type}
                                </span>
                                <span className={`badge badge-${mission.difficulty}`}>
                                    {mission.difficulty}
                                </span>
                            </div>

                            <h3 style={{ marginBottom: '0.5rem', color: 'white' }}>{mission.title}</h3>
                            <p style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>Target: {mission.target}</p>

                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1, lineHeight: 1.6 }}>
                                {mission.description}
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>+{mission.reward} CR</span>
                                <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }} onClick={() => handleAccept(mission)}>Accept</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="glass-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
                        <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No missions found matching criteria.</h3>
                        <button className="btn btn-secondary" onClick={() => { setFilterType('all'); setFilterDifficulty('all'); }}>Clear Filters</button>
                    </div>
                )}
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

export default Missions;
