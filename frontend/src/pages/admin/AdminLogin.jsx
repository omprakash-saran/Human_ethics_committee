import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminLogin.module.css';
import { apiFetch, setAuthToken } from '../../utils/api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await apiFetch('/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      // Log the response for debugging
      console.log('Login response status:', res.status);
      
      const data = await res.json();
      console.log('Login response data:', data);

      if (res.ok && data.success && data.token) {
        setAuthToken(data.token);
        localStorage.setItem('isAdminLoggedIn', 'true');
        navigate('/admin/dashboard');
        return;
      }

      // Handle different error scenarios
      if (res.status === 401) {
        setError('Invalid username or password');
      } else if (res.status === 403) {
        setError('Access denied. Contact administrator.');
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Admin Login</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.input}
              placeholder="Enter username"
              autoComplete="username"
            />
          </label>
          <label className={styles.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </label>
          {error && <p className={styles.error}>{error}</p>}
          <button 
            type="submit" 
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
