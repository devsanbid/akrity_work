import React from 'react';
import { Calendar, Package, CheckCircle, Clock, Truck } from 'lucide-react';

const PurchaseCard = ({ purchase }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <img 
          src={purchase.image} 
          alt={purchase.title}
          className="w-20 h-28 object-cover rounded-lg"
        />
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{purchase.title}</h3>
              <p className="text-gray-600">by {purchase.author}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-800">Rs. {purchase.price}</p>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                {getStatusIcon(purchase.status)}
                <span className="ml-1 capitalize">{purchase.status}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Purchased on {new Date(purchase.purchaseDate).toLocaleDateString()}</span>
          </div>
          
          <div className="flex space-x-3">
            <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm">
              View Details
            </button>
            {purchase.status === 'delivered' && (
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Write Review
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCard;