const express = require('express');
const { body } = require('express-validator');
const {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  getMyBooks,
  addReview,
  toggleLike,
  testDatabaseBooks
} = require('../controllers/bookController');
const { protect, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

const createBookValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be less than 200 characters'),
  body('author')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author is required and must be less than 100 characters'),
  body('category')
    .isIn(['Academic', 'Fiction', 'Non-Fiction', 'Self-Help', 'Biography', 'Science', 'History', 'Romance', 'Mystery', 'Fantasy', 'Comics', 'Children', 'Reference', 'Textbook', 'Professional', 'Religious'])
    .withMessage('Please select a valid category'),
  body('condition')
    .isIn(['new', 'like-new', 'very-good', 'good', 'fair', 'poor'])
    .withMessage('Please select a valid condition'),
  body('sellingPrice')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Selling price must be a positive number'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters')
];

const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment must be less than 500 characters')
];

router.route('/')
  .get(optionalAuth, getBooks)
  .post(protect, upload.array('images', 10), createBookValidation, createBook);

router.get('/my-books', protect, getMyBooks);
router.get('/test-db', testDatabaseBooks);

router.route('/:id')
  .get(optionalAuth, getBook)
  .put(protect, updateBook)
  .delete(protect, deleteBook);

router.post('/:id/reviews', protect, reviewValidation, addReview);
router.post('/:id/like', protect, toggleLike);

module.exports = router;