import React from 'react';
import { User, Edit3, Lock, ShoppingCart, Package, Heart, Eye, LogOut } from 'lucide-react';

const ProfileDropdown = ({ user, cartItems, onAction, onClose }) => {
  const handleAction = (action) => {
    onAction(action);
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <img 
            src={user.avatar} 
            alt="Profile" 
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-800">{user.fullName}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <button
          onClick={() => handleAction('dashboard')}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
        >
          <User className="w-5 h-5 text-gray-500" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => handleAction('editProfile')}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
        >
          <Edit3 className="w-5 h-5 text-gray-500" />
          <span>Edit Profile</span>
        </button>

        <button
          onClick={() => handleAction('updatePassword')}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
        >
          <Lock className="w-5 h-5 text-gray-500" />
          <span>Update Password</span>
        </button>

        <button
          onClick={() => handleAction('sellBook')}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
        >
          <Package className="w-5 h-5 text-gray-500" />
          <span>Sell Books</span>
        </button>

        <div className="border-t border-gray-100 my-2"></div>

        <button
          onClick={() => handleAction('cart')}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
        >
          <ShoppingCart className="w-5 h-5 text-gray-500" />
          <div className="flex items-center justify-between w-full">
            <span>Shopping Cart</span>
            {cartItems.length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </div>
        </button>

        <button
          onClick={() => handleAction('purchases')}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
        >
          <Package className="w-5 h-5 text-gray-500" />
          <span>My Purchases</span>
        </button>

        <button
          onClick={() => handleAction('wishlist')}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
        >
          <Heart className="w-5 h-5 text-gray-500" />
          <span>Wishlist</span>
        </button>

        <button
          onClick={() => handleAction('listings')}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
        >
          <Package className="w-5 h-5 text-gray-500" />
          <span>My Listings</span>
        </button>

        <button
          onClick={() => handleAction('sales')}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
        >
          <Eye className="w-5 h-5 text-gray-500" />
          <span>Sales History</span>
        </button>

        <div className="border-t border-gray-100 my-2"></div>

        <button
          onClick={() => handleAction('logout')}
          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;