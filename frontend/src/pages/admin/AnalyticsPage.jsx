import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, BookOpen, DollarSign, Eye, Calendar, ShoppingCart, BarChart3, PieChart } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { toast } from 'sonner';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, [timeRange]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const stats = await adminService.getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Process dashboard stats for charts
  const userGrowthData = dashboardStats?.userGrowth || [];
  const revenueData = dashboardStats?.revenueData || [];
  const categoryData = dashboardStats?.categoryDistribution || [];

  const metrics = dashboardStats ? [
    {
      title: 'Total Users',
      value: dashboardStats.totalUsers?.toLocaleString() || '0',
      change: '+8.2%',
      isIncrease: true,
      icon: Users,
      color: 'green'
    },
    {
      title: 'Total Books',
      value: dashboardStats.totalBooks?.toLocaleString() || '0',
      change: '+15.3%',
      isIncrease: true,
      icon: BookOpen,
      color: 'yellow'
    },
    {
      title: 'Total Orders',
      value: dashboardStats.totalOrders?.toLocaleString() || '0',
      change: '+12.5%',
      isIncrease: true,
      icon: ShoppingCart,
      color: 'blue'
    },
    {
      title: 'Total Revenue',
      value: `$${dashboardStats.totalRevenue?.toLocaleString() || '0'}`,
      change: '-2.1%',
      isIncrease: false,
      icon: DollarSign,
      color: 'red'
    }
  ] : [];

  const topBooks = dashboardStats?.topBooks || [];

  const getColorClass = (color) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      red: 'text-red-600 bg-red-100'
    };
    return colors[color] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track platform performance and user engagement</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="w-20 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-24 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))
        ) : (
          metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${getColorClass(metric.color)}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    metric.isIncrease ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.isIncrease ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {metric.change}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-gray-600 mb-1">{metric.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User & Book Growth</h2>
          <div className="h-[300px] bg-gray-50 rounded-lg flex items-center justify-center">
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : (
              <div className="text-center">
                <TrendingUp className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">User Growth Trend</p>
                <p className="text-sm text-gray-500">Users: {userGrowthData.length > 0 ? userGrowthData[userGrowthData.length - 1]?.users || 'N/A' : 'No data'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Revenue</h2>
          <div className="h-[300px] bg-gray-50 rounded-lg flex items-center justify-center">
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : (
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Revenue Analytics</p>
                <p className="text-sm text-gray-500">Weekly revenue: {revenueData.length > 0 ? `$${revenueData[revenueData.length - 1]?.revenue || 0}` : 'No data'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Distribution and Top Books */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Book Categories Distribution</h2>
          <div className="h-80">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {categoryData.length > 0 ? (
                  categoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color || '#8884d8' }}
                        ></div>
                        <span className="text-sm font-medium text-gray-900">{category.name}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {category.value} books
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <PieChart className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                    <p className="text-gray-600">Category Distribution</p>
                    <p className="text-sm text-gray-500">No category data available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Top Performing Books */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Books</h2>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                  <div className="flex-1 min-w-0">
                    <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-3 bg-gray-200 rounded"></div>
                      <div className="w-16 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="w-8 h-4 bg-gray-200 rounded"></div>
                </div>
              ))
            ) : (
              topBooks.map((book, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{book.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>{book.views} views</span>
                      <span>•</span>
                      <span>{book.sales} sales</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">#{index + 1}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">156</div>
            <div className="text-sm text-gray-600">New Registrations</div>
            <div className="text-xs text-green-600 mt-1">+12% from last week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">89</div>
            <div className="text-sm text-gray-600">Books Listed</div>
            <div className="text-xs text-green-600 mt-1">+8% from last week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-2">234</div>
            <div className="text-sm text-gray-600">Transactions</div>
            <div className="text-xs text-red-600 mt-1">-3% from last week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;