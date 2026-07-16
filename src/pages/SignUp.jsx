import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Please enter your name.');
    if (!form.email.trim()) return setError('Please enter your email.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    setTimeout(() => {
      const result = signup(form.name.trim(), form.email.trim(), form.password);
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
          <h1 className="text-3xl font-medium tracking-wide mb-3">Create an account</h1>
          <p className="text-gray-500 mb-10">Enter your details below</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative">
              <input
                name="name"
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border-b border-gray-400 py-3 focus:outline-none focus:border-primary transition-colors text-black placeholder-gray-500 bg-transparent"
              />
            </div>
            <div className="relative">
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

            <div className="pt-2 space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <button
                type="button"
                className="w-full border border-gray-400 py-4 rounded flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors font-medium text-black"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
                Sign up with Google
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-gray-600">
            Already have account?{' '}
            <Link to="/login" className="text-black font-medium hover:underline underline-offset-4 ml-2">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
