import React from 'react';
import { getBookImageUrl } from '../../utils/imageUtils';

const BookCard = ({ book, isLoggedIn, onViewDetails, onAddToWishlist, onAddToCart }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
    <div className="relative">
      <img
        src={getBookImageUrl(book)}
        alt={book.title}
        className="w-full h-60 object-cover rounded-t-lg"
      />
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-gray-800 mb-2 text-lg leading-tight">{book.title}</h3>
      <p className="text-gray-600 text-sm mb-3">By {book.author}</p>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-gray-900">Rs{book.price}.00</span>
          <span className="text-sm text-gray-500 line-through">Rs{book.originalPrice}.00</span>
        </div>
      </div>
      <button
        onClick={() => onViewDetails(book)}
        className="w-full bg-white border-2 border-gray-800 text-gray-800 py-2 px-4 rounded-md font-medium hover:bg-gray-800 hover:text-white transition-colors duration-200 mb-2"
      >
        View Details
      </button>
      {isLoggedIn && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onAddToWishlist(book)}
            className="flex-1 bg-pink-100 text-pink-700 border border-pink-200 py-2 rounded hover:bg-pink-200"
          >
            Wishlist
          </button>
          <button
            onClick={() => onAddToCart(book)}
            className="flex-1 bg-blue-100 text-blue-700 border border-blue-200 py-2 rounded hover:bg-blue-200"
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  </div>
);

export default BookCard;
