import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import { toast } from 'sonner';

const OrderTest = ({ bookId = '6751b5b8b6b8b8b8b8b8b8b8' }) => {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const testOrderCreation = async () => {
    if (!isLoggedIn || !user) {
      toast.error('Please log in first');
      return;
    }

    setTesting(true);
    setResult(null);

    try {
      const orderData = {
        bookId: bookId,
        quantity: 1,
        paymentMethod: 'online_payment',
        deliveryMethod: 'delivery',
        notes: 'Test order'
      };

      console.log('Testing order creation with:', orderData);
      const response = await orderService.createOrder(orderData);
      
      setResult({
        success: true,
        data: response
      });
      toast.success('Test order created successfully!');
    } catch (error) {
      console.error('Test order failed:', error);
      setResult({
        success: false,
        error: error.message
      });
      toast.error(`Test failed: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-yellow-50">
      <h3 className="font-bold mb-2">Order Creation Test</h3>
      <div className="space-y-2 text-sm mb-3">
        <p>User: {user ? user.email : 'Not logged in'}</p>
        <p>Test Book ID: {bookId}</p>
      </div>
      
      <button 
        onClick={testOrderCreation}
        disabled={testing || !isLoggedIn}
        className="px-3 py-1 bg-yellow-500 text-white rounded text-sm disabled:opacity-50"
      >
        {testing ? 'Testing...' : 'Test Order Creation'}
      </button>
      
      {result && (
        <div className="mt-3 p-2 bg-white rounded text-xs">
          <div className={`font-bold ${result.success ? 'text-green-600' : 'text-red-600'}`}>
            {result.success ? 'SUCCESS' : 'FAILED'}
          </div>
          <pre className="mt-1 whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default OrderTest;