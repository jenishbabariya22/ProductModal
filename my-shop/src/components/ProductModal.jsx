import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar';
import axios from 'axios';
import { FiHeart, FiFilter, FiX, FiStar } from 'react-icons/fi';

const ProductModal = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRes = await axios.get('https://fakestoreapi.com/products');
        setProducts(productsRes.data);
        setFilteredProducts(productsRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRes = await axios.get('https://fakestoreapi.com/products/categories');
        setCategories(['all', ...categoriesRes.data]);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  };

  const handleSearch = (query) => {
    let filtered = [...products];

    if (query) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase()),
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    if (showFavorites) {
      filtered = filtered.filter((product) => favorites.includes(product.id));
    }

    setFilteredProducts(filtered);
  };

  const handleSort = () => {
    const sorted = [...filteredProducts].sort((a, b) => {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    });
    setFilteredProducts(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (loading) {
    return <div className='flex justify-center items-center h-screen'>Loading...</div>;
  }

  if (error) {
    return <div className='text-red-500 text-center p-4'>Error: {error}</div>;
  }

  const displayedProducts = showFavorites
    ? filteredProducts.filter((product) => favorites.includes(product.id))
    : filteredProducts;

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <header className='bg-white shadow-sm sticky top-0 z-10'>
        <div className='container mx-auto px-4 py-4'>
          <h1 className='text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent'>
            StyleHub
          </h1>
          <p className='text-center text-gray-500 mt-1'>Discover Amazing Products</p>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8 '>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
          <div className='w-full md:w-1/3'>
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className='flex flex-wrap gap-3 w-full md:w-auto'>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                let filtered = [...products];
                if (e.target.value !== 'all') {
                  filtered = filtered.filter((p) => p.category === e.target.value);
                }
                setFilteredProducts(filtered);
              }}
              className='px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            <button
              onClick={handleSort}
              className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors'
            >
              <FiFilter className='text-purple-600' />
              Sort: {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
            </button>

            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${showFavorites
                ? 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-purple-500'
                }`}
            >
              <FiHeart className={showFavorites ? 'fill-current' : ''} />
              Favorites ({favorites.length})
            </button>
          </div>
        </div>

        {displayedProducts.length === 0 ? (
          <div className='text-center py-12'>
            <div className='mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
              <FiStar className='text-gray-400 text-3xl' />
            </div>
            <h3 className='text-lg font-medium text-gray-900'>No products found</h3>
            <p className='mt-1 text-gray-500'>
              {showFavorites
                ? "You haven't added any favorites yet."
                : 'Try adjusting your search or filter criteria.'}
            </p>
            {showFavorites && (
              <button
                onClick={() => setShowFavorites(false)}
                className='mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors'
              >
                Browse All Products
              </button>
            )}
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}

        {selectedProduct && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
            <div className='bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col'>
              <div className='flex justify-between items-center p-4 border-b'>
                <h2 className='text-2xl font-bold text-gray-900'>{selectedProduct.title}</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className='p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors'
                >
                  <FiX className='w-6 h-6' />
                </button>
              </div>

              <div className='overflow-y-auto'>
                <div className='flex flex-col md:flex-row'>
                  <div className='md:w-1/2 p-6 flex items-center justify-center bg-gray-50'>
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.title}
                      className='max-h-96 object-contain'
                    />
                  </div>

                  <div className='md:w-1/2 p-6 flex flex-col'>
                    <div className='flex items-center justify-between mb-4'>
                      <span className='text-3xl font-bold text-gray-900'>
                        ${selectedProduct.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => toggleFavorite(selectedProduct.id)}
                        className={`p-2 rounded-full ${favorites.includes(selectedProduct.id)
                          ? 'text-red-500 hover:bg-red-50'
                          : 'text-gray-400 hover:bg-gray-100'
                          } transition-colors`}
                      >
                        <FiHeart
                          className={`w-6 h-6 ${favorites.includes(selectedProduct.id) ? 'fill-current' : ''
                            }`}
                        />
                      </button>
                    </div>

                    <div className='flex items-center gap-2 mb-6'>
                      <div className='flex items-center bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full'>
                        <FiStar className='mr-1 fill-current' />
                        {selectedProduct.rating.rate} ({selectedProduct.rating.count} reviews)
                      </div>
                      <span className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                        {selectedProduct.category}
                      </span>
                    </div>

                    <div className='mb-6'>
                      <h3 className='text-lg font-medium text-gray-900 mb-2'>Description</h3>
                      <p className='text-gray-600'>{selectedProduct.description}</p>
                    </div>

                    <div className='mt-auto pt-6 border-t'>
                      <button className='w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors'>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductModal;
