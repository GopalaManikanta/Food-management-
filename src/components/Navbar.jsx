import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import {
  ChefHat,
  Clock,
  LogOut,
  Menu,
  X,
  Store,
  LayoutDashboard,
  ShieldCheck,
  ShoppingBag,
  Bike,
  User,
  UtensilsCrossed,
  MapPin,
  ChevronDown,
  RefreshCw
} from 'lucide-react';

const Navbar = () => {
  const { currentUser, switchRole, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Profile Dropdown Menu State
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Live Clock Ticker
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const isAdmin = currentUser?.role === 'Admin';


  // Logout Handler
  const handleLogout = () => {
    const res = logout();
    if (res.success) {
      toast.info(res.message);
      navigate('/login');
    }
  };

  const isDashboardActive = location.pathname === '/dashboard';
  const isRestaurantsActive = location.pathname.startsWith('/restaurants');
  const isMenuActive = location.pathname.startsWith('/menu');
  const isCustomerActive = location.pathname === '/customer';
  const isProfileActive = location.pathname === '/profile';

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-2xs">
      
      {/* 1. BRAND LOGO & TAG */}
      <div className="flex items-center gap-3">
        <Link to={isAdmin ? '/dashboard' : '/customer'} className="flex items-center gap-3 group">
          <div className="p-2 rounded-2xl bg-gradient-to-tr from-orange-500 via-rose-500 to-amber-500 text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-lg sm:text-xl text-slate-900 tracking-tight leading-tight">
              Crave<span className="text-orange-600">Dash</span>
            </h1>
            <span className="hidden sm:block text-[10px] text-orange-600 font-extrabold uppercase tracking-wider -mt-1">
              {isAdmin ? 'Admin Operations' : 'Customer Food Hub'}
            </span>
          </div>
        </Link>
      </div>

      {/* 2. CENTRAL NAVIGATION TABS (ROLE-AWARE) */}
      <nav className="hidden md:flex items-center bg-slate-100/80 p-1 rounded-2xl text-xs font-bold text-slate-600 border border-slate-200/60 shadow-2xs">
        {isAdmin ? (
          <>
            <Link
              to="/dashboard"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition duration-200 ${
                isDashboardActive
                  ? 'bg-white text-orange-600 shadow-xs font-black'
                  : 'hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/restaurants"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition duration-200 ${
                isRestaurantsActive
                  ? 'bg-white text-orange-600 shadow-xs font-black'
                  : 'hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Restaurants</span>
            </Link>

            <Link
              to="/menu"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition duration-200 ${
                isMenuActive
                  ? 'bg-white text-orange-600 shadow-xs font-black'
                  : 'hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Menu Management</span>
            </Link>

            <Link
              to="/profile"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition duration-200 ${
                isProfileActive
                  ? 'bg-white text-orange-600 shadow-xs font-black'
                  : 'hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>My Profile</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/restaurants"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition duration-200 ${
                isRestaurantsActive
                  ? 'bg-white text-orange-600 shadow-xs font-black'
                  : 'hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Explore Restaurants</span>
            </Link>

            <Link
              to="/menu"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition duration-200 ${
                isMenuActive
                  ? 'bg-white text-orange-600 shadow-xs font-black'
                  : 'hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Food Menu</span>
            </Link>

            <Link
              to="/customer"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition duration-200 ${
                isCustomerActive
                  ? 'bg-white text-orange-600 shadow-xs font-black'
                  : 'hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>My Orders</span>
            </Link>

            <Link
              to="/profile"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition duration-200 ${
                isProfileActive
                  ? 'bg-white text-orange-600 shadow-xs font-black'
                  : 'hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>My Profile & Addresses</span>
            </Link>
          </>
        )}
      </nav>

      {/* 3. RIGHT CONTROLS & PROFILE (DESKTOP) */}
      <div className="hidden lg:flex items-center gap-3">
        
        {/* Live Clock Pill with Green Pulse */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Clock className="w-3.5 h-3.5 text-orange-600" />
          <span>{currentDateTime}</span>
        </div>

        {/* Customer Cart Basket Button (Only shown for Customers, hidden for Admin) */}
        {!isAdmin && (
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-black transition cursor-pointer active:scale-95"
            title="Open Cart Basket"
          >
            <ShoppingBag className="w-4 h-4 text-orange-600" />
            <span>Basket</span>
            {itemCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-black animate-scaleIn">
                {itemCount}
              </span>
            )}
          </button>
        )}

        {/* Profile Pill with Interactive Dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            type="button"
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-2xl border border-slate-200 transition cursor-pointer active:scale-98"
            aria-label="User profile menu"
          >
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-orange-300"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-500 to-rose-600 text-white flex items-center justify-center font-bold text-xs">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight max-w-[110px] truncate">
                {currentUser?.name || (isAdmin ? 'Admin' : 'Customer')}
              </span>
              <span className="text-[10px] text-orange-600 font-bold leading-tight flex items-center gap-0.5">
                {isAdmin ? <ShieldCheck className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
                {currentUser?.role || (isAdmin ? 'Admin' : 'Customer')}
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180 text-orange-600' : ''}`} />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn divide-y divide-slate-100">
              
              {/* User Overview */}
              <div className="px-4 py-3 bg-slate-50/60 rounded-t-2xl">
                <p className="text-xs font-black text-slate-900 truncate">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser?.email || 'customer@foodie.com'}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 text-[10px] font-black uppercase tracking-wider">
                    {currentUser?.role || 'Customer'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">● Hyderabad Region</span>
                </div>
              </div>

              {/* Menu Links */}
              <div className="py-1 text-xs">
                <Link
                  to="/profile"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-orange-50 hover:text-orange-600 text-slate-700 font-bold transition"
                >
                  <User className="w-4 h-4 text-orange-600" />
                  <div>
                    <span className="block font-black text-slate-900">View & Edit Profile</span>
                    <span className="text-[10px] text-slate-400 font-normal">Name, phone, avatar</span>
                  </div>
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-orange-50 hover:text-orange-600 text-slate-700 font-bold transition"
                >
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <div>
                    <span className="block font-black text-slate-900">
                      {isAdmin ? 'Restaurant Outlet Address' : 'Saved Delivery Addresses'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {isAdmin ? 'Official outlet location' : 'Manage home & work spots'}
                    </span>
                  </div>
                </Link>

                <Link
                  to={isAdmin ? "/dashboard" : "/customer"}
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-orange-50 hover:text-orange-600 text-slate-700 font-bold transition"
                >
                  <Bike className="w-4 h-4 text-orange-600" />
                  <div>
                    <span className="block font-black text-slate-900">{isAdmin ? "Admin Operations" : "Orders & Tracking"}</span>
                    <span className="text-[10px] text-slate-400 font-normal">Live delivery status</span>
                  </div>
                </Link>
              </div>

              {/* Switch Role & Logout */}
              <div className="py-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    switchRole(isAdmin ? 'Customer' : 'Admin');
                    setIsProfileDropdownOpen(false);
                    navigate(isAdmin ? '/customer' : '/dashboard');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-amber-50 text-slate-700 hover:text-amber-800 font-bold transition cursor-pointer text-left"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                  <span>Switch to {isAdmin ? 'Customer View' : 'Admin Mode'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-bold transition cursor-pointer text-left"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Quick Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-100 cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>

      </div>

      {/* 4. MOBILE HAMBURGER BUTTON */}
      <div className="flex items-center gap-2 lg:hidden">
        {/* Mobile Cart Button (Only for Customers) */}
        {!isAdmin && (
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-200"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-orange-600 text-white text-[9px] font-black">
                {itemCount}
              </span>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* 5. MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-xl p-4 space-y-4 animate-fadeIn select-none">
          
          {/* User Info */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80'}
                alt={currentUser?.name}
                className="w-9 h-9 rounded-full object-cover border border-orange-300"
              />
              <div>
                <p className="text-xs font-black text-slate-900">{currentUser?.name || 'User'}</p>
                <p className="text-[10px] text-orange-600 font-bold">{currentUser?.role || 'User'}</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            {isAdmin ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    isDashboardActive ? 'bg-orange-50 text-orange-600 font-black' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-orange-600" />
                  <span>Admin Dashboard</span>
                </Link>

                <Link
                  to="/restaurants"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    isRestaurantsActive ? 'bg-orange-50 text-orange-600 font-black' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Store className="w-4 h-4 text-orange-600" />
                  <span>Restaurants</span>
                </Link>

                <Link
                  to="/menu"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    isMenuActive ? 'bg-orange-50 text-orange-600 font-black' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                  <span>Menu Management</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    isProfileActive ? 'bg-orange-50 text-orange-600 font-black' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-4 h-4 text-orange-600" />
                  <span>My Profile</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/restaurants"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    isRestaurantsActive ? 'bg-orange-50 text-orange-600 font-black' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Store className="w-4 h-4 text-orange-600" />
                  <span>Explore Restaurants</span>
                </Link>

                <Link
                  to="/menu"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    isMenuActive ? 'bg-orange-50 text-orange-600 font-black' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                  <span>Food Menu</span>
                </Link>

                <Link
                  to="/customer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    isCustomerActive ? 'bg-orange-50 text-orange-600 font-black' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Bike className="w-4 h-4 text-orange-600" />
                  <span>My Orders & Live Tracking</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    isProfileActive ? 'bg-orange-50 text-orange-600 font-black' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-4 h-4 text-orange-600" />
                  <span>My Profile & Addresses</span>
                </Link>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      )}

    </header>
  );
};

export default Navbar;
