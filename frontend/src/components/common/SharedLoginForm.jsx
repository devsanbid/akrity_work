// SharedLoginForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BookOpen, Mail, Lock, Eye, EyeOff, AlertCircle, X, Shield, Users } from 'lucide-react';

const SharedLoginForm = ({
  loginType = 'user',
  onSubmit,           // async function (data, setError)
  loadingText,
  showDemoInfo = false,
  onClose,
  footer,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Wrapper for onSubmit to pass setError too
  const handleFormSubmit = async (data) => {
    await onSubmit(data, setError);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
        )}
        {/* Header */}
        <div className={`p-6 text-white ${loginType === 'admin'
            ? 'bg-gradient-to-r from-red-600 to-red-800'
            : 'bg-gradient-to-r from-black to-gray-800'}`}>
          <div className="flex items-center space-x-3 mb-2">
            {loginType === 'admin' ? (
              <Shield className="w-8 h-8 text-yellow-400" />
            ) : (
              <BookOpen className="w-8 h-8 text-yellow-400" />
            )}
            <h2 className="text-2xl font-bold">
              {loginType === 'admin' ? 'Admin Login' : 'Welcome Back'}
            </h2>
          </div>
          <p className={loginType === 'admin' ? 'text-red-100' : 'text-gray-300'}>
            {loginType === 'admin'
              ? 'Access the admin dashboard'
              : 'Sign in to your KitabYatra account'}
          </p>
        </div>
        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {loginType === 'admin' ? 'Admin Email' : 'Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder={loginType === 'admin' ? 'Enter admin email' : 'Enter your email'}
                />
                {errors.email && (
                  <div className="flex items-center mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email.message}
                  </div>
                )}
              </div>
            </div>
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    }
                  })}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder={loginType === 'admin' ? 'Enter admin password' : 'Enter your password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword
                    ? <EyeOff className="w-5 h-5" />
                    : <Eye className="w-5 h-5" />}
                </button>
                {errors.password && (
                  <div className="flex items-center mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password.message}
                  </div>
                )}
              </div>
            </div>
            {/* Remember me / forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a
                href={loginType === 'admin' ? "/admin-forgot-password" : "/forgot-password"}
                className="text-sm text-yellow-600 hover:text-yellow-700 transition-colors"
              >
                Forgot password?
              </a>
            </div>
            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${loginType === 'admin'
                  ? 'bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900'
                  : 'bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black'
                }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {loadingText || 'Signing In...'}
                </div>
              ) : (
                loadingText || (loginType === 'admin' ? 'Access Admin Panel' : 'Sign In')
              )}
            </button>
          </form>

          {/* Demo Credentials for Admin */}
          {showDemoInfo && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs text-red-800 font-medium mb-1">Demo Admin Credentials:</p>
              <p className="text-xs text-red-700">Email: admin@kitabyatra.com</p>
              <p className="text-xs text-red-700">Password: admin123</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 text-center">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedLoginForm;
