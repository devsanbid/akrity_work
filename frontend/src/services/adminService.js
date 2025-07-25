// Admin service for API calls
const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/admin`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const adminService = {
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    const result = await response.json();
    return result.data;
  },

  // User management
  getAllUsers: async (page = 1, limit = 10, search = '', status = '') => {
    const params = { page, limit };
    if (search) params.search = search;
    if (status) params.status = status;
    
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/users?${queryString}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    const result = await response.json();
    return result.data;
  },

  updateUserStatus: async (userId, isActive) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isActive }),
    });
    if (!response.ok) throw new Error('Failed to update user status');
    const result = await response.json();
    return result.data;
  },

  getUserDetails: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch user details');
    const result = await response.json();
    return result.data;
  },

  deleteUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete user');
    const result = await response.json();
    return result.data;
  },

  // Book management
  getAllBooks: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/books?${queryString}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch books');
    const result = await response.json();
    return result.data;
  },

  getPendingBooks: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/books/pending?${queryString}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch pending books');
    const result = await response.json();
    return result.data;
  },

  approveBook: async (bookId, data) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to approve book');
    const result = await response.json();
    return result.data;
  },

  rejectBook: async (bookId, data) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}/reject`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to reject book');
    const result = await response.json();
    return result.data;
  },

  // Order management
  getAllOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/orders?${queryString}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    const result = await response.json();
    return result.data;
  },

  updatePaymentStatus: async (orderId, paymentStatus) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/payment-status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ paymentStatus }),
    });
    if (!response.ok) throw new Error('Failed to update payment status');
    const result = await response.json();
    return result.data;
  },
};

export { adminService };