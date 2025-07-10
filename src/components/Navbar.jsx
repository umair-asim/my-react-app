import { useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  return (
    <nav className="w-full bg-[#0B1D26] py-4 px-8 flex items-center justify-between shadow-md">
      <div className="text-2xl font-bold text-white tracking-tight cursor-pointer" onClick={() => navigate('/')}>Social Media App</div>
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
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={() => navigate('/signin')}
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
