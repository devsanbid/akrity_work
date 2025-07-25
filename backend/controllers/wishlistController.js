const User = require('../models/User');
const Book = require('../models/Book');

const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'wishlist',
        match: { status: 'approved' },
        populate: {
          path: 'seller',
          select: 'name rating.average'
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    next(error);
  }
};

const addToWishlist = async (req, res, next) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Book is not available'
      });
    }

    if (book.seller.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot add your own book to wishlist'
      });
    }

    const user = await User.findById(req.user.id);
    
    if (user.wishlist.includes(bookId)) {
      return res.status(400).json({
        success: false,
        message: 'Book already in wishlist'
      });
    }

    user.wishlist.push(bookId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Book added to wishlist successfully'
    });
  } catch (error) {
    next(error);
  }
};

const removeFromWishlist = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const user = await User.findById(req.user.id);
    
    if (!user.wishlist.includes(bookId)) {
      return res.status(400).json({
        success: false,
        message: 'Book not in wishlist'
      });
    }

    user.wishlist.pull(bookId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Book removed from wishlist successfully'
    });
  } catch (error) {
    next(error);
  }
};

const clearWishlist = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user.id,
      { $set: { wishlist: [] } }
    );

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
};