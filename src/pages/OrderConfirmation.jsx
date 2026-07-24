import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { CheckCircle, Package, Truck, MapPin, Calendar, ArrowRight } from 'lucide-react';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const found = getOrderById(orderId);
    setOrder(found);
    // Remove animation after a few seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [orderId, getOrderById]);

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <Link to="/" className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors">
          Go Home
        </Link>
      </div>
    );
  }

  const deliveryDate = new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Success Header */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6 ${showConfetti ? 'animate-bounce' : ''}`}>
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Order Confirmed! 🎉
          </h1>
          <p className="text-gray-500 text-lg">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          {/* Order Header */}
          <div className="bg-gray-900 text-white px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Order Number</p>
              <p className="font-mono font-bold text-lg">{order.id}</p>
            </div>
            <div className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-1.5 rounded-full text-xs font-bold">
              <Package size={14} />
              {order.status}
            </div>
          </div>

          {/* Delivery & Shipping Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 sm:p-8 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Estimated Delivery</p>
                <p className="font-semibold text-gray-900 text-sm">{deliveryDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin size={20} className="text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Shipping To</p>
                <p className="font-semibold text-gray-900 text-sm">{order.shippingInfo.name}</p>
                <p className="text-xs text-gray-500">
                  {order.shippingInfo.address}{order.shippingInfo.apartment ? `, ${order.shippingInfo.apartment}` : ''}, {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6 sm:p-8">
            <h3 className="font-bold text-gray-900 mb-4">
              Items Ordered ({order.items.reduce((sum, i) => sum + i.quantity, 0)})
            </h3>
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 p-2">
                    <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                    <p className="text-xs text-gray-500 capitalize">{item.category} · Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Totals */}
          <div className="bg-gray-50 px-6 sm:px-8 py-5">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Shipping</span>
              <span className={`font-medium ${order.shipping === 0 ? 'text-green-500' : ''}`}>
                {order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3 mt-3">
              <span>Total Paid</span>
              <span className="text-primary">${order.total.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Truck size={14} className="text-gray-400" />
              <span className="text-xs text-gray-500 capitalize">
                Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/account"
            className="flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            <Package size={18} />
            View My Orders
          </Link>
          <Link
            to="/products"
            className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-900 px-8 py-3.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmation;
