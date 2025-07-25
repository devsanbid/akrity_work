// Order service for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No authentication token found in localStorage');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const orderService = {
  // Get user's orders (purchases)
  getMyOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/orders?${queryString}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    const result = await response.json();
    return result.data;
  },

  // Get user's sales
  getMySales: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/orders/sales?${queryString}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch sales');
    const result = await response.json();
    return result.data;
  },

  // Create new order
  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to create order' }));
      throw new Error(errorData.message || `HTTP ${response.status}: Failed to create order`);
    }
    
    const result = await response.json();
    return result.data;
  },

  // Get order details
  getOrderDetails: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch order details');
    const result = await response.json();
    return result.data;
  },

  // Update order status (for sellers)
  updateOrderStatus: async (orderId,status, message = '') => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, message })
    });
    if (!response.ok) throw new Error('Failed to update order status');
    const result = await response.json();
    return result.data;
  },

  // Cancel order
  cancelOrder: async (orderId, reason = '') => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    });
    if (!response.ok) throw new Error('Failed to cancel order');
    const result = await response.json();
    return result.data;
  }
};

export { orderService };