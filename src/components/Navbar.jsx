import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cartCount } = useCart();

  return (
    <header className="w-full">
      {/* Top Banner */}
      <div className="bg-black text-white text-sm py-2 px-4 flex justify-center items-center relative">
        <p className="flex items-center gap-2">
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
          <Link to="/products" className="font-semibold underline ml-2 hover:text-gray-300">
            ShopNow
          </Link>
        </p>
        <div className="absolute right-4 hidden sm:flex items-center gap-1 cursor-pointer">
          <span>English</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="font-bold text-2xl tracking-wide text-black">
                Exclusive
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-12">
              <Link to="/" className="text-black font-medium hover:underline underline-offset-4">Home</Link>
              <Link to="/contact" className="text-black font-medium hover:underline underline-offset-4">Contact</Link>
              <Link to="/about" className="text-black font-medium hover:underline underline-offset-4">About</Link>
              <Link to="/signup" className="text-black font-medium hover:underline underline-offset-4">Sign Up</Link>
            </div>

            {/* Search & Icons */}
            <div className="flex items-center gap-4">
              
              {/* Search Bar */}
              <div className="hidden sm:flex relative items-center">
                <input 
                  type="text" 
                  placeholder="What are you looking for?" 
                  className="bg-[#F5F5F5] rounded-md py-2 pl-4 pr-10 text-sm focus:outline-none w-64"
                />
                <button className="absolute right-3 text-black">
                  <Search size={18} />
                </button>
              </div>

              {/* Icons */}
              <div className="flex items-center gap-4 ml-2">
                <Link to="/wishlist" className="text-black hover:text-primary transition-colors">
                  <Heart size={24} />
                </Link>
                
                <Link to="/cart" className="relative text-black hover:text-primary transition-colors group">
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-primary rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <div className="relative group hidden sm:block">
                  <button className="text-black hover:text-primary transition-colors flex items-center justify-center bg-transparent group-hover:bg-primary group-hover:text-white rounded-full p-1">
                    <User size={24} />
                  </button>
                  {/* Dropdown would go here */}
                </div>
              </div>
            </div>

          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
