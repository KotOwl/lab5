const getTypeIcon = (type) => {
    switch (type) {
        case 'research': return <Microscope size={16} />;
        case 'rescue': return <Crosshair size={16} />;
        case 'colonization': return <Users size={16} />;
        default: return null;
    }
};

const AcceptedMissions = () => {
    const [acceptedMissions, setAcceptedMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (currentUser) {
            fetchMissions()
                .then(setAcceptedMissions)
                .catch(console.error)
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    const handleAbandon = async (missionId) => {
        setAcceptedMissions(prev => prev.filter(m => m.id !== missionId));
    };

    const handleComplete = async (mission) => {
        setAcceptedMissions(prev => prev.filter(m => m.id !== mission.id));
        alert(`Місію виконано!`);
    };

    const handleSave = async (mission) => {
        try {
            await saveMission({
                ...mission,
                startTime: new Date().toISOString()
            });
            alert('Зміни збережено!');
        } catch (error) {
            console.error("Error saving mission:", error);
        }
    };

    if (loading) {
        return <div className="animate-in fade-in" style={{ textAlign: 'center', padding: '2rem' }}>Loading active assignments...</div>;
    }

    return (
        <div className="animate-in fade-in">
            <h1 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldAlert color="var(--primary)" />
                Active Assignments (My Travels)
            </h1>

            <div className="grid-3">
                {acceptedMissions.length > 0 ? (
                    acceptedMissions.map(mission => (
                        <div key={mission.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--primary)' }}>
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

                            {mission.startTime && (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                                    Started: {new Date(mission.startTime).toLocaleString()}
                                </p>
                            )}

                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1, lineHeight: 1.6 }}>
                                {mission.description}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>+{mission.reward} CR</span>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                                        onClick={() => handleSave(mission)}
                                    >
                                        Update Start Time
                                    </button>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                                        onClick={() => handleAbandon(mission.id)}
                                    >
                                        Abandon
                                    </button>
                                    <button
                                        className="btn"
                                        style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                        onClick={() => handleComplete(mission)}
                                    >
                                        <CheckCircle size={14} /> Complete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="glass-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
                        <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No active assignments.</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Head to the Expeditions board to accept new missions.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcceptedMissions;
