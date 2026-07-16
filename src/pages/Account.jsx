import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, LogOut, Camera, Save, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TABS = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'wishlist', label: 'My Wishlist', icon: Heart },
];

const Account = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <h2 className="text-2xl font-bold">You are not logged in.</h2>
        <div className="flex gap-4">
          <Link to="/login" className="bg-primary text-white px-8 py-3 rounded hover:bg-red-600 transition-colors">
            Log In
          </Link>
          <Link to="/signup" className="border border-black px-8 py-3 rounded hover:bg-gray-50 transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  const handleProfileChange = (e) => {
    setProfileForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setProfileMsg({ type: '', text: '' });
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return setProfileMsg({ type: 'error', text: 'Name cannot be empty.' });
    if (profileForm.newPassword && profileForm.newPassword.length < 6)
      return setProfileMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword)
      return setProfileMsg({ type: 'error', text: 'New passwords do not match.' });
    updateProfile({ name: profileForm.name.trim(), email: profileForm.email.trim() });
    setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    setProfileForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-white min-h-screen pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex mb-10 text-sm text-gray-500">
          <Link to="/" className="hover:text-black">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">My Account</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-4xl font-bold mb-3">
                {user.name.charAt(0).toUpperCase()}
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow hover:bg-gray-50">
                  <Camera size={14} className="text-gray-600" />
                </button>
              </div>
              <p className="text-sm text-gray-500">Hello,</p>
              <p className="font-semibold text-lg">{user.name}</p>
            </div>

            <nav className="space-y-1">
              <p className="text-sm font-bold text-black px-3 py-2 uppercase tracking-wider">Manage My Account</p>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary font-medium'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded text-left text-gray-600 hover:text-red-500 transition-colors mt-4"
              >
                <LogOut size={18} />
                Logout
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white shadow-[0_1px_13px_rgba(0,0,0,0.05)] rounded p-8 sm:p-10">

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-medium text-primary mb-8">Edit Your Profile</h2>

                {profileMsg.text && (
                  <div className={`rounded px-4 py-3 mb-6 text-sm ${profileMsg.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                    {profileMsg.text}
                  </div>
                )}

                <form onSubmit={handleProfileSave} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <input
                        name="name"
                        type="text"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        className="w-full bg-[#F5F5F5] rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        name="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        className="w-full bg-[#F5F5F5] rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4 mt-4">Password Changes</h3>
                    <div className="space-y-4">
                      {[
                        { name: 'currentPassword', label: 'Current Password', key: 'current' },
                        { name: 'newPassword', label: 'New Password', key: 'new' },
                        { name: 'confirmPassword', label: 'Confirm New Password', key: 'confirm' },
                      ].map(field => (
                        <div key={field.name} className="relative">
                          <input
                            name={field.name}
                            type={showPw[field.key] ? 'text' : 'password'}
                            placeholder={field.label}
                            value={profileForm[field.name]}
                            onChange={handleProfileChange}
                            className="w-full bg-[#F5F5F5] rounded py-3 px-4 pr-11 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPw(p => ({ ...p, [field.key]: !p[field.key] }))}
                            className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                          >
                            {showPw[field.key] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={() => setProfileForm({ name: user.name, email: user.email, currentPassword: '', newPassword: '', confirmPassword: '' })} className="px-8 py-3 rounded border border-gray-300 hover:bg-gray-50 text-sm font-medium transition-colors">
                      Cancel
                    </button>
                    <button type="submit" className="bg-primary text-white px-8 py-3 rounded font-medium hover:bg-red-600 transition-colors flex items-center gap-2 text-sm">
                      <Save size={16} />
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-medium mb-8">My Orders</h2>
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <Package size={64} strokeWidth={1} className="mb-6" />
                  <p className="text-lg font-medium text-gray-500">No orders yet</p>
                  <p className="text-sm mt-2 mb-6">You haven't placed any orders.</p>
                  <Link to="/products" className="bg-primary text-white px-8 py-3 rounded hover:bg-red-600 transition-colors text-sm font-medium">
                    Start Shopping
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-xl font-medium mb-8">My Wishlist</h2>
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <Heart size={64} strokeWidth={1} className="mb-6" />
                  <p className="text-lg font-medium text-gray-500">Your wishlist is empty</p>
                  <p className="text-sm mt-2 mb-6">Save items you love to your wishlist.</p>
                  <Link to="/products" className="bg-primary text-white px-8 py-3 rounded hover:bg-red-600 transition-colors text-sm font-medium">
                    Explore Products
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
