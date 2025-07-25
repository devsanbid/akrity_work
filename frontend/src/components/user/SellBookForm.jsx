import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Camera, Upload, X, AlertCircle, CheckCircle, 
  User, Mail, Phone, MapPin, DollarSign, Package, FileText,
  Star, Calendar, Globe, Save, Eye, Plus, Trash2
} from 'lucide-react';
import { bookService } from '../../services/bookService';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const SellBookForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookImages, setBookImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    // Book Details
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publicationYear: '',
    edition: '',
    language: 'English',
    category: '',
    genre: '',
    pages: '',
    weight: '',
    dimensions: '',
    
    // Book Condition & Pricing
    condition: '',
    conditionDescription: '',
    originalPrice: '',
    sellingPrice: '',
    negotiable: false,
    
    // Book Description
    description: '',
    highlights: [''],
    keyFeatures: [''],
    
    // Seller Information
    sellerName: '',
    sellerEmail: '',
    sellerPhone: '',
    sellerAddress: '',
    sellerCity: '',
    sellerDistrict: '',
    sellerProvince: '',
    sellerPostalCode: '',
    
    // Delivery & Availability
    availableFrom: '',
    deliveryOptions: [],
    meetupLocations: [''],
    estimatedDeliveryTime: '',
    returnPolicy: '',
    
    // Additional Information
    reasonForSelling: '',
    purchaseDate: '',
    tags: [''],
    specialInstructions: ''
  });

  const categories = [
    'Academic', 'Fiction', 'Non-Fiction', 'Self-Help', 'Biography', 
    'Science', 'History', 'Romance', 'Mystery', 'Fantasy', 'Comics', 
    'Children', 'Reference', 'Textbook', 'Professional', 'Religious'
  ];

  const conditions = [
    { value: 'new', label: 'New - Never used, perfect condition' },
    { value: 'like-new', label: 'Like New - Minimal wear, excellent condition' },
    { value: 'very-good', label: 'Very Good - Minor wear, good condition' },
    { value: 'good', label: 'Good - Normal wear, readable condition' },
    { value: 'fair', label: 'Fair - Heavy wear but still functional' },
    { value: 'poor', label: 'Poor - Significant wear, may have damage' }
  ];

  const deliveryOptions = [
    { value: 'pickup', label: 'Pickup Only' },
    { value: 'delivery', label: 'Home Delivery' },
    { value: 'courier', label: 'Courier Service' },
    { value: 'meetup', label: 'Meetup Location' }
  ];

  const provinces = [
    'Province 1', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleArrayInputChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleDeliveryOptionChange = (option) => {
    setFormData(prev => ({
      ...prev,
      deliveryOptions: prev.deliveryOptions.includes(option)
        ? prev.deliveryOptions.filter(opt => opt !== option)
        : [...prev.deliveryOptions, option]
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    if (bookImages.length + files.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert('Each image should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select valid image files');
        return;
      }

      setBookImages(prev => [...prev, file]);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setBookImages(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Book title is required';
    if (!formData.author.trim()) newErrors.author = 'Author name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (!formData.sellingPrice) newErrors.sellingPrice = 'Selling price is required';
    if (bookImages.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          formData[key].forEach(item => {
            if (item.trim()) formDataToSend.append(key, item);
          });
        } else if (formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add images to FormData
      bookImages.forEach(image => {
        formDataToSend.append('images', image);
      });
      
      const result = await bookService.createBookWithImages(formDataToSend);
      
      toast.success('Book listing submitted successfully! It will be reviewed by our team.');
      
      // Reset form
      setFormData({
        title: '',
        author: '',
        isbn: '',
        publisher: '',
        publicationYear: '',
        edition: '',
        language: 'English',
        category: '',
        genre: '',
        pages: '',
        weight: '',
        dimensions: '',
        condition: '',
        conditionDescription: '',
        originalPrice: '',
        sellingPrice: '',
        negotiable: false,
        description: '',
        highlights: [''],
        keyFeatures: [''],
        sellerName: '',
        sellerEmail: '',
        sellerPhone: '',
        sellerAddress: '',
        sellerCity: '',
        sellerDistrict: '',
        sellerProvince: '',
        sellerPostalCode: '',
        availableFrom: '',
        deliveryOptions: [],
        meetupLocations: [''],
        estimatedDeliveryTime: '',
        returnPolicy: '',
        reasonForSelling: '',
        purchaseDate: '',
        tags: [''],
        specialInstructions: ''
      });
      setBookImages([]);
      setImagePreview([]);
      setCurrentStep(1);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error(`Submission failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Sell Your Book</h2>
        <p className="text-gray-600">List your book and connect with buyers across Nepal</p>
      </div>

      <div className="space-y-8">
        {/* Book Images */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Camera className="w-6 h-6 mr-2 text-yellow-500" />
            Book Images (Required)
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {imagePreview.map((image, index) => (
              <div key={index} className="relative">
                <img 
                  src={image} 
                  alt={`Book ${index + 1}`} 
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {bookImages.length < 10 && (
              <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-yellow-500 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Add Image</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          
          <p className="text-sm text-gray-600">
            Upload up to 10 high-quality images. First image will be the main display image.
          </p>
          {errors.images && (
            <div className="flex items-center mt-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.images}
            </div>
          )}
        </div>

        {/* Basic Book Information */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-yellow-500" />
            Basic Book Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Book Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter the complete book title"
              />
              {errors.title && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.title}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                  errors.author ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Author name"
              />
              {errors.author && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.author}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.category}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="English">English</option>
                <option value="Nepali">Nepali</option>
                <option value="Hindi">Hindi</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Condition & Pricing */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-yellow-500" />
            Condition & Pricing
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Book Condition *</label>
              <div className="space-y-2">
                {conditions.map((condition) => (
                  <label key={condition.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="condition"
                      value={condition.value}
                      checked={formData.condition === condition.value}
                      onChange={(e) => handleInputChange('condition', e.target.value)}
                      className="text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="ml-3 text-sm">{condition.label}</span>
                  </label>
                ))}
              </div>
              {errors.condition && (
                <div className="flex items-center mt-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.condition}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (Rs.)</label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Original purchase price"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (Rs.) *</label>
                <input
                  type="number"
                  value={formData.sellingPrice}
                  onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                    errors.sellingPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Your selling price"
                  min="0"
                />
                {errors.sellingPrice && (
                  <div className="flex items-center mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.sellingPrice}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.negotiable}
                  onChange={(e) => handleInputChange('negotiable', e.target.checked)}
                  className="text-yellow-500 focus:ring-yellow-500"
                />
                <span className="ml-2 text-sm text-gray-700">Price is negotiable</span>
              </label>
            </div>
          </div>
        </div>

        {/* Book Description */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-yellow-500" />
            Book Description
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              rows="4"
              placeholder="Describe the book content, why you're selling, any special features..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-black to-gray-800 text-white px-8 py-4 rounded-xl font-semibold hover:from-gray-800 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Submitting...
              </div>
            ) : (
              'Submit Book Listing'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellBookForm;