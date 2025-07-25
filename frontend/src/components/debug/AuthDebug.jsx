import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import orderService from '../../services/orderService';

const AuthDebug = () => {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [testResult, setTestResult] = useState(null);

  const testAuth = async () => {
    const token = localStorage.getItem('token');
    console.log('Auth Debug:', {
      isLoggedIn,
      user: user ? { id: user._id, email: user.email, role: user.role } : null,
      token: token ? `${token.substring(0, 20)}...` : 'No token'
    });

    // Test API call
    try {
      const response = await fetch('http://localhost:4000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      setTestResult({
        status: response.status,
        ok: response.ok,
        data: result
      });
    } catch (error) {
      setTestResult({
        error: error.message
      });
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-2 text-sm">
        <p>Logged In: {isLoggedIn ? 'Yes' : 'No'}</p>
        <p>User: {user ? `${user.email} (${user.role})` : 'None'}</p>
        <p>Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}</p>
      </div>
      
      <button 
        onClick={testAuth}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
      >
        Test Auth
      </button>
      
      {testResult && (
        <div className="mt-2 p-2 bg-white rounded text-xs">
          <pre>{JSON.stringify(testResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AuthDebug;