
import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../utils/api';

interface SignInProps {
  onSignIn: (data: { user: any; token: string }) => void;
}

interface SignInForm {
  email: string;
  password: string;
}

export default function SignIn({ onSignIn }: SignInProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState<SignInForm>({ email: '', password: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await signIn(form);
      if (data.success && data.user && typeof data.token === 'string') {
        onSignIn({ user: data.user, token: data.token });
      } else {
        setError(data.error || 'Sign in failed.');
      }
    } catch (err) {
      setError('Network error.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ background: '#0B1D26' }}>
      <div className="w-full max-w-md bg-white/90 shadow-2xl rounded-3xl p-10 border border-blue-100 flex flex-col items-center">
        <h2 className="text-4xl font-extrabold mb-8 text-blue-700 tracking-tight">Sign In</h2>
        <form onSubmit={handleSubmit} className="w-full space-y-6">
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <button className="text-blue-600 hover:underline font-semibold" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
        {error && <div className="text-red-600 mt-6 text-center">{error}</div>}
      </div>
    </div>
  );
}
