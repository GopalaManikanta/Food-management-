import { useState, useEffect, useMemo } from 'react';
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
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
  ShieldCheck,
  CreditCard,
  Banknote,
  QrCode,
  Wallet,
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
  Bike,
  Eye,
  EyeOff,
  Lock,
  RefreshCw,
  Smartphone,
  Info
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

const WALLET_OPTIONS = [
  {
    id: 'amazon_pay',
    name: 'Amazon Pay',
    tagline: 'Instant 1-Click Pay',
    balance: 1250,
    icon: '📦',
    accent: 'text-amber-700 bg-amber-50 border-amber-200'
  },
  {
    id: 'paytm',
    name: 'Paytm Wallet',
    tagline: 'Linked with registered mobile',
    balance: 480,
    icon: '📱',
    accent: 'text-sky-700 bg-sky-50 border-sky-200'
  },
  {
    id: 'phonepe',
    name: 'PhonePe Wallet',
    tagline: 'Safe UPI-linked balance',
    balance: 620,
    icon: '🟣',
    accent: 'text-purple-700 bg-purple-50 border-purple-200'
  },
  {
    id: 'foodie_cash',
    name: 'CraveDash Foodie Cash',
    tagline: 'Your rewards & cashback credits',
    balance: 350,
    icon: '🪙',
    accent: 'text-orange-700 bg-orange-50 border-orange-200'
  },
  {
    id: 'mobikwik',
    name: 'MobiKwik ZIP',
    tagline: 'Instant wallet checkout',
    balance: 150,
    icon: '⚡',
    accent: 'text-blue-700 bg-blue-50 border-blue-200'
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

  // 3. Payment Method: 'UPI' | 'CARD' | 'WALLET' | 'COD' | 'NETBANKING'
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // UPI State
  const [upiMode, setUpiMode] = useState('apps'); // 'apps' | 'qr' | 'id'
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [qrTimer, setQrTimer] = useState(300); // 5 mins countdown

  useEffect(() => {
    if (paymentMethod === 'UPI' && upiMode === 'qr') {
      const interval = setInterval(() => {
        setQrTimer((prev) => (prev > 0 ? prev - 1 : 300));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [paymentMethod, upiMode]);

  const formatQrTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `0${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Card State
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: currentUser?.name || 'Rahul Sharma',
    expiry: '',
    cvv: ''
  });
  const [showCvv, setShowCvv] = useState(false);
  const [saveCard, setSaveCard] = useState(true);

  // Card formatting helpers
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardDetails((prev) => ({ ...prev, number: formatted }));
  };

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardDetails((prev) => ({ ...prev, expiry: raw }));
  };

  const cardNetwork = useMemo(() => {
    const clean = cardDetails.number.replace(/\D/g, '');
    if (clean.startsWith('4')) {
      return { name: 'Visa', logo: '💳 Visa', color: 'from-blue-600 to-indigo-900', badge: 'bg-blue-100 text-blue-800' };
    }
    if (/^(5[1-5]|2[2-7])/.test(clean)) {
      return { name: 'Mastercard', logo: '🔴🟠 Mastercard', color: 'from-orange-600 to-red-800', badge: 'bg-orange-100 text-orange-800' };
    }
    if (/^(60|65|81)/.test(clean)) {
      return { name: 'RuPay', logo: '🇮🇳 RuPay', color: 'from-emerald-700 to-teal-900', badge: 'bg-emerald-100 text-emerald-800' };
    }
    if (/^(34|37)/.test(clean)) {
      return { name: 'Amex', logo: '💎 Amex', color: 'from-cyan-700 to-blue-900', badge: 'bg-cyan-100 text-cyan-800' };
    }
    return { name: 'Debit / Credit Card', logo: '💳 Card', color: 'from-slate-800 to-slate-900', badge: 'bg-slate-100 text-slate-800' };
  }, [cardDetails.number]);

  // Wallet State
  const [selectedWalletId, setSelectedWalletId] = useState('amazon_pay');
  const activeWallet = WALLET_OPTIONS.find((w) => w.id === selectedWalletId) || WALLET_OPTIONS[0];

  // Netbanking State
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // 4. Promo Code & Coupons input
  const [couponInput, setCouponInput] = useState('');

  // 5. Payment Gateway Processing, Success, and Failure States
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [gatewayStep, setGatewayStep] = useState(1); // 1: connecting, 2: authorizing, 3: verifying
  const [isSimulateFailure, setIsSimulateFailure] = useState(false); // Testing toggle
  const [paymentFailure, setPaymentFailure] = useState(null); // Failure Screen state
  const [paymentSuccess, setPaymentSuccess] = useState(null); // Success Screen state

  // Selected address object
  const activeAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  // Handle Apply Coupon
  const handleApplyCoupon = (codeToApply) => {
    const code = codeToApply || couponInput;
    if (!code) {
      toast.warning('Please enter or select a coupon code.');
      return;
    }
    const res = applyCoupon(code);
    if (res.success) setCouponInput('');
  };

  // Add New Address Form Submit
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

  // Real-time Payment & Order Placement Handler
  const handleInitiatePayment = (e) => {
    e?.preventDefault();

    // Guard 1: Empty cart
    if (cartItems.length === 0) {
      toast.error('Your cart is empty! Please add items before checking out.');
      return;
    }

    // Guard 2: Missing delivery address
    if (!activeAddress) {
      toast.error('Please select or add a delivery address.');
      return;
    }

    // Guard 3: Payment Specific Validation
    if (paymentMethod === 'CARD') {
      const cleanNum = cardDetails.number.replace(/\D/g, '');
      if (cleanNum.length < 15) {
        toast.error('Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardDetails.expiry || cardDetails.expiry.length < 5) {
        toast.error('Please enter a valid card expiry (MM/YY).');
        return;
      }
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        toast.error('Please enter a valid 3 or 4 digit CVV security code.');
        return;
      }
    }

    if (paymentMethod === 'UPI' && upiMode === 'id') {
      if (!customUpiId.trim() || !customUpiId.includes('@')) {
        toast.error('Please enter a valid UPI ID (e.g. mobile@okhdfcbank).');
        return;
      }
    }

    // If Cash On Delivery, no gateway required; place directly
    if (paymentMethod === 'COD') {
      executeOrderPlacement({
        paymentMode: 'Cash on Delivery (COD)',
        transactionId: `COD_CRV_${Date.now().toString(36).toUpperCase()}`,
        bankRef: `COD${Date.now()}`,
        status: 'Cash to be collected upon delivery'
      });
      return;
    }

    // Check if user set CVV to 000 or enabled failure simulation toggle to test Payment Failure Screen
    const shouldFail = isSimulateFailure || (paymentMethod === 'CARD' && cardDetails.cvv === '000');

    // Launch Real-Time Gateway Processing Modal
    setIsProcessingPayment(true);
    setGatewayStep(1);

    setTimeout(() => {
      setGatewayStep(2);

      setTimeout(() => {
        setGatewayStep(3);

        setTimeout(() => {
          setIsProcessingPayment(false);

          if (shouldFail) {
            // TRIGGER PAYMENT FAILURE SCREEN
            let failureReason = 'Bank declined transaction: Card declined by issuing bank (Insufficient funds / Incorrect CVV) [CODE: 05]';
            let errCode = 'ERR_BANK_DECLINED_05';

            if (paymentMethod === 'UPI') {
              failureReason = 'UPI request timed out: No authorization received from UPI app within 60 seconds [CODE: U30]';
              errCode = 'ERR_UPI_TIMEOUT_U30';
            } else if (paymentMethod === 'WALLET') {
              failureReason = `Transaction declined: Insufficient balance in ${activeWallet.name} wallet [CODE: W04]`;
              errCode = 'ERR_WALLET_INSUFFICIENT_W04';
            } else if (paymentMethod === 'NETBANKING') {
              failureReason = `Bank server unreachable: ${selectedBank} gateway failed to respond [CODE: NB504]`;
              errCode = 'ERR_NETBANKING_GATEWAY_504';
            }

            setPaymentFailure({
              reason: failureReason,
              code: errCode,
              amount: grandTotal,
              method: getPaymentMethodLabel()
            });
            toast.error('Payment Failed! Bank declined transaction.');
          } else {
            // TRIGGER PAYMENT SUCCESS
            const txnId = `TXN_CRV_${Date.now().toString(36).toUpperCase()}_${Math.floor(1000 + Math.random() * 9000)}`;
            const bankRef = `RRN${Date.now()}`;
            executeOrderPlacement({
              paymentMode: getPaymentMethodLabel(),
              transactionId: txnId,
              bankRef,
              status: 'Paid Successfully'
            });
          }
        }, 700);
      }, 700);
    }, 600);
  };

  // Helper: Friendly label for payment mode
  const getPaymentMethodLabel = () => {
    if (paymentMethod === 'UPI') {
      if (upiMode === 'apps') return `UPI (${selectedUpiApp})`;
      if (upiMode === 'qr') return 'UPI (QR Code Scan)';
      return `UPI (${customUpiId || 'VPA'})`;
    }
    if (paymentMethod === 'CARD') {
      const last4 = cardDetails.number.replace(/\D/g, '').slice(-4) || '4242';
      return `${cardNetwork.name} Card ending in ${last4}`;
    }
    if (paymentMethod === 'WALLET') {
      return `${activeWallet.name} Wallet`;
    }
    if (paymentMethod === 'NETBANKING') {
      return `${selectedBank} Net Banking`;
    }
    return 'Cash on Delivery';
  };

  // Execute Order Placement and render Payment Success Screen
  const executeOrderPlacement = ({ paymentMode, transactionId, bankRef, status }) => {
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
      paymentMethod: paymentMode,
      paymentDetails: {
        transactionId,
        bankRef,
        method: paymentMode,
        status,
        paidAt: new Date().toISOString()
      },
      estimatedTime: '30-35 mins'
    });

    if (res.success && res.orderId) {
      setPaymentSuccess({
        orderId: res.orderId,
        transactionId,
        bankRef,
        amount: grandTotal,
        method: paymentMode,
        order: res.order
      });
    }
  };

  // Free delivery progress
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / 499) * 100));

  // Compute live estimated arrival time
  const arrivalTime = useMemo(() =>
    new Date(Date.now() + 32 * 60 * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    }), []);

  // Total savings calculation
  const totalSavings = (couponDiscount || 0) + (deliveryFee === 0 ? 35 : 0);

  // =========================================================================
  // VIEW 1: PAYMENT SUCCESS SCREEN
  // =========================================================================
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none">
        <Navbar />
        <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 text-center animate-fadeIn relative overflow-hidden">
            
            {/* Top Confetti Accent */}
            <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-emerald-100/60 blur-xl pointer-events-none" />

            {/* Animated Checkmark Badge */}
            <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
            </div>

            {/* Title & Celebration */}
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Payment Authorized & Verified</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Payment Successful! 🎉
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Your order is confirmed and sent directly to the kitchen. Hot & fresh food is on the way!
              </p>
            </div>

            {/* Payment Summary Receipt Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs text-slate-500 font-bold">Amount Paid</span>
                <span className="text-xl font-black text-emerald-700">₹{paymentSuccess.amount}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Order ID</span>
                  <span className="font-mono font-black text-slate-900 block truncate">#{paymentSuccess.orderId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Payment Mode</span>
                  <span className="font-bold text-slate-800 block truncate">{paymentSuccess.method}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Transaction ID</span>
                  <span className="font-mono font-bold text-slate-700 block truncate text-[11px]">{paymentSuccess.transactionId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Bank Reference (RRN)</span>
                  <span className="font-mono font-bold text-slate-700 block truncate text-[11px]">{paymentSuccess.bankRef}</span>
                </div>
              </div>

              {totalSavings > 0 && (
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-emerald-700 font-bold">
                  <span>Total Savings on this order:</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg text-[11px] font-black">
                    Saved ₹{totalSavings}! 🏷️
                  </span>
                </div>
              )}
            </div>

            {/* Estimated Delivery Notice */}
            <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between text-xs text-orange-950 text-left">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-orange-600 shrink-0" />
                <div>
                  <span className="font-black text-slate-900 block">Expected by {arrivalTime}</span>
                  <span className="text-[11px] text-slate-600">30-35 mins express delivery to {activeAddress?.tag || 'Home'}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase">
                ON TIME
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => navigate(`/order-confirmation/${paymentSuccess.orderId}`)}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 hover:from-orange-700 hover:to-rose-700 text-white font-black text-xs transition shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Bike className="w-4 h-4" />
                <span>Track Order Live in Real-Time</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/customer')}
                className="w-full py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
              >
                Go to My Orders & Profile
              </button>
            </div>

          </div>
        </main>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: PAYMENT FAILURE SCREEN
  // =========================================================================
  if (paymentFailure) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none">
        <Navbar />
        <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-2xl space-y-6 text-center animate-fadeIn relative overflow-hidden">
            
            {/* Top Red Bar */}
            <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-rose-500 to-red-600" />
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-rose-100/60 blur-xl pointer-events-none" />

            {/* Animated Failure Cross Badge */}
            <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500 to-red-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/30">
              <XCircle className="w-12 h-12 stroke-[2.5]" />
            </div>

            {/* Title & Message */}
            <div>
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Transaction Declined</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Payment Failed / Declined
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                We could not complete your transaction. Don&apos;t worry, your food basket and delivery address are completely safe!
              </p>
            </div>

            {/* Failure Reason Breakdown Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/60 border border-rose-200 text-left space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-rose-200/80">
                <span className="text-xs text-slate-600 font-bold">Attempted Amount</span>
                <span className="text-lg font-black text-rose-700">₹{paymentFailure.amount}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Decline Reason</span>
                  <p className="font-bold text-slate-900 text-xs mt-0.5 leading-relaxed">{paymentFailure.reason}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Payment Method</span>
                    <span className="font-bold text-slate-800 block truncate">{paymentFailure.method}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Error Code</span>
                    <span className="font-mono font-bold text-rose-600 block truncate text-[11px]">{paymentFailure.code}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reassurance Notice */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Safety Guarantee:</strong> If money was deducted from your account/bank, it will be automatically refunded within 2 business days.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setPaymentFailure(null);
                  setIsSimulateFailure(false);
                }}
                className="w-full py-3.5 px-5 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-xs transition shadow-md shadow-black/10 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Payment</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentFailure(null);
                  setIsSimulateFailure(false);
                  setPaymentMethod('COD');
                  executeOrderPlacement({
                    paymentMode: 'Cash on Delivery (COD)',
                    transactionId: `COD_CRV_${Date.now().toString(36).toUpperCase()}`,
                    bankRef: `COD${Date.now()}`,
                    status: 'Cash to be collected upon delivery'
                  });
                }}
                className="w-full py-3 px-5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-black text-xs transition border border-emerald-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>Pay via Cash on Delivery (COD) Instead</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentFailure(null);
                  setIsSimulateFailure(false);
                }}
                className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                Change Payment Method
              </button>
            </div>

          </div>
        </main>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: MAIN ACTIVE CHECKOUT VIEW
  // =========================================================================
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
                <span>100% Safe Payments • Real-Time Order Verification</span>
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

                {/* Add New Address Form */}
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
                        className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300 font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Street / Colony / Area *"
                        value={newAddrForm.area}
                        onChange={(e) => setNewAddrForm({ ...newAddrForm, area: e.target.value })}
                        required
                        className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300 font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Nearby Landmark (Optional)"
                        value={newAddrForm.landmark}
                        onChange={(e) => setNewAddrForm({ ...newAddrForm, landmark: e.target.value })}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300 font-medium"
                      />
                      <input
                        type="text"
                        placeholder="City & Pincode"
                        value={newAddrForm.pincode}
                        onChange={(e) => setNewAddrForm({ ...newAddrForm, pincode: e.target.value })}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300 font-medium"
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

              {/* STEP 2: DELIVERY INSTRUCTIONS */}
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

              {/* STEP 3: PAYMENT METHOD (SWIGGY / ZOMATO REAL-TIME WORKFLOW) */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm">
                      3
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900">Payment Option</h2>
                      <p className="text-xs text-slate-500">Choose your preferred payment method</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>256-Bit SSL Encrypted</span>
                  </span>
                </div>

                {/* Primary Payment Mode Navigation Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  
                  {/* Tab 1: UPI */}
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

                  {/* Tab 2: Card */}
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
                    <span>Cards</span>
                  </button>

                  {/* Tab 3: Wallets (Feature Request) */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('WALLET')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'WALLET'
                        ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Wallet className="w-4 h-4 text-orange-600" />
                    <span>Wallets</span>
                  </button>

                  {/* Tab 4: Cash on Delivery */}
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

                  {/* Tab 5: Net Banking */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1.5 cursor-pointer col-span-2 sm:col-span-1 ${
                      paymentMethod === 'NETBANKING'
                        ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-4 h-4 text-orange-600" />
                    <span>Net Banking</span>
                  </button>
                </div>

                {/* ========================================================= */}
                {/* 1. UPI PAYMENT UI (APPS, QR, ID) */}
                {/* ========================================================= */}
                {paymentMethod === 'UPI' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-fadeIn">
                    
                    {/* Sub-mode selector */}
                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 max-w-sm">
                      <button
                        type="button"
                        onClick={() => setUpiMode('apps')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                          upiMode === 'apps' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        UPI Apps
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpiMode('qr')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                          upiMode === 'qr' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Scan QR Code
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpiMode('id')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                          upiMode === 'id' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Enter UPI ID
                      </button>
                    </div>

                    {/* Mode A: UPI Apps */}
                    {upiMode === 'apps' && (
                      <div className="space-y-3">
                        <span className="text-xs font-black text-slate-800 block">
                          Select Installed App for 1-Tap Authorization:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {[
                            { name: 'Google Pay', icon: '🟢', color: 'border-emerald-200 hover:border-emerald-400' },
                            { name: 'PhonePe', icon: '🟣', color: 'border-purple-200 hover:border-purple-400' },
                            { name: 'Paytm', icon: '🔵', color: 'border-sky-200 hover:border-sky-400' },
                            { name: 'CRED UPI', icon: '⚪', color: 'border-slate-300 hover:border-slate-500' },
                            { name: 'BHIM UPI', icon: '🇮🇳', color: 'border-orange-200 hover:border-orange-400' }
                          ].map((app) => (
                            <button
                              key={app.name}
                              type="button"
                              onClick={() => setSelectedUpiApp(app.name)}
                              className={`p-3 rounded-xl border-2 text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                                selectedUpiApp === app.name
                                  ? 'border-orange-500 bg-white text-orange-950 shadow-xs'
                                  : `bg-white text-slate-700 ${app.color}`
                              }`}
                            >
                              <span className="text-base">{app.icon}</span>
                              <div className="text-left min-w-0">
                                <span className="block truncate font-black">{app.name}</span>
                                <span className="text-[10px] text-slate-400 block font-normal">Instant Pay</span>
                              </div>
                            </button>
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                          <Smartphone className="w-3.5 h-3.5 text-orange-600" />
                          <span>Tap &quot;Place Order & Pay&quot; to open {selectedUpiApp} and approve the request.</span>
                        </p>
                      </div>
                    )}

                    {/* Mode B: Scan QR Code */}
                    {upiMode === 'qr' && (
                      <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-[11px] font-black">
                          <Clock className="w-3.5 h-3.5 text-orange-600" />
                          <span>QR expires in {formatQrTimer(qrTimer)}</span>
                        </div>

                        {/* Interactive Dynamic QR Code Mock */}
                        <div className="w-48 h-48 mx-auto p-3 bg-white rounded-2xl border-2 border-slate-900 shadow-md relative flex flex-col items-center justify-center">
                          <div className="w-full h-full bg-radial from-slate-900 via-slate-800 to-black rounded-xl p-2 flex flex-col items-center justify-between text-white text-[10px]">
                            <div className="w-full flex justify-between font-mono font-bold">
                              <span>■■■</span>
                              <span>CRAVEDASH</span>
                              <span>■■■</span>
                            </div>
                            <div className="p-2 bg-white text-slate-900 rounded-lg font-black text-center font-mono">
                              <span className="text-sm block">₹{grandTotal}</span>
                              <span className="text-[9px] text-slate-500">BHIM UPI QR</span>
                            </div>
                            <div className="w-full flex justify-between font-mono font-bold">
                              <span>■■■</span>
                              <span>SCAN & PAY</span>
                              <span>■■■</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 font-medium">
                          Scan this QR with <strong>Google Pay, PhonePe, Paytm</strong> or any UPI App to complete payment.
                        </p>

                        <button
                          type="button"
                          onClick={() => {
                            toast.success('QR Code verified! Payment approved from device. 📲');
                            handleInitiatePayment();
                          }}
                          className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-black border border-orange-200 transition cursor-pointer"
                        >
                          ⚡ Test QR Approval (Simulate Scan)
                        </button>
                      </div>
                    )}

                    {/* Mode C: Custom UPI ID / VPA */}
                    {upiMode === 'id' && (
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-800 block">
                          Enter your Virtual Payment Address (VPA) / UPI ID:
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="e.g. yourname@okhdfcbank"
                            value={customUpiId}
                            onChange={(e) => setCustomUpiId(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-300 pr-20"
                          />
                          {customUpiId.includes('@') && (
                            <span className="absolute right-3 top-3 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Valid VPA</span>
                            </span>
                          )}
                        </div>

                        {/* Quick Handle Chips */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] text-slate-400 font-bold">Suggestions:</span>
                          {['@okhdfcbank', '@okaxis', '@ybl', '@paytm', '@ibl'].map((handle) => (
                            <button
                              key={handle}
                              type="button"
                              onClick={() => {
                                const prefix = customUpiId.split('@')[0] || currentUser?.phone || 'rahul';
                                setCustomUpiId(`${prefix}${handle}`);
                              }}
                              className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:border-orange-300 text-[11px] font-mono text-slate-700 hover:text-orange-600 transition cursor-pointer"
                            >
                              {handle}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* ========================================================= */}
                {/* 2. CARD PAYMENT UI (LIVE INTERACTIVE VIRTUAL CARD PREVIEW) */}
                {/* ========================================================= */}
                {paymentMethod === 'CARD' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-fadeIn">
                    
                    {/* Live Virtual Card Mockup Preview */}
                    <div className={`w-full max-w-sm mx-auto p-5 rounded-3xl bg-gradient-to-r ${cardNetwork.color} text-white shadow-xl space-y-4 relative overflow-hidden transition-all duration-300`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-5 rounded-md bg-amber-400/80 border border-amber-300 shadow-inner flex items-center justify-center text-[9px] font-bold text-amber-900">
                            CHIP
                          </span>
                          <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Debit / Credit</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider">
                          {cardNetwork.logo}
                        </span>
                      </div>

                      <div className="py-2">
                        <span className="text-[9px] text-white/60 uppercase tracking-widest block">Card Number</span>
                        <span className="font-mono text-base sm:text-lg tracking-widest font-black block">
                          {cardDetails.number || '•••• •••• •••• ••••'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-white/20">
                        <div>
                          <span className="text-[8px] text-white/60 uppercase tracking-widest block">Cardholder</span>
                          <span className="font-bold text-white truncate block max-w-[140px] uppercase text-[11px]">
                            {cardDetails.name || 'YOUR NAME'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] text-white/60 uppercase tracking-widest block">Expires</span>
                          <span className="font-mono font-bold text-white text-[11px]">
                            {cardDetails.expiry || 'MM/YY'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Input Form */}
                    <div className="space-y-3 pt-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-black text-slate-700">Card Number *</label>
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${cardNetwork.badge}`}>
                            {cardNetwork.name}
                          </span>
                        </div>
                        <div className="relative">
                          <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            placeholder="XXXX XXXX XXXX XXXX"
                            maxLength={19}
                            value={cardDetails.number}
                            onChange={handleCardNumberChange}
                            required
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-black text-slate-700 block mb-1">Name on Card *</label>
                        <input
                          type="text"
                          placeholder="e.g. Rahul Sharma"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-black text-slate-700 block mb-1">Expiry Date *</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={cardDetails.expiry}
                            onChange={handleExpiryChange}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-black text-slate-700 block mb-1">CVV / CVC *</label>
                          <div className="relative">
                            <input
                              type={showCvv ? 'text' : 'password'}
                              placeholder="3 or 4 digits"
                              maxLength={4}
                              value={cardDetails.cvv}
                              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') })}
                              required
                              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCvv(!showCvv)}
                              className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 cursor-pointer"
                              title="Toggle CVV visibility"
                            >
                              {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Save Card Checkbox */}
                      <label className="flex items-center gap-2 pt-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={saveCard}
                          onChange={(e) => setSaveCard(e.target.checked)}
                          className="rounded text-orange-600 focus:ring-orange-400"
                        />
                        <span className="text-[11px] text-slate-600 font-medium">
                          Securely save this card as per RBI guidelines for faster checkout
                        </span>
                      </label>
                    </div>

                  </div>
                )}

                {/* ========================================================= */}
                {/* 3. WALLET PAYMENT UI (FEATURE REQUEST) */}
                {/* ========================================================= */}
                {paymentMethod === 'WALLET' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800">Select Digital Wallet:</span>
                      <span className="text-[10px] text-slate-500 font-bold">1-Click Instant Deduction</span>
                    </div>

                    <div className="space-y-2.5">
                      {WALLET_OPTIONS.map((wallet) => {
                        const isSelected = selectedWalletId === wallet.id;
                        const isSufficient = wallet.balance >= grandTotal;

                        return (
                          <div
                            key={wallet.id}
                            onClick={() => setSelectedWalletId(wallet.id)}
                            className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'border-orange-500 bg-white shadow-xs'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl p-2 rounded-xl bg-slate-100 shrink-0">{wallet.icon}</span>
                              <div>
                                <h4 className="font-black text-xs text-slate-900">{wallet.name}</h4>
                                <p className="text-[11px] text-slate-500">{wallet.tagline}</p>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-xs font-black text-slate-900 block">₹{wallet.balance}</span>
                              {isSufficient ? (
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                                  ✓ Sufficient
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                                  Low (Short ₹{grandTotal - wallet.balance})
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {activeWallet && activeWallet.balance >= grandTotal ? (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{activeWallet.name} has sufficient balance (₹{activeWallet.balance}). Instant 1-click payment ready!</span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Balance is less than total amount. Remaining can be covered via UPI/Card.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* ========================================================= */}
                {/* 4. CASH ON DELIVERY (COD) */}
                {/* ========================================================= */}
                {paymentMethod === 'COD' && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium space-y-1.5 animate-fadeIn">
                    <p className="font-black text-sm flex items-center gap-2 text-emerald-900">
                      <Banknote className="w-4 h-4 text-emerald-700" />
                      <span>Cash / UPI on Delivery</span>
                    </p>
                    <p className="text-[11px] text-emerald-700 leading-relaxed">
                      You can pay via Cash or scan the delivery hero&apos;s dynamic QR code on their device using Google Pay, PhonePe, or Paytm upon doorstep arrival.
                    </p>
                  </div>
                )}

                {/* ========================================================= */}
                {/* 5. NET BANKING */}
                {/* ========================================================= */}
                {paymentMethod === 'NETBANKING' && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
                    <span className="text-xs font-black text-slate-800 block">Select Top Indian Banks:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank'].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setSelectedBank(b)}
                          className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                            selectedBank === b
                              ? 'border-orange-500 bg-white text-orange-950 shadow-xs'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <Building className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                          <span className="block truncate">{b}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Test Mode Failure Simulation Switch */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-slate-600">Gateway Test Mode:</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSimulateFailure}
                      onChange={(e) => setIsSimulateFailure(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-400"
                    />
                    <span className={`text-[11px] font-bold ${isSimulateFailure ? 'text-rose-600' : 'text-slate-500'}`}>
                      {isSimulateFailure ? '⚠️ Simulate Payment Failure Screen' : 'Normal (Success Flow)'}
                    </span>
                  </label>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: Order Summary, Coupons, Bill Breakdown, Pay CTA (5 Cols) */}
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

              {/* COUPONS & OFFERS SECTION (FEATURE 1: APPLY COUPON & FEATURE 2: DISCOUNT CALCULATION) */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-orange-600" />
                    Coupons & Offers
                  </span>
                  <span className="text-[10px] text-orange-600 font-bold">
                    {availableCoupons?.length || 5} deals available
                  </span>
                </div>

                {appliedCoupon ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-fadeIn">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-emerald-900 font-mono tracking-wide">
                            {appliedCoupon.code}
                          </span>
                          <span className="text-[10px] bg-emerald-200 text-emerald-950 font-bold px-1.5 py-0.2 rounded-full">
                            Applied
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                          🎉 Saved ₹{couponDiscount} on your bill!
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="px-2.5 py-1 text-xs font-black text-rose-600 bg-white hover:bg-rose-50 rounded-lg border border-rose-200 transition cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Enter Promo Code (e.g. WELCOME50)"
                        className="flex-1 uppercase font-mono text-xs p-2.5 pl-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-300 font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        disabled={!couponInput.trim()}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black disabled:opacity-40 text-white text-xs font-black transition cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Coupons Carousel / Pills List */}
                    <div className="space-y-2 pt-1">
                      {availableCoupons?.map((c) => {
                        const canApply = subtotal >= c.minSubtotal;
                        return (
                          <div
                            key={c.code}
                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-black text-slate-900 bg-white border border-slate-200 px-1.5 py-0.2 rounded text-[11px]">
                                  {c.code}
                                </span>
                                <span className="font-bold text-slate-800 text-[11px]">{c.title}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 truncate mt-0.5">{c.description}</p>
                            </div>

                            {canApply ? (
                              <button
                                type="button"
                                onClick={() => handleApplyCoupon(c.code)}
                                className="px-3 py-1 bg-orange-50 hover:bg-orange-100 text-orange-700 font-black text-[11px] rounded-lg border border-orange-200 transition cursor-pointer shrink-0"
                              >
                                Apply
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold shrink-0">
                                Min ₹{c.minSubtotal}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* ESTIMATED DELIVERY TIME BADGE */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <span className="font-black text-slate-900 block">⚡ Express Doorstep Delivery</span>
                    <span className="text-[11px] text-slate-600">Expected by {arrivalTime} (30-35 mins)</span>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                  ON TIME
                </span>
              </div>

              {/* FEATURE 3: BILL SUMMARY & PAYMENT BREAKDOWN */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2.5 text-xs">
                <span className="font-black text-slate-900 block border-b border-slate-100 pb-2">
                  Payment Summary
                </span>
                
                <div className="flex justify-between text-slate-600">
                  <span>Item Total (Subtotal)</span>
                  <span className="font-bold text-slate-900">₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Delivery Partner Fee</span>
                  <span className={deliveryFee === 0 ? 'font-bold text-emerald-600' : 'font-bold text-slate-900'}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <span>Platform Fee</span>
                    <Info className="w-3 h-3 text-slate-400" title="Supports continuous operational service" />
                  </span>
                  <span className="font-bold text-slate-900">₹{platformFee}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Govt. Taxes (GST 5%)</span>
                  <span className="font-bold text-slate-900">₹{gstTax}</span>
                </div>

                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50/60 p-1.5 rounded-lg border border-emerald-100">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-emerald-600" />
                      <span>Coupon Discount ({appliedCoupon.code})</span>
                    </span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}

                {totalSavings > 0 && (
                  <div className="p-2 rounded-xl bg-emerald-100/50 text-emerald-800 font-bold text-center text-[11px]">
                    🎉 You are saving ₹{totalSavings} on this order!
                  </div>
                )}

                <div className="pt-2.5 border-t border-slate-200 flex justify-between items-center text-base font-black text-slate-900">
                  <div>
                    <span className="block text-slate-900">To Pay</span>
                    <span className="text-[10px] text-slate-400 font-normal">Inclusive of all taxes & charges</span>
                  </div>
                  <span className="text-orange-600 text-xl font-black">₹{grandTotal}</span>
                </div>
              </div>

              {/* PRIMARY ACTION CTA */}
              <button
                type="button"
                disabled={cartItems.length === 0}
                onClick={handleInitiatePayment}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 hover:from-orange-700 hover:to-rose-700 text-white font-black text-base transition shadow-xl shadow-orange-600/30 flex items-center justify-between cursor-pointer active:scale-98 disabled:opacity-50"
              >
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-white/80 block -mb-0.5">Grand Total</span>
                  <span>₹{grandTotal}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Pay with {paymentMethod === 'COD' ? 'Cash' : paymentMethod === 'CARD' ? 'Card' : paymentMethod === 'WALLET' ? 'Wallet' : 'UPI'}</span>
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

      {/* ========================================================================= */}
      {/* 4. REAL-TIME PAYMENT GATEWAY PROCESSING MODAL */}
      {/* ========================================================================= */}
      {isProcessingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn select-none">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-6 animate-scaleIn">
            
            {/* Gateway Header */}
            <div className="flex items-center justify-center gap-2 pb-3 border-b border-slate-100">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span className="font-mono text-xs font-black text-slate-800 uppercase tracking-widest">
                CraveDash SecurePay Gateway
              </span>
            </div>

            {/* Processing Spinner */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-orange-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <CreditCard className="w-7 h-7 text-orange-600" />
              </div>
            </div>

            {/* Stepper Status */}
            <div className="space-y-2">
              <h3 className="font-black text-lg text-slate-900">
                {gatewayStep === 1 && 'Connecting to Banking Network...'}
                {gatewayStep === 2 && `Authorizing ₹${grandTotal} via ${getPaymentMethodLabel()}...`}
                {gatewayStep === 3 && 'Verifying 3D Secure / OTP Token...'}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Please do not close this window or press back while we securely process your transaction.
              </p>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    gatewayStep >= step ? 'w-8 bg-orange-600' : 'w-4 bg-slate-200'
                  }`}
                />
              ))}
            </div>

            <span className="text-[10px] text-slate-400 font-mono block">
              Session Ref: SEC_{Date.now().toString(36).toUpperCase()} • RBI Compliant
            </span>
          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;
