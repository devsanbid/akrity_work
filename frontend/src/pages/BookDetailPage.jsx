import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, MapPin, User, Calendar, BookOpen, ArrowLeft, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CheckoutPopup from '../components/user/CheckoutPopup';
import { useAuth } from '../context/AuthContext';
import { bookService } from '../services/bookService';
import { wishlistService } from '../services/wishlistService';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (id) {
      loadBookDetails();
      if (user) {
        checkWishlistStatus();
        checkCartStatus();
      }
    }
  }, [id, user]);

  const loadBookDetails = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBookDetails(id);
      setBook(response.data);
    } catch (error) {
      console.error('Error loading book details:', error);
      toast.error('Failed to load book details');
      navigate('/browse');
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await wishlistService.getWishlist();
      const wishlistItems = response.data?.items || [];
      setIsInWishlist(wishlistItems.some(item => item._id === id));
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const checkCartStatus = async () => {
    try {
      const response = await cartService.getCart();
      const cartItems = response.data?.items || [];
      setIsInCart(cartItems.some(item => item.book._id === id));
    } catch (error) {
      console.error('Error checking cart status:', error);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }

    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(id);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await wishlistService.addToWishlist(id);
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await cartService.addToCart(id, quantity);
      setIsInCart(true);
      toast.success(`Added ${quantity} item(s) to cart`);
      // Navigate to cart page after successful addition
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please login to purchase books');
      navigate('/login');
      return;
    }
    setShowCheckout(true);
  };

  const handleOrderSuccess = (order) => {
    navigate(`/order/${order._id}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Check out this book: ${book.title} by ${book.author}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Book not found</h2>
          <button
            onClick={() => navigate('/browse')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Books
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = book.images || ['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=book%20cover%20placeholder&image_size=portrait_4_3'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-w-3 aspect-h-4">
                <img
                  src={images[selectedImage]}
                  alt={book.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-24 rounded-md overflow-hidden border-2 ${
                        selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${book.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Book Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(book.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 ml-2">({book.reviews || 0} reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-b border-gray-200 py-4">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-green-600">₹{book.sellingPrice}</span>
                  {book.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">₹{book.originalPrice}</span>
                  )}
                  {book.originalPrice && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                      {Math.round(((book.originalPrice - book.sellingPrice) / book.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Book Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>Condition: {book.condition}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Published: {book.publishedYear}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>Seller: {book.seller?.name || 'Unknown'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Location: {book.seller?.location || 'Not specified'}</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-gray-600 hover:text-gray-900"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-l border-r border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:text-gray-900"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={isInCart}
                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                      isInCart
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5 inline mr-2" />
                    {isInCart ? 'In Cart' : 'Add to Cart'}
                  </button>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToWishlist}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                      isInWishlist
                        ? 'bg-pink-50 border-pink-300 text-pink-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 inline mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
                    {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="w-4 h-4 inline mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {book.description && (
            <div className="border-t border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>
          )}

          {/* Additional Details */}
          <div className="border-t border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Book Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {book.isbn && (
                <div>
                  <span className="font-medium text-gray-700">ISBN:</span>
                  <span className="ml-2 text-gray-600">{book.isbn}</span>
                </div>
              )}
              {book.language && (
                <div>
                  <span className="font-medium text-gray-700">Language:</span>
                  <span className="ml-2 text-gray-600">{book.language}</span>
                </div>
              )}
              {book.pages && (
                <div>
                  <span className="font-medium text-gray-700">Pages:</span>
                  <span className="ml-2 text-gray-600">{book.pages}</span>
                </div>
              )}
              {book.category && (
                <div>
                  <span className="font-medium text-gray-700">Category:</span>
                  <span className="ml-2 text-gray-600 capitalize">{book.category}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      
      {showCheckout && (
         <CheckoutPopup
           isOpen={showCheckout}
           book={book}
           quantity={quantity}
           onClose={() => setShowCheckout(false)}
           onOrderSuccess={handleOrderSuccess}
         />
       )}
    </div>
  );
};

export default BookDetailPage;