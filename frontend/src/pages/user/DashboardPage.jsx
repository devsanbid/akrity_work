import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, Edit3, Lock, Package, Heart, ShoppingBag, 
  Eye, Settings, BookOpen, TrendingUp, Star, 
  Save, Camera, Mail, Phone, MapPin, Calendar,
  AlertCircle, CheckCircle, X, 
  ShoppingCart, Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { userService } from '../../services/userService';
import { wishlistService } from '../../services/wishlistService';
import { orderService } from '../../services/orderService';
import { bookService } from '../../services/bookService';
import { getBookImageUrl } from '../../utils/imageUtils';

const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [listings, setListings] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    avatar: null
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        avatar: user.avatar || null
      });
    }
    
    loadDashboardData();
    
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [user, location.state]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load dashboard stats
      const stats = await userService.getDashboardStats();
      setDashboardStats(stats);
      
      // Load wishlist
      const wishlistData = await wishlistService.getWishlist();
      setWishlistItems(wishlistData.wishlist || []);
      
      // Load purchase history
      const ordersData = await orderService.getMyOrders({ limit: 10 });
      setPurchases(ordersData.orders || []);
      
      // Load sales history
      const salesData = await orderService.getMySales({ limit: 10 });
      setSales(salesData.orders || []);
      
      // Load user's book listings
      const userBooksData = await userService.getUserBooks({ limit: 10 });
      setListings(userBooksData.books || []);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditForm(prev => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProfile = () => setIsEditing(true);
  
  const handleSaveProfile = async () => {
    const newErrors = {};
    if (!editForm.name.trim()) newErrors.name = 'Name is required';
    if (!editForm.email.trim()) newErrors.email = 'Email is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      await userService.updateProfile({
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address,
        city: editForm.city,
        country: editForm.country
      });
      
      window.location.reload();
      setErrors({});
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({});
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        avatar: user.avatar || null
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const removeFromWishlist = async (bookId) => {
    try {
      await wishlistService.removeFromWishlist(bookId);
      setWishlistItems(prev => prev.filter(item => item._id !== bookId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'purchases', label: 'Purchases', icon: ShoppingBag },
    { id: 'sales', label: 'Sales History', icon: TrendingUp },
    { id: 'listings', label: 'My Listings', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Orders</p>
                  <p className="text-2xl font-bold">{dashboardStats?.stats?.totalOrders || 0}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Active Listings</p>
                  <p className="text-2xl font-bold">{dashboardStats?.stats?.activeListing || 0}</p>
                </div>
                <Package className="w-8 h-8 text-green-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Wishlist Items</p>
                  <p className="text-2xl font-bold">{wishlistItems.length}</p>
                </div>
                <Heart className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Total Sales</p>
                  <p className="text-2xl font-bold">{dashboardStats?.stats?.totalSales || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">Total Earnings</p>
                  <p className="text-2xl font-bold">₹{dashboardStats?.stats?.totalEarnings || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-200" />
              </div>
            </div>
          </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Purchase completed</p>
                <p className="text-xs text-gray-500">1984 by George Orwell - ₹275</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Heart className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Added to wishlist</p>
                <p className="text-xs text-gray-500">The Great Gatsby by F. Scott Fitzgerald</p>
              </div>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );

  const renderWishlist = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">My Wishlist</h3>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-8">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistItems.map(item => (
            <div key={item._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <img 
                src={`http://localhost:4000${item.images[0].url}`} 
                alt={item.title} 
                className="w-full h-48 object-cover rounded-lg mb-3" 
              />
              <h4 className="font-semibold text-gray-900">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.author}</p>
              <p className="text-lg font-bold text-green-600 mt-2">₹{item.sellingPrice}</p>
              <p className="text-xs text-gray-500">Condition: {item.condition}</p>
              <div className="flex space-x-2 mt-3">
                <button 
                  onClick={() => navigate(`/book/${item._id}`)}
                  className="flex-1 bg-yellow-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
                >
                  View Details
                </button>
                <button 
                  onClick={() => removeFromWishlist(item._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPurchases = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Purchase History</h3>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : purchases.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No purchases yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map(purchase => (
            <div key={purchase._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-4">
                <img 
                  src={`http://localhost:4000${purchase.book.images[0].url}`} 
                  alt={purchase.book?.title} 
                  className="w-16 h-20 object-cover rounded" 
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{purchase.book?.title}</h4>
                  <p className="text-sm text-gray-600">{purchase.book?.author}</p>
                  <p className="text-sm text-gray-500">Ordered on {new Date(purchase.createdAt).toLocaleDateString()}</p>
                  <p className="text-lg font-bold text-green-600">₹{purchase.finalAmount}</p>
                  <p className="text-xs text-gray-500">Order ID: {purchase._id.slice(-8)}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    purchase.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' : 
                    purchase.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    purchase.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {purchase.orderStatus?.charAt(0).toUpperCase() + purchase.orderStatus?.slice(1) || 'Unknown'}
                  </span>
                  <button 
                    onClick={() => navigate(`/order/${purchase._id}`)}
                    className="block mt-2 text-blue-600 hover:text-blue-800 text-xs"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSales = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Sales History</h3>
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          Total Sales: {sales.length}
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : sales.length === 0 ? (
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No sales yet</p>
          <p className="text-sm text-gray-400 mt-2">Start selling your books to see sales history here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sales.map(sale => (
            <div key={sale._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-4">
                <img 
                  src={`http://localhost:4000${sale.book.images[0].url}`} 
                  alt={sale.book?.title} 
                  className="w-16 h-20 object-cover rounded" 
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{sale.book?.title}</h4>
                  <p className="text-sm text-gray-600">{sale.book?.author}</p>
                  <p className="text-sm text-gray-500">Sold on {new Date(sale.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Buyer: {sale.buyer?.name}</p>
                  <p className="text-lg font-bold text-green-600">₹{sale.finalAmount}</p>
                  <p className="text-xs text-gray-500">Order ID: {sale._id.slice(-8)}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    sale.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' : 
                    sale.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    sale.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    sale.orderStatus === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {sale.orderStatus?.charAt(0).toUpperCase() + sale.orderStatus?.slice(1) || 'Unknown'}
                  </span>
                  <button 
                    onClick={() => navigate(`/order/${sale._id}`)}
                    className="block mt-2 text-blue-600 hover:text-blue-800 text-xs"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const handleDeleteListing = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      await userService.deleteUserBook(bookId);
      setListings(prev => prev.filter(item => item._id !== bookId));
      toast.success('Listing deleted successfully');
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing');
    }
  };

  const renderListings = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">My Listings</h3>
        <button 
          onClick={() => navigate('/sell')}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
        >
          Add New Listing
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No active listings</p>
          <button 
            onClick={() => navigate('/sell')}
            className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
          >
            Create Your First Listing
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map(listing => (
            <div key={listing._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-4">
                <img 
                src={`http://localhost:4000${listing.images[0].url}`} 
                  alt={listing.title} 
                  className="w-16 h-20 object-cover rounded" 
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{listing.title}</h4>
                  <p className="text-sm text-gray-600">{listing.author}</p>
                  <p className="text-lg font-bold text-green-600">₹{listing.sellingPrice}</p>
                  <p className="text-xs text-gray-500">Condition: {listing.condition}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye className="w-4 h-4 mr-1" />
                      {listing.views || 0} views
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      listing.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      listing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      listing.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => navigate(`/book/${listing._id}`)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => navigate(`/edit-book/${listing._id}`)}
                    className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit Listing"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteListing(listing._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Listing"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
          {!isEditing && (
            <button
              onClick={handleEditProfile}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {editForm.avatar ? (
                <img src={editForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                <Camera className="w-3 h-3" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900">{user?.name || 'User'}</h4>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            ) : (
              <p className="text-gray-900">{user?.name || 'Not provided'}</p>
            )}
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            ) : (
              <p className="text-gray-900">{user?.email || 'Not provided'}</p>
            )}
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.address}
                onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{user?.address || 'Not provided'}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleSaveProfile}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
        <div className="space-y-3">
          <button className="flex items-center space-x-3 w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <Lock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">Change Password</p>
              <p className="text-sm text-gray-500">Update your account password</p>
            </div>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full text-left p-3 rounded-lg hover:bg-red-50 transition-colors text-red-600"
          >
            <X className="w-5 h-5" />
            <div>
              <p className="font-medium">Logout</p>
              <p className="text-sm text-red-500">Sign out of your account</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'wishlist': return renderWishlist();
      case 'purchases': return renderPurchases();
      case 'sales': return renderSales();
      case 'listings': return renderListings();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'User'}!</h1>
              <p className="text-gray-600">Manage your books and account settings</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;