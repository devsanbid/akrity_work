import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Create and export the context
const AuthContext = createContext();
export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setUser(data.data.user);
        } else {
          console.error('Invalid response format from server');
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const login = async (email, password, isAdmin = false) => {
    try {
      setLoading(true);
      const endpoint = isAdmin ? '/auth/admin-login' : '/auth/login';
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          toast.error('API endpoint not found. Please check if the server is running.');
          return { success: false, message: 'Server not available' };
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          toast.error(data.message || 'Login failed');
          return { success: false, message: data.message };
        } else {
          toast.error('Server error. Please try again later.');
          return { success: false, message: 'Server error' };
        }
      }

      const data = await response.json();
      localStorage.setItem('token', data.data.token);
      setUser(data.data.user);
      setIsLoggedIn(true);
      toast.success('Login successful!');
      return { success: true, user: data.data.user };
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Network error. Please try again.');
      return { success: false, message: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        if (response.status === 404) {
          toast.error('API endpoint not found. Please check if the server is running.');
          return { success: false, message: 'Server not available' };
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          toast.error(data.message || 'Registration failed');
          return { success: false, message: data.message };
        } else {
          toast.error('Server error. Please try again later.');
          return { success: false, message: 'Server error' };
        }
      }

      const data = await response.json();
      localStorage.setItem('token', data.data.token);
      setUser(data.data.user);
      setIsLoggedIn(true);
      toast.success('Registration successful!');
      return { success: true, user: data.data.user };
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Network error. Please try again.');
      return { success: false, message: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsLoggedIn(false);
      toast.success('Logged out successfully!');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        if (response.status === 404) {
          toast.error('API endpoint not found. Please check if the server is running.');
          return { success: false, message: 'Server not available' };
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          toast.error(data.message || 'Profile update failed');
          return { success: false, message: data.message };
        } else {
          toast.error('Server error. Please try again later.');
          return { success: false, message: 'Server error' };
        }
      }

      const data = await response.json();
      setUser(data.data);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Network error. Please try again.');
      return { success: false, message: 'Network error' };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          toast.error('API endpoint not found. Please check if the server is running.');
          return { success: false, message: 'Server not available' };
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          toast.error(data.message || 'Password change failed');
          return { success: false, message: data.message };
        } else {
          toast.error('Server error. Please try again later.');
          return { success: false, message: 'Server error' };
        }
      }

      const data = await response.json();
      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      toast.error('Network error. Please try again.');
      return { success: false, message: 'Network error' };
    }
  };

  const value = {
    user,
    loading,
    isLoggedIn,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
