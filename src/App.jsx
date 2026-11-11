import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RestaurantProvider } from './context/RestaurantContext';
import { MenuProvider } from './context/MenuContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import CartDrawer from './components/CartDrawer';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import CustomerPortal from './pages/CustomerPortal';
import RestaurantList from './pages/RestaurantList';
import RestaurantDetails from './pages/RestaurantDetails';
import MenuManagement from './pages/MenuManagement';
import FoodDetails from './pages/FoodDetails';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';

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
        <MenuProvider>
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

                {/* Shared Menu Catalog & Food Ordering (For both Admin & Customer) */}
                <Route
                  path="/menu"
                  element={
                    <ProtectedRoute>
                      <MenuManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/menu/:id"
                  element={
                    <ProtectedRoute>
                      <FoodDetails />
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

                {/* Dedicated Swiggy/Zomato Checkout Page */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />

                {/* Real-Time Live Order Confirmation & Live Pipeline Tracking */}
                <Route
                  path="/order-confirmation/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderConfirmation />
                    </ProtectedRoute>
                  }
                />

                {/* Shared Restaurant Catalog & Details (For both Admin & Customer) */}
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

              {/* Global Real-Time Cart Drawer accessible across all pages */}
              <CartDrawer />

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
        </MenuProvider>
      </RestaurantProvider>
    </AuthProvider>
  );
}

export default App;
