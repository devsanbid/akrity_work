const Order = require('../models/Order');
const Book = require('../models/Book');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      bookId,
      quantity = 1,
      paymentMethod,
      deliveryMethod,
      deliveryAddress,
      meetupLocation,
      notes
    } = req.body;

    const book = await Book.findById(bookId).populate('seller', 'name email phone');
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Book is not available for purchase'
      });
    }

    if (book.seller._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot purchase your own book'
      });
    }

    const totalAmount = book.sellingPrice * quantity;
    const deliveryFee = deliveryMethod === 'delivery' ? 100 : 0;
    const finalAmount = totalAmount + deliveryFee;

    const orderNumber = 'ORD' + Date.now() + Math.floor(Math.random() * 1000);

    const orderData = {
      orderNumber,
      buyer: req.user.id,
      seller: book.seller._id,
      book: bookId,
      bookDetails: {
        title: book.title,
        author: book.author,
        condition: book.condition,
        images: book.images
      },
      quantity,
      price: book.sellingPrice,
      totalAmount,
      deliveryFee,
      finalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
      deliveryMethod,
      deliveryAddress,
      meetupLocation,
      notes: {
        buyer: notes
      },
      timeline: [{
        status: 'placed',
        message: 'Order has been placed successfully',
        updatedBy: req.user.id
      }]
    };

    const order = await Order.create(orderData);

    await User.findByIdAndUpdate(
      req.user.id,
      { 
        $push: { booksPurchased: order._id },
        $pull: { cart: { book: bookId } }
      }
    );

    const populatedOrder = await Order.findById(order._id)
      .populate('buyer', 'name email phone')
      .populate('seller', 'name email phone')
      .populate('book', 'title author images');

    res.status(201).json({
      success: true,
      data: {
        order: populatedOrder
      },
      message: 'Order created successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { buyer: req.user.id };
    
    if (req.query.status) {
      query.orderStatus = req.query.status;
    }

    const orders = await Order.find(query)
      .populate('seller', 'name email phone rating.average')
      .populate('book', 'title author images')
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

const getMySales = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { seller: req.user.id };
    
    if (req.query.status) {
      query.orderStatus = req.query.status;
    }

    const orders = await Order.find(query)
      .populate('buyer', 'name email phone rating.average')
      .populate('book', 'title author images')
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

const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email phone address')
      .populate('seller', 'name email phone address')
      .populate('book', 'title author images condition')
      .populate('timeline.updatedBy', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.buyer._id.toString() !== req.user.id && 
        order.seller._id.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        order
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, message, trackingNumber } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    const validStatuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    order.orderStatus = status;
    
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (status === 'delivered') {
      order.actualDeliveryDate = new Date();
      // Automatically mark payment as paid when order is delivered
      if (order.paymentMethod === 'cash_on_delivery') {
        order.paymentStatus = 'paid';
      }
    }

    if (status === 'delivered' && order.book) {
      await Book.findByIdAndUpdate(
        order.book,
        { 
          status: 'sold',
          soldTo: order.buyer,
          soldAt: new Date()
        }
      );

      await User.findByIdAndUpdate(
        order.seller,
        { $push: { booksSold: order.book } }
      );
    }

    order.timeline.push({
      status,
      message: message || `Order status updated to ${status}`,
      updatedBy: req.user.id
    });

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .populate('book', 'title author');

    res.status(200).json({
      success: true,
      data: {
        order: updatedOrder
      },
      message: 'Order status updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.buyer.toString() !== req.user.id && 
        order.seller.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    if (['delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this order'
      });
    }

    order.orderStatus = 'cancelled';
    order.cancellationReason = reason;
    order.cancelledBy = req.user.id;
    order.cancelledAt = new Date();

    order.timeline.push({
      status: 'cancelled',
      message: `Order cancelled. Reason: ${reason}`,
      updatedBy: req.user.id
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

const addRating = async (req, res, next) => {
  try {
    const { rating, comment, type } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.orderStatus !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed orders'
      });
    }

    if (type === 'buyer' && order.buyer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to rate as buyer'
      });
    }

    if (type === 'seller' && order.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to rate as seller'
      });
    }

    if (type === 'buyer') {
      if (order.rating.buyerRating.rating) {
        return res.status(400).json({
          success: false,
          message: 'You have already rated this order'
        });
      }
      order.rating.buyerRating = {
        rating,
        comment,
        ratedAt: new Date()
      };
    } else if (type === 'seller') {
      if (order.rating.sellerRating.rating) {
        return res.status(400).json({
          success: false,
          message: 'You have already rated this order'
        });
      }
      order.rating.sellerRating = {
        rating,
        comment,
        ratedAt: new Date()
      };
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Rating added successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getMySales,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  addRating
};