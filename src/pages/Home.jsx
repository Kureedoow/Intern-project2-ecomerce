import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Truck, ShieldCheck, Headphones, ChevronRight, ChevronDown } from 'lucide-react';
import { fetchAllProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

/* ─── Category Data ─── */
const CATEGORIES = [
  {
    name: "Woman's Fashion",
    subs: ["Dresses", "Tops & Blouses", "Jeans & Pants", "Skirts", "Outerwear", "Swimwear", "Lingerie", "Shoes & Heels", "Bags & Purses", "Accessories"],
  },
  {
    name: "Men's Fashion",
    subs: ["T-Shirts & Shirts", "Jeans & Trousers", "Suits & Blazers", "Sportswear", "Outerwear", "Underwear", "Shoes", "Watches", "Bags", "Accessories"],
  },
  {
    name: "Electronics",
    subs: ["Smartphones", "Laptops", "Tablets", "Cameras", "Headphones", "Speakers", "Smart Watches", "Gaming", "Accessories", "TVs"],
  },
  {
    name: "Home & Lifestyle",
    subs: ["Furniture", "Kitchen", "Bedding", "Lighting", "Decor", "Garden", "Storage", "Cleaning", "Bath", "Candles"],
  },
  {
    name: "Medicine",
    subs: ["Vitamins", "Pain Relief", "First Aid", "Cold & Flu", "Digestive", "Skincare Meds", "Eye Care", "Baby Health", "Fitness Supplements", "Dental"],
  },
  {
    name: "Sports & Outdoor",
    subs: ["Gym Equipment", "Running", "Cycling", "Swimming", "Camping", "Hiking", "Team Sports", "Yoga & Pilates", "Water Sports", "Winter Sports"],
  },
  {
    name: "Baby's & Toys",
    subs: ["Baby Clothing", "Strollers", "Toys 0-2 yrs", "Toys 3-5 yrs", "Toys 6-12 yrs", "Board Games", "Educational", "Outdoor Play", "Baby Monitors", "Feeding"],
  },
  {
    name: "Groceries & Pets",
    subs: ["Fresh Produce", "Snacks", "Beverages", "Dairy", "Bakery", "Pet Food", "Pet Accessories", "Organic", "Frozen", "Condiments"],
  },
  {
    name: "Health & Beauty",
    subs: ["Skincare", "Haircare", "Makeup", "Fragrances", "Nail Care", "Oral Care", "Men's Grooming", "Sunscreen", "Body Care", "Tools & Devices"],
  },
];

/* ─── Sidebar Category Item ─── */
const SidebarCategory = ({ cat, isOpen, onToggle }) => {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center py-3 px-1 text-sm font-medium text-gray-800 hover:text-red-500 transition-colors group"
      >
        <span>{cat.name}</span>
        <span className={`transition-transform duration-200 text-gray-400 group-hover:text-red-500 ${isOpen ? 'rotate-90' : ''}`}>
          <ChevronRight size={14} />
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? `${cat.subs.length * 36}px` : '0px' }}
      >
        <ul className="pb-2 pl-3">
          {cat.subs.map((sub) => (
            <SidebarSubItem key={sub} sub={sub} parentCategory={cat.name} />
          ))}
        </ul>
      </div>
    </div>
  );
};

/* ─── Sidebar Sub Item ─── */
const SidebarSubItem = ({ sub, parentCategory }) => {
  const navigate = useNavigate();
  const slug = encodeURIComponent(parentCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
  const subSlug = encodeURIComponent(sub.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

  return (
    <li>
      <button
        onClick={() => navigate(`/category/${slug}/${subSlug}?name=${encodeURIComponent(parentCategory)}&sub=${encodeURIComponent(sub)}`)}
        className="flex items-center gap-1.5 w-full text-left text-xs text-gray-600 hover:text-red-500 py-1.5 transition-colors group"
      >
        <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-red-400 flex-shrink-0 transition-colors" />
        {sub}
      </button>
    </li>
  );
};

/* ─── Section Label ─── */
const SectionHeader = ({ subtitle, title }) => (
  <div className="mb-6">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-5 h-10 bg-primary rounded-sm" />
      <span className="text-primary font-bold text-base">{subtitle}</span>
    </div>
    <h2 className="text-3xl font-semibold tracking-wide text-black">{title}</h2>
  </div>
);

/* ─── Custom Scroll Slider ─── */
const CardSlider = ({ children, itemWidth = 280 }) => {
  const ref = useRef(null);
  const scroll = (dir) => {
    if (ref.current) ref.current.scrollBy({ left: dir * (itemWidth + 24), behavior: 'smooth' });
  };
  return (
    <div className="relative">
      {/* Arrows */}
      <button
        onClick={() => scroll(-1)}
        className="absolute -top-14 right-14 z-10 w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-gray-200 transition-colors"
      >
        <ArrowLeft size={18} />
      </button>
      <button
        onClick={() => scroll(1)}
        className="absolute -top-14 right-2 z-10 w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-gray-200 transition-colors"
      >
        <ArrowRight size={18} />
      </button>

      {/* Track */}
      <div
        ref={ref}
        className="flex gap-6 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {React.Children.map(children, (child) => (
          <div className="flex-shrink-0 snap-start" style={{ width: itemWidth }}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Home ─── */
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCategory, setOpenCategory] = useState(null);

  useEffect(() => {
    fetchAllProducts().then((p) => { setProducts(p); setLoading(false); });
  }, []);

  const handleCategoryToggle = (catName) => {
    setOpenCategory((prev) => (prev === catName ? null : catName));
  };

  const SkeletonCard = () => (
    <div className="flex-shrink-0 w-[270px] h-80 bg-gray-100 animate-pulse rounded" />
  );

  return (
    <div className="bg-white min-h-screen pb-10 overflow-x-hidden">

      {/* ── Hero Section ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 mb-24">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:flex flex-col w-60 border-r border-gray-200 pr-4 flex-shrink-0" style={{ maxHeight: '440px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
            {CATEGORIES.map((cat) => (
              <SidebarCategory
                key={cat.name}
                cat={cat}
                isOpen={openCategory === cat.name}
                onToggle={() => handleCategoryToggle(cat.name)}
              />
            ))}
          </div>

          {/* Hero Banner */}
          <div className="flex-1 bg-black text-white p-10 lg:p-16 flex items-center justify-between overflow-hidden rounded">
            <div className="max-w-xs z-10">
              <div className="flex items-center gap-3 mb-5 text-sm text-gray-300">
                <span className="text-xl">🍎</span>
                iPhone 14 Series
              </div>
              <h1 className="text-4xl lg:text-5xl font-semibold leading-tight mb-8">
                Up to 10%<br/>off Voucher
              </h1>
              <Link to="/products" className="inline-flex items-center gap-2 border-b border-white pb-1 text-sm hover:text-gray-300 transition-colors">
                Shop Now <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=280&auto=format"
                alt="iPhone"
                className="w-48 h-48 object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Flash Sales ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 border-b border-gray-200 pb-16">
        <div className="flex flex-wrap items-end gap-10 mb-10 relative">
          <SectionHeader subtitle="Today's" title="Flash Sales" />
          {/* Countdown */}
          <div className="flex items-center gap-3 mb-1 text-black">
            {[['Days','03'],['Hours','23'],['Minutes','19'],['Seconds','56']].map(([label, val], i) => (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-semibold">{label}</span>
                  <span className="text-3xl font-bold">{val}</span>
                </div>
                {i < 3 && <span className="text-primary text-2xl font-bold pb-2">:</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <CardSlider itemWidth={270}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} discount={40} />
            ))}
          </CardSlider>
        )}

        <div className="mt-12 text-center">
          <Link to="/products" className="bg-primary text-white px-12 py-4 rounded font-medium hover:bg-red-600 transition-colors inline-block">
            View All Products
          </Link>
        </div>
      </section>

      {/* ── Browse By Category ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 border-b border-gray-200 pb-16">
        <div className="mb-10 relative">
          <SectionHeader subtitle="Categories" title="Browse By Category" />
        </div>
        <CardSlider itemWidth={170}>
          {[
            { name: 'Phones', icon: '📱', keyword: 'smartphones' },
            { name: 'Computers', icon: '💻', keyword: 'laptops' },
            { name: 'SmartWatch', icon: '⌚', keyword: 'watches' },
            { name: 'Camera', icon: '📷', keyword: 'camera' },
            { name: 'HeadPhones', icon: '🎧', keyword: 'headphones' },
            { name: 'Gaming', icon: '🎮', keyword: 'gaming' },
            { name: 'Accessories', icon: '🔌', keyword: 'accessories' },
            { name: 'Tablets', icon: '📟', keyword: 'tablets' },
          ].map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.keyword)}`}
              className="border border-gray-300 rounded flex flex-col items-center justify-center py-8 gap-3 cursor-pointer hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 select-none"
            >
              <span className="text-4xl">{cat.icon}</span>
              <span className="font-medium text-sm">{cat.name}</span>
            </Link>
          ))}
        </CardSlider>
      </section>

      {/* ── Best Selling Products ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="flex items-end justify-between mb-10">
          <SectionHeader subtitle="This Month" title="Best Selling Products" />
          <Link to="/products" className="bg-primary text-white px-10 py-3 rounded font-medium hover:bg-red-600 transition-colors mb-1">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {loading
            ? [...Array(4)].map((_, i) => <div key={i} className="h-80 bg-gray-100 animate-pulse rounded" />)
            : products.slice(4, 8).map((p) => <ProductCard key={p.id} product={p} />)
          }
        </div>
      </section>

      {/* ── Promo Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-black text-white p-12 md:p-16 flex flex-col md:flex-row items-center justify-between rounded">
          <div className="mb-10 md:mb-0">
            <span className="text-[#00FF66] font-semibold mb-5 block">Categories</span>
            <h2 className="text-4xl lg:text-5xl leading-tight font-semibold mb-8 max-w-sm">
              Enhance Your Music Experience
            </h2>
            <div className="flex gap-4 mb-10">
              {[['23','Hours'],['05','Days'],['59','Minutes'],['35','Seconds']].map(([val, label]) => (
                <div key={label} className="w-16 h-16 bg-white text-black rounded-full flex flex-col items-center justify-center">
                  <span className="font-bold text-sm">{val}</span>
                  <span className="text-[9px]">{label}</span>
                </div>
              ))}
            </div>
            <button className="bg-[#00FF66] text-white px-10 py-4 rounded font-medium hover:bg-green-500 transition-colors">
              Buy Now!
            </button>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format"
              alt="Headphones"
              className="w-64 h-64 object-contain drop-shadow-[0_0_60px_rgba(255,255,255,0.3)]"
            />
          </div>
        </div>
      </section>

      {/* ── Explore Our Products ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="mb-10 relative">
          <SectionHeader subtitle="Our Products" title="Explore Our Products" />
        </div>
        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <CardSlider itemWidth={270}>
            {products.slice(0, 12).map((p) => (
              <ProductCard key={`exp-${p.id}`} product={p} isNew={p.id % 3 === 0} />
            ))}
          </CardSlider>
        )}
        <div className="mt-12 text-center">
          <Link to="/products" className="bg-primary text-white px-12 py-4 rounded font-medium hover:bg-red-600 transition-colors inline-block">
            View All Products
          </Link>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {[
            { icon: <Truck size={24} />, title: 'FREE AND FAST DELIVERY', desc: 'Free delivery for all orders over $140' },
            { icon: <Headphones size={24} />, title: '24/7 CUSTOMER SERVICE', desc: 'Friendly 24/7 customer support' },
            { icon: <ShieldCheck size={24} />, title: 'MONEY BACK GUARANTEE', desc: 'We return money within 30 days' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mb-6">
                <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center border-4 border-gray-300">
                  {icon}
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
