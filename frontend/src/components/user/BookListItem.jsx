import React from 'react';
import { getBookImageUrl } from '../../utils/imageUtils';

const BookListItem = ({ book, isLoggedIn, onViewDetails, onAddToWishlist, onAddToCart }) => (
  <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 border border-gray-200">
    <div className="flex space-x-4">
      <div className="relative">
        <img
          src={getBookImageUrl(book)}
          alt={book.title}
          className="w-24 h-32 object-cover rounded-md"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{book.title}</h3>
            <p className="text-gray-600 text-sm">By {book.author}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">Rs{book.price}.00</div>
            <div className="text-sm text-gray-500 line-through">Rs{book.originalPrice}.00</div>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4">{book.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {book.category}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onViewDetails(book)}
              className="bg-white border-2 border-gray-800 text-gray-800 px-6 py-2 rounded-md font-medium hover:bg-gray-800 hover:text-white transition-colors duration-200"
            >
              View Details
            </button>
            {isLoggedIn && (
              <>
                <button
                  onClick={() => onAddToWishlist(book)}
                  className="bg-pink-100 text-pink-700 border border-pink-200 px-3 py-2 rounded hover:bg-pink-200"
                >
                  Wishlist
                </button>
                <button
                  onClick={() => onAddToCart(book)}
                  className="bg-blue-100 text-blue-700 border border-blue-200 px-3 py-2 rounded hover:bg-blue-200"
                >
                  Add to Cart
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default BookListItem;
