import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAllProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import { Heart, Truck, RotateCcw } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const allProducts = await fetchAllProducts();
      const foundProduct = allProducts.find(p => p.id === id);
      setProduct(foundProduct);
      setLoading(false);
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-opacity-50"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="bg-white min-h-screen pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex mb-12 text-sm text-gray-500">
          <Link to="/" className="hover:text-black">Account</Link>
          <span className="mx-2">/</span>
          <span className="capitalize hover:text-black">{product.category}</span>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">{product.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Gallery Section */}
          <div className="w-full lg:w-3/5 flex flex-col-reverse sm:flex-row gap-6">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-4 w-full sm:w-32 overflow-x-auto sm:overflow-visible">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#F5F5F5] p-2 flex-shrink-0 w-24 h-24 sm:w-full sm:h-32 rounded flex items-center justify-center cursor-pointer border-2 hover:border-primary transition-colors border-transparent">
                  <img src={product.image} alt="Thumbnail" className="max-h-full mix-blend-multiply" />
                </div>
              ))}
            </div>
            {/* Main Image */}
            <div className="flex-1 bg-[#F5F5F5] rounded flex items-center justify-center p-10 min-h-[400px]">
              <img src={product.image} alt={product.title} className="max-h-[500px] w-auto mix-blend-multiply" />
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-2/5 flex flex-col">
            <h1 className="text-2xl font-bold text-black mb-3">
              {product.title}
            </h1>
            
            {/* Reviews & Stock */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < 4 ? 'text-[#FFAD33] fill-[#FFAD33]' : 'text-gray-300 fill-gray-300'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-gray-500 text-sm ml-1">(150 Reviews)</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-[#00FF66] text-sm font-semibold">In Stock</span>
            </div>

            <p className="text-2xl font-medium text-black mb-6">
              ${Number(product.price).toFixed(2)}
            </p>

            <p className="text-sm text-black leading-relaxed pb-6 border-b border-gray-300">
              {product.description}
            </p>

            {/* Options */}
            <div className="py-6 flex flex-col gap-6">
              {/* Colors */}
              <div className="flex items-center gap-4">
                <span className="text-xl mr-2">Colours:</span>
                <div className="w-5 h-5 rounded-full bg-red-400 border-2 border-white ring-2 ring-black cursor-pointer"></div>
                <div className="w-5 h-5 rounded-full bg-blue-400 cursor-pointer"></div>
              </div>

              {/* Sizes */}
              <div className="flex items-center gap-4">
                <span className="text-xl mr-2">Size:</span>
                <div className="flex gap-4">
                  {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                    <button key={size} className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-colors">
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mb-10">
              {/* Quantity */}
              <div className="flex items-center border border-gray-400 rounded overflow-hidden h-11">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-full flex items-center justify-center text-2xl hover:bg-primary hover:text-white transition-colors"
                >-</button>
                <span className="w-16 h-full flex items-center justify-center font-medium text-lg border-l border-r border-gray-400">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-full flex items-center justify-center text-xl bg-primary text-white hover:bg-red-600 transition-colors"
                >+</button>
              </div>

              {/* Buy Button */}
              <button 
                onClick={() => addToCart(product, quantity)}
                className="bg-primary text-white px-10 h-11 rounded font-medium hover:bg-red-600 transition-colors"
              >
                Buy Now
              </button>

              {/* Wishlist */}
              <button className="w-11 h-11 border border-gray-400 rounded flex items-center justify-center hover:bg-gray-50 transition-colors ml-auto">
                <Heart size={20} />
              </button>
            </div>

            {/* Delivery Info */}
            <div className="border border-gray-400 rounded flex flex-col">
              <div className="flex items-center gap-4 p-6 border-b border-gray-400">
                <Truck size={32} />
                <div>
                  <h4 className="font-medium text-black text-lg mb-1">Free Delivery</h4>
                  <p className="text-xs font-medium underline cursor-pointer">Enter your postal code for Delivery Availability</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6">
                <RotateCcw size={32} />
                <div>
                  <h4 className="font-medium text-black text-lg mb-1">Return Delivery</h4>
                  <p className="text-xs font-medium">Free 30 Days Delivery Returns. <span className="underline cursor-pointer">Details</span></p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
