import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../utils/api';

interface User {
  id: number;
  name: string;
  email: string;
  public_id: string;
  [key: string]: any;
}

interface AuthReturn {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  authLoading: boolean;
  handleSignIn: (data: { user: User; token: string }) => void;
  handleSignUp: (data: { user: User; token: string }) => void;
}

export const useAuth = (): AuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(null);
    const token = localStorage.getItem('token');
    if (token) {
      getMe()
        .then((data: any) => {
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

  const handleSignIn = ({ user, token }: { user: User; token: string }) => {
    setUser(user);
    localStorage.setItem('token', token);
    navigate('/');
  };

  const handleSignUp = ({ user, token }: { user: User; token: string }) => {
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
