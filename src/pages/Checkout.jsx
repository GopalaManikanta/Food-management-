import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  ShoppingBag,
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  Tag,
  Percent,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Banknote,
  QrCode,
  Sparkles,
  ArrowRight,
  Clock,
  Home,
  Briefcase,
  Navigation,
  Building,
  Check,
  VolumeX,
  DoorClosed,
  BellOff,
  ShieldAlert,
  Bike
} from 'lucide-react';

const DEFAULT_SAVED_ADDRESSES = [
  {
    id: 'addr-1',
    tag: 'Home',
    icon: 'home',
    flatNo: 'Flat 402, Lotus Residency',
    area: 'Road No. 36, Jubilee Hills',
    landmark: 'Opposite Peddamma Temple Metro',
    city: 'Hyderabad',
    pincode: '500033',
    receiverName: 'Rahul Sharma',
    receiverPhone: '+91 9876543210',
    fullAddress: 'Flat 402, Lotus Residency, Road No. 36, Jubilee Hills, Hyderabad - 500033'
  },
  {
    id: 'addr-2',
    tag: 'Work',
    icon: 'work',
    flatNo: 'Tower B, 6th Floor, Workspace 604',
    area: 'Mindspace IT Park, HITEC City',
    landmark: 'Near Inorbit Mall Back Gate',
    city: 'Hyderabad',
    pincode: '500081',
    receiverName: 'Rahul Sharma',
    receiverPhone: '+91 9876543210',
    fullAddress: 'Tower B, 6th Floor, Mindspace IT Park, HITEC City, Hyderabad - 500081'
  },
  {
    id: 'addr-3',
    tag: 'Other',
    icon: 'other',
    flatNo: 'Plot 88, Green Meadows',
    area: 'Durgam Cheruvu Lake Road, Madhapur',
    landmark: 'Near Metro Pillar #124',
    city: 'Hyderabad',
    pincode: '500081',
    receiverName: 'Rahul Sharma',
    receiverPhone: '+91 9876543210',
    fullAddress: 'Plot 88, Green Meadows, Durgam Cheruvu Road, Madhapur, Hyderabad - 500081'
  }
];

const Checkout = () => {
  const {
    cartItems,
    activeRestaurant,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    platformFee,
    gstTax,
    grandTotal,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    availableCoupons,
    placeOrder
  } = useCart();

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // 1. Saved Addresses State
  const [addresses, setAddresses] = useState(() => {
    try {
      const stored = localStorage.getItem('food_delivery_saved_addresses');
      return stored ? JSON.parse(stored) : DEFAULT_SAVED_ADDRESSES;
    } catch {
      return DEFAULT_SAVED_ADDRESSES;
    }
  });

  const [selectedAddressId, setSelectedAddressId] = useState(DEFAULT_SAVED_ADDRESSES[0].id);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrForm, setNewAddrForm] = useState({
    tag: 'Home',
    flatNo: '',
    area: '',
    landmark: '',
    city: 'Hyderabad',
    pincode: '',
    receiverName: currentUser?.name || 'Rahul Sharma',
    receiverPhone: currentUser?.phone || '9876543210'
  });

  // Sync addresses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('food_delivery_saved_addresses', JSON.stringify(addresses));
    } catch {
      // ignore
    }
  }, [addresses]);

  // Listen to address updates from Customer Profile or other tabs
  useEffect(() => {
    const handleSync = () => {
      try {
        const stored = localStorage.getItem('food_delivery_saved_addresses');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAddresses(parsed);
          }
        }
      } catch (e) {
        console.error('Failed to sync addresses:', e);
      }
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('food_delivery_addresses_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('food_delivery_addresses_updated', handleSync);
    };
  }, []);

  // 2. Delivery Instructions
  const [selectedInstructions, setSelectedInstructions] = useState([]);
  const [customInstructions, setCustomInstructions] = useState('');

  const toggleInstruction = (instruction) => {
    setSelectedInstructions((prev) =>
      prev.includes(instruction)
        ? prev.filter((i) => i !== instruction)
        : [...prev, instruction]
    );
  };

  // 3. Payment Method: 'UPI' | 'CARD' | 'COD' | 'NETBANKING'
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: currentUser?.name || 'Rahul Sharma',
    expiry: '',
    cvv: ''
  });

  // 4. Promo Code input
  const [couponInput, setCouponInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState('');

  // Selected address object
  const activeAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleApplyCoupon = (codeToApply) => {
    const code = codeToApply || couponInput;
    if (!code) return;
    const res = applyCoupon(code);
    if (res.success) setCouponInput('');
  };

  const handleAddNewAddressSubmit = (e) => {
    e.preventDefault();
    if (!newAddrForm.flatNo || !newAddrForm.area) {
      toast.error('Please enter house/flat and street area.');
      return;
    }

    const full = `${newAddrForm.flatNo}, ${newAddrForm.area}${newAddrForm.landmark ? `, Near ${newAddrForm.landmark}` : ''}, ${newAddrForm.city || 'Hyderabad'} - ${newAddrForm.pincode || '500081'}`;
    const newEntry = {
      id: `addr-${Date.now()}`,
      tag: newAddrForm.tag,
      icon: newAddrForm.tag.toLowerCase(),
      flatNo: newAddrForm.flatNo,
      area: newAddrForm.area,
      landmark: newAddrForm.landmark,
      city: newAddrForm.city || 'Hyderabad',
      pincode: newAddrForm.pincode || '500081',
      receiverName: newAddrForm.receiverName || currentUser?.name || 'Customer',
      receiverPhone: newAddrForm.receiverPhone || currentUser?.phone || '9876543210',
      fullAddress: full
    };

    const updated = [newEntry, ...addresses];
    setAddresses(updated);
    setSelectedAddressId(newEntry.id);
    setIsAddingAddress(false);
    try {
      localStorage.setItem('food_delivery_saved_addresses', JSON.stringify(updated));
      window.dispatchEvent(new Event('food_delivery_addresses_updated'));
    } catch (e) {
      console.error(e);
    }
    toast.success(`Address "${newEntry.tag}" added successfully! 📍`);
  };

  // Order Placement Handler
  const handlePlaceOrder = () => {
    // Prevent empty cart checkout guard
    if (cartItems.length === 0) {
      toast.error('Your cart is empty! Please add items before checking out.');
      return;
    }

    if (!activeAddress) {
      toast.error('Please select or add a delivery address.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStep('Verifying order and delivery partner...');

    setTimeout(() => {
      setSubmissionStep('Confirming with kitchen...');

      setTimeout(() => {
        const fullInstructions = [
          ...selectedInstructions,
          customInstructions.trim()
        ]
          .filter(Boolean)
          .join(', ') || 'Contactless delivery';

        const res = placeOrder({
          customerName: activeAddress.receiverName || currentUser?.name || 'Rahul Sharma',
          customerPhone: activeAddress.receiverPhone || currentUser?.phone || '+91 9876543210',
          deliveryAddress: activeAddress.fullAddress,
          deliveryInstructions: fullInstructions,
          paymentMethod,
          estimatedTime: '30-35 mins'
        });

        setIsSubmitting(false);

        if (res.success && res.orderId) {
          navigate(`/order-confirmation/${res.orderId}`);
        }
      }, 700);
    }, 700);
  };

  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / 499) * 100));

  // Compute live estimated arrival time
  const [arrivalTime] = useState(() =>
    new Date(Date.now() + 32 * 60 * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition shadow-2xs cursor-pointer"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Secure Checkout
              </h1>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Contactless & Safe Delivery Guarantee</span>
              </p>
            </div>
          </div>

          <Link
            to="/menu"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl border border-orange-200 transition"
          >
            + Add More Dishes
          </Link>
        </div>

        {/* 1. PREVENT EMPTY CART CHECKOUT (GUARD VIEW) */}
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-14 text-center max-w-xl mx-auto border border-slate-200 shadow-xl space-y-5 animate-fadeIn">
            <div className="w-24 h-24 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto shadow-inner">
              <ShoppingBag className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Your Basket is Empty</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Good food is always cooking! You have not added any dishes to your cart yet.
                Explore our curated restaurants and food menu to start placing your order.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link
                to="/restaurants"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white text-xs font-black transition shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2"
              >
                <Bike className="w-4 h-4" />
                <span>Explore Restaurants</span>
              </Link>
              <Link
                to="/menu"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <span>Browse Food Menu</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </Link>
            </div>
          </div>
        ) : (
          /* 2. ACTIVE CHECKOUT TWO-COLUMN LAYOUT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Address, Delivery Instructions, Payment Methods (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">

              {/* STEP 1: DELIVERY ADDRESS */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm">
                      1
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900">Delivery Address</h2>
                      <p className="text-xs text-slate-500">Select where you want your food delivered</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl border border-orange-200 transition cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingAddress ? 'Cancel' : 'Add New Address'}</span>
                  </button>
                </div>

                {/* Add New Address Form Modal/Collapse */}
                {isAddingAddress && (
                  <form onSubmit={handleAddNewAddressSubmit} className="p-4 bg-slate-50 rounded-2xl border border-orange-200 space-y-3 animate-fadeIn">
                    <span className="text-xs font-black text-slate-800 block">Add New Delivery Location</span>
                    
                    <div className="flex gap-2">
                      {['Home', 'Work', 'Other'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewAddrForm({ ...newAddrForm, tag: type })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            newAddrForm.tag === type
                              ? 'bg-orange-600 text-white border-orange-600'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Flat / House No. / Floor *"
                        value={newAddrForm.flatNo}
                        onChange={(e) => setNewAddrForm({ ...newAddrForm, flatNo: e.target.value })}
                        required
                        className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                      <input
                        type="text"
                        placeholder="Street / Colony / Area *"
                        value={newAddrForm.area}
                        onChange={(e) => setNewAddrForm({ ...newAddrForm, area: e.target.value })}
                        required
                        className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                      <input
                        type="text"
                        placeholder="Nearby Landmark (Optional)"
                        value={newAddrForm.landmark}
                        onChange={(e) => setNewAddrForm({ ...newAddrForm, landmark: e.target.value })}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                      <input
                        type="text"
                        placeholder="City & Pincode"
                        value={newAddrForm.pincode}
                        onChange={(e) => setNewAddrForm({ ...newAddrForm, pincode: e.target.value })}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black rounded-xl shadow-md shadow-orange-600/20 transition cursor-pointer"
                    >
                      Save & Deliver to this Address
                    </button>
                  </form>
                )}

                {/* Saved Address Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {addresses.map((addr) => {
                    const isSelected = addr.id === selectedAddressId;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between relative ${
                          isSelected
                            ? 'border-orange-600 bg-orange-50/50 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                              {addr.tag === 'Home' && <Home className="w-3.5 h-3.5 text-orange-600" />}
                              {addr.tag === 'Work' && <Briefcase className="w-3.5 h-3.5 text-orange-600" />}
                              {addr.tag === 'Other' && <Navigation className="w-3.5 h-3.5 text-orange-600" />}
                              <span>{addr.tag}</span>
                            </span>
                            {isSelected && (
                              <span className="w-4 h-4 rounded-full bg-orange-600 text-white flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 stroke-3" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">{addr.flatNo}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{addr.area}</p>
                        </div>

                        <span className="text-[10px] text-orange-600 font-bold mt-2 block">
                          30-35 mins delivery
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: DELIVERY INSTRUCTIONS (ZOMATO STYLE) */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="w-9 h-9 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm">
                    2
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">Delivery Instructions</h2>
                    <p className="text-xs text-slate-500">Guide the rider for a contactless, smooth handoff</p>
                  </div>
                </div>

                {/* Instruction Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Avoid calling', icon: VolumeX },
                    { label: 'Leave at door', icon: DoorClosed },
                    { label: "Don't ring bell", icon: BellOff },
                    { label: 'Leave with guard', icon: ShieldAlert }
                  ].map((chip) => {
                    const isChecked = selectedInstructions.includes(chip.label);
                    const Icon = chip.icon;
                    return (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => toggleInstruction(chip.label)}
                        className={`p-3 rounded-2xl border text-xs font-bold transition cursor-pointer flex flex-col items-center gap-1.5 text-center ${
                          isChecked
                            ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-orange-600" />
                        <span className="text-[11px] leading-tight">{chip.label}</span>
                      </button>
                    );
                  })}
                </div>

                <textarea
                  rows={2}
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="Any specific note for kitchen or rider? e.g. Ring twice, gate code #402..."
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
                />
              </div>

              {/* STEP 3: PAYMENT METHOD (SWIGGY STYLE) */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="w-9 h-9 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm">
                    3
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">Payment Option</h2>
                    <p className="text-xs text-slate-500">Choose your preferred payment mode</p>
                  </div>
                </div>

                {/* Payment Option Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'UPI'
                        ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-orange-600" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'CARD'
                        ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-orange-600" />
                    <span>Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'COD'
                        ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-orange-600" />
                    <span>Cash on Del.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'NETBANKING'
                        ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-4 h-4 text-orange-600" />
                    <span>Net Banking</span>
                  </button>
                </div>

                {/* Payment Detail Sub-forms */}
                {paymentMethod === 'UPI' && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
                    <span className="text-xs font-black text-slate-700 block">Select Instant UPI App</span>
                    <div className="grid grid-cols-3 gap-2">
                      {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
                        <button
                          key={app}
                          type="button"
                          onClick={() => setSelectedUpiApp(app)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                            selectedUpiApp === app
                              ? 'border-orange-500 bg-white text-orange-700 shadow-xs'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>{app}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Or enter UPI ID (e.g. mobile@okhdfcbank)"
                        value={customUpiId}
                        onChange={(e) => setCustomUpiId(e.target.value)}
                        className="flex-1 p-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300 font-mono"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'CARD' && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-700">Enter Card Details</span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                        <span>VISA</span> • <span>Mastercard</span> • <span>RuPay</span>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                      maxLength={19}
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Valid Thru (MM/YY)"
                        maxLength={5}
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                      <input
                        type="password"
                        placeholder="CVV (3 Digits)"
                        maxLength={3}
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'COD' && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium space-y-1 animate-fadeIn">
                    <p className="font-bold">💵 Cash / UPI on Delivery</p>
                    <p className="text-[11px] text-emerald-700">
                      You can pay cash or scan the delivery partner&apos;s QR code using any UPI app when your food arrives.
                    </p>
                  </div>
                )}

                {paymentMethod === 'NETBANKING' && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 animate-fadeIn">
                    <span className="text-xs font-black text-slate-700 block">Select Popular Bank</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank'].map((b) => (
                        <button
                          key={b}
                          type="button"
                          className="p-2 bg-white rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: Order Summary, Coupons, Bill Breakdown, Place Order (5 Cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* RESTAURANT INFO CARD */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={activeRestaurant?.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80'}
                    alt={activeRestaurant?.name || 'Restaurant'}
                    className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-orange-100 shadow-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-black text-slate-900 truncate">
                      {activeRestaurant?.name || 'Partner Kitchen'}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">{activeRestaurant?.address || 'Hyderabad'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                        ⚡ 30-35 mins Delivery
                      </span>
                    </div>
                  </div>
                </div>

                {/* Free Delivery Meter */}
                <div className="bg-orange-50/70 p-3 rounded-2xl border border-orange-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                      {subtotal >= 499 ? (
                        <span className="text-emerald-700 font-black">🎉 Free Delivery Unlocked!</span>
                      ) : (
                        <span>Add <strong className="text-orange-600">₹{499 - subtotal}</strong> more for Free Delivery</span>
                      )}
                    </span>
                    <span className="text-[10px] font-black text-slate-500">{freeDeliveryProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        subtotal >= 499 ? 'bg-emerald-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${freeDeliveryProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* ORDER ITEMS LIST (WITH QUANTITY CONTROLS) */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                    Order Items ({cartItems.length})
                  </span>
                  <span className="text-xs font-bold text-slate-500">Qty / Price</span>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2.5 hover:border-slate-200 transition"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span
                          className={`w-3.5 h-3.5 rounded-xs border-2 flex items-center justify-center shrink-0 ${
                            item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                          }`}
                          title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                          <p className="text-[11px] font-extrabold text-slate-600">₹{item.price}</p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-xl border border-slate-200 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition cursor-pointer"
                          title="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black text-slate-800 w-4 text-center">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition cursor-pointer"
                          title="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right flex items-center gap-1.5 min-w-[50px] justify-end">
                        <span className="text-xs font-black text-slate-900">₹{item.price * item.qty}</span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-300 hover:text-rose-500 transition cursor-pointer p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COUPONS & OFFERS SECTION */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-orange-600" />
                  Coupons & Offers
                </span>

                {appliedCoupon ? (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-emerald-800 font-mono tracking-wide">
                            {appliedCoupon.code}
                          </span>
                          <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.2 rounded-full">
                            Applied
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-700 font-medium">
                          You saved ₹{couponDiscount} with this promo!
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Enter Promo Code"
                        className="flex-1 uppercase font-mono text-xs p-2.5 pl-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        disabled={!couponInput.trim()}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black disabled:opacity-40 text-white text-xs font-bold transition cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {availableCoupons.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => handleApplyCoupon(c.code)}
                          className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 transition cursor-pointer"
                        >
                          <Percent className="w-3 h-3 text-orange-600" />
                          <span>{c.code}</span>
                          <span className="text-[10px] text-slate-500 font-normal">({c.title})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ESTIMATED DELIVERY TIME BADGE */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <span className="font-black text-slate-900 block">⚡ Estimated Delivery Time</span>
                    <span className="text-[11px] text-slate-600">Expected by {arrivalTime} (30-35 mins)</span>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                  ON TIME
                </span>
              </div>

              {/* BILL SUMMARY DETAILS */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2.5 text-xs">
                <span className="font-black text-slate-900 block border-b border-slate-100 pb-2">
                  Bill Summary
                </span>
                
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

                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-base font-black text-slate-900">
                  <span>To Pay</span>
                  <span className="text-orange-600 text-lg">₹{grandTotal}</span>
                </div>
              </div>

              {/* PLACE ORDER PRIMARY ACTION CTA */}
              <button
                type="button"
                disabled={isSubmitting || cartItems.length === 0}
                onClick={handlePlaceOrder}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 hover:from-orange-700 hover:to-rose-700 text-white font-black text-base transition shadow-xl shadow-orange-600/30 flex items-center justify-between cursor-pointer active:scale-98 disabled:opacity-50"
              >
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-white/80 block -mb-0.5">Grand Total</span>
                  <span>₹{grandTotal}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{isSubmitting ? (submissionStep || 'Placing Order...') : 'Place Order'}</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                By placing this order, you agree to CraveDash Terms of Service & Cancellation Policy.
              </p>

            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default Checkout;
