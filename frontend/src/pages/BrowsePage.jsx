import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Grid, List, Heart, ShoppingCart, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from "../components/common/Navbar.jsx";
import Footer from "../components/common/Footer.jsx";
import { useAuth } from '../context/AuthContext.jsx';
import { bookService } from '../services/bookService.js';
import { wishlistService } from '../services/wishlistService';
import { cartService } from '../services/cartService';
import { getBookImageUrl } from '../utils/imageUtils';


const BrowsePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  

  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Test backend connectivity
    const testBackendConnection = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/health');
        console.log('Backend health check response:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Backend health data:', data);
        }
      } catch (error) {
        console.error('Backend connection failed:', error);
      }
    };
    
    testBackendConnection();
    fetchBooks();
    if (user) {
      loadWishlist();
      loadCart();
    }
  }, [user, currentPage, searchTerm, selectedCategory, priceRange, sortBy]);

  // Fetch books from API
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: 12
      };
      
      if (searchTerm && searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      
      // Add sorting parameter
      if (sortBy && sortBy !== 'newest') {
        const sortMapping = {
          'price-low': 'price_low',
          'price-high': 'price_high',
          'rating': 'popular',
          'newest': 'newest'
        };
        params.sortBy = sortMapping[sortBy] || 'newest';
      }
      
      // Add price range filter
      if (priceRange && Array.isArray(priceRange)) {
        params.minPrice = priceRange[0];
        params.maxPrice = priceRange[1];
      }
      
      const response = await bookService.getAllBooks(params);
      
      setBooks(response.books || []);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.message || 'Failed to fetch books');
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };





  const loadWishlist = async () => {
    try {
      const response = await wishlistService.getWishlist();
      setWishlistItems(response.data?.items || []);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const loadCart = async () => {
    try {
      const response = await cartService.getCart();
      setCartItems(response.data?.items || []);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  // Default categories fallback
  const defaultCategories = [
    'All Categories', 'Academic', 'Fiction', 'Non-Fiction', 'Self-Help',
    'Biography', 'Science', 'History', 'Romance', 'Mystery', 'Fantasy', 'Comics', 'Children', 'Reference', 'Textbook', 'Professional', 'Religious'
  ];

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-low' },
    { label: 'Price: High to Low', value: 'price-high' },
    { label: 'Highest Rated', value: 'rating' }
  ];



  // Filter and sort books
  const sortedBooks = useMemo(() => {
    let filtered = books;
    return filtered;
  }, [books]);

  // Real handlers for wishlist and cart actions
  const handleAddToWishlist = async (book) => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }
    
    try {
      const bookId = book._id || book.id;
      await wishlistService.addToWishlist(bookId);
      setWishlistItems(prev => [...prev, book]);
      toast.success(`${book.title} added to wishlist`);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };
  
  const handleAddToCart = async (book) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    
    try {
      const bookId = book._id || book.id;
      await cartService.addToCart(bookId, 1);
      setCartItems(prev => [...prev, { ...book, quantity: 1 }]);
      toast.success(`${book.title} added to cart`);
      // Navigate to cart page after successful addition
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  console.log("sortedBookes",sortedBooks)
  
  const isInWishlist = (bookId) => {
    return wishlistItems.some(item => (item._id || item.id) === bookId);
  };
  
  const isInCart = (bookId) => {
    return cartItems.some(item => (item._id || item.id || item.book?._id || item.book?.id) === bookId);
  };

  const handleViewDetails = (book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  // BookCard component
  const BookCard = ({ book }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <div className="relative">
           <img
             src={getBookImageUrl(book)}
             alt={book.title}
             className="w-full h-60 object-cover rounded-t-lg"
             onError={(e) => {
               e.target.src = '/placeholder-book.png';
             }}
           />
         </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 text-lg leading-tight">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-2">By {book.author}</p>
        <p className="text-gray-500 text-xs mb-3">{book.category}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900">₹{book.sellingPrice || book.price}</span>
            {book.originalPrice && book.originalPrice > (book.sellingPrice || book.price) && (
              <span className="text-sm text-gray-500 line-through">₹{book.originalPrice}</span>
            )}
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {book.condition}
          </span>
        </div>
        <button
          onClick={() => navigate(`/book/${book._id || book.id}`)}
          className="w-full bg-white border-2 border-gray-800 text-gray-800 py-2 px-4 rounded-md font-medium hover:bg-gray-800 hover:text-white transition-colors duration-200 mb-2"
        >
          View Details
        </button>
        {user && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleAddToWishlist(book)}
              disabled={isInWishlist(book._id || book.id)}
              className={`flex-1 py-2 rounded transition ${
                isInWishlist(book._id || book.id)
                  ? 'bg-pink-200 text-pink-800 border border-pink-300 cursor-not-allowed'
                  : 'bg-pink-100 text-pink-700 border border-pink-200 hover:bg-pink-200'
              }`}
            >
              <Heart className="w-4 h-4 inline mr-1" />
              {isInWishlist(book._id || book.id) ? 'In Wishlist' : 'Wishlist'}
            </button>
            <button
              onClick={() => handleAddToCart(book)}
              disabled={isInCart(book._id || book.id)}
              className={`flex-1 py-2 rounded transition ${
                isInCart(book._id || book.id)
                  ? 'bg-blue-200 text-blue-800 border border-blue-300 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200'
              }`}
            >
              <ShoppingCart className="w-4 h-4 inline mr-1" />
              {isInCart(book._id || book.id) ? 'In Cart' : 'Add to Cart'}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // BookListItem component
  const BookListItem = ({ book }) => (
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
              <div className="text-xl font-bold text-gray-900">Rs{book.sellingPrice || book.price}.00</div>
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
                onClick={() => navigate(`/book/${book._id || book.id}`)}
                className="bg-white border-2 border-gray-800 text-gray-800 px-6 py-2 rounded-md font-medium hover:bg-gray-800 hover:text-white transition-colors duration-200"
              >
                View Details
              </button>
              {user && (
                <>
                  <button
                    onClick={() => handleAddToWishlist(book)}
                    disabled={isInWishlist(book._id || book.id)}
                    className={`px-3 py-2 rounded transition ${
                      isInWishlist(book._id || book.id)
                        ? 'bg-pink-200 text-pink-800 border border-pink-300 cursor-not-allowed'
                        : 'bg-pink-100 text-pink-700 border border-pink-200 hover:bg-pink-200'
                    }`}
                  >
                    <Heart className="w-4 h-4 inline mr-1" />
                    {isInWishlist(book._id || book.id) ? 'In Wishlist' : 'Wishlist'}
                  </button>
                  <button
                    onClick={() => handleAddToCart(book)}
                    disabled={isInCart(book._id || book.id)}
                    className={`px-3 py-2 rounded transition ${
                      isInCart(book._id || book.id)
                        ? 'bg-blue-200 text-blue-800 border border-blue-300 cursor-not-allowed'
                        : 'bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4 inline mr-1" />
                    {isInCart(book._id || book.id) ? 'In Cart' : 'Add to Cart'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading books...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchBooks}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Browse Books</h1>
          <p className="text-gray-600 mt-2">Discover quality approved secondhand books at great prices</p>
        </div>
      </header>

      {/* Search and Filters */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search books, authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {defaultCategories.map((category, index) => (
                  <option key={index} value={index === 0 ? 'all' : category.toLowerCase()}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                  </label>
                  <div className="px-3">
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>₹0</span>
                      <span>₹2000+</span>
                    </div>
                  </div>
                </div>
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {sortedBooks.length} Books Found
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              <span>Sort by: Featured</span>
            </div>
          </div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedBooks.map((book) => (
                <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-w-3 aspect-h-4">
                    <img
                      src={`http://localhost:4000${book.images[0].url}`}
                      alt={book.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-lg line-clamp-2 flex-1 pr-2">{book.title}</h3>
                      {user && (
                        <button
                          onClick={() => handleAddToWishlist(book)}
                          className={`flex-shrink-0 p-1 rounded-full transition-colors ${
                            isInWishlist(book._id)
                              ? 'text-red-500 hover:text-red-600'
                              : 'text-gray-400 hover:text-red-500'
                          }`}
                          title={isInWishlist(book._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <Heart className={`w-5 h-5 ${isInWishlist(book._id) ? 'fill-current' : ''}`} />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{book.author}</p>
                    <p className="text-gray-500 text-xs mb-2">{book.category}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-green-600">₹{book.sellingPrice}</span>
                        {book.originalPrice && book.originalPrice > book.sellingPrice && (
                          <span className="text-sm text-gray-500 line-through">₹{book.originalPrice}</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {book.condition}
                      </span>
                    </div>
                    {user && (
                      <button
                        onClick={() => handleAddToCart(book)}
                        disabled={isInCart(book._id)}
                        className={`w-full flex items-center justify-center py-2.5 px-4 rounded-lg font-medium transition-colors mb-2 ${
                          isInCart(book._id)
                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                            : 'bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {isInCart(book._id) ? 'Already in Cart' : 'Add to Cart'}
                      </button>
                    )}
                    <button 
                      onClick={() => handleViewDetails(book)}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
               <div className="space-y-4">
                 {sortedBooks.map((book) => (
                   <div key={book._id} className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-6">
                     <img
                       src={book.images && book.images.length > 0 ? book.images[0] : '/placeholder-book.png'}
                       alt={book.title}
                       className="w-24 h-32 object-cover rounded"
                       onError={(e) => {
                         e.target.src = '/placeholder-book.png';
                       }}
                     />
                     <div className="flex-1">
                       <div className="flex items-start justify-between mb-2">
                         <h3 className="font-semibold text-xl flex-1 pr-3">{book.title}</h3>
                         {user && (
                           <button
                             onClick={() => handleAddToWishlist(book)}
                             className={`flex-shrink-0 p-1 rounded-full transition-colors ${
                               isInWishlist(book._id)
                                 ? 'text-red-500 hover:text-red-600'
                                 : 'text-gray-400 hover:text-red-500'
                             }`}
                             title={isInWishlist(book._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                           >
                             <Heart className={`w-6 h-6 ${isInWishlist(book._id) ? 'fill-current' : ''}`} />
                           </button>
                         )}
                       </div>
                       <p className="text-gray-600 mb-2">By {book.author}</p>
                       <p className="text-gray-500 text-sm mb-1">{book.category} • {book.condition}</p>
                       <p className="text-gray-500 text-sm mb-3 line-clamp-2">{book.description}</p>
                       <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center space-x-2">
                           <span className="text-2xl font-bold text-green-600">₹{book.sellingPrice}</span>
                           {book.originalPrice && book.originalPrice > book.sellingPrice && (
                             <span className="text-lg text-gray-500 line-through">₹{book.originalPrice}</span>
                           )}
                         </div>
                         <span className="text-sm text-gray-500">
                           Seller: {book.seller?.name || 'Unknown'}
                         </span>
                       </div>
                     </div>
                     <div className="flex flex-col space-y-2 min-w-[200px]">
                       {user && (
                         <button
                           onClick={() => handleAddToCart(book)}
                           disabled={isInCart(book._id)}
                           className={`flex items-center justify-center py-2.5 px-4 rounded-lg font-medium transition-colors ${
                             isInCart(book._id)
                               ? 'bg-green-100 text-green-700 cursor-not-allowed'
                               : 'bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700'
                           }`}
                         >
                           <ShoppingCart className="w-4 h-4 mr-2" />
                           {isInCart(book._id) ? 'Already in Cart' : 'Add to Cart'}
                         </button>
                       )}
                       <button 
                         onClick={() => handleViewDetails(book)}
                         className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                       >
                         View Details
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          {sortedBooks.length === 0 && !loading && (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No approved books found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or browse all categories</p>
              <p className="text-gray-400 text-sm mt-2">All books are reviewed for quality before being listed.</p>
            </div>
          )}
          
          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, currentPage - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg ${
                        pageNum === currentPage
                          ? 'bg-yellow-500 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                  disabled={currentPage === pagination.totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="mt-4 text-center text-gray-600 text-sm">
                Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, pagination.totalBooks)} of {pagination.totalBooks} books
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Book Details Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Book Details</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <img
                    src={selectedBook.images && selectedBook.images.length > 0 ? selectedBook.images[0] : '/placeholder-book.png'}
                    alt={selectedBook.title}
                    className="w-full h-auto rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.src = '/placeholder-book.png';
                    }}
                  />
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{selectedBook.title}</h3>
                  <p className="text-gray-600 mb-4">By {selectedBook.author}</p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-20">Price:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">₹{selectedBook.sellingPrice}</span>
                        {selectedBook.originalPrice && selectedBook.originalPrice > selectedBook.sellingPrice && (
                          <span className="text-lg text-gray-500 line-through">₹{selectedBook.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-20">Category:</span>
                      <span className="text-gray-600">{selectedBook.category}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-20">Condition:</span>
                      <span className="text-gray-600">{selectedBook.condition}</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-2">Description:</h4>
                    <p className="text-gray-600 leading-relaxed">{selectedBook.description}</p>
                  </div>
                  <div className="flex justify-center">
                    <button className="w-full bg-gray-800 text-white py-3 px-6 rounded-md font-medium hover:bg-gray-700 transition-colors duration-200">
                      Contact Seller
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BrowsePage;
