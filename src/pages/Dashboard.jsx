import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Store,
  UtensilsCrossed,
  ShoppingBag,
  Bike,
  CheckCircle2,
  Users,
  TrendingUp,
  PlusCircle,
  Search,
  Clock,
  LogOut,
  X,
  ChefHat,
  Zap,
  Flame,
  ArrowUpRight,
  Receipt,
  Trash2
} from 'lucide-react';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // 1. Live Clock State
  const [currentDateTime, setCurrentDateTime] = useState('');

  // 2. Real-Time Orders List (Starts at ZERO: Empty array [])
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('food_delivery_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  // 3. Real-Time Counters (Starts at ZERO: 0)
  const [totalFoodItems, setTotalFoodItems] = useState(() => {
    const saved = localStorage.getItem('food_delivery_food_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [totalRestaurants, setTotalRestaurants] = useState(() => {
    const saved = localStorage.getItem('food_delivery_restaurant_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Total Customers starts strictly at 0 and increments dynamically with unique customer orders
  const totalCustomers = useMemo(() => {
    if (orders.length === 0) return 0;
    return new Set(orders.map((o) => o.customerName)).size;
  }, [orders]);

  // 4. UI Filters & Modals
  const [revenuePeriod, setRevenuePeriod] = useState('Today');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [isAddRestaurantModalOpen, setIsAddRestaurantModalOpen] = useState(false);
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);

  // Form states
  const [newFood, setNewFood] = useState({
    name: '',
    category: 'Biryani',
    restaurantName: '',
    price: '',
    prepTime: '20 mins'
  });

  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    cuisine: 'Multi-Cuisine',
    location: 'Hyderabad'
  });

  // Sync orders to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('food_delivery_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to sync orders to localStorage', e);
    }
  }, [orders]);

  // Sync food count to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('food_delivery_food_count', totalFoodItems.toString());
    } catch (e) {
      console.error('Failed to sync food count', e);
    }
  }, [totalFoodItems]);

  // Sync restaurant count to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('food_delivery_restaurant_count', totalRestaurants.toString());
    } catch (e) {
      console.error('Failed to sync restaurant count', e);
    }
  }, [totalRestaurants]);

  // Live Clock Ticker
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

  // Compute Live Metrics dynamically from real-time state
  const metrics = useMemo(() => {
    const totalOrdersCount = orders.length;
    const activeOrdersCount = orders.filter(
      (o) => o.status === 'Preparing' || o.status === 'Out for Delivery'
    ).length;
    const deliveredOrdersCount = orders.filter((o) => o.status === 'Delivered').length;
    const totalRevenueCalc = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      totalRestaurants,
      totalFoodItems,
      totalOrders: totalOrdersCount,
      activeOrders: activeOrdersCount,
      deliveredOrders: deliveredOrdersCount,
      totalCustomers,
      totalRevenue: totalRevenueCalc
    };
  }, [orders, totalFoodItems, totalRestaurants, totalCustomers]);

  // Filtered Orders for the Table
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.restaurantName.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === 'Active') {
        return order.status === 'Preparing' || order.status === 'Out for Delivery';
      }
      if (statusFilter === 'Delivered') {
        return order.status === 'Delivered';
      }
      if (statusFilter === 'Cancelled') {
        return order.status === 'Cancelled';
      }
      return true;
    });
  }, [orders, searchQuery, statusFilter]);

  // Real-Time Action: Advance Order Status
  const handleAdvanceStatus = (orderId) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        if (order.status === 'Preparing') {
          toast.info(`Order #${order.id} is now Out for Delivery! 🛵`);
          return { ...order, status: 'Out for Delivery' };
        }
        if (order.status === 'Out for Delivery') {
          toast.success(`Order #${order.id} marked as Delivered! 🎉`);
          return { ...order, status: 'Delivered' };
        }
        return order;
      })
    );
  };

  // Real-Time Action: Cancel an Order
  const handleCancelOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        toast.warn(`Order #${order.id} has been cancelled.`);
        return { ...order, status: 'Cancelled' };
      })
    );
  };

  // Real-Time Action: Simulate a live incoming mock order (Increases 0 to 1, 2...)
  const handleSimulateLiveOrder = () => {
    const customerNames = ['Aarav Patel', 'Divya Sen', 'Sameer Khan', 'Kavya Rao', 'Nikhil Joshi', 'Priya Sharma'];
    const sampleDishes = [
      { name: 'Special Chicken Dum Biryani', price: 299, rest: 'Paradise Royale' },
      { name: 'Wood-Fired Truffle Pizza', price: 380, rest: 'Artisan Crust Co.' },
      { name: 'Double Smash Gourmet Burger', price: 249, rest: 'Burger District' },
      { name: 'Paneer Butter Masala & Naan', price: 310, rest: 'Punjabi Rasoi' },
      { name: 'Belgian Chocolate Waffle', price: 220, rest: 'The Dessert Club' }
    ];

    const randomCustomer = customerNames[Math.floor(Math.random() * customerNames.length)];
    const randomDish = sampleDishes[Math.floor(Math.random() * sampleDishes.length)];
    const randomId = `CRV-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrderObj = {
      id: randomId,
      customerName: randomCustomer,
      customerPhone: '+91 98' + Math.floor(10000000 + Math.random() * 90000000),
      deliveryAddress: 'Flat 402, Jubilee Hills, Hyderabad',
      restaurantName: randomDish.rest,
      items: [{ name: randomDish.name, qty: 1, price: randomDish.price }],
      totalAmount: randomDish.price,
      status: 'Preparing',
      paymentMethod: 'UPI',
      createdAt: 'Just now',
      timestamp: Date.now()
    };

    setOrders((prev) => [newOrderObj, ...prev]);
    // Also increment restaurants if at 0
    if (totalRestaurants === 0) setTotalRestaurants(1);
    if (totalFoodItems === 0) setTotalFoodItems(1);

    toast.success(`⚡ Live Order Placed! #${randomId} from ${randomCustomer} (₹${randomDish.price})`);
  };

  // Real-Time Action: Add New Food Item (Increases 0 to 1, 2...)
  const handleCreateFoodItem = (e) => {
    e.preventDefault();
    if (!newFood.name.trim() || !newFood.price) {
      toast.error('Please enter valid dish name and price');
      return;
    }
    setTotalFoodItems((prev) => prev + 1);
    setIsAddFoodModalOpen(false);
    toast.success(`"${newFood.name}" added to menu catalog! 🍲`);
    setNewFood({
      name: '',
      category: 'Biryani',
      restaurantName: '',
      price: '',
      prepTime: '20 mins'
    });
  };

  // Real-Time Action: Add New Restaurant (Increases 0 to 1, 2...)
  const handleCreateRestaurant = (e) => {
    e.preventDefault();
    if (!newRestaurant.name.trim()) {
      toast.error('Please enter restaurant name');
      return;
    }
    setTotalRestaurants((prev) => prev + 1);
    setIsAddRestaurantModalOpen(false);
    toast.success(`"${newRestaurant.name}" onboarded successfully! 🏪`);
    setNewRestaurant({
      name: '',
      cuisine: 'Multi-Cuisine',
      location: 'Hyderabad'
    });
  };

  // Clear / Reset All Data back to ZERO (0)
  const handleClearAllToZero = () => {
    setOrders([]);
    setTotalFoodItems(0);
    setTotalRestaurants(0);
    localStorage.removeItem('food_delivery_orders');
    localStorage.removeItem('food_delivery_food_count');
    localStorage.removeItem('food_delivery_restaurant_count');
    toast.info('Dashboard reset to 0! All counts and orders cleared.');
  };

  // Logout
  const handleLogout = () => {
    const res = logout();
    if (res.success) {
      toast.info(res.message);
      navigate('/login');
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Preparing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            Preparing
          </span>
        );
      case 'Out for Delivery':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Bike className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
            On the way
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <X className="w-3.5 h-3.5 text-rose-600" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  // Dynamic Revenue Calculation
  const revenueData = useMemo(() => {
    const calculatedGross = metrics.totalRevenue;
    const platformFee = Math.round(calculatedGross * 0.15); // 15% platform commission
    const deliveryPartnerPayout = Math.round(calculatedGross * 0.18);
    const restaurantShare = calculatedGross - platformFee - deliveryPartnerPayout;
    const avgOrderValue = orders.length > 0 ? Math.round(calculatedGross / orders.length) : 0;

    return {
      label: `${revenuePeriod}'s Revenue`,
      calculatedGross,
      platformFee,
      restaurantShare,
      deliveryPartnerPayout,
      avgOrderValue
    };
  }, [revenuePeriod, metrics.totalRevenue, orders.length]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col select-none">
      
      {/* 1. TOP RESPONSIVE NAVIGATION HEADER */}
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-2xs">
        
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-600 text-white shadow-md shadow-orange-500/20">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-lg sm:text-xl text-slate-900 tracking-tight leading-tight">
              Crave<span className="text-orange-600">Dash</span>
            </h1>
            <span className="hidden sm:block text-[10px] text-orange-600 font-extrabold uppercase tracking-wider -mt-1">
              Food Delivery Management
            </span>
          </div>
        </div>

        {/* Live Clock & Action Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Live Date-Time Pill */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-700">
            <Clock className="w-3.5 h-3.5 text-orange-600" />
            <span>{currentDateTime}</span>
          </div>

          {/* Quick Mock Order Simulator Button */}
          <button
            type="button"
            onClick={handleSimulateLiveOrder}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-md shadow-orange-600/20 cursor-pointer active:scale-95"
            title="Create a mock order to test live state"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>+ Create Mock Order</span>
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
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
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight max-w-[100px] truncate">
                {currentUser?.name || 'User'}
              </span>
              <span className="text-[10px] text-orange-600 font-semibold leading-tight">
                {currentUser?.role || 'Admin'}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Welcome Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 p-6 sm:p-8 text-white overflow-hidden shadow-xl">
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2 border border-white/25">
                <Flame className="w-3.5 h-3.5 text-amber-200 fill-current" />
                <span>Real-Time Food Delivery Management</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Welcome, {currentUser?.name || 'Admin'}! 👋
              </h2>
              <p className="text-sm text-orange-100 mt-1 max-w-xl">
                System starts at <b>0</b>. Use the Quick Action cards or click "+ Create Mock Order" to see live counters update in real time!
              </p>
            </div>

            {/* Clear All to Zero Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClearAllToZero}
                className="px-3.5 py-2 rounded-2xl bg-white/20 hover:bg-rose-600/60 backdrop-blur-md border border-white/30 text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer"
                title="Reset all counts and orders to 0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset to 0</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. METRICS / STAT CARDS GRID (STARTS AT 0) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Total Restaurants */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100">
                <Store className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Live
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Restaurants</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{metrics.totalRestaurants}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Onboarded partners</p>
          </div>

          {/* Total Food Items */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Menu
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Food Items</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{metrics.totalFoodItems}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Dishes in catalog</p>
          </div>

          {/* Total Orders */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Total
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{metrics.totalOrders}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Orders placed</p>
          </div>

          {/* Active Orders */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-orange-200/80 bg-gradient-to-br from-white to-orange-50/30 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-2xl bg-orange-600 text-white shadow-md shadow-orange-600/20">
                <Bike className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                metrics.activeOrders > 0 ? 'bg-orange-600 text-white animate-pulse' : 'bg-slate-200 text-slate-600'
              }`}>
                {metrics.activeOrders > 0 ? 'Live' : 'Idle'}
              </span>
            </div>
            <p className="text-xs font-bold text-orange-900 uppercase tracking-wider">Active Orders</p>
            <h3 className="text-xl sm:text-2xl font-black text-orange-600 mt-0.5">{metrics.activeOrders}</h3>
            <p className="text-[11px] text-orange-700/80 font-medium mt-1">In kitchen / Transit</p>
          </div>

          {/* Delivered Orders */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Done
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Delivered</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{metrics.deliveredOrders}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Successfully dropped</p>
          </div>

          {/* Total Customers */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                Users
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customers</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{metrics.totalCustomers}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Registered users</p>
          </div>

        </div>

        {/* 4. QUICK ACTION CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Quick Action 1: Add New Food Item */}
          <button
            type="button"
            onClick={() => setIsAddFoodModalOpen(true)}
            className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50/30 transition shadow-2xs group text-left cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-2xl bg-orange-100 text-orange-600 group-hover:scale-110 transition">
                <PlusCircle className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Add New Food Item</h4>
            <p className="text-xs text-slate-500 mt-1">Add a dish to increase Total Food Items</p>
          </button>

          {/* Quick Action 2: Simulate Live Order */}
          <button
            type="button"
            onClick={handleSimulateLiveOrder}
            className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 transition shadow-2xs group text-left cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-2xl bg-amber-100 text-amber-600 group-hover:scale-110 transition">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Live Test
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900">Create Mock Order</h4>
            <p className="text-xs text-slate-500 mt-1">Dispatches an active order and updates live table</p>
          </button>

          {/* Quick Action 3: Add Restaurant Partner */}
          <button
            type="button"
            onClick={() => setIsAddRestaurantModalOpen(true)}
            className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition shadow-2xs group text-left cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-2xl bg-blue-100 text-blue-600 group-hover:scale-110 transition">
                <Store className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Onboard Restaurant</h4>
            <p className="text-xs text-slate-500 mt-1">Register a new restaurant partner</p>
          </button>

          {/* Quick Action 4: Revenue Audit Report */}
          <button
            type="button"
            onClick={() => setIsRevenueModalOpen(true)}
            className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition shadow-2xs group text-left cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-600 group-hover:scale-110 transition">
                <Receipt className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Revenue Breakdown</h4>
            <p className="text-xs text-slate-500 mt-1">Inspect earnings, fees, and payout share</p>
          </button>

        </div>

        {/* 5. REVENUE SUMMARY SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="font-black text-lg text-slate-900">Revenue Summary</h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {metrics.totalRevenue > 0 ? 'Active Billing' : '0 Orders Placed'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Real-time financial summary calculated from placed orders
              </p>
            </div>

            {/* Period Filters */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-bold text-slate-600">
              {['Today', 'This Week', 'This Month', 'All Time'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setRevenuePeriod(p)}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    revenuePeriod === p
                      ? 'bg-white text-orange-600 shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Revenue Key Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            
            <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
              <span className="text-xs font-bold text-orange-900 uppercase tracking-wider">
                {revenueData.label}
              </span>
              <h4 className="text-2xl font-black text-orange-600 mt-1">
                ₹{revenueData.calculatedGross.toLocaleString('en-IN')}
              </h4>
              <p className="text-[11px] text-orange-700/80 mt-1">From active/completed orders</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Platform Commission (15%)
              </span>
              <h4 className="text-2xl font-black text-slate-900 mt-1">
                ₹{revenueData.platformFee.toLocaleString('en-IN')}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">Net platform revenue</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Restaurant Payouts
              </span>
              <h4 className="text-2xl font-black text-slate-900 mt-1">
                ₹{revenueData.restaurantShare.toLocaleString('en-IN')}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">To restaurant partners</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Average Order Value
              </span>
              <h4 className="text-2xl font-black text-slate-900 mt-1">
                ₹{revenueData.avgOrderValue}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">Average cart size</p>
            </div>

          </div>

        </div>

        {/* 6. RECENT ORDERS MANAGEMENT TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          
          {/* Table Header & Search Bar */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-slate-900">Recent Orders</h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {filteredOrders.length} orders
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Live order tracking and fulfillment workflow
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              
              {/* Search Box */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search order ID, customer..."
                  className="w-full sm:w-64 pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-200 bg-slate-50"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600 overflow-x-auto">
                {['All', 'Active', 'Delivered', 'Cancelled'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setStatusFilter(tab)}
                    className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                      statusFilter === tab
                        ? 'bg-white text-orange-600 shadow-2xs font-extrabold'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* Table List / Empty State View */}
          <div className="overflow-x-auto">
            {filteredOrders.length === 0 ? (
              /* CLEAN EMPTY STATE UI */
              <div className="py-16 px-4 text-center">
                <div className="w-16 h-16 rounded-3xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-black text-lg text-slate-900">No Orders in the System (0)</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  The dashboard is currently at zero. Click the button below to create a mock order and watch live tracking in action!
                </p>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleSimulateLiveOrder}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-lg shadow-orange-600/20 transition cursor-pointer active:scale-95"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Create First Live Order</span>
                  </button>
                </div>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-extrabold">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Restaurant & Items</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4 text-right">Live Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/60 transition group cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-slate-900">
                        #{order.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{order.customerName}</div>
                        <div className="text-[11px] text-slate-400">{order.customerPhone}</div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-bold text-orange-600 block">{order.restaurantName}</span>
                        <span className="text-slate-600 truncate block text-[11px]">
                          {order.items.map((i) => `${i.name} (x${i.qty})`).join(', ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-black text-slate-900">
                        ₹{order.totalAmount}
                      </td>

                      <td className="py-3.5 px-4">
                        {getStatusBadge(order.status)}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-700">{order.paymentMethod}</div>
                        <div className="text-[10px] text-slate-400">{order.createdAt}</div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {order.status === 'Preparing' && (
                            <button
                              type="button"
                              onClick={() => handleAdvanceStatus(order.id)}
                              className="px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] border border-blue-200 transition cursor-pointer"
                              title="Dispatch order for delivery"
                            >
                              Dispatch 🛵
                            </button>
                          )}

                          {order.status === 'Out for Delivery' && (
                            <button
                              type="button"
                              onClick={() => handleAdvanceStatus(order.id)}
                              className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] border border-emerald-200 transition cursor-pointer"
                              title="Mark as delivered"
                            >
                              Deliver ✅
                            </button>
                          )}

                          {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                            <button
                              type="button"
                              onClick={() => handleCancelOrder(order.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                              title="Cancel order"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="px-2 py-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer text-[11px] font-semibold"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>

      </main>

      {/* 7. MODAL: ADD NEW FOOD ITEM */}
      {isAddFoodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 relative">
            <button
              type="button"
              onClick={() => setIsAddFoodModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2.5 rounded-2xl bg-orange-100 text-orange-600">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Add New Food Item</h3>
                <p className="text-xs text-slate-500">Insert dish to live menu catalog</p>
              </div>
            </div>

            <form onSubmit={handleCreateFoodItem} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mutton Ghee Roast Biryani"
                  value={newFood.name}
                  onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newFood.category}
                    onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                  >
                    <option value="Biryani">Biryani</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Burgers">Burgers</option>
                    <option value="North Indian">North Indian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="299"
                    value={newFood.price}
                    onChange={(e) => setNewFood({ ...newFood, price: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Restaurant Partner</label>
                <input
                  type="text"
                  placeholder="e.g. Paradise Royale"
                  value={newFood.restaurantName}
                  onChange={(e) => setNewFood({ ...newFood, restaurantName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddFoodModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition cursor-pointer"
                >
                  Save to Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. MODAL: ONBOARD RESTAURANT */}
      {isAddRestaurantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 relative">
            <button
              type="button"
              onClick={() => setIsAddRestaurantModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2.5 rounded-2xl bg-blue-100 text-blue-600">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Onboard Restaurant</h3>
                <p className="text-xs text-slate-500">Add restaurant to increase partner count</p>
              </div>
            </div>

            <form onSubmit={handleCreateRestaurant} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Restaurant Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Spice Kitchen"
                  value={newRestaurant.name}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Cuisine</label>
                <input
                  type="text"
                  placeholder="e.g. Mughlai, North Indian, Biryani"
                  value={newRestaurant.cuisine}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, cuisine: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location / Area</label>
                <input
                  type="text"
                  placeholder="e.g. Madhapur, Hyderabad"
                  value={newRestaurant.location}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, location: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddRestaurantModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition cursor-pointer"
                >
                  Register Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. MODAL: ORDER DETAILS */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400">Order #{selectedOrder.id}</span>
                <h3 className="font-black text-xl text-slate-900 mt-0.5">{selectedOrder.restaurantName}</h3>
              </div>
              <div className="mr-8">
                {getStatusBadge(selectedOrder.status)}
              </div>
            </div>

            {/* Customer & Address */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="font-bold text-slate-800">{selectedOrder.customerName} ({selectedOrder.customerPhone})</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-slate-400 shrink-0">Address:</span>
                <span className="font-medium text-slate-800 text-right max-w-xs">{selectedOrder.deliveryAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment:</span>
                <span className="font-bold text-slate-800">{selectedOrder.paymentMethod}</span>
              </div>
            </div>

            {/* Items Breakdown */}
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Itemized Bill</h4>
            <div className="divide-y divide-slate-100 mb-4">
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="py-2.5 flex justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{it.name}</span>
                    <span className="text-slate-400 ml-2">x{it.qty}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">₹{it.price * it.qty}</span>
                </div>
              ))}
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-center p-3.5 rounded-2xl bg-orange-50 border border-orange-100 text-orange-950 text-sm font-bold mb-4">
              <span>Total Amount Paid:</span>
              <span className="text-lg font-black text-orange-600">₹{selectedOrder.totalAmount}</span>
            </div>

            {/* Status Change CTA in modal */}
            {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleAdvanceStatus(selectedOrder.id);
                    setSelectedOrder(null);
                  }}
                  className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition cursor-pointer"
                >
                  {selectedOrder.status === 'Preparing' ? 'Dispatch for Delivery 🛵' : 'Mark as Delivered ✅'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 10. MODAL: REVENUE REPORT DETAILS */}
      {isRevenueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 relative">
            <button
              type="button"
              onClick={() => setIsRevenueModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-600">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Revenue Audit Report</h3>
                <p className="text-xs text-slate-500">Financial distribution for {revenuePeriod}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="p-3 bg-slate-50 rounded-2xl flex justify-between">
                <span className="text-slate-500">Gross Total Revenue:</span>
                <span className="font-black text-slate-900">₹{revenueData.calculatedGross.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl flex justify-between">
                <span className="text-slate-500">Platform Commission (15%):</span>
                <span className="font-bold text-orange-600">₹{revenueData.platformFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl flex justify-between">
                <span className="text-slate-500">Restaurant Payout:</span>
                <span className="font-bold text-slate-800">₹{revenueData.restaurantShare.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl flex justify-between">
                <span className="text-slate-500">Delivery Partner Pool (18%):</span>
                <span className="font-bold text-slate-800">₹{revenueData.deliveryPartnerPayout.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl flex justify-between">
                <span className="text-slate-500">Total Orders Settled:</span>
                <span className="font-bold text-slate-800">{metrics.totalOrders}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                toast.success('Financial report exported to CSV successfully! 📊');
                setIsRevenueModalOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              Export Report to CSV
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
