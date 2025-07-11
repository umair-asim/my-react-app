import { useAuth } from './hooks/useAuth';
import AppRoutes from './routes/AppRoutes';

import React from 'react';

export default function App(): React.ReactElement {
  const { user, setUser, logout, authLoading, handleSignIn, handleSignUp } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1D26]">
        <span className="text-white text-2xl">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1D26]">
      <AppRoutes
        user={user}
        logout={logout}
        handleSignIn={handleSignIn}
        handleSignUp={handleSignUp}
      />
    </div>
  );
}