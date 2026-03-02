import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Ship from './components/Ship';
import Missions from './components/Missions';
import CustomMissions from './components/AcceptedMissions';
import TravelLog from './components/TravelLog';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';
import SubspaceComm from './components/SubspaceComm';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Navbar />
        <main className="page-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Ship />} />
            <Route path="/missions" element={<Missions />} />
            <Route path="/active" element={
              <ProtectedRoute>
                <CustomMissions />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <SubspaceComm />
              </ProtectedRoute>
            } />
            <Route path="/log" element={<TravelLog />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
