import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchAllProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Filter, Search, X } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial values from URL
  const urlCategory = searchParams.get('category') || '';
  const urlSearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeKeyword, setActiveKeyword] = useState(urlCategory);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const allProducts = await fetchAllProducts();
      setProducts(allProducts);
      setLoading(false);
    };
    loadProducts();
  }, []);

  // Sync URL params when they change externally (e.g. navigating from category cards)
  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    setActiveKeyword(cat);
    setSearchTerm(search);
  }, [searchParams]);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || product.title.toLowerCase().includes(searchTerm.toLowerCase()) || product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    // Keyword filter (from Browse By Category or URL)
    const matchesKeyword = activeKeyword === '' ||
      product.category.toLowerCase().includes(activeKeyword.toLowerCase()) ||
      product.title.toLowerCase().includes(activeKeyword.toLowerCase());

    return matchesSearch && matchesCategory && matchesKeyword;
  });

  const clearKeyword = () => {
    setActiveKeyword('');
    // Remove category from URL without losing other params
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('category');
    setSearchParams(newParams, { replace: true });
  };

  const clearSearch = () => {
    setSearchTerm('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams, { replace: true });
  };

  // Pretty label for the active keyword
  const keywordLabels = {
    smartphones: 'Phones',
    laptops: 'Computers',
    watches: 'SmartWatch',
    camera: 'Camera',
    headphones: 'HeadPhones',
    gaming: 'Gaming',
    accessories: 'Accessories',
    tablets: 'Tablets',
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {activeKeyword
                ? `${keywordLabels[activeKeyword] || activeKeyword.charAt(0).toUpperCase() + activeKeyword.slice(1)}`
                : 'Shop All Products'}
            </h1>
            <p className="text-gray-500">Showing {filteredProducts.length} results</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-grow sm:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Filter size={18} />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-10 py-2.5 w-full sm:w-auto border border-gray-200 rounded-xl bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent cursor-pointer capitalize"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(activeKeyword || searchTerm) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Active filters:</span>
            {activeKeyword && (
              <button
                onClick={clearKeyword}
                className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-red-600 transition-colors"
              >
                Category: {keywordLabels[activeKeyword] || activeKeyword}
                <X size={12} />
              </button>
            )}
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="inline-flex items-center gap-1.5 bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors"
              >
                Search: "{searchTerm}"
                <X size={12} />
              </button>
            )}
            <button
              onClick={() => { clearKeyword(); clearSearch(); setSelectedCategory('All'); }}
              className="text-xs text-gray-500 hover:text-red-500 underline transition-colors ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl h-[400px] border border-gray-100"></div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 text-gray-400">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">
              {activeKeyword
                ? `We couldn't find products matching "${keywordLabels[activeKeyword] || activeKeyword}".`
                : `We couldn't find anything matching "${searchTerm}". Try adjusting your filters.`
              }
            </p>
            <button 
              onClick={() => { clearKeyword(); clearSearch(); setSelectedCategory('All'); }}
              className="mt-6 text-blue-600 font-medium hover:text-blue-800 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
