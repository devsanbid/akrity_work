const mongoose = require('mongoose');
const Book = require('../models/Book');
const User = require('../models/User');
require('dotenv').config();

const sampleBooks = [
  {
    title: 'Introduction to Computer Science',
    author: 'John Smith',
    isbn: '978-0123456789',
    publisher: 'Tech Publications',
    publicationYear: 2020,
    edition: '3rd Edition',
    language: 'English',
    category: 'Computer Science',
    genre: 'Programming',
    pages: 450,
    condition: 'Good',
    conditionDescription: 'Minor wear on cover, pages in excellent condition',
    originalPrice: 89.99,
    sellingPrice: 45.99,
    negotiable: true,
    description: 'Comprehensive introduction to computer science fundamentals including programming, algorithms, and data structures.',
    highlights: ['Covers latest programming concepts', 'Includes practical examples', 'Updated for modern frameworks'],
    keyFeatures: ['500+ practice problems', 'Online resources included', 'Industry-relevant case studies'],
    availableFrom: new Date(),
    deliveryOptions: ['pickup', 'delivery'],
    meetupLocations: ['University Campus', 'City Center'],
    estimatedDeliveryTime: '2-3 days',
    returnPolicy: '7 days return policy',
    reasonForSelling: 'Course completed',
    purchaseDate: new Date('2023-01-15'),
    tags: ['programming', 'computer-science', 'algorithms'],
    status: 'approved',
    images: ['book-1753442459828-113104751.jpg']
  },
  {
    title: 'Calculus and Analytical Geometry',
    author: 'Robert Johnson',
    isbn: '978-0987654321',
    publisher: 'Math Academic Press',
    publicationYear: 2019,
    edition: '2nd Edition',
    language: 'English',
    category: 'Mathematics',
    genre: 'Calculus',
    pages: 680,
    condition: 'Excellent',
    conditionDescription: 'Like new condition, barely used',
    originalPrice: 120.00,
    sellingPrice: 75.00,
    negotiable: false,
    description: 'Complete guide to calculus with analytical geometry, perfect for engineering and mathematics students.',
    highlights: ['Step-by-step solutions', 'Visual learning aids', 'Comprehensive problem sets'],
    keyFeatures: ['1000+ solved examples', 'Interactive online content', 'Exam preparation guide'],
    availableFrom: new Date(),
    deliveryOptions: ['pickup', 'courier'],
    meetupLocations: ['Library', 'Coffee Shop Downtown'],
    estimatedDeliveryTime: '1-2 days',
    returnPolicy: '5 days return policy',
    reasonForSelling: 'Graduated',
    purchaseDate: new Date('2022-08-20'),
    tags: ['mathematics', 'calculus', 'geometry'],
    status: 'pending'
  },
  {
    title: 'Organic Chemistry Fundamentals',
    author: 'Sarah Davis',
    isbn: '978-0456789123',
    publisher: 'Science World',
    publicationYear: 2021,
    edition: '4th Edition',
    language: 'English',
    category: 'Chemistry',
    genre: 'Organic Chemistry',
    pages: 520,
    condition: 'Fair',
    conditionDescription: 'Some highlighting and notes, but all pages intact',
    originalPrice: 95.50,
    sellingPrice: 40.00,
    negotiable: true,
    description: 'Essential organic chemistry textbook covering all fundamental concepts with modern applications.',
    highlights: ['Updated reaction mechanisms', 'Real-world applications', 'Laboratory techniques'],
    keyFeatures: ['3D molecular models', 'Practice problems', 'Online simulations'],
    availableFrom: new Date(),
    deliveryOptions: ['pickup', 'delivery', 'meetup'],
    meetupLocations: ['Science Building', 'Student Center'],
    estimatedDeliveryTime: '3-4 days',
    returnPolicy: '3 days return policy',
    reasonForSelling: 'Changed major',
    purchaseDate: new Date('2023-02-10'),
    tags: ['chemistry', 'organic', 'science'],
    status: 'rejected',
    adminNotes: 'Book condition not suitable for sale'
  },
  {
    title: 'Modern Physics Concepts',
    author: 'Michael Brown',
    isbn: '978-0789123456',
    publisher: 'Physics Today',
    publicationYear: 2022,
    edition: '1st Edition',
    language: 'English',
    category: 'Physics',
    genre: 'Modern Physics',
    pages: 380,
    condition: 'Excellent',
    conditionDescription: 'Brand new condition, never used',
    originalPrice: 110.00,
    sellingPrice: 85.00,
    negotiable: false,
    description: 'Cutting-edge physics textbook covering quantum mechanics, relativity, and particle physics.',
    highlights: ['Latest research findings', 'Interactive simulations', 'Nobel Prize discoveries'],
    keyFeatures: ['Augmented reality content', 'Video lectures', 'Problem-solving strategies'],
    availableFrom: new Date(),
    deliveryOptions: ['pickup', 'delivery'],
    meetupLocations: ['Physics Department', 'Main Gate'],
    estimatedDeliveryTime: '1-2 days',
    returnPolicy: '10 days return policy',
    reasonForSelling: 'Duplicate copy',
    purchaseDate: new Date('2023-09-01'),
    tags: ['physics', 'quantum', 'relativity'],
    status: 'approved'
  },
  {
    title: 'Data Structures and Algorithms',
    author: 'Emily Wilson',
    isbn: '978-0321654987',
    publisher: 'Code Masters',
    publicationYear: 2023,
    edition: '5th Edition',
    language: 'English',
    category: 'Computer Science',
    genre: 'Programming',
    pages: 600,
    condition: 'Good',
    conditionDescription: 'Well-maintained with minimal wear',
    originalPrice: 99.99,
    sellingPrice: 60.00,
    negotiable: true,
    description: 'Comprehensive guide to data structures and algorithms with practical implementations.',
    highlights: ['Multiple programming languages', 'Time complexity analysis', 'Real-world examples'],
    keyFeatures: ['Code repositories', 'Interactive exercises', 'Interview preparation'],
    availableFrom: new Date(),
    deliveryOptions: ['pickup', 'courier', 'meetup'],
    meetupLocations: ['Computer Lab', 'Tech Hub'],
    estimatedDeliveryTime: '2-3 days',
    returnPolicy: '7 days return policy',
    reasonForSelling: 'Course finished',
    purchaseDate: new Date('2023-03-15'),
    tags: ['programming', 'algorithms', 'data-structures'],
    status: 'pending'
  }
];

const seedBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    let testUser = await User.findOne({ email: 'testuser@example.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Test User',
        email: 'testuser@example.com',
        password: '$2a$10$dummy.hash.for.testing.purposes.only',
        phone: '1234567890',
        address: {
          street: '123 Test Street',
          city: 'Test City',
          district: 'Test District',
          province: 'Test Province',
          postalCode: '12345'
        },
        role: 'user'
      });
      console.log('Created test user');
    }

    await Book.deleteMany({});
    console.log('Cleared existing books');

    for (const bookData of sampleBooks) {
      const book = await Book.create({
        ...bookData,
        seller: testUser._id,
        sellerInfo: {
          name: testUser.name,
          email: testUser.email,
          phone: testUser.phone,
          address: testUser.address
        }
      });
      console.log(`Created book: ${book.title}`);
    }

    console.log(`Successfully seeded ${sampleBooks.length} books`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding books:', error);
    process.exit(1);
  }
};

seedBooks();