import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login } from '../services/auth';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { pageVariants } from '../components/EditorialComponents';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">NEXIS</h1>
          <p className="text-stone-600 font-medium">National Eligibility eXplorer & Information System</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#FAF9F6] border-4 border-stone-900 shadow-[12px_12px_0px_0px_rgba(28,25,23,1)] p-8">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b-2 border-stone-200">
            <div className="w-12 h-12 bg-[#059669] border-2 border-stone-900 flex items-center justify-center">
              <LogIn size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-stone-900 uppercase tracking-wider">Login</h2>
              <p className="text-sm text-stone-600 font-medium">Access your account</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-600 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 mt-0.5 shrink-0" strokeWidth={2.5} />
              <p className="text-sm text-red-800 font-bold">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-stone-900 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" strokeWidth={2.5} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 border-2 border-stone-300 bg-[#FAF9F6] text-stone-900 font-bold focus:border-stone-900 outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-stone-900 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" strokeWidth={2.5} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 border-2 border-stone-300 bg-[#FAF9F6] text-stone-900 font-bold focus:border-stone-900 outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-[#059669] font-bold uppercase tracking-wider hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-[#059669] text-white border-2 border-transparent hover:bg-[#047857] disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(28,25,23,0.15)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,0.15)] transition-all"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 pt-6 border-t-2 border-stone-200 text-center">
            <p className="text-sm text-stone-600 font-medium">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-[#059669] font-bold uppercase tracking-wider hover:underline"
              >
                Register
              </Link>
            </p>
          </div>

          {/* Guest Access */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/profile')}
              className="text-sm text-stone-500 font-bold uppercase tracking-wider hover:text-stone-900 transition-colors"
            >
              Continue as Guest
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-stone-500">
          <p>Powered by AI for Bharat Hackathon 2026</p>
        </div>
      </div>
    </motion.div>
  );
}
