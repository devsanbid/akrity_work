const Book = require('../models/Book');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const createBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Handle uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => {
        return {
          public_id: file.filename,
          url: `/uploads/books/${file.filename}`
        };
      });
    }

    const bookData = {
      ...req.body,
      images: images,
      seller: req.user.id,
      sellerInfo: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        address: typeof req.user.address === 'string' ? {
          street: req.user.address,
          city: '',
          district: '',
          province: '',
          postalCode: ''
        } : req.user.address || {
          street: '',
          city: '',
          district: '',
          province: '',
          postalCode: ''
        }
      }
    };

    const book = await Book.create(bookData);

    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { booksListed: book._id } }
    );

    res.status(201).json({
      success: true,
      data: {
        book
      }
    });
  } catch (error) {
    next(error);
  }
};

const getBooks = async (req, res, next) => {
  try {
    console.log('=== getBooks API called ===');
    console.log('Request query params:', req.query);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    console.log('Pagination params:', { page, limit, skip });

    let query = { status: 'approved' };
    let sort = { createdAt: -1 };
    
    console.log('Initial query:', query);

    if (req.query.category) {
      query.category = req.query.category;
      console.log('Added category filter:', req.query.category);
    }

    if (req.query.condition) {
      query.condition = req.query.condition;
      console.log('Added condition filter:', req.query.condition);
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.sellingPrice = {};
      if (req.query.minPrice) query.sellingPrice.$gte = parseInt(req.query.minPrice);
      if (req.query.maxPrice) query.sellingPrice.$lte = parseInt(req.query.maxPrice);
      console.log('Added price filter:', query.sellingPrice);
    }

    if (req.query.search) {
      query.$text = { $search: req.query.search };
      console.log('Added text search:', req.query.search);
    }

    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'price_low':
          sort = { sellingPrice: 1 };
          break;
        case 'price_high':
          sort = { sellingPrice: -1 };
          break;
        case 'newest':
          sort = { createdAt: -1 };
          break;
        case 'oldest':
          sort = { createdAt: 1 };
          break;
        case 'popular':
          sort = { views: -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
      console.log('Sort order:', sort);
    }
    
    console.log('Final query object:', JSON.stringify(query, null, 2));
    console.log('Final sort object:', JSON.stringify(sort, null, 2));
    
    console.log('Checking total books in database...');
    const totalBooksInDB = await Book.countDocuments({});
    console.log('Total books in database (all statuses):', totalBooksInDB);
    
    const approvedBooksCount = await Book.countDocuments({ status: 'approved' });
    console.log('Total approved books in database:', approvedBooksCount);
    
    const allStatuses = await Book.distinct('status');
    console.log('All book statuses in database:', allStatuses);
    
    console.log('Executing Book.find query...');
    const books = await Book.find(query)
      .populate('seller', 'name rating.average')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    
    console.log('Books found:', books.length);
    console.log('First book (if any):', books[0] ? JSON.stringify(books[0], null, 2) : 'No books found');

    const total = await Book.countDocuments(query);
    console.log('Total documents matching query:', total);
    
    const totalPages = Math.ceil(total / limit);
    console.log('Total pages:', totalPages);
    
    const responseData = {
      success: true,
      data: {
        books,
        pagination: {
          currentPage: page,
          totalPages,
          totalBooks: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    };
    
    console.log('Sending response with books count:', books.length);
    console.log('Response pagination:', responseData.data.pagination);

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error in getBooks controller:', error);
    next(error);
  }
};

const getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('seller', 'name email phone rating.average isVerified')
      .populate('reviews.user', 'name avatar');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.status !== 'approved' && (!req.user || (req.user.id !== book.seller._id.toString() && req.user.role !== 'admin'))) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    book.views += 1;
    await book.save();

    res.status(200).json({
      success: true,
      data: {
        book
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this book'
      });
    }

    if (book.status === 'sold') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a sold book'
      });
    }

    book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('seller', 'name email phone rating.average');

    res.status(200).json({
      success: true,
      data: {
        book
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this book'
      });
    }

    if (book.status === 'sold') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a sold book'
      });
    }

    await Book.findByIdAndDelete(req.params.id);

    await User.findByIdAndUpdate(
      book.seller,
      { $pull: { booksListed: book._id } }
    );

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const testDatabaseBooks = async (req, res, next) => {
  try {
    console.log('=== Testing Database Books ===');
    
    const allBooks = await Book.find({}).lean();
    console.log('All books in database:', allBooks.length);
    
    if (allBooks.length > 0) {
      console.log('Sample book:', JSON.stringify(allBooks[0], null, 2));
      
      const statusCounts = {};
      allBooks.forEach(book => {
        statusCounts[book.status] = (statusCounts[book.status] || 0) + 1;
      });
      console.log('Books by status:', statusCounts);
    }
    
    const approvedBooks = await Book.find({ status: 'approved' }).lean();
    console.log('Approved books:', approvedBooks.length);
    
    if (approvedBooks.length > 0) {
      console.log('First approved book:', JSON.stringify(approvedBooks[0], null, 2));
    }
    
    res.status(200).json({
      success: true,
      data: {
        totalBooks: allBooks.length,
        approvedBooks: approvedBooks.length,
        statusCounts: allBooks.reduce((acc, book) => {
          acc[book.status] = (acc[book.status] || 0) + 1;
          return acc;
        }, {}),
        sampleBook: allBooks[0] || null,
        sampleApprovedBook: approvedBooks[0] || null
      }
    });
  } catch (error) {
    console.error('Error in testDatabaseBooks:', error);
    next(error);
  }
};

const getMyBooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { seller: req.user.id };

    if (req.query.status) {
      query.status = req.query.status;
    }

    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Book.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        books,
        pagination: {
          currentPage: page,
          totalPages,
          totalBooks: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    const existingReview = book.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this book'
      });
    }

    const review = {
      user: req.user.id,
      rating,
      comment
    };

    book.reviews.push(review);

    book.rating.count = book.reviews.length;
    book.rating.average = book.reviews.reduce((acc, item) => item.rating + acc, 0) / book.reviews.length;

    await book.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    next(error);
  }
};

const toggleLike = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    const isLiked = book.likedBy.includes(req.user.id);

    if (isLiked) {
      book.likedBy.pull(req.user.id);
      book.likes -= 1;
    } else {
      book.likedBy.push(req.user.id);
      book.likes += 1;
    }

    await book.save();

    res.status(200).json({
      success: true,
      data: {
        liked: !isLiked,
        totalLikes: book.likes
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  getMyBooks,
  addReview,
  toggleLike,
  testDatabaseBooks
};