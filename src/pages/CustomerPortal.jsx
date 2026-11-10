import { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ShoppingBag,
  Bike,
  Clock,
  CheckCircle2,
  MapPin,
  Phone,
  RotateCcw,
  Receipt,
  UtensilsCrossed,
  Sparkles,
  ChefHat,
  Search,
  Store,
  User
} from 'lucide-react';

const CustomerPortal = () => {
  const { currentUser } = useAuth();
  const { addToCart, setIsCartOpen } = useCart();

  // Active Tab: 'active' | 'history' | 'profile'
  const [activeTab, setActiveTab] = useState('active');

  // Search in order history
  const [historySearch, setHistorySearch] = useState('');

  // Selected Order for Receipt Modal
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  // Orders State (Synced directly with localStorage 'food_delivery_orders')
  const [allOrders, setAllOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('food_delivery_orders');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync orders from localStorage and listen to real-time events
  const refreshOrders = () => {
    try {
      const stored = localStorage.getItem('food_delivery_orders');
      if (stored) {
        setAllOrders(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // Event listener for cross-tab or within-app orders changes
    const handleOrderEvent = () => refreshOrders();
    window.addEventListener('storage', handleOrderEvent);
    window.addEventListener('food_delivery_order_placed', handleOrderEvent);
    window.addEventListener('food_delivery_orders_updated', handleOrderEvent);

    // Auto-refresh interval every 4 seconds for real-time status simulation
    const interval = setInterval(refreshOrders, 3000);

    return () => {
      window.removeEventListener('storage', handleOrderEvent);
      window.removeEventListener('food_delivery_order_placed', handleOrderEvent);
      window.removeEventListener('food_delivery_orders_updated', handleOrderEvent);
      clearInterval(interval);
    };
  }, []);

  // Filter orders for the current customer (or all orders if testing)
  const customerOrders = useMemo(() => {
    if (!currentUser) return allOrders;
    // Show orders matching customer name or phone, or all if demo
    const matches = allOrders.filter(
      (o) =>
        o.customerName?.toLowerCase() === currentUser.name?.toLowerCase() ||
        o.customerPhone === currentUser.phone
    );
    return matches.length > 0 ? matches : allOrders;
  }, [allOrders, currentUser]);

  // Active / In-progress Orders
  const activeOrders = useMemo(() => {
    return customerOrders.filter(
      (o) => o.status === 'Preparing' || o.status === 'Out for Delivery' || o.status === 'Order Placed'
    );
  }, [customerOrders]);

  // Past Completed / Cancelled Orders
  const pastOrders = useMemo(() => {
    return customerOrders
      .filter((o) => o.status === 'Delivered' || o.status === 'Cancelled')
      .filter((o) => {
        if (!historySearch) return true;
        const q = historySearch.toLowerCase();
        return (
          o.id.toLowerCase().includes(q) ||
          o.restaurantName?.toLowerCase().includes(q) ||
          o.items?.some((i) => i.name.toLowerCase().includes(q))
        );
      });
  }, [customerOrders, historySearch]);

  // Handle Cancel Order
  const handleCancelOrder = (orderId) => {
    const confirmCancel = window.confirm(`Are you sure you want to cancel order #${orderId}?`);
    if (!confirmCancel) return;

    try {
      const updated = allOrders.map((o) =>
        o.id === orderId ? { ...o, status: 'Cancelled' } : o
      );
      setAllOrders(updated);
      localStorage.setItem('food_delivery_orders', JSON.stringify(updated));
      window.dispatchEvent(new Event('food_delivery_orders_updated'));
      toast.info(`Order #${orderId} was cancelled.`);
    } catch (e) {
      console.error(e);
    }
  };

  // Handle 1-Click Reorder
  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    
    // Add all dishes from order to cart
    order.items.forEach((item) => {
      addToCart(
        {
          id: item.id || `dish-${Date.now()}-${Math.random()}`,
          name: item.name,
          price: item.price,
          isVeg: item.isVeg !== undefined ? item.isVeg : true,
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: order.restaurantId || 'rest-1',
          name: order.restaurantName || 'Paradise Royale Biryani',
          deliveryCharges: 'Free'
        }
      );
    });

    setIsCartOpen(true);
    toast.success(`Items from #${order.id} added to basket!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col select-none">
      
      {/* Unified Navbar */}
      <Navbar />

            
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* CUSTOMER GREETING & HERO BANNER */}
        <div className="relative rounded-3xl bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 p-6 sm:p-8 text-white overflow-hidden shadow-xl">
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Customer Food Hub & Tracking</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                Hungry, {currentUser?.name || 'Foodie'}? 🍕
              </h1>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-white/90">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="truncate max-w-md">
                  Delivering to: <b className="text-white">{currentUser?.address || 'Jubilee Hills, Hyderabad'}</b>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-orange-600 font-extrabold text-xs shadow-lg hover:bg-orange-50 transition active:scale-95"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Browse Food Menu</span>
              </Link>
              <Link
                to="/restaurants"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/20 border border-white/25 text-white font-extrabold text-xs hover:bg-white/30 transition active:scale-95"
              >
                <Store className="w-4 h-4" />
                <span>Restaurants</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-orange-950/40 border border-white/20 text-white font-extrabold text-xs shadow-lg hover:bg-orange-950/60 transition active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span>Basket</span>
              </button>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'active'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Live Tracking & Active Orders</span>
            {activeOrders.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'active' ? 'bg-white text-orange-600' : 'bg-orange-600 text-white'
              }`}>
                {activeOrders.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Order History</span>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">
              {pastOrders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Addresses & Profile</span>
          </button>
        </div>

        {/* 1. ACTIVE LIVE ORDERS TAB */}
        {activeTab === 'active' && (
          <div className="space-y-6">
            {activeOrders.length === 0 ? (
              <div className="bg-white p-10 sm:p-14 rounded-3xl border border-slate-200 text-center space-y-4 shadow-2xs">
                <div className="w-16 h-16 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                  <UtensilsCrossed className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">No Active Orders Right Now</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Your kitchen is resting! Browse top Hyderabad restaurants and place an order to experience real-time tracking.
                  </p>
                </div>
                <Link
                  to="/restaurants"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-md shadow-orange-600/20"
                >
                  <Store className="w-4 h-4" />
                  <span>Browse Restaurants</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {activeOrders.map((order) => {
                  const isPreparing = order.status === 'Preparing';
                  const isDispatched = order.status === 'Out for Delivery';

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl border border-orange-200/80 shadow-md p-5 sm:p-7 space-y-6 relative overflow-hidden"
                    >
                      {/* Top Accent line */}
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500" />

                      {/* Header with Order ID and Restaurant */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-orange-100 text-orange-800">
                              #{order.id}
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">{order.createdAt || 'Just now'}</span>
                          </div>
                          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                            <span>{order.restaurantName || 'Paradise Royale Biryani'}</span>
                          </h3>
                        </div>

                        {/* Estimated Time Badge */}
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200/60 text-right">
                            <span className="text-[10px] uppercase font-bold text-orange-600 block">Estimated Arrival</span>
                            <span className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-orange-600 animate-spin" />
                              {isDispatched ? '10 - 15 mins' : '22 - 28 mins'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* REAL-TIME PROGRESS STEPPER */}
                      <div className="py-2">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-4">
                          Live Order Progress
                        </span>
                        <div className="grid grid-cols-4 gap-2 relative">
                          
                          {/* Step 1: Placed */}
                          <div className="flex flex-col items-center text-center space-y-2">
                            <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-black text-slate-800">Confirmed</span>
                            <span className="text-[10px] text-slate-400">Order accepted</span>
                          </div>

                          {/* Step 2: Preparing */}
                          <div className="flex flex-col items-center text-center space-y-2">
                            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition shadow-md ${
                              isPreparing
                                ? 'bg-orange-500 text-white animate-pulse shadow-orange-500/30'
                                : 'bg-emerald-500 text-white shadow-emerald-500/20'
                            }`}>
                              <ChefHat className="w-5 h-5" />
                            </div>
                            <span className={`text-[11px] font-black ${isPreparing ? 'text-orange-600' : 'text-slate-800'}`}>
                              Kitchen Prep
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {isPreparing ? 'Fresh cooking' : 'Cooking done'}
                            </span>
                          </div>

                          {/* Step 3: Out for Delivery */}
                          <div className="flex flex-col items-center text-center space-y-2">
                            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition shadow-md ${
                              isDispatched
                                ? 'bg-orange-500 text-white animate-bounce shadow-orange-500/30'
                                : isPreparing
                                ? 'bg-slate-100 text-slate-400 border border-slate-200'
                                : 'bg-emerald-500 text-white'
                            }`}>
                              <Bike className="w-5 h-5" />
                            </div>
                            <span className={`text-[11px] font-black ${isDispatched ? 'text-orange-600' : 'text-slate-500'}`}>
                              On the Way
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {isDispatched ? 'Rider heading to you' : 'Rider waiting'}
                            </span>
                          </div>

                          {/* Step 4: Delivered */}
                          <div className="flex flex-col items-center text-center space-y-2">
                            <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-400">Delivered</span>
                            <span className="text-[10px] text-slate-400">Doorstep drop</span>
                          </div>

                        </div>
                      </div>

                      {/* DELIVERY PARTNER CARD */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black text-sm">
                            <Bike className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-black text-sm text-slate-900">K. Suresh (Delivery Hero)</h4>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                                4.9 ★
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">Hero Splendor • TS 09 EA 4421</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toast.info('Calling delivery rider Suresh at +91 98490 12345...')}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Call Rider</span>
                          </button>
                          
                          {isPreparing && (
                            <button
                              type="button"
                              onClick={() => handleCancelOrder(order.id)}
                              className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition border border-rose-200"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>

                      {/* ITEMS & BILL FOOTER */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
                        <div className="space-y-1">
                          <span className="font-extrabold text-slate-400 uppercase text-[10px] tracking-wider">Ordered Items</span>
                          <div className="flex flex-wrap gap-2">
                            {order.items?.map((item, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 font-bold text-slate-800"
                              >
                                <span>{item.qty}x</span>
                                <span>{item.name}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block font-semibold">Total Paid ({order.paymentMethod || 'UPI'})</span>
                            <span className="text-base font-black text-slate-900">₹{order.totalAmount}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptOrder(order)}
                            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
                          >
                            View Receipt
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 2. PAST ORDERS HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            
            {/* Search past orders */}
            <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search previous orders by dish, restaurant, or order #..."
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <span className="text-xs text-slate-400 font-bold px-2">{pastOrders.length} Orders</span>
            </div>

            {pastOrders.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">No order history found</h4>
                <p className="text-xs text-slate-400">Past completed deliveries will be logged here for easy 1-click reorders.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      {/* Restaurant & Date */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-black text-sm text-slate-900">{order.restaurantName || 'Restaurant'}</h4>
                          <span className="text-[11px] text-slate-400">{order.createdAt || 'Yesterday'} • #{order.id}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-slate-600">
                            <span>{item.qty}x {item.name}</span>
                            <span className="font-bold text-slate-800">₹{item.price * item.qty}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Total Amount</span>
                        <span className="font-black text-sm text-slate-900">₹{order.totalAmount}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedReceiptOrder(order)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
                        >
                          Bill
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReorder(order)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black transition shadow-xs cursor-pointer active:scale-95"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reorder</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* 3. PROFILE & SAVED ADDRESSES TAB */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Customer Profile Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                  alt={currentUser?.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-200 shadow-sm"
                />
                <div>
                  <h3 className="font-black text-lg text-slate-900">{currentUser?.name || 'Rahul Sharma'}</h3>
                  <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 text-[10px] font-black uppercase tracking-wider">
                    Customer Account
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-bold text-slate-800">{currentUser?.email || 'customer@foodie.com'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Mobile Phone:</span>
                  <span className="font-bold text-slate-800">{currentUser?.phone || '+91 9876543210'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Member Since:</span>
                  <span className="font-bold text-slate-800">November 2026</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-orange-700 font-bold block uppercase">CraveDash Rewards</span>
                  <span className="text-sm font-black text-orange-900">450 Foodie Coins 🪙</span>
                </div>
                <span className="text-[11px] font-black text-orange-600 bg-white px-2 py-1 rounded-xl shadow-2xs">
                  ₹45 Off next order
                </span>
              </div>
            </div>

            {/* Saved Delivery Addresses */}
            <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <h3 className="font-black text-base text-slate-900">Saved Delivery Addresses</h3>
                </div>
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-xl">
                  ● Hyderabad Region Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Home Address */}
                <div className="p-4 rounded-2xl border-2 border-orange-500 bg-orange-50/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-orange-900 uppercase tracking-wider flex items-center gap-1">
                      🏠 Home (Primary)
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                    Flat 402, Lotus Residency, Road No. 36, Jubilee Hills, Hyderabad - 500033
                  </p>
                  <p className="text-[11px] text-slate-500">Contact: {currentUser?.phone || '+91 9876543210'}</p>
                </div>

                {/* Office Address */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      🏢 Office
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                    Level 6, Mindspace IT Park, Building No. 12, HITEC City, Hyderabad - 500081
                  </p>
                  <p className="text-[11px] text-slate-500">Contact: {currentUser?.phone || '+91 9876543210'}</p>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* RECEIPT MODAL */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 relative">
            <button
              type="button"
              onClick={() => setSelectedReceiptOrder(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              ✕
            </button>

            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">Tax Invoice / Bill</h3>
                <p className="text-xs text-slate-400">Order #{selectedReceiptOrder.id}</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Restaurant:</span>
                <span className="font-bold text-slate-800">{selectedReceiptOrder.restaurantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Address:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                  {selectedReceiptOrder.deliveryAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment:</span>
                <span className="font-bold text-emerald-600">{selectedReceiptOrder.paymentMethod || 'UPI'} Paid</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs mb-4">
              <span className="font-black text-slate-800 block border-b border-slate-200 pb-1">Items</span>
              {selectedReceiptOrder.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between text-slate-700">
                  <span>{item.qty}x {item.name}</span>
                  <span className="font-bold">₹{item.price * item.qty}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-sm">
                <span>Grand Total Paid</span>
                <span className="text-orange-600">₹{selectedReceiptOrder.totalAmount}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                toast.success('Invoice downloaded as PDF! 📄');
                setSelectedReceiptOrder(null);
              }}
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-md shadow-orange-600/20"
            >
              Download PDF Invoice
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerPortal;
