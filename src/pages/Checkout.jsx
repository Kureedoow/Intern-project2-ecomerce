import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Truck, CreditCard, Banknote, ChevronRight, Lock } from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const shipping = cartTotal > 140 ? 0 : 9.99;
  const total = cartTotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Truck size={32} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Nothing to checkout</h2>
        <p className="text-gray-500 mb-6">Add some items to your cart first.</p>
        <Link to="/products" className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium">
          Browse Products
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email address';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!form.address.trim()) newErrors.address = 'Street address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate brief processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const shippingInfo = {
      name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      phone: form.phone,
      address: form.address,
      apartment: form.apartment,
      city: form.city,
      state: form.state,
      zipCode: form.zipCode,
      country: form.country,
    };

    const order = placeOrder(cartItems, shippingInfo, paymentMethod);
    clearCart();
    navigate(`/order-confirmation/${order.id}`);
  };

  const InputField = ({ name, label, type = 'text', placeholder, required = true, colSpan = false }) => (
    <div className={colSpan ? 'sm:col-span-2' : ''}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={form[name]}
        onChange={handleChange}
        className={`w-full bg-[#F5F5F5] rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 transition-shadow ${
          errors[name] ? 'ring-2 ring-red-400 bg-red-50' : 'focus:ring-primary'
        }`}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-10 text-sm text-gray-500">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/cart" className="hover:text-black transition-colors">Cart</Link>
          <ChevronRight size={14} />
          <span className="text-black font-medium">Checkout</span>
        </nav>

        <form onSubmit={handlePlaceOrder}>
          <div className="flex flex-col lg:flex-row gap-12">

            {/* ── Left: Billing Details ── */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Billing Details</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField name="firstName" label="First Name" placeholder="John" />
                <InputField name="lastName" label="Last Name" placeholder="Doe" />
                <InputField name="email" label="Email Address" type="email" placeholder="john@example.com" />
                <InputField name="phone" label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" />
                <InputField name="address" label="Street Address" placeholder="1234 Main St" colSpan />
                <InputField name="apartment" label="Apartment, Suite, etc." placeholder="Apt 4B" required={false} colSpan />
                <InputField name="city" label="City" placeholder="New York" />
                <InputField name="state" label="State / Province" placeholder="NY" />
                <InputField name="zipCode" label="ZIP / Postal Code" placeholder="10001" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full bg-[#F5F5F5] rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                    <option>Germany</option>
                    <option>France</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-10">
                <h2 className="text-xl font-bold text-gray-900 mb-5">Payment Method</h2>
                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-primary bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-primary w-4 h-4"
                    />
                    <Banknote size={22} className={paymentMethod === 'cod' ? 'text-primary' : 'text-gray-400'} />
                    <div>
                      <p className="font-medium text-sm">Cash on Delivery</p>
                      <p className="text-xs text-gray-500">Pay when your order arrives</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-primary bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="accent-primary w-4 h-4"
                    />
                    <CreditCard size={22} className={paymentMethod === 'card' ? 'text-primary' : 'text-gray-400'} />
                    <div>
                      <p className="font-medium text-sm">Credit / Debit Card</p>
                      <p className="text-xs text-gray-500">Visa, Mastercard, AMEX</p>
                    </div>
                  </label>
                </div>

                {paymentMethod === 'card' && (
                  <div className="mt-4 p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        className="w-full bg-white rounded-lg py-3 px-4 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full bg-white rounded-lg py-3 px-4 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full bg-white rounded-lg py-3 px-4 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: Order Summary ── */}
            <div className="w-full lg:w-[420px] flex-shrink-0">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                  {cartItems.map(item => {
                    const itemKey = `${item.id}-${item.selectedSize || 'none'}-${item.selectedColor || 'none'}`;
                    return (
                      <div key={itemKey} className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 p-1">
                          <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                            {item.selectedSize && ` · Size: ${item.selectedSize}`}
                            {item.selectedColor && ` · Color: ${item.selectedColor}`}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className={`font-medium ${shipping === 0 ? 'text-green-500' : ''}`}>
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-400">Free shipping on orders over $140</p>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3 mt-3">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full mt-6 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all text-base ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary hover:bg-red-600 hover:shadow-lg hover:shadow-red-200'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      Place Order — ${total.toFixed(2)}
                    </>
                  )}
                </button>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 mt-5 text-gray-400">
                  <div className="flex items-center gap-1.5 text-xs">
                    <ShieldCheck size={14} />
                    <span>Secure</span>
                  </div>
                  <span className="text-gray-200">|</span>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Truck size={14} />
                    <span>Fast Delivery</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
};

export default Checkout;
