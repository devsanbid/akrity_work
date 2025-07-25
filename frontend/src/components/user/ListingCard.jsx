import React from 'react';
import { Eye, Heart, Calendar, Edit, Trash2, MoreVertical } from 'lucide-react';

const ListingCard = ({ listing }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <img 
          src={listing.image} 
          alt={listing.title}
          className="w-20 h-28 object-cover rounded-lg"
        />
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{listing.title}</h3>
              <p className="text-gray-600">by {listing.author}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-800">Rs. {listing.price}</p>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                <span className="capitalize">{listing.status}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              <span>{listing.views} views</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              <span>{listing.likes} likes</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Posted {new Date(listing.postedDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              View
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </button>
            <button className="border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm flex items-center">
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;