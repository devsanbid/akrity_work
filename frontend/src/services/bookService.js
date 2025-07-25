// Book service for API calls
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
      throw new Error('API endpoint not found. Please check if the server is running.');
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    } else {
      throw new Error(`Server error: ${response.status}`);
    }
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  } else {
    throw new Error('Invalid response format from server');
  }
};

const bookService = {
  // Get all approved books with filtering
  getAllBooks: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/books?${queryString}`);
    const result = await handleResponse(response);
    return result.data;
  },

  // Search books
  searchBooks: async (searchTerm, filters = {}) => {
    const params = { search: searchTerm, ...filters };
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/books/search?${queryString}`);
    const result = await handleResponse(response);
    return result.data;
  },

  // Get book details
  getBookDetails: async (bookId) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
    const result = await handleResponse(response);
    return result.data;
  },

  // Get books by category
  getBooksByCategory: async (category, params = {}) => {
    const queryParams = { category, ...params };
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await fetch(`${API_BASE_URL}/books?${queryString}`);
    const result = await handleResponse(response);
    return result.data;
  },

  // Get featured books
  getFeaturedBooks: async (limit = 8) => {
    const response = await fetch(`${API_BASE_URL}/books/featured?limit=${limit}`);
    const result = await handleResponse(response);
    return result.data;
  },



  // Create new book listing (requires auth)
  createBook: async (bookData) => {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookData)
    });
    const result = await handleResponse(response);
    return result.data;
  },

  // Create new book listing with images (requires auth)
  createBookWithImages: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData
    });
    const result = await handleResponse(response);
    return result.data;
  },

  // Update book listing (requires auth)
  updateBook: async (bookId, bookData) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookData)
    });
    const result = await handleResponse(response);
    return result.data;
  },

  // Delete book listing (requires auth)
  deleteBook: async (bookId) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const result = await handleResponse(response);
    return result.data;
  },

  // Get recommended books
  getRecommendedBooks: async (limit = 6) => {
    const response = await fetch(`${API_BASE_URL}/books/recommended?limit=${limit}`, {
      headers: getAuthHeaders()
    });
    const result = await handleResponse(response);
    return result.data;
  }
};

export { bookService };