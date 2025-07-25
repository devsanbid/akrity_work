const express = require('express');
const {
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
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/dashboard', getDashboardStats);

router.route('/users')
  .get(getAllUsers);

router.route('/users/:id')
  .get(getUserDetails)
  .put(updateUserStatus)
  .delete(deleteUser);

router.get('/books/pending', getPendingBooks);
router.get('/books', getAllBooks);
router.put('/books/:id/approve', approveBook);
router.put('/books/:id/reject', rejectBook);
router.delete('/books/:id', deleteBook);

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/payment-status', updatePaymentStatus);

module.exports = router;