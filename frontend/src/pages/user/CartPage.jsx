import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, Heart, ArrowLeft, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import CartCheckoutPopup from '../../components/user/CartCheckoutPopup';

import { useAuth } from '../../context/AuthContext';
import { cartService } from '../../services/cartService';
import { wishlistService } from '../../services/wishlistService';
import { getBookImageUrl } from '../../utils/imageUtils';

const CartPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadCart();
  }, [user, navigate]);

  console.log(cartItems)

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCartItems(response.cart || []);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating(prev => ({ ...prev, [bookId]: true }));
      await cartService.updateCartItem(bookId, newQuantity);
      setCartItems(prev => 
        prev.map(item => 
          item.book._id === bookId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      toast.success('Quantity updated');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setUpdating(prev => ({ ...prev, [bookId]: false }));
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      setUpdating(prev => ({ ...prev, [bookId]: true }));
      await cartService.removeFromCart(bookId);
      setCartItems(prev => prev.filter(item => item.book._id !== bookId));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item');
    } finally {
      setUpdating(prev => ({ ...prev, [bookId]: false }));
    }
  };

  const moveToWishlist = async (bookId) => {
    try {
      setUpdating(prev => ({ ...prev, [bookId]: true }));
      await cartService.moveToWishlist(bookId);
      setCartItems(prev => prev.filter(item => item.book._id !== bookId));
      toast.success('Item moved to wishlist');
    } catch (error) {
      console.error('Error moving to wishlist:', error);
      toast.error('Failed to move to wishlist');
    } finally {
      setUpdating(prev => ({ ...prev, [bookId]: false }));
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCartItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.book.sellingPrice * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">
                {cartItems.length === 0 
                  ? 'Your cart is empty' 
                  : `${getTotalItems()} item${getTotalItems() !== 1 ? 's' : ''} in your cart`
                }
              </p>
            </div>
          </div>
          
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any books to your cart yet.</p>
            <button
              onClick={() => navigate('/browse')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Cart Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.book._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex space-x-4">
                    {/* Book Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={`http://localhost:4000${item.book.images[0].url}`}
                        alt={item.book.title}
                        className="w-24 h-32 object-cover rounded-lg"
                      />
                    </div>
                    
                    {/* Book Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.book.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-1">By {item.book.author}</p>
                          <p className="text-gray-500 text-xs mb-2">{item.book.category}</p>
                          <p className="text-gray-500 text-xs">Condition: {item.book.condition}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">₹{item.book.sellingPrice}</p>
                          {item.book.originalPrice && item.book.originalPrice > item.book.sellingPrice && (
                            <p className="text-sm text-gray-500 line-through">₹{item.book.originalPrice}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Quantity and Actions */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">Quantity:</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.book._id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updating[item.book._id]}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.book._id, item.quantity + 1)}
                              disabled={updating[item.book._id]}
                              className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => moveToWishlist(item.book._id)}
                            disabled={updating[item.book._id]}
                            className="p-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Move to Wishlist"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.book._id)}
                            disabled={updating[item.book._id]}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Remove from Cart"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Subtotal */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Subtotal:</span>
                          <span className="font-semibold text-gray-900">
                            ₹{(item.book.sellingPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({getTotalItems()}):</span>
                    <span className="font-medium">₹{calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-lg font-bold text-gray-900">₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Proceed to Checkout</span>
                </button>
                
                <button
                  onClick={() => navigate('/browse')}
                  className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Checkout Popup */}
       {showCheckout && (
         <CartCheckoutPopup
           isOpen={showCheckout}
           onClose={() => setShowCheckout(false)}
           cartItems={cartItems}
           total={calculateTotal()}
           onOrderComplete={() => {
             setCartItems([]);
             setShowCheckout(false);
           }}
         />
       )}
      
      <Footer />
    </div>
  );
};

export default CartPage;