import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            await register(username, email, password);
            navigate('/');
        } catch (err) {
            setError('Failed to create an account. ' + err.message);
        }

        setLoading(false);
    }

    return (
        <div className="auth-container">
            <div className="auth-card glass-panel">
                <h2 className="title">Sign Up</h2>
                {error && <div className="error-alert">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Pilot Name (Username)</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <button disabled={loading} type="submit" className="button start" style={{ width: '100%', marginTop: '1rem' }}>
                        Register for Duty
                    </button>
                </form>
                <div className="auth-link">
                    Already have an account? <Link to="/login">Log In</Link>
                </div>
            </div>
        </div>
    );
}
