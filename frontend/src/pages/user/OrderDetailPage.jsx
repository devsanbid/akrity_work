import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail, User } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { getBookImageUrl } from '../../utils/imageUtils';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadOrderDetails();
    }
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderDetails(id);
      setOrder(response.order);
    } catch (error) {
      console.error('Error loading order details:', error);
      setError('Failed to load order details');
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
      case 'placed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      case 'shipped':
        return <Truck className="w-5 h-5" />;
      case 'processing':
        return <Package className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-8">The order you're looking for doesn't exist or you don't have permission to view it.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600">Order #{order.orderNumber}</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${getStatusColor(order.orderStatus)}`}>
              {getStatusIcon(order.orderStatus)}
              <span className="ml-2 capitalize">{order.orderStatus}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Book Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Book Details</h2>
              <div className="flex space-x-4">
                <img
                  src={getBookImageUrl(order.book)}
                  alt={order.bookDetails?.title || order.book?.title}
                  className="w-24 h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = '/placeholder-book.png';
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {order.bookDetails?.title || order.book?.title}
                  </h3>
                  <p className="text-gray-600">
                    by {order.bookDetails?.author || order.book?.author}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Condition: {order.bookDetails?.condition || order.book?.condition}
                  </p>
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                    <p className="text-sm text-gray-600">Price: ₹{order.price}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Timeline</h2>
              <div className="space-y-4">
                {order.timeline?.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      index === 0 ? 'bg-blue-600' : 'bg-gray-300'
                    }`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 capitalize">{event.status}</p>
                      <p className="text-gray-600 text-sm">{event.message}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            {order.deliveryMethod && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">Delivery Method:</span>
                    <span className="ml-2 font-medium capitalize">{order.deliveryMethod}</span>
                  </div>
                  
                  {order.trackingNumber && (
                    <div className="flex items-center">
                      <Truck className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-600">Tracking Number:</span>
                      <span className="ml-2 font-medium">{order.trackingNumber}</span>
                    </div>
                  )}
                  
                  {order.deliveryAddress && (
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <span className="text-gray-600">Delivery Address:</span>
                        <div className="mt-1 text-sm text-gray-800">
                          {order.deliveryAddress.name && <p>{order.deliveryAddress.name}</p>}
                          {order.deliveryAddress.street && <p>{order.deliveryAddress.street}</p>}
                          {order.deliveryAddress.city && (
                            <p>
                              {order.deliveryAddress.city}
                              {order.deliveryAddress.district && `, ${order.deliveryAddress.district}`}
                              {order.deliveryAddress.province && `, ${order.deliveryAddress.province}`}
                              {order.deliveryAddress.postalCode && ` - ${order.deliveryAddress.postalCode}`}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {order.meetupLocation && (
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-600">Meetup Location:</span>
                      <span className="ml-2 font-medium">{order.meetupLocation}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₹{order.totalAmount}</span>
                </div>
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span className="font-medium">₹{order.deliveryFee}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-lg font-semibold text-green-600">₹{order.finalAmount}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">Payment Method:</p>
                <p className="font-medium capitalize">{order.paymentMethod?.replace('_', ' ')}</p>
                <p className="text-sm text-gray-600 mt-2">Payment Status:</p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                  order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                </span>
              </div>
            </div>

            {/* Seller Information */}
            {order.seller && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Seller Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="font-medium">{order.seller.name}</span>
                  </div>
                  {order.seller.email && (
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-600">{order.seller.email}</span>
                    </div>
                  )}
                  {order.seller.phone && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-600">{order.seller.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Information</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{order._id.slice(-8)}</span>
                </div>
                {order.estimatedDeliveryDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Delivery:</span>
                    <span className="font-medium">{new Date(order.estimatedDeliveryDate).toLocaleDateString()}</span>
                  </div>
                )}
                {order.actualDeliveryDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivered On:</span>
                    <span className="font-medium">{new Date(order.actualDeliveryDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderDetailPage;