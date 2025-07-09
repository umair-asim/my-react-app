import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setUser(data.user);
        else setError(data.error || 'User not found');
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-400 text-center mt-10">{error}</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#0B1D26] py-8">
      <div className="w-full max-w-xl bg-blue-900/80 rounded-3xl p-10 shadow-2xl flex flex-col items-center border border-blue-700">
        <h2 className="text-4xl font-extrabold text-white mb-4">{user.name}</h2>
        <div className="text-blue-100 text-lg mb-2">Email: {user.email}</div>
        <div className="text-blue-200 text-sm">User ID: {user.id}</div>
      </div>
    </div>
  );
}
