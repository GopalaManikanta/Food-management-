import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import {
  CheckCircle2,
  Clock,
  Bike,
  ChefHat,
  MapPin,
  Phone,
  MessageSquare,
  Copy,
  ShieldCheck,
  Store,
  Printer,
  Sparkles
} from 'lucide-react';

const OrderConfirmation = () => {
  const { orderId } = useParams();

  // Find order from localStorage
  const [order, setOrder] = useState(() => {
    try {
      const stored = localStorage.getItem('food_delivery_orders');
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) {
          const found = list.find((o) => o.id === orderId);
          if (found) return found;
          if (list.length > 0) return list[0]; // fallback to most recent
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  // Real-time synchronization when Admin updates status on Dashboard
  useEffect(() => {
    const syncCurrentOrder = () => {
      try {
        const stored = localStorage.getItem('food_delivery_orders');
        if (stored) {
          const list = JSON.parse(stored);
          if (Array.isArray(list)) {
            const found = list.find((o) => o.id === orderId);
            if (found) setOrder(found);
          }
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('storage', syncCurrentOrder);
    window.addEventListener('food_delivery_orders_updated', syncCurrentOrder);
    const interval = setInterval(syncCurrentOrder, 2000);

    return () => {
      window.removeEventListener('storage', syncCurrentOrder);
      window.removeEventListener('food_delivery_orders_updated', syncCurrentOrder);
      clearInterval(interval);
    };
  }, [orderId]);

  // Real-time ticking countdown timer (starts around 31 mins)
  const [secondsRemaining, setSecondsRemaining] = useState(31 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const copyOrderId = () => {
    if (order?.id) {
      navigator.clipboard.writeText(order.id);
      toast.success(`Copied Order ID: ${order.id} 📋`);
    }
  };

  const handleCallPartner = () => {
    toast.info(`Calling delivery partner ${order?.deliveryPartner?.name || 'Suresh Kumar'} (${order?.deliveryPartner?.phone || '+91 9876543210'}) 📞`);
  };

  const handleMessagePartner = () => {
    toast.success('Message sent to rider: "Please leave food at door as instructed." 💬');
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md text-center border border-slate-200 shadow-xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
              <Store className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Order Not Found</h2>
            <p className="text-xs text-slate-500">
              We couldn&apos;t find details for order #{orderId}. It might have been cleared or placed under another session.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <Link
                to="/customer"
                className="px-5 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-600/20"
              >
                Go to My Orders
              </Link>
              <Link
                to="/menu"
                className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Food Menu
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none print:bg-white">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* 1. CELEBRATION HEADER CARD */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-8 shadow-xl animate-fadeIn">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-lg">
              <CheckCircle2 className="w-10 h-10 text-white animate-scaleIn" />
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-emerald-100 border border-white/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Order Placed & Confirmed</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Thank you, {order.customerName}! 🎉
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                Your order from <strong className="text-white font-bold">{order.restaurantName}</strong> has been received by the kitchen and is being prepared with high kitchen hygiene standards.
              </p>

              {/* Order ID Tag with Copy */}
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={copyOrderId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/20 hover:bg-black/30 border border-white/20 text-xs font-mono font-bold text-white transition cursor-pointer"
                  title="Copy Order ID"
                >
                  <span>Order #{order.id}</span>
                  <Copy className="w-3.5 h-3.5 text-emerald-300" />
                </button>
                <span className="text-xs text-emerald-100">• Placed Just now</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. LIVE ESTIMATED DELIVERY TIME & COUNTDOWN */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-orange-600 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Estimated Delivery Time
              </span>
              <p className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                Arriving in ~{order.estimatedDeliveryTime || '30-35 mins'}
              </p>
              <span className="text-xs text-orange-600 font-bold">
                Expected Arrival by {order.estimatedArrival || '11:45 AM'}
              </span>
            </div>
          </div>

          <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl flex flex-col items-center sm:items-end shadow-inner">
            <span className="text-[10px] uppercase font-bold text-slate-400">Live ETA Clock</span>
            <span className="text-xl font-black font-mono text-orange-400">
              {formatCountdown(secondsRemaining)}
            </span>
          </div>
        </div>

        {/* 3. SWIGGY / ZOMATO 4-STEP LIVE TRACKER */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Live Order Pipeline
            </h2>
            <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              order.status === 'Delivered'
                ? 'bg-emerald-100 text-emerald-800'
                : order.status === 'Cancelled'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-orange-100 text-orange-800 animate-pulse'
            }`}>
              Status: {order.status || 'Preparing'}
            </span>
          </div>

          {order.status === 'Cancelled' ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <span>⚠️ This order was cancelled. Refund has been initiated to the original payment source.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
              
              {/* Step 1: Confirmed */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center sm:flex-col sm:items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-emerald-900">Order Placed</p>
                  <p className="text-[10px] text-emerald-700 font-medium">Received by kitchen</p>
                </div>
              </div>

              {/* Step 2: Preparing in Kitchen */}
              <div className={`p-3.5 rounded-2xl border flex items-center sm:flex-col sm:items-start gap-3 transition ${
                order.status === 'Preparing'
                  ? 'bg-orange-50 border-orange-200 shadow-sm'
                  : (order.status === 'Out for Delivery' || order.status === 'Delivered')
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  order.status === 'Preparing'
                    ? 'bg-orange-600 text-white animate-pulse shadow-md shadow-orange-600/30'
                    : (order.status === 'Out for Delivery' || order.status === 'Delivered')
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  <ChefHat className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-xs font-black ${order.status === 'Preparing' ? 'text-orange-900' : (order.status === 'Out for Delivery' || order.status === 'Delivered') ? 'text-emerald-900' : 'text-slate-700'}`}>
                    Preparing Food
                  </p>
                  <p className={`text-[10px] ${order.status === 'Preparing' ? 'text-orange-700 font-bold' : (order.status === 'Out for Delivery' || order.status === 'Delivered') ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {order.status === 'Preparing' ? 'Cooking freshly now' : 'Cooking complete'}
                  </p>
                </div>
              </div>

              {/* Step 3: Out for Delivery */}
              <div className={`p-3.5 rounded-2xl border flex items-center sm:flex-col sm:items-start gap-3 transition ${
                order.status === 'Out for Delivery'
                  ? 'bg-orange-50 border-orange-200 shadow-sm'
                  : order.status === 'Delivered'
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  order.status === 'Out for Delivery'
                    ? 'bg-orange-600 text-white animate-bounce shadow-md shadow-orange-600/30'
                    : order.status === 'Delivered'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  <Bike className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-xs font-black ${order.status === 'Out for Delivery' ? 'text-orange-900' : order.status === 'Delivered' ? 'text-emerald-900' : 'text-slate-700'}`}>
                    Rider On The Way
                  </p>
                  <p className={`text-[10px] ${order.status === 'Out for Delivery' ? 'text-orange-700 font-bold' : order.status === 'Delivered' ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {order.status === 'Out for Delivery' ? 'Rider heading to you' : order.status === 'Delivered' ? 'Arrived & Handed over' : 'Rider waiting'}
                  </p>
                </div>
              </div>

              {/* Step 4: Delivered */}
              <div className={`p-3.5 rounded-2xl border flex items-center sm:flex-col sm:items-start gap-3 transition ${
                order.status === 'Delivered'
                  ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  order.status === 'Delivered' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'bg-slate-200 text-slate-500'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-xs font-black ${order.status === 'Delivered' ? 'text-emerald-900' : 'text-slate-700'}`}>
                    Delivered
                  </p>
                  <p className={`text-[10px] ${order.status === 'Delivered' ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                    {order.status === 'Delivered' ? 'Delivered safely' : 'Doorstep handoff'}
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* 4. DELIVERY PARTNER & ADDRESS TWO-COLUMN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* Delivery Partner Assigned Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Delivery Partner Assigned
            </span>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                SK
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black text-slate-900">
                    {order.deliveryPartner?.name || 'Suresh Kumar'}
                  </h3>
                  <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md">
                    ★ 4.9
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  {order.deliveryPartner?.vehicle || 'Hero Splendor (TS 09 EZ 4821)'}
                </p>
                <span className="text-[10px] text-emerald-600 font-bold">
                  ✓ Verified & Vaccinated Delivery Executive
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCallPartner}
                className="flex-1 py-2 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-orange-200 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-orange-600" />
                <span>Call Partner</span>
              </button>
              <button
                type="button"
                onClick={handleMessagePartner}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                <span>Message</span>
              </button>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
              Delivery Destination
            </span>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-orange-50 text-orange-600 shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 leading-snug">
                  {order.deliveryAddress}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Receiver: <strong className="text-slate-700">{order.customerName}</strong> ({order.customerPhone})
                </p>
                {order.deliveryInstructions && (
                  <p className="text-[11px] text-orange-700 bg-orange-50 p-2 rounded-xl border border-orange-100 mt-2">
                    Note: {order.deliveryInstructions}
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* 5. ITEMIZED ORDER SUMMARY & RECEIPT DETAILS */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">Order Summary & Receipt</h2>
              <p className="text-xs text-slate-500">{order.restaurantName}</p>
            </div>
            
            <button
              type="button"
              onClick={() => window.print()}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer print:hidden"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>

          {/* Dishes List */}
          <div className="space-y-2">
            {order.items?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-xs border-2 flex items-center justify-center shrink-0 ${
                      item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                    }`}
                  >
                    <span className={`w-1 h-1 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                  </span>
                  <span className="font-bold text-slate-900">{item.name}</span>
                  <span className="text-slate-400 font-bold">x {item.qty}</span>
                </div>
                <span className="font-black text-slate-900">₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>

          {/* Bill Calculation */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Item Total</span>
              <span className="font-bold text-slate-900">₹{order.subtotal || order.totalAmount}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span className={order.deliveryFee === 0 ? 'font-bold text-emerald-600' : 'font-bold text-slate-900'}>
                {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Platform Fee</span>
              <span className="font-bold text-slate-900">₹{order.platformFee || 5}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Govt. Taxes (GST 5%)</span>
              <span className="font-bold text-slate-900">₹{order.gstTax || 0}</span>
            </div>
            {order.couponCode && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Coupon ({order.couponCode})</span>
                <span>-₹{order.couponDiscount}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
              <span>Total Paid via {order.paymentMethod || 'UPI'}</span>
              <span className="text-orange-600 text-base">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* 6. BOTTOM ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center gap-3 print:hidden">
          <Link
            to="/customer"
            className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs transition shadow-lg shadow-orange-600/20 text-center flex items-center justify-center gap-2"
          >
            <Bike className="w-4 h-4" />
            <span>Track in Customer Portal</span>
          </Link>
          <Link
            to="/restaurants"
            className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs transition border border-slate-200 text-center flex items-center justify-center gap-2"
          >
            <Store className="w-4 h-4 text-slate-500" />
            <span>Explore More Restaurants</span>
          </Link>
        </div>

      </main>
    </div>
  );
};

export default OrderConfirmation;
