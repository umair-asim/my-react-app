import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  user: {
    name: string;
    [key: string]: any;
  } | null;
  onLogout: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  return (
    <nav className="w-full bg-[#0B1D26] py-4 px-8 flex items-center justify-between shadow-md">
      <div
        className="text-2xl font-bold text-white tracking-tight cursor-pointer"
        onClick={() => navigate('/')}
      >
        Social Media App
      </div>
      <div />
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span
              className="text-white text-lg"
              title={user.name}
            >
              Hello, {user.name}
            </span>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              onClick={onLogout}
              type="button"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={() => navigate('/signin')}
            type="button"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
