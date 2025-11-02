import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DoctorDashboard from './components/DoctorDashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Show doctor dashboard if user is a doctor
  if (user.role === 'doctor') {
    return <DoctorDashboard user={user} onLogout={handleLogout} />;
  }

  // Show patient dashboard
  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;
