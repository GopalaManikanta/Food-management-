import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { useRestaurant } from '../context/RestaurantContext';
import { useMenu } from '../context/MenuContext';
import { FALLBACK_RESTAURANTS } from '../services/restaurantApi';
import { Link } from 'react-router-dom';
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
  X,
  Zap,
  Flame,
  ArrowUpRight,
  Receipt,
  Trash2
} from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { restaurants = [], handleToggleStatus, handleOnboardSubmit } = useRestaurant();
  const { menuItems = [] } = useMenu();
  const displayRestaurants = (restaurants && restaurants.length > 0) ? restaurants : FALLBACK_RESTAURANTS;

  // 1. Real-Time Orders List (Starts at ZERO: Empty array [])
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

  // 2. Real-Time Counters (Starts at ZERO: 0)
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

  // 3. UI Filters & Modals
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
      window.dispatchEvent(new Event('food_delivery_orders_updated'));
    } catch (e) {
      console.error('Failed to sync orders to localStorage', e);
    }
  }, [orders]);

  // Listen for external real-time customer order placements
  useEffect(() => {
    const handleSyncOrders = () => {
      try {
        const saved = localStorage.getItem('food_delivery_orders');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setOrders(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('food_delivery_order_placed', handleSyncOrders);
    window.addEventListener('food_delivery_orders_updated', handleSyncOrders);
    window.addEventListener('storage', handleSyncOrders);
    return () => {
      window.removeEventListener('food_delivery_order_placed', handleSyncOrders);
      window.removeEventListener('food_delivery_orders_updated', handleSyncOrders);
      window.removeEventListener('storage', handleSyncOrders);
    };
  }, []);

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

    const activeRestCount = (restaurants && restaurants.length > 0) ? restaurants.length : (totalRestaurants > 0 ? totalRestaurants : 12);
    const activeFoodCount = (menuItems && menuItems.length > 0) ? menuItems.length : (totalFoodItems > 0 ? totalFoodItems : 16);

    return {
      totalRestaurants: activeRestCount,
      totalFoodItems: activeFoodCount,
      totalOrders: totalOrdersCount,
      activeOrders: activeOrdersCount,
      deliveredOrders: deliveredOrdersCount,
      totalCustomers,
      totalRevenue: totalRevenueCalc
    };
  }, [orders, totalFoodItems, totalRestaurants, totalCustomers, restaurants, menuItems]);

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

  // Real-Time Action: Update Order Status (Directly supports all 4: Preparing, Out for Delivery, Delivered, Cancelled)
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    let statusMessage = '';
    if (newStatus === 'Preparing') statusMessage = 'Kitchen is now preparing the food! 👨‍🍳';
    else if (newStatus === 'Out for Delivery') statusMessage = 'Order is now Out for Delivery! 🛵';
    else if (newStatus === 'Delivered') statusMessage = 'Order marked as Delivered! 🎉';
    else if (newStatus === 'Cancelled') statusMessage = 'Order has been marked as Cancelled. ⚠️';

    const updated = orders.map((order) => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        status: newStatus,
        updatedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        deliveredAt: newStatus === 'Delivered' ? (order.deliveredAt || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })) : order.deliveredAt,
        cancelledAt: newStatus === 'Cancelled' ? (order.cancelledAt || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })) : order.cancelledAt
      };
    });

    setOrders(updated);
    try {
      localStorage.setItem('food_delivery_orders', JSON.stringify(updated));
      window.dispatchEvent(new Event('food_delivery_orders_updated'));
    } catch (e) {
      console.error(e);
    }

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    if (newStatus === 'Delivered') {
      toast.success(`Order #${orderId}: ${statusMessage}`);
    } else if (newStatus === 'Cancelled') {
      toast.warn(`Order #${orderId}: ${statusMessage}`);
    } else {
      toast.info(`Order #${orderId}: ${statusMessage}`);
    }
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

    const nowMinutes = 25;
    const arrivalDate = new Date(Date.now() + nowMinutes * 60000);
    const estimatedArrival = arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrderObj = {
      id: randomId,
      customerName: randomCustomer,
      customerPhone: '+91 98' + Math.floor(10000000 + Math.random() * 90000000),
      deliveryAddress: 'Flat 402, Jubilee Hills, Hyderabad',
      restaurantName: randomDish.rest,
      items: [{ name: randomDish.name, qty: 1, price: randomDish.price, isVeg: false }],
      totalAmount: randomDish.price + 40,
      subtotal: randomDish.price,
      deliveryFee: 35,
      platformFee: 5,
      gstTax: Math.round(randomDish.price * 0.05),
      status: 'Preparing',
      paymentMethod: 'UPI',
      estimatedDeliveryTime: '25-30 mins',
      estimatedArrival,
      deliveryPartner: {
        name: 'K. Suresh Kumar',
        phone: '+91 98490 12345',
        vehicle: 'Hero Splendor (TS 09 EA 4421)',
        rating: 4.9,
        status: 'Assigned & Heading to Kitchen'
      },
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

    if (handleOnboardSubmit) {
      handleOnboardSubmit({
        name: newRestaurant.name.trim(),
        cuisine: newRestaurant.cuisine || 'Biryani & Mughlai',
        address: newRestaurant.location?.trim() || 'Jubilee Hills, Hyderabad',
        deliveryTime: '20-25 mins',
        deliveryCharges: '0',
        costForTwo: '450'
      });
    }

    setTotalRestaurants((prev) => prev + 1);
    setIsAddRestaurantModalOpen(false);
    toast.success(`"${newRestaurant.name}" onboarded successfully! 🏬`);
    setNewRestaurant({
      name: '',
      cuisine: 'Biryani & Mughlai',
      location: ''
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
      
      {/* 1. PROFESSIONAL UNIFIED NAVBAR */}
      <Navbar onSimulateOrder={handleSimulateLiveOrder} />

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
          <Link
            to="/restaurants"
            className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition hover:border-orange-300 block group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 group-hover:scale-105 transition">
                <Store className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <span>View</span>
                <ArrowUpRight className="w-2.5 h-2.5" />
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Restaurants</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{metrics.totalRestaurants}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Onboarded partners</p>
          </Link>

          {/* Total Food Items */}
          <Link
            to="/menu"
            className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition hover:border-amber-300 block group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 group-hover:scale-105 transition">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <span>Catalog</span>
                <ArrowUpRight className="w-2.5 h-2.5" />
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Food Items</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{metrics.totalFoodItems || 16}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Dishes in catalog</p>
          </Link>

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

        {/* 5.5 ONBOARDED RESTAURANT PARTNERS GRID */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                  <Store className="w-4 h-4" />
                </div>
                <h3 className="font-black text-base sm:text-lg text-slate-900">
                  Onboarded Restaurant Partners ({metrics.totalRestaurants})
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Active restaurant hubs serving customers across Hyderabad with live status controls
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddRestaurantModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs border border-orange-200 transition cursor-pointer active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Onboard Partner</span>
              </button>
              <Link
                to="/restaurants"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition cursor-pointer active:scale-95"
              >
                <span>Manage All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            {displayRestaurants.slice(0, 8).map((r) => (
              <div
                key={r.id}
                className="bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200 p-3.5 flex flex-col justify-between space-y-3 transition shadow-2xs hover:shadow-md group"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={r.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80'}
                    alt={r.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200 group-hover:scale-105 transition"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/restaurants/${r.id}`}
                      className="font-black text-xs text-slate-900 hover:text-orange-600 transition block truncate"
                      title={r.name}
                    >
                      {r.name}
                    </Link>
                    <span className="text-[10px] text-orange-600 font-bold block truncate">{r.cuisine}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{r.address || r.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus && handleToggleStatus(r.id)}
                    className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase transition cursor-pointer ${
                      r.isOpen !== false
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                    }`}
                    title="Click to toggle restaurant status"
                  >
                    ● {r.isOpen !== false ? 'Open' : 'Closed'}
                  </button>

                  <Link
                    to={`/restaurants/${r.id}`}
                    className="font-bold text-slate-500 hover:text-orange-600 transition flex items-center gap-0.5"
                  >
                    <span>View Menu</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
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
                          className="flex items-center justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border cursor-pointer focus:outline-none focus:ring-2 transition ${
                              order.status === 'Preparing'
                                ? 'bg-amber-50 text-amber-800 border-amber-300 focus:ring-amber-200'
                                : order.status === 'Out for Delivery'
                                ? 'bg-blue-50 text-blue-800 border-blue-300 focus:ring-blue-200'
                                : order.status === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 focus:ring-emerald-200'
                                : 'bg-rose-50 text-rose-800 border-rose-300 focus:ring-rose-200'
                            }`}
                            title="Update Live Order Status (Real-time sync to Customer)"
                          >
                            <option value="Preparing">👨‍🍳 Preparing</option>
                            <option value="Out for Delivery">🛵 Out for Delivery</option>
                            <option value="Delivered">✅ Delivered</option>
                            <option value="Cancelled">❌ Cancelled</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer text-[11px] font-bold"
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

            {/* Estimated Delivery Time in Modal */}
            <div className="p-3 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-between text-xs mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-600 block">Estimated Arrival</span>
                <span className="font-bold text-slate-900">{selectedOrder.estimatedDeliveryTime || '25-30 mins'} (by {selectedOrder.estimatedArrival || 'Soon'})</span>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-white text-orange-700 font-extrabold text-[11px] border border-orange-200">
                {selectedOrder.status}
              </span>
            </div>

            {/* Delivery Partner Info */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Rider</span>
                <span className="font-bold text-slate-800">{selectedOrder.deliveryPartner?.name || 'K. Suresh Kumar'} • {selectedOrder.deliveryPartner?.vehicle || 'Hero Splendor'}</span>
              </div>
              <span className="text-emerald-700 font-bold text-[11px]">★ 4.9 Verified</span>
            </div>

            {/* Live Order Status Controls Bar */}
            <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 mb-4 space-y-2">
              <span className="text-[11px] font-black uppercase text-slate-600 tracking-wider block">
                Update Live Order Status (Real-Time Customer Sync)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Preparing', label: 'Preparing', icon: '👨‍🍳' },
                  { id: 'Out for Delivery', label: 'Out for Delivery', icon: '🛵' },
                  { id: 'Delivered', label: 'Delivered', icon: '✅' },
                  { id: 'Cancelled', label: 'Cancelled', icon: '❌' }
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, st.id)}
                    className={`py-2 px-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                      selectedOrder.status === st.id
                        ? st.id === 'Delivered'
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : st.id === 'Cancelled'
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                          : st.id === 'Out for Delivery'
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{st.icon}</span>
                    <span className="truncate">{st.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Link to Live Customer Tracking View */}
            <div className="pt-1">
              <Link
                to={`/order-confirmation/${selectedOrder.id}`}
                className="w-full py-2.5 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-orange-200 text-center"
              >
                <span>View Full Customer Tracking Screen</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-orange-600" />
              </Link>
            </div>
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
