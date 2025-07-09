import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp({ onSignUp }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Signup successful!');
        setForm({ name: '', email: '', password: '' });
        setTimeout(() => {
          onSignUp({ user: data.user, token: data.token });
        }, 1200);
      } else {
        setError(data.error || 'Signup failed.');
      }
    } catch (err) {
      setError('Network error.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{background: '#0B1D26'}}>
      <div className="w-full max-w-md bg-white/90 shadow-2xl rounded-3xl p-10 border border-blue-100 flex flex-col items-center">
        <h2 className="text-4xl font-extrabold mb-8 text-blue-700 tracking-tight">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-5 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-lg"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-5 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-lg"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-5 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-bold shadow-lg hover:from-blue-600 hover:to-purple-600 transition text-lg"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <button className="text-blue-600 hover:underline font-semibold" onClick={() => navigate('/signin')}>Sign In</button>
        </div>
        {error && <div className="text-red-600 mt-6 text-center">{error}</div>}
        {success && <div className="text-green-600 mt-6 text-center">{success}</div>}
      </div>
    </div>
  );
}
