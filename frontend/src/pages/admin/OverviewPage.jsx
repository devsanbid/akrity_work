import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, TrendingUp, DollarSign, Clock, Activity } from 'lucide-react';
import { toast } from 'sonner';
import StatsCard from '../../components/Admin/StatsCard';
import { adminService } from '../../services/adminService';

const OverviewPage = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num || 0);
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const createdAt = new Date(date);
    const diffInMinutes = Math.floor((now - createdAt) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-red-600">{error}</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: formatNumber(dashboardData?.stats?.totalUsers),
      icon: Users
    },
    {
      title: 'Total Books',
      value: formatNumber(dashboardData?.stats?.totalBooks),
      icon: BookOpen
    },
    {
      title: 'Pending Approvals',
      value: formatNumber(dashboardData?.stats?.pendingApprovals),
      icon: Clock
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(dashboardData?.stats?.totalRevenue),
      icon: DollarSign
    }
  ];

  const generateRecentActivities = () => {
    const activities = [];
    
    dashboardData?.recentUsers?.slice(0, 2).forEach(user => {
      activities.push({
        id: `user-${user._id}`,
        action: 'New user registered',
        user: user.name,
        time: getTimeAgo(user.createdAt)
      });
    });
    
    dashboardData?.recentBooks?.slice(0, 2).forEach(book => {
      activities.push({
        id: `book-${book._id}`,
        action: 'Book listed for sale',
        user: book.seller?.name || 'Unknown',
        time: getTimeAgo(book.createdAt)
      });
    });
    
    dashboardData?.recentOrders?.slice(0, 1).forEach(order => {
      activities.push({
        id: `order-${order._id}`,
        action: 'Book purchase completed',
        user: order.buyer?.name || 'Unknown',
        time: getTimeAgo(order.createdAt)
      });
    });
    
    return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
  };

  const recentActivities = generateRecentActivities();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">by {activity.user}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/admin/users')}
              className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-500 mt-1">View and manage user accounts</p>
            </button>
            <button 
              onClick={() => navigate('/admin/approvals')}
              className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Review Books</h3>
              <p className="text-sm text-gray-500 mt-1">Approve or reject book listings</p>
            </button>
            <button 
              onClick={() => navigate('/admin/reports')}
              className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">View Reports</h3>
              <p className="text-sm text-gray-500 mt-1">Generate and view reports</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;