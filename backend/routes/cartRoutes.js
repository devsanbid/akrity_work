const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  moveToWishlist
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router.route('/:bookId')
  .put(updateCartItem)
  .delete(removeFromCart);

router.post('/:bookId/move-to-wishlist', moveToWishlist);

module.exports = router;