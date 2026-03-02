import { createContext, useContext, useEffect, useState } from "react";
import { registerUser, loginUser, fetchProfile } from "../services/api";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function register(username, email, password) {
        const data = await registerUser({ username, email, password });
        localStorage.setItem('token', data.token);
        setCurrentUser(data.user);
        return data;
    }

    async function login(email, password) {
        const data = await loginUser({ email, password });
        localStorage.setItem('token', data.token);
        setCurrentUser(data.user);
        return data;
    }

    function logout() {
        localStorage.removeItem('token');
        setCurrentUser(null);
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchProfile()
                .then(user => setCurrentUser(user))
                .catch(() => {
                    localStorage.removeItem('token');
                    setCurrentUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const value = {
        currentUser,
        register,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

