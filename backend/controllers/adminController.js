const User = require('../models/User');
const Book = require('../models/Book');
const Order = require('../models/Order');

const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBooks = await Book.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingApprovals = await Book.countDocuments({ status: 'pending' });
    
    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: { $in: ['delivered', 'processing', 'shipped'] } } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]);

    const recentUsers = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt isActive');

    const recentBooks = await Book.find()
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title author status sellingPrice createdAt');

    const recentOrders = await Order.find()
      .populate('buyer', 'name email')
      .populate('book', 'title')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber totalAmount orderStatus createdAt');

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalBooks,
          totalOrders,
          pendingApprovals,
          totalRevenue: totalRevenue[0]?.total || 0
        },
        recentUsers,
        recentBooks,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { role: 'user' };
    
    if (req.query.status) {
      query.isActive = req.query.status === 'active';
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('booksListed', 'title status')
      .populate('booksSold', 'title')
      .lean();

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('booksListed')
      .populate('booksSold')
      .populate('booksPurchased');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      },
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    next(error);
  }
};

const getPendingBooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find({ status: 'pending' })
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments({ status: 'pending' });
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

const approveBook = async (req, res, next) => {
  try {
    const { adminNotes } = req.body;
    
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'approved',
        adminNotes
      },
      { new: true }
    ).populate('seller', 'name email');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        book
      },
      message: 'Book approved successfully'
    });
  } catch (error) {
    next(error);
  }
};

const rejectBook = async (req, res, next) => {
  try {
    const { adminNotes } = req.body;
    
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'rejected',
        adminNotes
      },
      { new: true }
    ).populate('seller', 'name email');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        book
      },
      message: 'Book rejected successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getAllBooks = async (req, res, next) => {
  try {
    console.log('=== ADMIN getAllBooks DEBUG ===');
    console.log('getAllBooks called with query:', req.query);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { author: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    console.log('Final query:', query);
    
    // Check if database connection is working
    try {
      const totalBooksInDB = await Book.countDocuments({});
      console.log('Total books in database:', totalBooksInDB);
      
      if (totalBooksInDB === 0) {
        console.log('WARNING: No books found in database at all!');
      } else {
        const allBooks = await Book.find({}).select('title author status category').limit(5);
        console.log('Sample books in database:', allBooks);
        
        const statusCounts = await Book.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        console.log('Books by status:', statusCounts);
      }
    } catch (dbError) {
      console.error('Database connection error:', dbError);
    }

    const books = await Book.find(query)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log('Books found with query:', books.length);
    if (books.length > 0) {
      console.log('Sample book data:', JSON.stringify(books[0], null, 2));
    } else {
      console.log('No books matched the query');
    }

    const total = await Book.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

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
    
    console.log('Sending response - books count:', books.length, 'total:', total);
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error in getAllBooks:', error);
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (req.query.status) {
      query.orderStatus = req.query.status;
    }

    if (req.query.paymentStatus) {
      query.paymentStatus = req.query.paymentStatus;
    }

    const orders = await Order.find(query)
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .populate('book', 'title author')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin user'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
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

    await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    
    const validOrderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validOrderStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    ).populate('buyer', 'name email')
     .populate('seller', 'name email')
     .populate('book', 'title author');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        order
      },
      message: `Order status updated to ${orderStatus}`
    });
  } catch (error) {
    next(error);
  }
};

const updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;
    
    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    ).populate('buyer', 'name email')
     .populate('seller', 'name email')
     .populate('book', 'title author');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        order
      },
      message: `Payment status updated to ${paymentStatus}`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  updateUserStatus,
  deleteUser,
  getPendingBooks,
  approveBook,
  rejectBook,
  getAllBooks,
  deleteBook,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus
};