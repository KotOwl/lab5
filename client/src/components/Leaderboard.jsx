import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/db';
import { Trophy, Medal, Star, Users } from 'lucide-react';

export default function Leaderboard() {
    const [captains, setCaptains] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                const data = await getLeaderboard();
                setCaptains(data);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchLeaderboard();
    }, []);

    if (loading) {
        return <div className="animate-in fade-in" style={{ textAlign: 'center', padding: '2rem' }}>Завантаження рейтингу...</div>;
    }

    return (
        <div className="animate-in fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Trophy size={32} color="var(--warning)" />
                Рейтинг Флоту AeroX
            </h1>

            <div className="glass-panel">
                <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 120px 120px', padding: '1rem', borderBottom: '2px solid var(--border-light)', fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                    <span>#</span>
                    <span>Капітан</span>
                    <span style={{ textAlign: 'right' }}>Місії</span>
                    <span style={{ textAlign: 'right' }}>Кредити</span>
                </div>

                {captains.length > 0 ? captains.map((captain, index) => (
                    <div key={captain.id} style={{
                        display: 'grid',
                        gridTemplateColumns: '50px 1fr 120px 120px',
                        padding: '1.2rem 1rem',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        alignItems: 'center',
                        background: index < 3 ? 'rgba(255, 215, 0, 0.03)' : 'transparent'
                    }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                            {index === 0 && <Medal color="#ffd700" size={20} />}
                            {index === 1 && <Medal color="#c0c0c0" size={20} />}
                            {index === 2 && <Medal color="#cd7f32" size={20} />}
                            {index > 2 && index + 1}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)' }}>
                                <Users size={16} color="var(--text-muted)" />
                            </div>
                            <span style={{ color: 'white', fontWeight: '500' }}>{captain.email.split('@')[0]}</span>
                        </div>
                        <div style={{ textAlign: 'right', color: 'var(--primary)' }}>{captain.missionsCompleted || 0}</div>
                        <div style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--success)' }}>
                            {captain.credits?.toLocaleString() || 0} CR
                        </div>
                    </div>
                )) : (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Дані про капітанів відсутні. Будьте першим у списку!
                    </div>
                )}
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="glass-panel" style={{ flex: 1, minWidth: '250px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Star color="var(--warning)" fill="var(--warning)" />
                    <div>
                        <h4 style={{ margin: 0 }}>Еліта Флоту</h4>
                        <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Топ-3 капітани отримують бонус до нагород.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
