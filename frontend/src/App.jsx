import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { Toaster } from 'sonner';

import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import AuthRoute from './components/common/AuthRoute';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import BrowsePage from './pages/BrowsePage.jsx';
import BookDetailPage from './pages/BookDetailPage.jsx';
import UserLoginPage from './pages/user/UserLoginPage.jsx';
import SignupPage from './pages/user/SignupPage.jsx';
import DashboardPage from './pages/user/DashboardPage.jsx';
import CartPage from './pages/user/CartPage.jsx';
import OrderDetailPage from './pages/user/OrderDetailPage.jsx';
import ForgotPasswordPage from './pages/user/ForgotPasswordPage.jsx';
import SellBookForm from './components/user/SellBookForm.jsx';

import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import OverviewPage from './pages/admin/OverviewPage.jsx';
import UsersPage from './pages/admin/UsersPage.jsx';
import BooksPage from './pages/admin/BooksPage.jsx';
import ApprovalsPage from './pages/admin/ApprovalsPage.jsx';
import ReportsPage from './pages/admin/ReportsPage.jsx';
import AnalyticsPage from './pages/admin/AnalyticsPage.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="browse" element={<BrowsePage />} />
            <Route path="book/:id" element={<BookDetailPage />} />
            <Route path="sell" element={
              <ProtectedRoute>
                <SellBookForm />
              </ProtectedRoute>
            } />
            
            <Route path="dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="cart" element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } />
            <Route path="order/:id" element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="/login" element={
            <AuthRoute>
              <UserLoginPage />
            </AuthRoute>
          } />
          <Route path="/signup" element={
            <AuthRoute>
              <SignupPage />
            </AuthRoute>
          } />
          <Route path="/forgot-password" element={
            <AuthRoute>
              <ForgotPasswordPage />
            </AuthRoute>
          } />

          <Route path="/admin/login" element={
            <AuthRoute>
              <AdminLoginPage />
            </AuthRoute>
          } />

          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route path="dashboard" element={<OverviewPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="books" element={<BooksPage />} />
            <Route path="approvals" element={<ApprovalsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>
        </Routes>
        <Toaster position="top-right" richColors />
      </Router>
    </AuthProvider>
  );
}

export default App;