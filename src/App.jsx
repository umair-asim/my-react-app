import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AppRoutes from './AppRoutes';

export default function App() {
  const { user, setUser, logout, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1D26]">
        <span className="text-white text-2xl">Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#0B1D26]">
        <AppRoutes user={user} setUser={setUser} logout={logout} />
      </div>
    </Router>
  );
}