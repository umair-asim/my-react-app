import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthTokenHeader } from '../utils/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(null);
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/me', {
        headers: getAuthTokenHeader(),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setUser(data.user);
          else {
            setUser(null);
            localStorage.removeItem('token');
          }
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem('token');
        })
        .finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
  }, []);

  const handleSignIn = ({ user, token }) => {
    setUser(user);
    localStorage.setItem('token', token);
    navigate('/');
  };

  const handleSignUp = ({ user, token }) => {
    setUser(user);
    localStorage.setItem('token', token);
    navigate('/');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return { user, setUser, logout, authLoading, handleSignIn, handleSignUp };
};
