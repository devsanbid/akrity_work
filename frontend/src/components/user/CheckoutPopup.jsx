import React, { useState } from 'react';
import { X, CreditCard, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { orderService } from '../../services/orderService';
import { getBookImageUrl } from '../../utils/imageUtils';

const CheckoutPopup = ({ isOpen, onClose, book, quantity = 1, onOrderSuccess }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = book?.sellingPrice * quantity;
  const deliveryFee = 100;
  const finalAmount = totalAmount + deliveryFee;

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

    setIsProcessing(true);

    try {
      const orderData = {
        bookId: book._id,
        quantity: quantity,
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

      const response = await orderService.createOrder(orderData);
      toast.success('Order placed successfully!');
      onOrderSuccess(response.order);
      onClose();
      
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setCardholderName('');
    } catch (error) {
      console.error('Order creation failed:', error);
      toast.error('Failed to place order. Please try again.');
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
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={`http://localhost:4000${book.images[0].url}`}
                alt={book?.title}
                className="w-16 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{book?.title}</h3>
                <p className="text-sm text-gray-600">{book?.author}</p>
                <p className="text-sm text-gray-500">Quantity: {quantity}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Book Price:</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total:</span>
                <span>₹{finalAmount}</span>
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
                {isProcessing ? 'Processing...' : `Pay ₹${finalAmount}`}
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

export default CheckoutPopup;