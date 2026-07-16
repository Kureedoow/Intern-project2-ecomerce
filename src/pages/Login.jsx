import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email.trim()) return setError('Please enter your email.');
    if (!form.password) return setError('Please enter your password.');
    setLoading(true);
    setTimeout(() => {
      const result = login(form.email.trim(), form.password);
      if (result.success) {
        navigate('/account');
      } else {
        setError(result.message);
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[85vh]">
      {/* Image Section */}
      <div className="w-full md:w-1/2 bg-[#CBE4E8] hidden md:flex items-end justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=900&auto=format&fit=crop"
          alt="Shopping"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:px-24 py-20">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-medium tracking-wide mb-3">Log in to Exclusive</h1>
          <p className="text-gray-500 mb-10">Enter your details below</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email or Phone Number"
                value={form.email}
                onChange={handleChange}
                className="w-full border-b border-gray-400 py-3 focus:outline-none focus:border-primary transition-colors text-black placeholder-gray-500 bg-transparent"
              />
            </div>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full border-b border-gray-400 py-3 focus:outline-none focus:border-primary transition-colors text-black placeholder-gray-500 bg-transparent pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-0 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white py-4 px-12 rounded font-medium hover:bg-red-600 transition-colors w-full sm:w-auto disabled:opacity-60"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
              <Link to="#" className="text-primary hover:underline text-sm">
                Forget Password?
              </Link>
            </div>
          </form>

          <div className="mt-8 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-black font-medium hover:underline underline-offset-4 ml-2">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
