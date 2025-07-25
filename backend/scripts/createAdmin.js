const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kitabyatra');
    
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin account already exists!');
      console.log('Email: admin@gmail.com');
      console.log('Password: admin123');
      process.exit(0);
    }
    
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
      isActive: true
    });
    
    await adminUser.save();
    
    console.log('Admin account created successfully!');
    console.log('Email: admin@gmail.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin account:', error);
    process.exit(1);
  }
};

createAdmin();
