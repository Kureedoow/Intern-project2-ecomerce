import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/" className="bg-primary text-white px-8 py-3 rounded hover:bg-red-600 transition-colors">
          Return To Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex mb-12 text-sm text-gray-500">
          <Link to="/" className="hover:text-black">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">Cart</span>
        </nav>

        {/* Cart Table Header */}
        <div className="hidden md:grid grid-cols-4 gap-4 bg-white shadow-[0_1px_10px_rgba(0,0,0,0.05)] rounded py-4 px-10 mb-10 font-medium">
          <div>Product</div>
          <div>Price</div>
          <div>Quantity</div>
          <div className="text-right">Subtotal</div>
        </div>

        {/* Cart Items */}
        <div className="space-y-10 mb-10">
          {cartItems.map((item) => (
            <div key={item.id} className="relative flex flex-col md:grid md:grid-cols-4 gap-4 items-center bg-white shadow-[0_1px_10px_rgba(0,0,0,0.05)] rounded py-4 px-10">
              
              {/* Product */}
              <div className="flex items-center gap-4 w-full md:w-auto relative">
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="absolute -top-2 -left-6 md:-left-4 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
                <div className="w-14 h-14 bg-gray-50 flex-shrink-0 flex items-center justify-center p-1 rounded">
                  <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                </div>
                <span className="font-medium text-sm line-clamp-1 truncate w-40">{item.title}</span>
              </div>

              {/* Price */}
              <div className="w-full flex justify-between md:block">
                <span className="md:hidden font-medium text-gray-500">Price:</span>
                <span>${Number(item.price).toFixed(2)}</span>
              </div>

              {/* Quantity */}
              <div className="w-full flex justify-between md:block">
                <span className="md:hidden font-medium text-gray-500">Quantity:</span>
                <div className="inline-flex items-center border border-gray-300 rounded px-3 py-1">
                  <span className="w-8 text-center">{item.quantity}</span>
                  <div className="flex flex-col border-l border-gray-300 pl-2 ml-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-500 hover:text-black text-xs leading-none">▲</button>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-500 hover:text-black text-xs leading-none">▼</button>
                  </div>
                </div>
              </div>

              {/* Subtotal */}
              <div className="w-full flex justify-between md:block md:text-right">
                <span className="md:hidden font-medium text-gray-500">Subtotal:</span>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>

            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-20">
          <Link to="/products" className="border border-black px-10 py-3 rounded font-medium hover:bg-gray-50 text-center">
            Return To Shop
          </Link>
          <button className="border border-black px-10 py-3 rounded font-medium hover:bg-gray-50">
            Update Cart
          </button>
        </div>

        {/* Footer Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
          
          {/* Coupon */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-1/2">
            <input 
              type="text" 
              placeholder="Coupon Code" 
              className="border border-black rounded px-6 py-3 flex-grow focus:outline-none"
            />
            <button className="bg-primary text-white px-10 py-3 rounded font-medium hover:bg-red-600 transition-colors whitespace-nowrap">
              Apply Coupon
            </button>
          </div>

          {/* Cart Total Box */}
          <div className="w-full lg:w-[400px] border-2 border-black rounded p-8">
            <h2 className="text-xl font-medium mb-6">Cart Total</h2>
            
            <div className="flex justify-between border-b border-gray-300 py-3 mb-3">
              <span>Subtotal:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between border-b border-gray-300 py-3 mb-6">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            
            <div className="flex justify-between mb-6">
              <span className="font-medium">Total:</span>
              <span className="font-bold">${cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-center">
              <button className="bg-primary text-white px-10 py-3 rounded font-medium hover:bg-red-600 transition-colors w-full">
                Proceed to checkout
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;
