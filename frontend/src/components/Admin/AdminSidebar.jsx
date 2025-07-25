import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Users, BookOpen, CheckCircle, Shield, PieChart } from 'lucide-react';

const AdminSidebar = ({ pendingApprovals = 0, reportedItems = 0 }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      path: '/admin/dashboard'
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      path: '/admin/users'
    },
    {
      id: 'books',
      label: 'Books',
      icon: BookOpen,
      path: '/admin/books'
    },
    {
      id: 'approvals',
      label: 'Approvals',
      icon: CheckCircle,
      path: '/admin/approvals',
      badge: pendingApprovals
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: Shield,
      path: '/admin/reports',
      badge: reportedItems
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: PieChart,
      path: '/admin/analytics'
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
                isActive(item.path) ? 'bg-red-50 text-red-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <Icon className="w-5 h-5 mr-2" />
                {item.label}
              </div>
              {item.badge && item.badge > 0 && (
                <span className={`text-xs rounded-full w-5 h-5 flex items-center justify-center text-white ${
                  item.id === 'approvals' ? 'bg-orange-500' : 'bg-red-500'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;