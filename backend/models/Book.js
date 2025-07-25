const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    maxlength: [100, 'Author name cannot exceed 100 characters']
  },
  isbn: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  publisher: {
    type: String,
    trim: true,
    maxlength: [100, 'Publisher name cannot exceed 100 characters']
  },
  publicationYear: {
    type: Number,
    min: [1000, 'Invalid publication year'],
    max: [new Date().getFullYear(), 'Publication year cannot be in the future']
  },
  edition: {
    type: String,
    trim: true
  },
  language: {
    type: String,
    default: 'English',
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Academic', 'Fiction', 'Non-Fiction', 'Self-Help', 'Biography', 'Science', 'History', 'Romance', 'Mystery', 'Fantasy', 'Comics', 'Children', 'Reference', 'Textbook', 'Professional', 'Religious']
  },
  genre: {
    type: String,
    trim: true
  },
  pages: {
    type: Number,
    min: [1, 'Pages must be at least 1']
  },
  weight: {
    type: String,
    trim: true
  },
  dimensions: {
    type: String,
    trim: true
  },
  condition: {
    type: String,
    required: [true, 'Book condition is required'],
    enum: ['new', 'like-new', 'very-good', 'good', 'fair', 'poor']
  },
  conditionDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'Condition description cannot exceed 500 characters']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Selling price is required'],
    min: [0, 'Selling price cannot be negative']
  },
  negotiable: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: [true, 'Book description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  highlights: [{
    type: String,
    trim: true
  }],
  keyFeatures: [{
    type: String,
    trim: true
  }],
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerInfo: {
    name: String,
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      district: String,
      province: String,
      postalCode: String
    }
  },
  availableFrom: {
    type: Date,
    default: Date.now
  },
  deliveryOptions: [{
    type: String,
    enum: ['pickup', 'delivery', 'courier', 'meetup']
  }],
  meetupLocations: [{
    type: String,
    trim: true
  }],
  estimatedDeliveryTime: {
    type: String,
    trim: true
  },
  returnPolicy: {
    type: String,
    trim: true
  },
  reasonForSelling: {
    type: String,
    trim: true
  },
  purchaseDate: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  specialInstructions: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'sold', 'inactive'],
    default: 'pending'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  soldTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  soldAt: {
    type: Date
  },
  adminNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

bookSchema.index({ title: 'text', author: 'text', description: 'text' });
bookSchema.index({ category: 1, status: 1 });
bookSchema.index({ seller: 1, status: 1 });
bookSchema.index({ sellingPrice: 1 });
bookSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Book', bookSchema);