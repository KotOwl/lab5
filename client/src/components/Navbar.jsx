import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Rocket, Map, BookOpen, ShieldAlert, LogOut, User, Trophy, Radio } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    }

    return (
        <nav className="navbar">
            <NavLink to="/" className="nav-brand">
                <Rocket size={28} color="var(--primary)" />
                <span>AeroX</span>
            </NavLink>
            <div className="nav-links">
                <NavLink
                    to="/"
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                >
                    Ship Status
                </NavLink>
                <NavLink
                    to="/missions"
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Map size={18} />
                        Expeditions
                    </div>
                </NavLink>
                {currentUser && (
                    <>
                        <NavLink
                            to="/active"
                            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShieldAlert size={18} />
                                Active
                            </div>
                        </NavLink>
                        <NavLink
                            to="/leaderboard"
                            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Trophy size={18} />
                                Leaderboard
                            </div>
                        </NavLink>
                        <NavLink
                            to="/chat"
                            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Radio size={18} />
                                Fleet Chat
                            </div>
                        </NavLink>
                    </>
                )}
                <NavLink
                    to="/log"
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BookOpen size={18} />
                        Travel Log
                    </div>
                </NavLink>

                {currentUser ? (
                    <div className="auth-menu">
                        <NavLink to="/profile" className="user-email" style={{ textDecoration: 'none', transition: 'color 0.3s' }}>
                            {currentUser.email}
                        </NavLink>
                        <button onClick={handleLogout} className="button danger small" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                ) : (
                    <div className="auth-menu">
                        <NavLink to="/login" className="button start small" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User size={16} /> Login
                        </NavLink>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
