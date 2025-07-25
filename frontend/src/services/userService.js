// User service for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const userService = {
  // Get current user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch user profile');
    const result = await response.json();
    return result.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    const result = await response.json();
    return result.data;
  },

  // Get user dashboard stats
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/users/dashboard`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    const result = await response.json();
    return result.data;
  },

  // Get user's listed books
  getUserBooks: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/books/my-books?${queryString}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch user books');
    const result = await response.json();
    return result.data;
  },

  // Delete user book listing
  deleteUserBook: async (bookId) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete book');
    const result = await response.json();
    return result.data;
  },

  // Update user book listing
  updateUserBook: async (bookId, bookData) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookData)
    });
    if (!response.ok) throw new Error('Failed to update book');
    const result = await response.json();
    return result.data;
  }
};

export { userService };