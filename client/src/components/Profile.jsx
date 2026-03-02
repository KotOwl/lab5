import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { User, Mail, Calendar, Clock, Award, Rocket } from 'lucide-react';

export default function Profile() {
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserData() {
            if (!currentUser) return;
            try {
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchUserData();
    }, [currentUser]);

    if (loading) {
        return <div className="animate-in fade-in" style={{ textAlign: 'center', padding: '2rem' }}>Loading profile...</div>;
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('uk-UA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="animate-in fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <User size={32} color="var(--primary)" />
                Командний Профіль
            </h1>

            <div className="grid-2">
                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem auto'
                        }}>
                            <User size={40} color="white" />
                        </div>
                        <h2 style={{ fontSize: '1.2rem', color: 'white' }}>{currentUser.email}</h2>
                        <span className="badge badge-research" style={{ marginTop: '0.5rem', display: 'inline-block' }}>Капітан</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                            <Mail size={18} />
                            <div>
                                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</div>
                                <div style={{ color: 'white' }}>{currentUser.email}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                            <Calendar size={18} />
                            <div>
                                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Дата реєстрації</div>
                                <div style={{ color: 'white' }}>{formatDate(userData?.createdAt)}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                            <Clock size={18} />
                            <div>
                                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Останній вхід</div>
                                <div style={{ color: 'white' }}>{formatDate(userData?.lastLogin)}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', marginTop: '0.5rem', padding: '1rem', background: 'rgba(0, 255, 136, 0.05)', borderRadius: '8px', border: '1px solid rgba(0, 255, 136, 0.1)' }}>
                            <Award size={24} color="var(--success)" />
                            <div>
                                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--success)' }}>Баланс Кредитів</div>
                                <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>{userData?.credits?.toLocaleString() || 0} CR</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-panel">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Award size={20} color="var(--warning)" />
                        Досягнення
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                                <Rocket size={18} color="var(--primary)" />
                                <span style={{ fontWeight: 'bold' }}>Перший крок</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Успішно зареєстровано в системі керування флотом.</p>
                        </div>

                        <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid var(--border-light)', opacity: 0.5 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                                <Award size={18} color="var(--accent)" />
                                <span style={{ fontWeight: 'bold' }}>Досвідчений пілот</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Завершіть 5 місій для отримання цього звання.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
