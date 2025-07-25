import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Check, X, Clock, User, Book, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { toast } from 'sonner';
import { getBookImageUrl } from '../../utils/imageUtils';

const ApprovalsPage = () => {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingBooks, setPendingBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const limit = 10;

  useEffect(() => {
    fetchPendingApprovals();
  }, [currentPage, searchTerm, filterStatus]);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit,
        search: searchTerm || undefined,
        status: filterStatus !== 'all' ? filterStatus : 'pending'
      };
      
      const response = await adminService.getPendingBooks(params);
      setPendingBooks(response.books);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || 'Failed to fetch pending approvals');
      toast.error('Failed to fetch pending approvals');
    } finally {
      setLoading(false);
    }
  };

  const filteredApprovals = (pendingBooks || []).filter(approval => {
    return filterType === 'all' || approval.type === filterType;
  });

  const handleApprove = async (id, type) => {
    try {
      await adminService.approveBook(id, { adminNotes: 'Book approved by admin' });
      toast.success('Book approved successfully');
      fetchPendingApprovals();
    } catch (err) {
      toast.error('Failed to approve book');
    }
  };

  const handleReject = async (id, type) => {
    try {
      await adminService.rejectBook(id, { adminNotes: 'Book rejected by admin' });
      toast.success('Book rejected successfully');
      fetchPendingApprovals();
    } catch (err) {
      toast.error('Failed to reject book');
    }
  };

  const handleViewDetails = (id) => {
    // Implementation for viewing approval details
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
          <p className="text-gray-600">Loading pending approvals...</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
          <p className="text-red-600">{error}</p>
        </div>
        <button 
          onClick={fetchPendingApprovals}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="text-gray-600">Review and approve pending submissions</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search books by title, author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-4 h-4" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Books List */}
      <div className="space-y-4">
        {filteredApprovals && filteredApprovals.length > 0 ? filteredApprovals.map((book) => (
          <div key={book._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={getBookImageUrl(book)}
                  alt={book.title}
                  className="w-20 h-24 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => {
                    e.target.src = '/placeholder-book.png';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                      <p className="text-sm text-gray-600">by {book.author}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(book.status)}`}>
                        {book.status}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {getTimeAgo(book.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <span className="text-xs text-gray-500">Price</span>
                      <p className="font-semibold text-yellow-600">${book.price}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Condition</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(book.condition)}`}>
                        {book.condition}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Category</span>
                      <p className="font-medium">{book.category}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Submitted by</span>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <p className="font-medium">{book.seller?.name || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{book.description}</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleViewDetails(book._id)}
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    {book.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(book._id, 'book')}
                          className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(book._id, 'book')}
                          className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )) : null}
      </div>

      {(!filteredApprovals || filteredApprovals.length === 0) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filterStatus === 'pending' ? 'All caught up!' : 'No books found'}
          </h3>
          <p className="text-gray-600">
            {filterStatus === 'pending' 
              ? 'No pending approvals at the moment.' 
              : 'Try adjusting your search or filter criteria.'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, pagination.total)} of {pagination.total} books
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Books</h3>
          <p className="text-3xl font-bold text-yellow-600">{pagination.total || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Page</h3>
          <p className="text-3xl font-bold text-blue-600">
            {currentPage} of {pagination.totalPages || 1}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Books per Page</h3>
          <p className="text-3xl font-bold text-purple-600">
            {filteredApprovals.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApprovalsPage;