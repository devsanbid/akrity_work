import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SharedLoginForm from '../../components/common/SharedLoginForm.jsx';
import { useAuth } from '../../context/AuthContext';

const UserLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn, user } = useAuth();

  const from = location.state?.from?.pathname || '/browse';

  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isLoggedIn, user, navigate, from]);

  const handleUserLogin = async (data, setError) => {
    try {
      let result = await login(data.email, data.password, false);
      
      if (!result.success) {
        result = await login(data.email, data.password, true);
      }
      
      if (!result.success) {
        setError('email', { message: 'Invalid credentials' });
        setError('password', { message: 'Invalid credentials' });
        return;
      }

      if (result.user && result.user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      setError('email', { message: 'Login failed. Please try again.' });
      setError('password', { message: 'Login failed. Please try again.' });
    }
  };

  return (
    <SharedLoginForm
      loginType="user"
      onSubmit={handleUserLogin}
      loadingText="Login"
      onClose={() => navigate('/')}
      footer={
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-yellow-600 hover:text-yellow-700 font-semibold transition-colors"
            >
              Sign up
            </button>
          </p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Forgot your password?
          </button>
        </div>
      }
    />
  );
};

export default UserLoginPage;