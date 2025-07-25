import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { getBookImageUrl } from '../../utils/imageUtils';

const BookApprovalCard = ({ book, onApprove, onReject }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <img src={getBookImageUrl(book)} alt={book.title} className="w-20 h-28 object-cover rounded-lg" />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
              <p className="text-gray-600">by {book.author}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>Seller: {book.seller}</span>
                <span>Category: {book.category}</span>
                <span>Condition: {book.condition}</span>
              </div>
              <p className="text-xl font-bold text-gray-800 mt-2">Rs. {book.price}</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">Submitted: {book.submittedDate}</span>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => onApprove(book.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </button>
                <button
                  onClick={() => onReject(book.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookApprovalCard;