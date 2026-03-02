import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sendChatMessage, subscribeToChat } from '../services/db';
import { MessageSquare, Send, Radio, User } from 'lucide-react';

export default function SubspaceComm() {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        const unsubscribe = subscribeToChat((msgs) => {
            setMessages(msgs);
            setLoading(false);
            // Scroll to bottom on new message
            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
            }, 100);
        });
        return () => unsubscribe();
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;
        try {
            await sendChatMessage(currentUser.uid, currentUser.email, newMessage);
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="animate-in fade-in" style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Radio size={32} color="var(--primary)" className="pulse" />
                    Міжзоряний Зв'язок
                </h1>
                <div className="badge badge-easy">Квантова лінія: Онлайн</div>
            </div>

            <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
                <div
                    ref={scrollRef}
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        background: 'rgba(0,0,0,0.2)'
                    }}
                >
                    {loading ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Встановлення квантового з'єднання...</div>
                    ) : messages.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Частота вільна. Будьте першим, хто вийде в ефір!</div>
                    ) : messages.map((msg) => (
                        <div
                            key={msg.id}
                            style={{
                                alignSelf: msg.userId === currentUser?.uid ? 'flex-end' : 'flex-start',
                                maxWidth: '70%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px'
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)',
                                alignSelf: msg.userId === currentUser?.uid ? 'flex-end' : 'flex-start'
                            }}>
                                <span style={{ color: msg.userId === currentUser?.uid ? 'var(--primary)' : 'var(--secondary)' }}>
                                    {msg.email.split('@')[0]}
                                </span>
                                <span> • {msg.timestamp?.toDate().toLocaleTimeString()}</span>
                            </div>
                            <div style={{
                                padding: '0.8rem 1.2rem',
                                borderRadius: msg.userId === currentUser?.uid ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                background: msg.userId === currentUser?.uid ? 'var(--primary-glow)' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${msg.userId === currentUser?.uid ? 'var(--primary)' : 'var(--border-light)'}`,
                                color: 'white'
                            }}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSend} style={{ padding: '1.2rem', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '1rem', background: 'var(--bg-card)' }}>
                    <input
                        type="text"
                        className="select-input"
                        style={{ flex: 1, background: 'rgba(255,255,255,0.05)' }}
                        placeholder="Введіть повідомлення для всієї флотилії..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" className="button start" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Send size={18} /> Передати
                    </button>
                </form>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Повідомлення транслюються всім підключеним капітанам AeroX через підпростір.
            </div>
        </div>
    );
}
