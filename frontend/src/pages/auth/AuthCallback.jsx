import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setAuthToken } from '../../utils/api';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Completing login...');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setMessage('Login failed. Please try again.');
      return;
    }

    setAuthToken(token);
    navigate('/applications', { replace: true });
  }, [navigate, searchParams]);

  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
      <p>{message}</p>
    </div>
  );
}
