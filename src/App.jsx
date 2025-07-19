import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check login status on app start
    const checkAuthStatus = () => {
      try {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userEmail = localStorage.getItem('userEmail');
        
        setIsLoggedIn(isLoggedIn && userEmail);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = (email) => {
    try {
      // Save login status to localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error saving login status:', error);
    }
  };

  const handleLogout = () => {
    try {
      // Clear login status from localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error clearing login status:', error);
      // Still logout even if there's an error
      setIsLoggedIn(false);
    }
  };


  return (
    <Routes>
      <Route
        path="/"
        element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
      />
      <Route
        path="/dashboard"
        element={
          isLoggedIn ? (
            <Dashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
}

export default App;