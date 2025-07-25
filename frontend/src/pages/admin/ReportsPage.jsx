import React, { useState } from 'react';
import { Download, Calendar, TrendingUp, Users, BookOpen, DollarSign, Filter } from 'lucide-react';

const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('last30days');

  const reportTypes = [
    { id: 'overview', name: 'Overview Report', description: 'General platform statistics' },
    { id: 'users', name: 'User Report', description: 'User registration and activity data' },
    { id: 'books', name: 'Book Report', description: 'Book listings and sales data' },
    { id: 'revenue', name: 'Revenue Report', description: 'Financial performance metrics' },
    { id: 'activity', name: 'Activity Report', description: 'Platform usage and engagement' }
  ];

  const dateRanges = [
    { id: 'last7days', name: 'Last 7 Days' },
    { id: 'last30days', name: 'Last 30 Days' },
    { id: 'last3months', name: 'Last 3 Months' },
    { id: 'last6months', name: 'Last 6 Months' },
    { id: 'lastyear', name: 'Last Year' },
    { id: 'custom', name: 'Custom Range' }
  ];

  const overviewData = {
    totalUsers: 1234,
    newUsers: 89,
    totalBooks: 5678,
    newBooks: 156,
    totalRevenue: 12345,
    monthlyRevenue: 2890,
    activeListings: 892,
    completedSales: 234
  };

  const recentReports = [
    {
      id: 1,
      name: 'Monthly User Activity Report',
      type: 'User Report',
      generatedDate: '2024-01-20',
      size: '2.3 MB'
    },
    {
      id: 2,
      name: 'Q4 Revenue Analysis',
      type: 'Revenue Report',
      generatedDate: '2024-01-15',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'Book Listing Performance',
      type: 'Book Report',
      generatedDate: '2024-01-10',
      size: '3.1 MB'
    }
  ];

  const handleGenerateReport = () => {
    // Implementation for generating report
  };

  const handleDownloadReport = (reportId) => {
    // Implementation for downloading report
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600">Generate and download platform reports</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{overviewData.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600">+{overviewData.newUsers} this month</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Books</p>
              <p className="text-2xl font-bold text-gray-900">{overviewData.totalBooks.toLocaleString()}</p>
              <p className="text-sm text-green-600">+{overviewData.newBooks} this month</p>
            </div>
            <BookOpen className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${overviewData.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600">${overviewData.monthlyRevenue} this month</p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Listings</p>
              <p className="text-2xl font-bold text-gray-900">{overviewData.activeListings}</p>
              <p className="text-sm text-blue-600">{overviewData.completedSales} sales completed</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Report Generator */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Generate New Report</h2>
          <p className="text-sm text-gray-600">Create custom reports based on your requirements</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                {reportTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                {reportTypes.find(t => t.id === selectedReport)?.description}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                {dateRanges.map(range => (
                  <option key={range.id} value={range.id}>{range.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={handleGenerateReport}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
          <p className="text-sm text-gray-600">Previously generated reports available for download</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Download className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{report.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{report.type}</span>
                      <span>•</span>
                      <span>Generated on {new Date(report.generatedDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadReport(report.id)}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((type) => (
          <div key={type.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{type.description}</p>
            <button
              onClick={() => {
                setSelectedReport(type.id);
                handleGenerateReport();
              }}
              className="w-full px-4 py-2 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
            >
              Generate Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;