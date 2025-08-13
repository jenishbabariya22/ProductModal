import React from 'react';
import { FiHeart } from 'react-icons/fi';

const ProductCard = ({ product, isFavorite, onToggleFavorite, onClick }) => {
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(product.id);
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col h-full border border-gray-100 hover:border-purple-100"
    >
      <div className="relative">
        <div className="p-6 bg-gray-50 flex-1 flex items-center justify-center group-hover:bg-gray-100 transition-colors duration-300">
          <img
            src={product.image}
            alt={product.title}
            className="h-48 w-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full ${isFavorite
            ? 'text-red-500 bg-red-50 hover:bg-red-100'
            : 'text-gray-400 bg-white/80 hover:bg-gray-100 hover:text-red-500'
            } shadow-sm transition-colors duration-200`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FiHeart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {product.rating.rate > 4.5 && (
          <span className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Popular
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 leading-tight">
          {product.title}
        </h3>

        <div className="mt-auto">
          <p className="text-xl font-bold text-gray-900 mb-2">
            ${product.price.toFixed(2)}
            {product.price > 100 && (
              <span className="ml-2 text-xs font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                Free Shipping
              </span>
            )}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center mr-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.round(product.rating.rate)
                      ? 'text-yellow-400'
                      : 'text-gray-200'
                      }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500">
                {product.rating.rate} ({product.rating.count})
              </span>
            </div>

            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
              {product.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
