// Cart service for API calls
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
      throw new Error('Cart endpoint not found. Please check if the server is running.');
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

const cartService = {
  // Get user's cart
  getCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: getAuthHeaders()
    });
    const result = await handleResponse(response);
    return result.data;
  },

  // Add book to cart
  addToCart: async (bookId, quantity = 1) => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ bookId, quantity })
    });
    const result = await handleResponse(response);
    return result.data;
  },

  // Update cart item quantity
  updateCartItem: async (bookId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/cart/${bookId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity })
    });
    const result = await handleResponse(response);
    return result.data;
  },

  // Remove book from cart
  removeFromCart: async (bookId) => {
    const response = await fetch(`${API_BASE_URL}/cart/${bookId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const result = await handleResponse(response);
    return result.data;
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const result = await handleResponse(response);
    return result.data;
  },

  // Move item from cart to wishlist
  moveToWishlist: async (bookId) => {
    const response = await fetch(`${API_BASE_URL}/cart/${bookId}/move-to-wishlist`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const result = await handleResponse(response);
    return result.data;
  }
};

export { cartService };