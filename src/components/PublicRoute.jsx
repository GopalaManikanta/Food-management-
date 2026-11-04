import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, currentUser } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={currentUser?.role === 'Customer' ? '/customer' : '/dashboard'} replace />;
  }

  return children;
};

export default PublicRoute;
