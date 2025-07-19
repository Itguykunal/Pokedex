import { useState } from 'react';
import pikaImage from '../assets/pika.png';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill in both fields');
      return;
    }

    setLoading(true);

    try {
      // Here you would normally validate credentials with your backend
      // For now, we'll accept any email/password combination
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the onLogin function with email
      if (onLogin) {
        onLogin(email);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: '#F5F5F5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      boxSizing: 'border-box',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      {/* Login Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '40px',
        width: '400px',
        maxWidth: '90vw',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>
        
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          backgroundColor: '#FFD76F',
          borderRadius: '50%',
          opacity: 0.1
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '100px',
          height: '100px',
          backgroundColor: '#FF6B6B',
          borderRadius: '50%',
          opacity: 0.1
        }}></div>

        {/* Pikachu Icon */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <img 
            src={pikaImage} 
            alt="Pikachu" 
            style={{
              width: '120px',
              height: '120px',
              marginBottom: '15px',
              objectFit: 'cover'
            }}
          />

          <h2 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#333',
            margin: '0 0 10px 0'
          }}>
            Welcome Back!
          </h2>
          
          <p style={{
            color: '#666',
            fontSize: '16px',
            margin: '0 0 30px 0'
          }}>
            Sign in to catch 'em all!
          </p>
        </div>

        {/* Login Form */}
        <div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              Email
            </label>
            <input
              type="email"
              placeholder="trainer@pokemon.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #E0E0E0',
                borderRadius: '12px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box',
                opacity: loading ? 0.7 : 1
              }}
              onFocus={(e) => e.target.style.borderColor = '#FFD76F'}
              onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #E0E0E0',
                borderRadius: '12px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box',
                opacity: loading ? 0.7 : 1
              }}
              onFocus={(e) => e.target.style.borderColor = '#FFD76F'}
              onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
            />
          </div>

          <button 
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: loading ? '#ccc' : '#FFD76F',
              color: '#333',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(255, 215, 111, 0.3)',
              opacity: loading ? 0.7 : 1
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#FFC107';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(255, 215, 111, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#FFD76F';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(255, 215, 111, 0.3)';
              }
            }}
          >
            {loading ? 'Logging in...' : 'Login! ⚡'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;