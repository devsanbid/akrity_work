const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getMyOrders,
  getMySales,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  addRating
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const createOrderValidation = [
  body('bookId')
    .notEmpty()
    .withMessage('Book ID is required'),
  body('paymentMethod')
    .isIn(['cash_on_delivery', 'online_payment', 'bank_transfer'])
    .withMessage('Please select a valid payment method'),
  body('deliveryMethod')
    .isIn(['pickup', 'delivery', 'courier', 'meetup'])
    .withMessage('Please select a valid delivery method'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1')
];

const ratingValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('type')
    .isIn(['buyer', 'seller'])
    .withMessage('Rating type must be either buyer or seller'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment must be less than 500 characters')
];

router.use(protect);

router.route('/')
  .post(createOrderValidation, createOrder)
  .get(getMyOrders);

router.get('/sales', getMySales);

router.route('/:id')
  .get(getOrder)
  .put(updateOrderStatus);

router.put('/:id/cancel', cancelOrder);
router.post('/:id/rating', ratingValidation, addRating);

module.exports = router;