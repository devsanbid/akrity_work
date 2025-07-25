const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Book = require('../models/Book');
const Order = require('../models/Order');

const router = express.Router();

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -cart -wishlist')
      .populate('booksListed', 'title author sellingPrice images status')
      .populate('booksSold', 'title author sellingPrice');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const stats = {
      totalBooksListed: user.booksListed.length,
      totalBooksSold: user.booksSold.length,
      activeListing: user.booksListed.filter(book => book.status === 'approved').length
    };

    res.status(200).json({
      success: true,
      data: {
        user,
        stats
      }
    });
  } catch (error) {
    next(error);
  }
};

const getUserBooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const books = await Book.find({ 
      seller: req.params.id, 
      status: 'approved' 
    })
      .populate('seller', 'name rating.average')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Book.countDocuments({ 
      seller: req.params.id, 
      status: 'approved' 
    });
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

const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const totalBooksListed = await Book.countDocuments({ seller: userId });
    const activeListing = await Book.countDocuments({ seller: userId, status: 'approved' });
    const pendingApproval = await Book.countDocuments({ seller: userId, status: 'pending' });
    const soldBooks = await Book.countDocuments({ seller: userId, status: 'sold' });

    const totalOrders = await Order.countDocuments({ buyer: userId });
    const totalSales = await Order.countDocuments({ seller: userId });

    const totalEarnings = await Order.aggregate([
      { $match: { seller: userId, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]);

    const totalSpent = await Order.aggregate([
      { $match: { buyer: userId, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]);

    const recentOrders = await Order.find({ buyer: userId })
      .populate('book', 'title author images')
      .populate('seller', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber totalAmount orderStatus createdAt');

    const recentSales = await Order.find({ seller: userId })
      .populate('book', 'title author images')
      .populate('buyer', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber totalAmount orderStatus createdAt');

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalBooksListed,
          activeListing,
          pendingApproval,
          soldBooks,
          totalOrders,
          totalSales,
          totalEarnings: totalEarnings[0]?.total || 0,
          totalSpent: totalSpent[0]?.total || 0
        },
        recentOrders,
        recentSales
      }
    });
  } catch (error) {
    next(error);
  }
};

const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const users = await User.find({
      $and: [
        { role: 'user' },
        { isActive: true },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    })
      .select('name email avatar rating createdAt')
      .sort({ 'rating.average': -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments({
      $and: [
        { role: 'user' },
        { isActive: true },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    });

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

router.get('/search', searchUsers);
router.get('/dashboard', protect, getDashboardStats);
router.get('/:id', getUserProfile);
router.get('/:id/books', getUserBooks);

module.exports = router;