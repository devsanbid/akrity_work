import React, { useState, useContext } from 'react';
import { X, CreditCard, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { orderService } from '../../services/orderService';
import { cartService } from '../../services/cartService';
import { getBookImageUrl } from '../../utils/imageUtils';
import { AuthContext } from '../../context/AuthContext';

const CartCheckoutPopup = ({ isOpen, onClose, cartItems, total, onOrderComplete }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { user, isLoggedIn } = useContext(AuthContext);

  const deliveryFee = 100;
  const finalAmount = total + deliveryFee;

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    if (value.length <= 19) {
      setCardNumber(value);
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    if (value.length <= 5) {
      setExpiryDate(value);
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      toast.error('Please fill in all card details');
      return;
    }

    // Check authentication before proceeding
    if (!isLoggedIn || !user) {
      toast.error('Please log in to place an order');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication token not found. Please log in again.');
      return;
    }

    console.log('User authenticated:', { userId: user._id, email: user.email });
    console.log('Token exists:', !!token);

    setIsProcessing(true);

    try {
      const orders = [];
      
      for (const item of cartItems) {
        const orderData = {
          bookId: item.book._id,
          quantity: item.quantity,
          paymentMethod: 'online_payment',
          deliveryMethod: 'delivery',
          deliveryAddress: {
            name: cardholderName,
            phone: '1234567890',
            street: 'Default Address',
            city: 'Default City',
            district: 'Default District',
            province: 'Default Province',
            postalCode: '12345'
          },
          notes: `Payment via card ending in ${cardNumber.slice(-4)}`
        };

        try {
          const response = await orderService.createOrder(orderData);
          orders.push(response.order);
        } catch (orderError) {
          console.error('Failed to create order for book:', item.book.title, orderError);
          throw new Error(`Failed to create order for ${item.book.title}: ${orderError.message}`);
        }
      }

      await cartService.clearCart();
      toast.success(`${orders.length} order(s) placed successfully!`);
      onOrderComplete();
      onClose();
      
      if (orders.length === 1) {
        navigate(`/order/${orders[0]._id}`);
      } else {
        navigate('/dashboard?tab=purchases');
      }
      
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setCardholderName('');
    } catch (error) {
      console.error('Order creation failed:', error);
      const errorMessage = error.message || 'Failed to place order. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Checkout</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Order Summary</h3>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.book._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={`http://localhost:4000${item.book.images[0].url}`}
                    alt={item.book.title}
                    className="w-12 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.src = '/placeholder-book.png';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{item.book.title}</h4>
                    <p className="text-xs text-gray-600 truncate">{item.book.author}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.book.sellingPrice}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ₹{(item.book.sellingPrice * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} items):</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total:</span>
                <span>₹{finalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="w-4 h-4 inline mr-2" />
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  CVV
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Processing...' : `Pay ₹${finalAmount.toFixed(2)}`}
              </button>
            </div>
          </form>

          <div className="mt-4 text-xs text-gray-500 text-center">
            <Lock className="w-3 h-3 inline mr-1" />
            Your payment information is secure and encrypted
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCheckoutPopup;