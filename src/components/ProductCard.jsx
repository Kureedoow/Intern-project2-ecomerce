import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, discount = 0, isNew = false }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  // Generate fake original price for effect if discount exists
  const originalPrice = discount ? (product.price / (1 - discount / 100)).toFixed(2) : null;

  return (
    <Link to={`/product/${product.id}`} className="group flex flex-col w-full h-full relative">
      
      {/* Image Container */}
      <div className="relative aspect-square bg-[#F5F5F5] rounded flex items-center justify-center p-8 mb-4 overflow-hidden">
        
        {/* Badges */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-3 py-1 rounded">
            -{discount}%
          </div>
        )}
        {isNew && !discount && (
          <div className="absolute top-3 left-3 bg-[#00FF66] text-white text-xs font-semibold px-3 py-1 rounded">
            NEW
          </div>
        )}

        {/* Action Icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button 
            onClick={(e) => { e.preventDefault(); /* add to wishlist */ }} 
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 hover:text-primary transition-colors"
          >
            <Heart size={16} />
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); /* quick view */ }} 
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 hover:text-primary transition-colors"
          >
            <Eye size={16} />
          </button>
        </div>

        {/* Product Image */}
        <img 
          src={product.image} 
          alt={product.title} 
          className="object-contain w-full h-full mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Add to Cart Button (Hover) */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-2.5 font-medium hover:bg-gray-800 transition-colors"
          >
            Add To Cart
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow">
        <h3 className="font-medium text-black text-base line-clamp-1 mb-2">
          {product.title}
        </h3>
        
        <div className="flex items-center gap-3 mb-2">
          <span className="font-medium text-primary">
            ${Number(product.price).toFixed(2)}
          </span>
          {originalPrice && (
            <span className="font-medium text-gray-500 line-through">
              ${originalPrice}
            </span>
          )}
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-4 h-4 ${i < 4 ? 'text-[#FFAD33] fill-[#FFAD33]' : 'text-gray-300 fill-gray-300'}`} viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-gray-500 text-xs font-semibold ml-1">(65)</span>
        </div>
      </div>
      
    </Link>
  );
};

export default ProductCard;
