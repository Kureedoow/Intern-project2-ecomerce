import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronRight, LayoutGrid, List, Search, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { fetchAllProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

/* ─── Category Map (same as Home sidebar) ─── */
const CATEGORY_MAP = {
  "woman-s-fashion": {
    name: "Woman's Fashion",
    subs: ["Dresses","Tops & Blouses","Jeans & Pants","Skirts","Outerwear","Swimwear","Lingerie","Shoes & Heels","Bags & Purses","Accessories"],
  },
  "men-s-fashion": {
    name: "Men's Fashion",
    subs: ["T-Shirts & Shirts","Jeans & Trousers","Suits & Blazers","Sportswear","Outerwear","Underwear","Shoes","Watches","Bags","Accessories"],
  },
  "electronics": {
    name: "Electronics",
    subs: ["Smartphones","Laptops","Tablets","Cameras","Headphones","Speakers","Smart Watches","Gaming","Accessories","TVs"],
  },
  "home---lifestyle": {
    name: "Home & Lifestyle",
    subs: ["Furniture","Kitchen","Bedding","Lighting","Decor","Garden","Storage","Cleaning","Bath","Candles"],
  },
  "medicine": {
    name: "Medicine",
    subs: ["Vitamins","Pain Relief","First Aid","Cold & Flu","Digestive","Skincare Meds","Eye Care","Baby Health","Fitness Supplements","Dental"],
  },
  "sports---outdoor": {
    name: "Sports & Outdoor",
    subs: ["Gym Equipment","Running","Cycling","Swimming","Camping","Hiking","Team Sports","Yoga & Pilates","Water Sports","Winter Sports"],
  },
  "baby-s---toys": {
    name: "Baby's & Toys",
    subs: ["Baby Clothing","Strollers","Toys 0-2 yrs","Toys 3-5 yrs","Toys 6-12 yrs","Board Games","Educational","Outdoor Play","Baby Monitors","Feeding"],
  },
  "groceries---pets": {
    name: "Groceries & Pets",
    subs: ["Fresh Produce","Snacks","Beverages","Dairy","Bakery","Pet Food","Pet Accessories","Organic","Frozen","Condiments"],
  },
  "health---beauty": {
    name: "Health & Beauty",
    subs: ["Skincare","Haircare","Makeup","Fragrances","Nail Care","Oral Care","Men's Grooming","Sunscreen","Body Care","Tools & Devices"],
  },
};

/* ─── Product List Row (for list view) ─── */
const ProductListRow = ({ product }) => {
  const { addToCart } = useCart();
  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex items-center gap-5 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-gray-200 transition-all duration-200"
    >
      <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1 capitalize">{product.category}</p>
        <h3 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-red-500 transition-colors mb-2">
          {product.title}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-3.5 h-3.5 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-gray-400 text-xs ml-1">(65)</span>
        </div>
        <p className="text-xs text-gray-500 line-clamp-1 hidden sm:block">{product.description}</p>
      </div>
      <div className="flex flex-col items-end gap-3 flex-shrink-0 ml-2">
        <span className="text-lg font-bold text-red-500">${Number(product.price).toFixed(2)}</span>
        <button
          onClick={(e) => { e.preventDefault(); addToCart(product); }}
          className="bg-black text-white text-xs px-4 py-2 rounded-lg hover:bg-red-500 transition-colors font-medium whitespace-nowrap"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

/* ─── Category Products Page ─── */
const CategoryProducts = () => {
  const { categorySlug, subSlug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoryName = searchParams.get('name') || 'Category';
  const subName = searchParams.get('sub') || 'All';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 10000]);

  // Get subs for the current category
  const categoryData = useMemo(() => {
    // Try to find by slug
    return CATEGORY_MAP[categorySlug] || { name: categoryName, subs: [] };
  }, [categorySlug, categoryName]);

  useEffect(() => {
    setLoading(true);
    fetchAllProducts().then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, []);

  // Filter products by subcategory keyword search + search term
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const keyword = subName.toLowerCase();
      const titleMatch = p.title.toLowerCase().includes(keyword);
      const catMatch = p.category.toLowerCase().includes(keyword);
      const searchMatch = searchTerm === '' || p.title.toLowerCase().includes(searchTerm.toLowerCase());
      // Also check against general category keywords
      const generalCatKeywords = categoryData.name.toLowerCase().split(/[\s&']+/).filter(w => w.length > 2);
      const generalMatch = generalCatKeywords.some(kw => p.category.toLowerCase().includes(kw) || p.title.toLowerCase().includes(kw));
      return (titleMatch || catMatch || generalMatch) && searchMatch;
    });

    if (sortBy === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'name') result = [...result].sort((a, b) => a.title.localeCompare(b.title));

    return result;
  }, [products, subName, categoryData, searchTerm, sortBy]);

  const buildSubUrl = (sub) => {
    const subSlugNew = encodeURIComponent(sub.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    return `/category/${categorySlug}/${subSlugNew}?name=${encodeURIComponent(categoryData.name)}&sub=${encodeURIComponent(sub)}`;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <button onClick={() => navigate(-1)} className="hover:text-red-500 transition-colors">{categoryData.name}</button>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">{subName}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">

          {/* ── Left Sidebar ── */}
          <aside className="hidden lg:flex flex-col w-60 flex-shrink-0">
            {/* Back button */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 mb-5 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Home
            </button>

            {/* Category Name */}
            <div className="mb-4">
              <h2 className="font-bold text-lg text-gray-900">{categoryData.name}</h2>
              <div className="w-8 h-0.5 bg-red-500 mt-1" />
            </div>

            {/* Subcategory List */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Types</p>
              </div>
              <ul>
                {categoryData.subs.map((sub) => {
                  const isActive = sub === subName;
                  return (
                    <li key={sub} className="border-b border-gray-50 last:border-b-0">
                      <Link
                        to={buildSubUrl(sub)}
                        className={`flex items-center justify-between px-4 py-3 text-sm transition-all duration-150 group ${
                          isActive
                            ? 'bg-red-50 text-red-500 font-semibold'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-red-500'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />}
                          {sub}
                        </span>
                        <ChevronRight
                          size={14}
                          className={`opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Price Filter */}
            <div className="mt-5 bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="font-semibold text-sm text-gray-900 mb-3">Price Range</h3>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>$0</span>
                <span>$1,000+</span>
              </div>
              <input
                type="range"
                min={0}
                max={1000}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full accent-red-500 cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-2 text-right">Up to <span className="font-semibold text-gray-800">${priceRange[1]}</span></p>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-grow min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{subName}</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {loading ? 'Loading…' : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Search */}
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-shadow w-44"
                  />
                </div>

                {/* Sort */}
                <div className="relative flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg bg-white py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent cursor-pointer appearance-none"
                  >
                    <option value="default">Sort: Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name: A–Z</option>
                  </select>
                </div>

                {/* View toggle */}
                <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Category pill nav (mobile) */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-4" style={{ scrollbarWidth: 'none' }}>
              {categoryData.subs.map((sub) => (
                <Link
                  key={sub}
                  to={buildSubUrl(sub)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium border transition-all flex-shrink-0 ${
                    sub === subName
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-500'
                  }`}
                >
                  {sub}
                </Link>
              ))}
            </div>

            {/* Product Grid/List */}
            {loading ? (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-4'
              }>
                {[...Array(8)].map((_, i) =>
                  viewMode === 'grid'
                    ? <div key={i} className="animate-pulse bg-white rounded-xl h-80 border border-gray-100" />
                    : <div key={i} className="animate-pulse bg-white rounded-xl h-28 border border-gray-100" />
                )}
              </div>
            ) : filteredProducts.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredProducts.map((product) => (
                    <ProductListRow key={product.id} product={product} />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 text-gray-400">
                  <Search size={28} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                  We couldn't find products for "{subName}". Try another subcategory.
                </p>
                <Link to="/" className="mt-6 inline-block text-red-500 font-medium hover:text-red-700 transition-colors text-sm">
                  ← Back to Home
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;
