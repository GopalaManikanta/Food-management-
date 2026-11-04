import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && requiredRole === 'Admin' && currentUser?.role !== 'Admin') {
      toast.info('Admin access required for Dashboard. Redirected to Customer Portal.');
    }
  }, [isAuthenticated, requiredRole, currentUser]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin-only route guard
  if (requiredRole === 'Admin' && currentUser?.role !== 'Admin') {
    return <Navigate to="/customer" replace />;
  }

  return children;
};

export default ProtectedRoute;
