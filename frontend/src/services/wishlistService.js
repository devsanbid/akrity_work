// Wishlist service for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Wishlist endpoint not found. Please check if the server is running.');
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      } catch (parseError) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } else {
      throw new Error(`Server returned non-JSON response. Status: ${response.status}`);
    }
  }
  
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Server returned non-JSON response');
  }
  
  return response.json();
};

const wishlistService = {
  // Get user's wishlist
  getWishlist: async () => {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      headers: getAuthHeaders()
    });
    const result = await handleResponse(response);
    return result.data;
  },

  // Add book to wishlist
  addToWishlist: async (bookId) => {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ bookId })
    });
    const result = await handleResponse(response);
    return result.data;
  },

  // Remove book from wishlist
  removeFromWishlist: async (bookId) => {
    const response = await fetch(`${API_BASE_URL}/wishlist/${bookId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const result = await handleResponse(response);
    return result.data;
  }
};

export { wishlistService };