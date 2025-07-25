import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SharedLoginForm from '../../components/common/SharedLoginForm.jsx';
import { useAuth } from '../../context/AuthContext';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn, user } = useAuth();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.role === 'admin') {
        navigate(from, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isLoggedIn, user, navigate, from]);

  const handleAdminLogin = async (data, setError) => {
    try {
      const result = await login(data.email, data.password, true);
      
      if (result.success && result.user) {
        if (result.user.role === 'admin') {
          navigate(from, { replace: true });
        } else {
          setError('email', { message: 'Invalid admin credentials' });
          setError('password', { message: 'Invalid admin credentials' });
        }
      } else {
        setError('email', { message: 'Invalid admin credentials' });
        setError('password', { message: 'Invalid admin credentials' });
      }
    } catch (error) {
      setError('email', { message: 'Invalid admin credentials' });
      setError('password', { message: 'Invalid admin credentials' });
    }
  };

  return (
    <SharedLoginForm
      loginType="admin"
      onSubmit={handleAdminLogin}
      loadingText="Admin Login"
      onClose={() => navigate('/')}
      footer={
        <div className="text-center">
          <p className="text-gray-600">
            Not an admin?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-yellow-600 hover:text-yellow-700 font-semibold transition-colors"
            >
              User Login
            </button>
          </p>
        </div>
      }
    />
  );
};

export default AdminLoginPage;