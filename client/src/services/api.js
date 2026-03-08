const API_URL = '/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const fetchMissions = async () => {
    const response = await fetch(`${API_URL}/missions`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch missions');
    return response.json();
};

export const saveMission = async (missionData) => {
    const response = await fetch(`${API_URL}/missions`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(missionData)
    });
    if (!response.ok) throw new Error('Failed to save mission');
    return response.json();
};

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');
    return data;
};

export const loginUser = async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    return data;
};

export const fetchProfile = async () => {
    const response = await fetch(`${API_URL}/auth/profile`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
};
