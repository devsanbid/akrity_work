const User = require('../models/User');
const Book = require('../models/Book');

const getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'cart.book',
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

    const validCartItems = user.cart.filter(item => item.book !== null);
    
    if (validCartItems.length !== user.cart.length) {
      user.cart = validCartItems;
      await user.save();
    }

    const totalAmount = validCartItems.reduce((total, item) => {
      return total + (item.book.sellingPrice * item.quantity);
    }, 0);

    res.status(200).json({
      success: true,
      data: {
        cart: validCartItems,
        totalItems: validCartItems.reduce((total, item) => total + item.quantity, 0),
        totalAmount
      }
    });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { bookId, quantity = 1 } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

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
        message: 'Cannot add your own book to cart'
      });
    }

    const user = await User.findById(req.user.id);
    
    const existingCartItem = user.cart.find(
      item => item.book.toString() === bookId
    );

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      user.cart.push({
        book: bookId,
        quantity
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Book added to cart successfully'
    });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const user = await User.findById(req.user.id);
    
    const cartItem = user.cart.find(
      item => item.book.toString() === bookId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Book not found in cart'
      });
    }

    cartItem.quantity = quantity;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const user = await User.findById(req.user.id);
    
    const cartItemIndex = user.cart.findIndex(
      item => item.book.toString() === bookId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Book not found in cart'
      });
    }

    user.cart.splice(cartItemIndex, 1);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Book removed from cart successfully'
    });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user.id,
      { $set: { cart: [] } }
    );

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    next(error);
  }
};

const moveToWishlist = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const user = await User.findById(req.user.id);
    
    const cartItemIndex = user.cart.findIndex(
      item => item.book.toString() === bookId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Book not found in cart'
      });
    }

    if (!user.wishlist.includes(bookId)) {
      user.wishlist.push(bookId);
    }

    user.cart.splice(cartItemIndex, 1);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Book moved to wishlist successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  moveToWishlist
};