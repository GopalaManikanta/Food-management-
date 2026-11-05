import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MapPin,
  CreditCard,
  Banknote,
  QrCode,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const CartDrawer = () => {
  const {
    cartItems,
    activeRestaurant,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    platformFee,
    gstTax,
    grandTotal,
    placeOrder
  } = useCart();

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Delivery Address
  const [deliveryAddress, setDeliveryAddress] = useState(
    currentUser?.address || 'Flat 402, Lotus Residency, Road No. 36, Jubilee Hills, Hyderabad'
  );

  // Payment Mode
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'COD' | 'CARD'
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const res = placeOrder({
        customerName: currentUser?.name || 'Rahul Sharma',
        customerPhone: currentUser?.phone || '+91 9876543210',
        deliveryAddress,
        paymentMethod
      });
      setIsSubmitting(false);
      if (res.success) {
        navigate('/customer');
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-slideLeft">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-600 text-white shadow-md shadow-orange-600/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-black text-base text-slate-900 leading-tight">Your Food Basket</h2>
                <p className="text-xs text-slate-500 truncate max-w-[220px]">
                  {activeRestaurant ? activeRestaurant.name : 'Cart items'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition text-xs font-semibold"
                  title="Clear Cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Content */}
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-800">Your basket is empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Explore delicious menus from top Hyderabad restaurants and fill your cart!
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/restaurants');
                }}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-md shadow-orange-600/20"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
              
              {/* Restaurant Info Pill */}
              {activeRestaurant && (
                <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-100 flex items-center gap-3">
                  <img
                    src={activeRestaurant.image}
                    alt={activeRestaurant.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-xs text-slate-900 truncate">{activeRestaurant.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{activeRestaurant.address || 'Hyderabad'}</p>
                    <span className="text-[10px] font-bold text-orange-600">⚡ 30-35 mins Delivery</span>
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-3">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Order Items</span>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span
                        className={`w-3.5 h-3.5 rounded-xs border-2 flex items-center justify-center shrink-0 ${
                          item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                        {item.restaurantName && (
                          <span className="text-[10px] font-bold text-orange-600 truncate block">
                            {item.restaurantName}
                          </span>
                        )}
                        <p className="text-xs font-extrabold text-slate-700">₹{item.price}</p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-slate-200 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black text-slate-800 w-4 text-center">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900">₹{item.price * item.qty}</span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-300 hover:text-rose-500 transition p-1 cursor-pointer"
                        title="Remove dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  Delivery Address
                </span>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  placeholder="Enter your street address, flat number, landmark..."
                />
              </div>

              {/* Payment Mode Selector */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Payment Mode</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                      paymentMethod === 'UPI'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                      paymentMethod === 'CARD'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                      paymentMethod === 'COD'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Cash on Del.</span>
                  </button>
                </div>
              </div>

              {/* Bill Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
                <span className="font-black text-slate-900 block border-b border-slate-200 pb-2">Bill Summary</span>
                
                <div className="flex justify-between text-slate-600">
                  <span>Item Total</span>
                  <span className="font-bold text-slate-900">₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Delivery Partner Fee</span>
                  <span className={deliveryFee === 0 ? 'font-bold text-emerald-600' : 'font-bold text-slate-900'}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Platform Fee</span>
                  <span className="font-bold text-slate-900">₹{platformFee}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Govt. Taxes (GST 5%)</span>
                  <span className="font-bold text-slate-900">₹{gstTax}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
                  <span>To Pay</span>
                  <span className="text-orange-600 text-base">₹{grandTotal}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Contactless Delivery Guarantee & Safe Kitchen Audit</span>
              </div>

            </div>
          )}

          {/* Footer Checkout Button */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-white">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white font-black text-sm transition shadow-lg shadow-orange-600/25 flex items-center justify-between cursor-pointer active:scale-98 disabled:opacity-50"
              >
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-white/80 block -mb-0.5">Total Amount</span>
                  <span>₹{grandTotal}</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span>{isSubmitting ? 'Placing Order...' : 'Place Order'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
