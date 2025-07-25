// Utility functions for handling image URLs

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Function to get the full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/placeholder-book.png';
  }
  
  // If it's already a full URL (starts with http), return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the backend base URL
  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  // If it doesn't start with /, add it
  return `${API_BASE_URL}/${imagePath}`;
};

// Function to get book image URL with fallback
export const getBookImageUrl = (book) => {
  // Try to get image from images array first (API data)
  if (book.images && book.images.length > 0) {
    return getImageUrl(book.images[0].url);
  }
  
  // Fallback to book.image (mock data)
  if (book.image) {
    return getImageUrl(book.image);
  }
  
  // Final fallback to placeholder
  return '/placeholder-book.png';
};