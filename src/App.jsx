import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RestaurantProvider } from './context/RestaurantContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import CustomerPortal from './pages/CustomerPortal';
import RestaurantList from './pages/RestaurantList';
import RestaurantDetails from './pages/RestaurantDetails';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Dynamic Root Redirect based on user's active role
const RootRedirect = () => {
  const { currentUser, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return currentUser?.role === 'Customer' ? (
    <Navigate to="/customer" replace />
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

function App() {
  return (
    <AuthProvider>
      <RestaurantProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Public Routes (Accessible only when logged out) */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PublicRoute>
                    <ForgotPassword />
                  </PublicRoute>
                }
              />

              {/* Admin-Only Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Customer Portal (Live Tracking, Order History, Addresses) */}
              <Route
                path="/customer"
                element={
                  <ProtectedRoute>
                    <CustomerPortal />
                  </ProtectedRoute>
                }
              />

              {/* Shared Catalog & Details (For both Admin & Customer) */}
              <Route
                path="/restaurants"
                element={
                  <ProtectedRoute>
                    <RestaurantList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/restaurants/:id"
                element={
                  <ProtectedRoute>
                    <RestaurantDetails />
                  </ProtectedRoute>
                }
              />

              {/* Root and Fallback redirects dynamically based on active role */}
              <Route path="/" element={<RootRedirect />} />
              <Route path="*" element={<RootRedirect />} />
            </Routes>

            {/* Global Real-Time Toast Notifications */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </Router>
        </CartProvider>
      </RestaurantProvider>
    </AuthProvider>
  );
}

export default App;
