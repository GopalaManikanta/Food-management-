import { useState, useEffect, useMemo, useRef } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
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
  User,
  X,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Edit2,
  Plus,
  Trash2,
  Camera,
  Check,
  Mail,
  Navigation,
  Printer,
  Download,
  FileText,
  Filter,
  ArrowUpDown,
  Copy,
  CreditCard,
  XCircle
} from 'lucide-react';

// Preset Avatars for Profile Customization
const AVATAR_PRESETS = [
  { id: '1', label: 'Rahul', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' },
  { id: '2', label: 'Priya', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
  { id: '3', label: 'Vikram', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80' },
  { id: '4', label: 'Ananya', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80' },
  { id: '5', label: 'Chef', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  { id: '6', label: 'Fun Bot', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=FoodieHero' }
];

// Default Saved Delivery Addresses (Synced with Checkout)
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
    receiverPhone: '9876543210',
    isPrimary: true,
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
    receiverPhone: '9876543210',
    isPrimary: false,
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
    receiverPhone: '9876543210',
    isPrimary: false,
    fullAddress: 'Plot 88, Green Meadows, Durgam Cheruvu Road, Madhapur, Hyderabad - 500081'
  }
];

// Realistic Fallback Historical Orders for Instant Demonstration & Real-time Reordering
const DEFAULT_HISTORY_ORDERS = [
  {
    id: 'CRV-ORD-8821',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 9876543210',
    deliveryAddress: 'Flat 402, Lotus Residency, Road No. 36, Jubilee Hills, Hyderabad - 500033',
    deliveryInstructions: 'Leave with security if not answering door',
    restaurantName: 'Bawarchi Biryani',
    restaurantId: 'rest-1',
    restaurantImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Biryani, North Indian, Mughlai',
    items: [
      { id: 'dish-101', name: 'Special Chicken Biryani (Family Pack)', qty: 1, price: 549, isVeg: false },
      { id: 'dish-102', name: 'Mirchi Ka Salan & Extra Raita', qty: 2, price: 40, isVeg: true },
      { id: 'dish-103', name: 'Thums Up (750ml)', qty: 1, price: 45, isVeg: true }
    ],
    itemCount: 4,
    subtotal: 674,
    deliveryFee: 0,
    platformFee: 5,
    gstTax: 34,
    couponCode: 'WELCOME50',
    couponDiscount: 50,
    totalAmount: 663,
    status: 'Delivered',
    paymentMethod: 'UPI',
    paymentDetails: {
      transactionId: 'TXN_CRV_UPI_882194',
      bankRef: 'RRN482910482',
      method: 'UPI (Google Pay)',
      status: 'Paid Successfully',
      paidAt: '2026-11-12T14:45:00.000Z'
    },
    deliveryPartner: {
      name: 'Suresh Kumar',
      phone: '+91 98765 43210',
      vehicle: 'Hero Splendor (TS 09 EZ 4821)',
      rating: 4.9,
      status: 'Delivered'
    },
    createdAt: 'Yesterday, 08:45 PM',
    timestamp: 1794500000000
  },
  {
    id: 'CRV-ORD-7419',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 9876543210',
    deliveryAddress: 'Tower B, 6th Floor, Mindspace IT Park, HITEC City, Hyderabad - 500081',
    deliveryInstructions: 'Call upon arrival at tower gate',
    restaurantName: 'Pista House',
    restaurantId: 'rest-2',
    restaurantImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Haleem, Hyderabadi, Kebabs',
    items: [
      { id: 'dish-201', name: 'Authentic Hyderabadi Mutton Haleem', qty: 2, price: 280, isVeg: false },
      { id: 'dish-202', name: 'Rumali Roti (Set of 4)', qty: 1, price: 60, isVeg: true }
    ],
    itemCount: 3,
    subtotal: 620,
    deliveryFee: 0,
    platformFee: 5,
    gstTax: 31,
    couponCode: 'FEAST20',
    couponDiscount: 120,
    totalAmount: 536,
    status: 'Delivered',
    paymentMethod: 'CARD',
    paymentDetails: {
      transactionId: 'TXN_CRV_CRD_741901',
      bankRef: 'RRN294819024',
      method: 'Visa Card ending in 4242',
      status: 'Paid Successfully',
      paidAt: '2026-11-10T13:15:00.000Z'
    },
    deliveryPartner: {
      name: 'Ramesh Varma',
      phone: '+91 98450 12345',
      vehicle: 'TVS Jupiter (TS 07 FA 8219)',
      rating: 4.8,
      status: 'Delivered'
    },
    createdAt: '3 days ago, 01:15 PM',
    timestamp: 1794300000000
  },
  {
    id: 'CRV-ORD-6230',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 9876543210',
    deliveryAddress: 'Flat 402, Lotus Residency, Road No. 36, Jubilee Hills, Hyderabad - 500033',
    deliveryInstructions: 'Ring bell and place on shoe rack',
    restaurantName: 'Chutneys',
    restaurantId: 'rest-3',
    restaurantImage: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=400&q=80',
    cuisine: 'South Indian, Tiffins, Filter Coffee',
    items: [
      { id: 'dish-301', name: 'Steam Dosa with 6 Signature Chutneys', qty: 2, price: 160, isVeg: true },
      { id: 'dish-302', name: 'Guntur Idli with Pure Ghee Podi', qty: 1, price: 120, isVeg: true },
      { id: 'dish-303', name: 'Degree Filter Coffee', qty: 2, price: 45, isVeg: true }
    ],
    itemCount: 5,
    subtotal: 530,
    deliveryFee: 0,
    platformFee: 5,
    gstTax: 26,
    couponCode: null,
    couponDiscount: 0,
    totalAmount: 561,
    status: 'Delivered',
    paymentMethod: 'WALLET',
    paymentDetails: {
      transactionId: 'TXN_CRV_WAL_623011',
      bankRef: 'RRN784291039',
      method: 'PhonePe Wallet',
      status: 'Paid Successfully',
      paidAt: '2026-11-08T09:30:00.000Z'
    },
    deliveryPartner: {
      name: 'Kalyan Reddy',
      phone: '+91 99123 45678',
      vehicle: 'Honda Activa (TS 10 HK 3912)',
      rating: 5.0,
      status: 'Delivered'
    },
    createdAt: '5 days ago, 09:30 AM',
    timestamp: 1794100000000
  },
  {
    id: 'CRV-ORD-5198',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 9876543210',
    deliveryAddress: 'Flat 402, Lotus Residency, Road No. 36, Jubilee Hills, Hyderabad - 500033',
    deliveryInstructions: 'Call before delivery',
    restaurantName: 'Paradise Royale Biryani',
    restaurantId: 'rest-4',
    restaurantImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Royal Mughlai, Biryani, Desserts',
    items: [
      { id: 'dish-401', name: 'Mutton Dum Biryani Single', qty: 1, price: 420, isVeg: false },
      { id: 'dish-402', name: 'Double Ka Meetha', qty: 1, price: 110, isVeg: true }
    ],
    itemCount: 2,
    subtotal: 530,
    deliveryFee: 35,
    platformFee: 5,
    gstTax: 27,
    couponCode: null,
    couponDiscount: 0,
    totalAmount: 597,
    status: 'Cancelled',
    paymentMethod: 'UPI',
    paymentDetails: {
      transactionId: 'TXN_CRV_UPI_519810',
      bankRef: 'RRN984210984',
      method: 'UPI (Paytm)',
      status: 'Refunded (100% credited back to bank account)',
      paidAt: '2026-11-05T20:10:00.000Z'
    },
    deliveryPartner: null,
    createdAt: 'Last week',
    timestamp: 1793800000000
  }
];

// Helper: Convert Number to Words for Official Tax Invoice
const numberToWords = (num) => {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const toWords = (n) => {
    if (n === 0) return '';
    if (n < 20) return a[n] + ' ';
    if (n < 100) return b[Math.floor(n / 10)] + ' ' + (n % 10 !== 0 ? a[n % 10] + ' ' : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred ' + (n % 100 !== 0 ? toWords(n % 100) : '');
    if (n < 100000) return toWords(Math.floor(n / 1000)) + 'Thousand ' + (n % 1000 !== 0 ? toWords(n % 1000) : '');
    if (n < 10000000) return toWords(Math.floor(n / 100000)) + 'Lakh ' + (n % 100000 !== 0 ? toWords(n % 100000) : '');
    return toWords(Math.floor(n / 10000000)) + 'Crore ' + (n % 10000000 !== 0 ? toWords(n % 10000000) : '');
  };

  const val = Math.round(Number(num) || 0);
  if (val === 0) return 'Zero Rupees Only';
  return (toWords(val).trim() + ' Rupees Only');
};

// Helper: Normalize orders to ensure valid timestamps and timing formats
const normalizeCustomerOrderTiming = (order) => {
  if (!order) return order;
  const ts = typeof order.timestamp === 'number'
    ? order.timestamp
    : (order.placedAt ? new Date(order.placedAt).getTime() : (order.paymentDetails?.paidAt ? new Date(order.paymentDetails.paidAt).getTime() : Date.now()));
  const d = new Date(ts);
  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

  return {
    ...order,
    timestamp: ts,
    placedTime: order.placedTime || timeStr,
    placedDate: order.placedDate || dateStr,
    createdAt: (!order.createdAt || order.createdAt === 'Just now') ? `Today, ${timeStr}` : order.createdAt
  };
};

const CustomerPortal = ({ defaultTab }) => {
  const { currentUser, updateUserProfile } = useAuth();
  const { addToCart, setIsCartOpen, reorderOrder } = useCart();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Determine active tab cleanly from defaultTab, pathname (/profile, /orders, /history), or query param (?tab=...)
  const urlTab = useMemo(() => {
    if (defaultTab) return defaultTab;
    if (location.pathname === '/profile') return 'profile';
    if (location.pathname === '/orders' || location.pathname === '/history') return 'history';
    const tabParam = searchParams.get('tab');
    if (tabParam === 'profile' || tabParam === 'history' || tabParam === 'active') return tabParam;
    return null;
  }, [defaultTab, location.pathname, searchParams]);

  const [overrideTab, setOverrideTab] = useState(null);
  const activeTab = overrideTab || urlTab || 'active';
  const setActiveTab = (tab) => setOverrideTab(tab);

  // Search & Filter in order history
  const [historySearch, setHistorySearch] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState('All');
  const [historySortBy, setHistorySortBy] = useState('newest');

  // Selected Order for Receipt / Tax Invoice Modal
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  // Selected Order for Detailed Breakdown Inspection Modal
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Dedicated Live Order Tracking Modal State (Track by ID)
  const [trackingOrderId, setTrackingOrderId] = useState(null);

  // 1. Saved Addresses State (Synced with localStorage 'food_delivery_saved_addresses')
  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const stored = localStorage.getItem('food_delivery_saved_addresses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_SAVED_ADDRESSES;
    } catch {
      return DEFAULT_SAVED_ADDRESSES;
    }
  });

  // Sync addresses to localStorage and notify app
  const updateAndPersistAddresses = (newAddresses) => {
    setSavedAddresses(newAddresses);
    try {
      localStorage.setItem('food_delivery_saved_addresses', JSON.stringify(newAddresses));
      window.dispatchEvent(new Event('food_delivery_addresses_updated'));
    } catch (e) {
      console.error('Failed to sync addresses to localStorage:', e);
    }
  };

  // Cross-tab and Checkout sync for saved addresses
  useEffect(() => {
    const handleAddressesSync = () => {
      try {
        const stored = localStorage.getItem('food_delivery_saved_addresses');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSavedAddresses(parsed);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('storage', handleAddressesSync);
    window.addEventListener('food_delivery_addresses_updated', handleAddressesSync);
    return () => {
      window.removeEventListener('storage', handleAddressesSync);
      window.removeEventListener('food_delivery_addresses_updated', handleAddressesSync);
    };
  }, []);

  // 2. Profile Edit Modal State
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    restaurantName: '',
    address: ''
  });

  const openEditProfileModal = () => {
    const isAdminUser = currentUser?.role === 'Admin';
    setProfileForm({
      name: currentUser?.name || (isAdminUser ? 'Vikram Oberoi' : 'Rahul Sharma'),
      email: currentUser?.email || (isAdminUser ? 'admin@foodie.com' : 'customer@foodie.com'),
      phone: currentUser?.phone || (isAdminUser ? '9123456780' : '9876543210'),
      avatar: currentUser?.avatar || (isAdminUser ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'),
      restaurantName: currentUser?.restaurantName || 'The Royal Spice Kitchen',
      address: currentUser?.address || (isAdminUser ? 'Plot 18, Software Units Layout, HITEC City, Hyderabad - 500081' : 'Flat 402, Lotus Residency, Road No. 36, Jubilee Hills, Hyderabad')
    });
    setIsEditProfileModalOpen(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }
    if (!profileForm.email.trim() || !profileForm.email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    const cleanPhone = profileForm.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast.error('Please provide a valid 10-digit mobile number.');
      return;
    }

    const payload = {
      name: profileForm.name.trim(),
      email: profileForm.email.trim().toLowerCase(),
      phone: cleanPhone,
      avatar: profileForm.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profileForm.name.trim())}`
    };

    if (currentUser?.role === 'Admin') {
      if (profileForm.restaurantName?.trim()) payload.restaurantName = profileForm.restaurantName.trim();
      if (profileForm.address?.trim()) payload.address = profileForm.address.trim();
    }

    const res = updateUserProfile(payload);

    if (res?.success) {
      toast.success(`${currentUser?.role === 'Admin' ? 'Restaurant Partner' : 'Customer'} Profile updated successfully! ✨`);
      setIsEditProfileModalOpen(false);
    } else {
      toast.error(res?.message || 'Failed to update profile.');
    }
  };

  // 3. Address Modal State (Add & Edit)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    tag: 'Home',
    flatNo: '',
    area: '',
    landmark: '',
    city: 'Hyderabad',
    pincode: '500033',
    receiverName: '',
    receiverPhone: '',
    isPrimary: false
  });

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      tag: 'Home',
      flatNo: '',
      area: '',
      landmark: '',
      city: 'Hyderabad',
      pincode: '500033',
      receiverName: currentUser?.name || 'Rahul Sharma',
      receiverPhone: currentUser?.phone || '9876543210',
      isPrimary: savedAddresses.length === 0
    });
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      tag: addr.tag || 'Home',
      flatNo: addr.flatNo || '',
      area: addr.area || '',
      landmark: addr.landmark || '',
      city: addr.city || 'Hyderabad',
      pincode: addr.pincode || '500033',
      receiverName: addr.receiverName || currentUser?.name || 'Rahul Sharma',
      receiverPhone: addr.receiverPhone || currentUser?.phone || '9876543210',
      isPrimary: !!addr.isPrimary
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressForm.flatNo.trim() || !addressForm.area.trim()) {
      toast.error('Please enter Flat/Building and Area/Street.');
      return;
    }

    const landmarkText = addressForm.landmark.trim() ? `, Near ${addressForm.landmark.trim()}` : '';
    const pincodeText = addressForm.pincode.trim() ? ` - ${addressForm.pincode.trim()}` : '';
    const fullAddress = `${addressForm.flatNo.trim()}, ${addressForm.area.trim()}${landmarkText}, ${addressForm.city.trim() || 'Hyderabad'}${pincodeText}`;

    if (editingAddressId) {
      // Editing existing address
      const updated = savedAddresses.map((addr) => {
        if (addr.id === editingAddressId) {
          return {
            ...addr,
            tag: addressForm.tag,
            icon: addressForm.tag.toLowerCase(),
            flatNo: addressForm.flatNo.trim(),
            area: addressForm.area.trim(),
            landmark: addressForm.landmark.trim(),
            city: addressForm.city.trim() || 'Hyderabad',
            pincode: addressForm.pincode.trim(),
            receiverName: addressForm.receiverName.trim() || currentUser?.name || 'Customer',
            receiverPhone: addressForm.receiverPhone.trim() || currentUser?.phone || '9876543210',
            fullAddress,
            isPrimary: addressForm.isPrimary
          };
        }
        return addressForm.isPrimary ? { ...addr, isPrimary: false } : addr;
      });

      if (addressForm.isPrimary) {
        const primaryItem = updated.find((a) => a.id === editingAddressId);
        const others = updated.filter((a) => a.id !== editingAddressId);
        updateAndPersistAddresses([primaryItem, ...others]);
      } else {
        updateAndPersistAddresses(updated);
      }

      toast.success(`Address "${addressForm.tag}" updated successfully! 📍`);
    } else {
      // Adding new address
      const newAddress = {
        id: `addr-${Date.now()}`,
        tag: addressForm.tag,
        icon: addressForm.tag.toLowerCase(),
        flatNo: addressForm.flatNo.trim(),
        area: addressForm.area.trim(),
        landmark: addressForm.landmark.trim(),
        city: addressForm.city.trim() || 'Hyderabad',
        pincode: addressForm.pincode.trim(),
        receiverName: addressForm.receiverName.trim() || currentUser?.name || 'Customer',
        receiverPhone: addressForm.receiverPhone.trim() || currentUser?.phone || '9876543210',
        fullAddress,
        isPrimary: addressForm.isPrimary || savedAddresses.length === 0
      };

      let updated;
      if (newAddress.isPrimary) {
        const unprimaried = savedAddresses.map((a) => ({ ...a, isPrimary: false }));
        updated = [newAddress, ...unprimaried];
      } else {
        updated = [...savedAddresses, newAddress];
      }

      updateAndPersistAddresses(updated);
      toast.success(`Address "${newAddress.tag}" added successfully! 🏠`);
    }

    setIsAddressModalOpen(false);
  };

  const handleDeleteAddress = (addrId) => {
    if (savedAddresses.length <= 1) {
      toast.warn('At least one saved address is required for deliveries.');
      return;
    }
    const toDelete = savedAddresses.find((a) => a.id === addrId);
    const confirmDelete = window.confirm(`Are you sure you want to delete "${toDelete?.tag || 'this'}" address?`);
    if (!confirmDelete) return;

    let remaining = savedAddresses.filter((a) => a.id !== addrId);
    if (toDelete?.isPrimary && remaining.length > 0) {
      remaining[0] = { ...remaining[0], isPrimary: true };
    }

    updateAndPersistAddresses(remaining);
    toast.info('Address removed successfully.');
  };

  const handleSetPrimaryAddress = (addrId) => {
    const target = savedAddresses.find((a) => a.id === addrId);
    if (!target) return;

    const others = savedAddresses.filter((a) => a.id !== addrId).map((a) => ({ ...a, isPrimary: false }));
    const updated = [{ ...target, isPrimary: true }, ...others];

    updateAndPersistAddresses(updated);
    toast.success(`"${target.tag}" set as default delivery address! 🏠`);
  };

  // Orders State (Synced directly with localStorage 'food_delivery_orders')
  const [allOrders, setAllOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('food_delivery_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeCustomerOrderTiming);
        }
      }
      localStorage.setItem('food_delivery_orders', JSON.stringify(DEFAULT_HISTORY_ORDERS));
      return DEFAULT_HISTORY_ORDERS;
    } catch {
      return DEFAULT_HISTORY_ORDERS;
    }
  });

  // Current tracking order derived cleanly from allOrders (always in sync, no cascade render)
  const trackingOrder = useMemo(
    () => (trackingOrderId ? allOrders.find((o) => o.id === trackingOrderId) || null : null),
    [allOrders, trackingOrderId]
  );

  // Real-Time Notification Tracker: Alert customer instantly when Admin changes status
  const previousOrdersRef = useRef(allOrders);
  useEffect(() => {
    if (!previousOrdersRef.current || previousOrdersRef.current.length === 0) {
      previousOrdersRef.current = allOrders;
      return;
    }

    allOrders.forEach((newOrder) => {
      const prevOrder = previousOrdersRef.current.find((p) => p.id === newOrder.id);
      if (prevOrder && prevOrder.status !== newOrder.status) {
        if (newOrder.status === 'Preparing') {
          toast.info(`👨‍🍳 Kitchen started preparing your order #${newOrder.id} from "${newOrder.restaurantName}"!`);
        } else if (newOrder.status === 'Out for Delivery') {
          toast.info(`🛵 Rider is on the way with your order #${newOrder.id} from "${newOrder.restaurantName}"!`);
        } else if (newOrder.status === 'Delivered') {
          toast.success(`🎉 Delicious news! Order #${newOrder.id} from "${newOrder.restaurantName}" was Delivered!`);
        } else if (newOrder.status === 'Cancelled') {
          toast.warn(`⚠️ Order #${newOrder.id} has been Cancelled. 100% refund initiated.`);
        }
      }
    });

    previousOrdersRef.current = allOrders;
  }, [allOrders]);

  // Sync orders from localStorage and listen to real-time events
  const refreshOrders = () => {
    try {
      const stored = localStorage.getItem('food_delivery_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setAllOrders(parsed.map(normalizeCustomerOrderTiming));
        }
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

    // Auto-refresh interval every 3 seconds for real-time status synchronization
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

  // Status Counts for History Filters
  const historyCounts = useMemo(() => {
    return {
      all: customerOrders.length,
      delivered: customerOrders.filter((o) => o.status === 'Delivered').length,
      outForDelivery: customerOrders.filter((o) => o.status === 'Out for Delivery').length,
      preparing: customerOrders.filter((o) => o.status === 'Preparing').length,
      cancelled: customerOrders.filter((o) => o.status === 'Cancelled').length
    };
  }, [customerOrders]);

  // Comprehensive Filtered & Sorted Order History List
  const filteredHistoryOrders = useMemo(() => {
    let result = [...customerOrders];

    // 1. Status Filter
    if (historyStatusFilter !== 'All') {
      result = result.filter((o) => o.status === historyStatusFilter);
    }

    // 2. Search Query (Order ID, Restaurant, Dish Name, Address, Payment Method)
    if (historySearch.trim()) {
      const q = historySearch.toLowerCase().trim();
      result = result.filter((o) => {
        const idMatch = o.id?.toLowerCase().includes(q);
        const restMatch = o.restaurantName?.toLowerCase().includes(q);
        const addressMatch = o.deliveryAddress?.toLowerCase().includes(q);
        const paymentMatch = o.paymentMethod?.toLowerCase().includes(q);
        const itemMatch = o.items?.some((i) => i.name?.toLowerCase().includes(q));
        return idMatch || restMatch || addressMatch || paymentMatch || itemMatch;
      });
    }

    // 3. Sorting
    result.sort((a, b) => {
      const timeA = a.timestamp || 0;
      const timeB = b.timestamp || 0;
      if (historySortBy === 'newest') return timeB - timeA;
      if (historySortBy === 'oldest') return timeA - timeB;
      if (historySortBy === 'highest') return (b.totalAmount || 0) - (a.totalAmount || 0);
      if (historySortBy === 'lowest') return (a.totalAmount || 0) - (b.totalAmount || 0);
      return 0;
    });

    return result;
  }, [customerOrders, historyStatusFilter, historySearch, historySortBy]);

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
    if (!order?.items || order.items.length === 0) {
      toast.warning('No items found in this order to reorder.');
      return;
    }
    
    if (reorderOrder) {
      reorderOrder(order);
    } else {
      order.items.forEach((item) => {
        addToCart(
          {
            id: item.id || `dish-${Date.now()}-${Math.random()}`,
            name: item.name,
            price: item.price,
            isVeg: item.isVeg !== undefined ? item.isVeg : true,
            image: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
          },
          {
            id: order.restaurantId || 'rest-1',
            name: order.restaurantName || 'Paradise Royale Biryani',
            deliveryCharges: order.deliveryFee === 0 ? 'Free' : '₹35'
          }
        );
      });
      setIsCartOpen(true);
      toast.success(`Reordered ${order.items.length} items from "${order.restaurantName}"! 🛍️`);
    }
  };

  // Print Tax Invoice
  const handlePrintInvoice = () => {
    window.print();
  };

  // Download PDF Tax Invoice Simulation
  const handleDownloadInvoicePdf = (order) => {
    toast.success(`Tax Invoice INV-CRV-${order.id} downloaded successfully! 📄`);
  };

  // Copy text helper
  const handleCopyText = (text, label = 'Text') => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard! 📋`);
    }
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
                <span>{currentUser?.role === 'Admin' ? 'Admin Operations HQ & Commercial Kitchen' : 'Customer Food Hub & Tracking'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                {currentUser?.role === 'Admin' ? `Welcome, ${currentUser?.name || 'Admin'}! 👨‍🍳` : `Hungry, ${currentUser?.name || 'Foodie'}? 🍕`}
              </h1>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-white/90">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="truncate max-w-md">
                  {currentUser?.role === 'Admin' ? (
                    <>Restaurant Outlet: <b className="text-white">{currentUser?.address || 'Plot 18, HITEC City, Hyderabad'}</b></>
                  ) : (
                    <>Delivering to: <b className="text-white">{savedAddresses.find((a) => a.isPrimary)?.fullAddress || currentUser?.address || 'Flat 402, Lotus Residency, Jubilee Hills, Hyderabad'}</b></>
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {currentUser?.role === 'Admin' ? (
                <>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white text-orange-600 font-extrabold text-xs shadow-lg hover:bg-orange-50 transition active:scale-95"
                  >
                    <Store className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                  <Link
                    to="/menu"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/20 border border-white/25 text-white font-extrabold text-xs hover:bg-white/30 transition active:scale-95"
                  >
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>Menu Catalog</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-extrabold text-xs transition active:scale-95 cursor-pointer ${
                      activeTab === 'profile'
                        ? 'bg-white text-orange-600 shadow-lg'
                        : 'bg-white/20 border border-white/25 text-white hover:bg-white/30'
                    }`}
                  >
                    <User className="w-4 h-4 text-amber-300" />
                    <span>Restaurant Profile & Outlet</span>
                  </button>
                </>
              ) : (
                <>
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
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-orange-950/40 border border-white/20 text-white font-extrabold text-xs shadow-lg hover:bg-orange-950/60 transition active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-300" />
                    <span>Basket</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-extrabold text-xs transition active:scale-95 cursor-pointer ${
                      activeTab === 'profile'
                        ? 'bg-white text-orange-600 shadow-lg'
                        : 'bg-white/20 border border-white/25 text-white hover:bg-white/30'
                    }`}
                  >
                    <User className="w-4 h-4 text-amber-300" />
                    <span>My Profile & Addresses</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'active'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>{currentUser?.role === 'Admin' ? 'Kitchen Orders' : 'Live Tracking & Active Orders'}</span>
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
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'history'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Order History</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'history' ? 'bg-white text-orange-600' : 'bg-slate-100 text-slate-600'
            }`}>
              {customerOrders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'profile'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{currentUser?.role === 'Admin' ? 'Restaurant Profile & Outlet Address' : 'My Profile & Addresses'}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
              activeTab === 'profile' ? 'bg-white text-orange-600' : 'bg-orange-100 text-orange-700'
            }`}>
              View / Edit
            </span>
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

                          <button
                            type="button"
                            onClick={() => setTrackingOrderId(order.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs font-bold text-orange-700 transition cursor-pointer"
                          >
                            <Bike className="w-3.5 h-3.5 text-orange-600" />
                            <span>Live Tracker & Timeline</span>
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

        {/* 2. ORDER HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-6">

            {/* ORDER HISTORY CONTROLS HEADER */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
              
              {/* Search bar and Sort controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="Search by dish (e.g. Biryani), restaurant, order #, or address..."
                    className="w-full pl-10 pr-9 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition"
                  />
                  {historySearch && (
                    <button
                      type="button"
                      onClick={() => setHistorySearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort Selector */}
                <div className="flex items-center gap-2 shrink-0">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  <select
                    value={historySortBy}
                    onChange={(e) => setHistorySortBy(e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
                  >
                    <option value="newest">Sort: Newest First</option>
                    <option value="oldest">Sort: Oldest First</option>
                    <option value="highest">Amount: High to Low</option>
                    <option value="lowest">Amount: Low to High</option>
                  </select>
                </div>
              </div>

              {/* Status Filter Tabs with Dynamic Counter Badges */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-100 pt-3">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1 mr-1 shrink-0">
                  <Filter className="w-3 h-3" />
                  Filter:
                </span>
                
                {[
                  { key: 'All', label: 'All Orders', count: historyCounts.all },
                  { key: 'Delivered', label: 'Delivered', count: historyCounts.delivered },
                  { key: 'Out for Delivery', label: 'Out for Delivery', count: historyCounts.outForDelivery },
                  { key: 'Preparing', label: 'Preparing', count: historyCounts.preparing },
                  { key: 'Cancelled', label: 'Cancelled', count: historyCounts.cancelled }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setHistoryStatusFilter(tab.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      historyStatusFilter === tab.key
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      historyStatusFilter === tab.key
                        ? 'bg-white/25 text-white'
                        : 'bg-white text-slate-700'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Quick Search Chips */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs pt-1">
                <span className="text-[11px] text-slate-400 font-semibold mr-1">Popular:</span>
                {['Biryani', 'Haleem', 'Dosa', 'Bawarchi', 'Pista House', 'Paradise'].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setHistorySearch(chip)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer border ${
                      historySearch.toLowerCase() === chip.toLowerCase()
                        ? 'bg-orange-100 text-orange-800 border-orange-300 font-black'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
                {(historySearch || historyStatusFilter !== 'All') && (
                  <button
                    type="button"
                    onClick={() => {
                      setHistorySearch('');
                      setHistoryStatusFilter('All');
                    }}
                    className="ml-auto text-[11px] text-orange-600 hover:text-orange-700 font-bold underline cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>

            </div>

            {/* ORDERS COUNT & ACTIVE FILTER BADGE */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
              <span>
                Showing <strong className="text-slate-900">{filteredHistoryOrders.length}</strong> of{' '}
                <strong className="text-slate-900">{customerOrders.length}</strong> previous orders
              </span>
              {historyStatusFilter !== 'All' && (
                <span className="text-[11px] text-orange-700 font-bold bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  Status: {historyStatusFilter}
                </span>
              )}
            </div>

            {/* ORDERS CARDS GRID / LIST */}
            {filteredHistoryOrders.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-2xs">
                <div className="w-16 h-16 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-base">No Matching Orders Found</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    {historySearch || historyStatusFilter !== 'All'
                      ? 'No previous orders match your current search query or status filter.'
                      : 'You haven’t placed any orders yet. Explore our restaurant menus to place your first meal!'}
                  </p>
                </div>
                {(historySearch || historyStatusFilter !== 'All') ? (
                  <button
                    type="button"
                    onClick={() => {
                      setHistorySearch('');
                      setHistoryStatusFilter('All');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition shadow-xs cursor-pointer"
                  >
                    <span>Clear Search & Show All</span>
                  </button>
                ) : (
                  <Link
                    to="/restaurants"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition shadow-xs"
                  >
                    <Store className="w-4 h-4" />
                    <span>Explore Restaurants</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredHistoryOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs hover:shadow-md transition space-y-4 flex flex-col justify-between group"
                  >
                    <div className="space-y-3.5">
                      {/* 1. RESTAURANT & STATUS HEADER */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={order.restaurantImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80'}
                            alt={order.restaurantName || 'Restaurant'}
                            className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <h4 className="font-black text-sm text-slate-900 group-hover:text-orange-600 transition leading-tight">
                              {order.restaurantName || 'Restaurant Kitchen'}
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {order.cuisine || 'Hyderabad Express'} • {order.createdAt || 'Recent'}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                #{order.id}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyText(order.id, 'Order ID')}
                                className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                                title="Copy Order ID"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border shrink-0 ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : order.status === 'Out for Delivery'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : order.status === 'Preparing'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {order.status === 'Delivered' && <CheckCircle2 className="w-3 h-3" />}
                          {order.status === 'Out for Delivery' && <Bike className="w-3 h-3" />}
                          {order.status === 'Preparing' && <ChefHat className="w-3 h-3" />}
                          {order.status === 'Cancelled' && <XCircle className="w-3 h-3" />}
                          <span>{order.status}</span>
                        </span>
                      </div>

                      {/* 2. ORDERED DISHES LIST */}
                      <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-slate-700">
                            <span className="flex items-center gap-2 truncate pr-2">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                              <span className="font-bold text-slate-900">{item.qty}x</span>
                              <span className="truncate">{item.name}</span>
                            </span>
                            <span className="font-bold text-slate-800 shrink-0">₹{item.price * item.qty}</span>
                          </div>
                        ))}
                      </div>

                      {/* 3. DELIVERY & PAYMENT SUMMARY BAR */}
                      <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-[11px] text-slate-500">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{order.deliveryAddress || 'Hyderabad Residence'}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                            <span>Paid via {order.paymentMethod || 'UPI'}</span>
                          </span>
                          <span className="font-black text-sm text-slate-900">
                            ₹{order.totalAmount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 4. ACTION BUTTONS (REORDER, DETAILS, INVOICE, TRACK) */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderDetails(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
                          title="View complete order breakdown"
                        >
                          <Receipt className="w-3.5 h-3.5 text-slate-500" />
                          <span>Details</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedReceiptOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
                          title="View and download tax invoice"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>Invoice</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {(order.status === 'Preparing' || order.status === 'Out for Delivery') && (
                          <button
                            type="button"
                            onClick={() => setTrackingOrderId(order.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-xs font-bold transition cursor-pointer"
                          >
                            <Bike className="w-3.5 h-3.5 text-orange-600" />
                            <span>Live Track</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleReorder(order)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black transition shadow-xs hover:shadow-md cursor-pointer active:scale-95"
                          title="Add all dishes back to basket"
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Role-based Profile Card */}
            {currentUser?.role === 'Admin' ? (
              /* Restaurant Partner Profile Card (Admin) */
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 h-fit">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-base text-slate-900">Partner Account</h3>
                      <p className="text-[11px] text-slate-400">Merchant & kitchen operations</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={openEditProfileModal}
                    className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-xs border border-orange-200 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                {/* Avatar & Header */}
                <div className="flex flex-col items-center text-center space-y-3 pt-1">
                  <div className="relative group">
                    <img
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80'}
                      alt={currentUser?.name || 'Admin Partner'}
                      className="w-24 h-24 rounded-3xl object-cover border-4 border-orange-100 shadow-md transition group-hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={openEditProfileModal}
                      title="Change Profile Photo"
                      className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-md transition cursor-pointer active:scale-90"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <h4 className="font-black text-xl text-slate-900">{currentUser?.name || 'Vikram Oberoi'}</h4>
                    <p className="text-xs font-bold text-orange-600 mt-0.5">
                      {currentUser?.restaurantName || 'The Royal Spice Kitchen'}
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Verified Partner</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider">
                        Admin HQ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact & Operational Credentials */}
                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Partner Email</span>
                      <span className="font-bold text-slate-800 truncate block">{currentUser?.email || 'admin@foodie.com'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Merchant Helpline</span>
                      <span className="font-bold text-slate-800 truncate block">
                        {currentUser?.phone ? (currentUser.phone.startsWith('+91') ? currentUser.phone : `+91 ${currentUser.phone}`) : '+91 9123456780'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <ChefHat className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">FSSAI Certification</span>
                      <span className="font-bold text-slate-800 block">Lic # 13621014000321</span>
                    </div>
                  </div>
                </div>

                {/* Live Merchant Status Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-emerald-800 font-black uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live Merchant Status</span>
                    </span>
                    <span className="text-[10px] font-black text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                      Accepting Orders
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-xl font-black text-slate-900">4.9 ★</span>
                      <span className="text-xs font-bold text-slate-500 ml-1">Rating</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl">
                      Avg Prep: 18-20 Mins
                    </span>
                  </div>
                </div>

                {/* Quick Action Button */}
                <button
                  type="button"
                  onClick={openEditProfileModal}
                  className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Update Merchant Profile</span>
                </button>
              </div>
            ) : (
              /* Customer Profile Card (Customer) */
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 h-fit">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-base text-slate-900">Customer Profile</h3>
                      <p className="text-[11px] text-slate-400">Personal account & contact details</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={openEditProfileModal}
                    className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-xs border border-orange-200 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                </div>

                {/* Avatar & Header */}
                <div className="flex flex-col items-center text-center space-y-3 pt-1">
                  <div className="relative group">
                    <img
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                      alt={currentUser?.name || 'Customer'}
                      className="w-24 h-24 rounded-3xl object-cover border-4 border-orange-100 shadow-md transition group-hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={openEditProfileModal}
                      title="Change Profile Photo"
                      className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-md transition cursor-pointer active:scale-90"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <h4 className="font-black text-xl text-slate-900">{currentUser?.name || 'Rahul Sharma'}</h4>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Verified Customer</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-black uppercase tracking-wider">
                        {currentUser?.role || 'Customer'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Email Address</span>
                      <span className="font-bold text-slate-800 truncate block">{currentUser?.email || 'customer@foodie.com'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Mobile Number</span>
                      <span className="font-bold text-slate-800 truncate block">
                        {currentUser?.phone ? (currentUser.phone.startsWith('+91') ? currentUser.phone : `+91 ${currentUser.phone}`) : '+91 9876543210'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Member Since</span>
                      <span className="font-bold text-slate-800 block">November 2026</span>
                    </div>
                  </div>
                </div>

                {/* Loyalty & Rewards Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/10 to-rose-500/10 border border-orange-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-orange-800 font-black uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>CraveDash Rewards</span>
                    </span>
                    <span className="text-[10px] font-black text-orange-700 bg-white px-2 py-0.5 rounded-full border border-orange-200">
                      Silver Tier
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-xl font-black text-slate-900">450</span>
                      <span className="text-xs font-bold text-amber-600 ml-1">Coins 🪙</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-xl">
                      ₹45 Savings available
                    </span>
                  </div>
                </div>

                {/* Quick Action Button */}
                <button
                  type="button"
                  onClick={openEditProfileModal}
                  className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile Information</span>
                </button>
              </div>
            )}

            {/* Right Column: Role-based Panel */}
            {currentUser?.role === 'Admin' ? (
              /* Single Official Restaurant Outlet Location (Admin / Swiggy-Zomato Merchant Partner) */
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-base text-slate-900">Official Restaurant Outlet Location</h3>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                          Primary Outlet
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Registered commercial kitchen address for rider pickups & customer deliveries
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={openEditProfileModal}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white font-extrabold text-xs shadow-md shadow-orange-600/20 transition active:scale-95 cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Update Outlet Location</span>
                    </button>
                  </div>
                </div>

                {/* Primary Outlet Showcase Card */}
                <div className="p-6 rounded-3xl border-2 border-orange-500 bg-gradient-to-br from-orange-50/50 via-amber-50/30 to-white shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-orange-100">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏬</span>
                      <div>
                        <span className="font-black text-xs text-orange-900 uppercase tracking-wider block">
                          Primary Commercial Outlet & Kitchen
                        </span>
                        <h4 className="text-lg font-black text-slate-900">
                          {currentUser?.restaurantName || 'The Royal Spice Kitchen'}
                        </h4>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live GPS Calibrated</span>
                    </span>
                  </div>

                  {/* Registered Commercial Address */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Official Commercial Address
                    </span>
                    <p className="text-sm text-slate-900 leading-relaxed font-bold">
                      {currentUser?.address || 'Plot 18, Software Units Layout, HITEC City, Hyderabad - 500081'}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1">
                      <Navigation className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                      <span>Landmark: Opposite Cyber Towers, Near HITEC City Metro Pillar 1042</span>
                    </div>
                  </div>

                  {/* Rider Pickup Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-orange-100/80 text-xs">
                    <div className="p-3 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 block">Rider Pickup Point</span>
                      <p className="font-bold text-slate-800">Ground Floor Desk B-2</p>
                      <span className="text-[10px] text-emerald-600 font-semibold block">Avg wait: 2-4 mins</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 block">Operating Hours</span>
                      <p className="font-bold text-slate-800">11:00 AM - 11:30 PM</p>
                      <span className="text-[10px] text-slate-500 font-semibold block">All 7 Days Active</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 block">Dispatch Zone</span>
                      <p className="font-bold text-slate-800">HITEC City Cluster</p>
                      <span className="text-[10px] text-blue-600 font-semibold block">Radius: Up to 12 KMs</span>
                    </div>
                  </div>
                </div>

                {/* Swiggy & Zomato Partner Architecture Info Banner */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-black text-slate-800">
                      Swiggy & Zomato Merchant Model: Single Official Outlet
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Restaurant partners have a single verified commercial outlet address where kitchen preparation takes place and delivery executives pick up orders. Customer delivery addresses (Home/Work) are handled individually per order at checkout.
                  </p>
                </div>
              </div>
            ) : (
              /* Saved Delivery Addresses Management (Customer) */
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-base text-slate-900">Saved Delivery Addresses</h3>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                          {savedAddresses.length}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">Manage delivery spots for quick 1-tap checkout</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleOpenAddAddress}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white font-extrabold text-xs shadow-md shadow-orange-600/20 transition active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Address</span>
                    </button>
                  </div>
                </div>

                {/* Address Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedAddresses.map((addr, idx) => {
                    const isPrimary = addr.isPrimary || idx === 0;
                    return (
                      <div
                        key={addr.id || idx}
                        className={`p-5 rounded-2xl border-2 transition relative flex flex-col justify-between space-y-3 ${
                          isPrimary
                            ? 'border-orange-500 bg-orange-50/30 shadow-xs'
                            : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          {/* Header: Tag + Primary Badge */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                              <span className="text-base">
                                {addr.tag === 'Home' ? '🏠' : addr.tag === 'Work' ? '🏢' : '📍'}
                              </span>
                              <span>{addr.tag || 'Address'}</span>
                            </span>

                            {isPrimary ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                <span>⭐</span>
                                <span>Primary Default</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryAddress(addr.id)}
                                className="text-[11px] font-bold text-slate-500 hover:text-orange-600 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 px-2 py-0.5 rounded-lg transition cursor-pointer"
                              >
                                Set as Default
                              </button>
                            )}
                          </div>

                          {/* Full Address */}
                          <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                            {addr.fullAddress || `${addr.flatNo}, ${addr.area}, ${addr.city || 'Hyderabad'}`}
                          </p>

                          {/* Landmark if any */}
                          {addr.landmark && (
                            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                              <Navigation className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>Landmark: {addr.landmark}</span>
                            </p>
                          )}

                          {/* Receiver Details */}
                          <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Receiver: <b className="text-slate-700">{addr.receiverName || currentUser?.name || 'Customer'}</b></span>
                            <span>{addr.receiverPhone || currentUser?.phone || '9876543210'}</span>
                          </div>
                        </div>

                        {/* Card Action Buttons */}
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditAddress(addr)}
                            className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3 text-slate-500" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="px-2.5 py-1 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-600 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Hyderabad Coverage Notice */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-semibold">30-40 Mins Express Delivery active across Hyderabad region.</span>
                  </div>
                  <span className="text-[11px] font-bold text-orange-600 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                    GPS Tracking Enabled
                  </span>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* 4. COMPREHENSIVE ORDER DETAILS MODAL */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-orange-100 text-orange-600">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base text-slate-900">Order Details</h3>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      #{selectedOrderDetails.id}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(selectedOrderDetails.id, 'Order ID')}
                      className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                      title="Copy Order ID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Placed on {selectedOrderDetails.createdAt || 'Recent'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrderDetails(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Banner */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
              selectedOrderDetails.status === 'Delivered'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : selectedOrderDetails.status === 'Out for Delivery'
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : selectedOrderDetails.status === 'Preparing'
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              <div className="flex items-center gap-2.5">
                {selectedOrderDetails.status === 'Delivered' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {selectedOrderDetails.status === 'Out for Delivery' && <Bike className="w-5 h-5 text-blue-600 animate-bounce" />}
                {selectedOrderDetails.status === 'Preparing' && <ChefHat className="w-5 h-5 text-amber-600" />}
                {selectedOrderDetails.status === 'Cancelled' && <XCircle className="w-5 h-5 text-rose-600" />}
                <div>
                  <h4 className="font-black text-sm">Order Status: {selectedOrderDetails.status}</h4>
                  <p className="text-xs opacity-90">
                    {selectedOrderDetails.status === 'Delivered'
                      ? 'Order was delivered safely to your address.'
                      : selectedOrderDetails.status === 'Out for Delivery'
                      ? 'Delivery partner is en route with your fresh food.'
                      : selectedOrderDetails.status === 'Preparing'
                      ? 'Kitchen is actively preparing your dishes.'
                      : 'This order was cancelled and 100% refund initiated.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Restaurant & Delivery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Restaurant Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 text-orange-600" />
                  Restaurant Partner
                </span>
                <p className="font-black text-slate-900 text-sm">{selectedOrderDetails.restaurantName}</p>
                <p className="text-slate-500">{selectedOrderDetails.cuisine || 'Multi-Cuisine Kitchen'}</p>
                <p className="text-slate-400 text-[11px]">Hyderabad Outlet</p>
              </div>

              {/* Delivery Address */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  Delivery Destination
                </span>
                <p className="font-bold text-slate-900">{selectedOrderDetails.customerName || currentUser?.name || 'Customer'}</p>
                <p className="text-slate-600 text-[11px] leading-relaxed">{selectedOrderDetails.deliveryAddress}</p>
                {selectedOrderDetails.deliveryInstructions && (
                  <p className="text-[10px] text-orange-600 font-semibold italic">
                    Note: "{selectedOrderDetails.deliveryInstructions}"
                  </p>
                )}
              </div>

            </div>

            {/* Itemized Food List */}
            <div className="space-y-2">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                Dishes Ordered ({selectedOrderDetails.items?.length || 0})
              </span>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                {selectedOrderDetails.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-200/60 last:border-b-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                      <span className="font-bold text-slate-900">{item.qty}x</span>
                      <span className="text-slate-800 font-semibold">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-[11px]">₹{item.price} each</span>
                      <span className="font-black text-slate-900">₹{item.price * item.qty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <span className="font-black text-slate-900 block pb-1 border-b border-slate-200">
                Payment Summary
              </span>
              <div className="flex justify-between text-slate-600">
                <span>Item Total</span>
                <span className="font-bold text-slate-900">₹{selectedOrderDetails.subtotal || selectedOrderDetails.totalAmount}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span className={selectedOrderDetails.deliveryFee === 0 ? 'font-bold text-emerald-600' : 'font-bold text-slate-900'}>
                  {selectedOrderDetails.deliveryFee === 0 ? 'FREE' : `₹${selectedOrderDetails.deliveryFee || 0}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Platform Fee</span>
                <span className="font-bold text-slate-900">₹{selectedOrderDetails.platformFee || 5}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Govt. Taxes (GST 5%)</span>
                <span className="font-bold text-slate-900">₹{selectedOrderDetails.gstTax || Math.round((selectedOrderDetails.subtotal || selectedOrderDetails.totalAmount) * 0.05)}</span>
              </div>
              {selectedOrderDetails.couponCode && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount ({selectedOrderDetails.couponCode})</span>
                  <span>-₹{selectedOrderDetails.couponDiscount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-sm">
                <span>Grand Total Paid</span>
                <span className="text-orange-600 text-base">₹{selectedOrderDetails.totalAmount}</span>
              </div>
            </div>

            {/* Verified Payment & Transaction Info */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
              <div className="flex items-center justify-between font-bold pb-1.5 border-b border-emerald-200/80">
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Verified Payment ({selectedOrderDetails.paymentMethod || 'UPI'})
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-black uppercase">
                  {selectedOrderDetails.paymentDetails?.status || 'PAID'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px] pt-1">
                <span>Transaction ID:</span>
                <span className="font-mono font-bold text-slate-900">
                  {selectedOrderDetails.paymentDetails?.transactionId || `TXN_CRV_${selectedOrderDetails.id}`}
                </span>
              </div>
              {selectedOrderDetails.paymentDetails?.bankRef && (
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>Bank Reference (RRN):</span>
                  <span className="font-mono font-bold text-slate-900">{selectedOrderDetails.paymentDetails.bankRef}</span>
                </div>
              )}
            </div>

            {/* Delivery Partner Info (if assigned) */}
            {selectedOrderDetails.deliveryPartner && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900">{selectedOrderDetails.deliveryPartner.name}</h5>
                    <p className="text-[11px] text-slate-500">
                      {selectedOrderDetails.deliveryPartner.vehicle} • {selectedOrderDetails.deliveryPartner.rating} ⭐
                    </p>
                  </div>
                </div>
                <a
                  href={`tel:${selectedOrderDetails.deliveryPartner.phone}`}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5"
                >
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>Call Rider</span>
                </a>
              </div>
            )}

            {/* Footer Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const target = selectedOrderDetails;
                  setSelectedOrderDetails(null);
                  setSelectedReceiptOrder(target);
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 transition text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-slate-600" />
                <span>View Tax Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleReorder(selectedOrderDetails);
                  setSelectedOrderDetails(null);
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs transition shadow-md shadow-orange-600/20 text-center flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reorder Items</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. DOWNLOAD INVOICE (UI ONLY) - OFFICIAL SWIGGY/ZOMATO GRADE TAX INVOICE MODAL */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-8 shadow-2xl border border-slate-200 relative my-6">
            
            {/* Top Modal Controls (Hidden in Print) */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5 print:hidden">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">Official Tax Invoice</h3>
                  <p className="text-xs text-slate-500 font-mono">Invoice Ref: INV-CRV-2026-{selectedReceiptOrder.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  className="px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                  title="Print Tax Invoice or Save as PDF"
                >
                  <Printer className="w-4 h-4 text-orange-600" />
                  <span>Print / Save PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadInvoicePdf(selectedReceiptOrder)}
                  className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                  title="Simulate Instant PDF Download"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedReceiptOrder(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer ml-1"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE INVOICE SHEET CONTAINER */}
            <div id="printable-tax-invoice" className="bg-white text-slate-900 space-y-6 text-xs font-sans">
              
              {/* 1. OFFICIAL BRANDED HEADER */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black text-sm">
                      C
                    </div>
                    <span className="font-black text-lg text-slate-900 tracking-tight">CRAVEDASH</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-700 mt-1">CRAVEDASH LOGISTICS & FOOD TECHNOLOGIES PVT. LTD.</p>
                  <p className="text-[10px] text-slate-500">Mindspace IT Park, HITEC City, Hyderabad - 500081, Telangana, India</p>
                  <p className="text-[10px] text-slate-500 font-mono">CIN: U74999TG2026PTC109842 • FSSAI Lic. No: 13622011000456</p>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 rounded bg-slate-900 text-white font-black text-[11px] uppercase tracking-wider block mb-1">
                    TAX INVOICE
                  </span>
                  <span className="text-[10px] text-slate-500 block font-semibold">Original for Recipient</span>
                  <span className="text-[10px] font-mono font-bold text-slate-800 block mt-1">
                    GSTIN: 36AAACC1206M1ZT
                  </span>
                </div>
              </div>

              {/* 2. INVOICE META GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Invoice Number</span>
                  <span className="font-black text-slate-900">INV-CRV-2026-{selectedReceiptOrder.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Invoice Date</span>
                  <span className="font-bold text-slate-900">{selectedReceiptOrder.createdAt || '13 Nov 2026'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Order ID</span>
                  <span className="font-bold text-slate-900">#{selectedReceiptOrder.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Place of Supply</span>
                  <span className="font-bold text-slate-900">Telangana (36)</span>
                </div>
              </div>

              {/* 3. BILLED BY & BILLED TO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Billed By */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider block">
                    Billed By (Restaurant Partner)
                  </span>
                  <p className="font-black text-slate-900 text-xs">{selectedReceiptOrder.restaurantName}</p>
                  <p className="text-slate-600 text-[11px]">{selectedReceiptOrder.cuisine || 'Hyderabadi Cuisine'}, Hyderabad Outlet</p>
                  <p className="text-slate-500 text-[10px] font-mono">FSSAI Lic. No: 13621008000291</p>
                  <p className="text-slate-500 text-[10px] font-mono">GSTIN: 36AABCB4829K1ZX</p>
                </div>

                {/* Billed To */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider block">
                    Billed To (Customer Details)
                  </span>
                  <p className="font-black text-slate-900 text-xs">
                    {selectedReceiptOrder.customerName || currentUser?.name || 'Rahul Sharma'}
                  </p>
                  <p className="text-slate-600 text-[11px] leading-tight">
                    {selectedReceiptOrder.deliveryAddress}
                  </p>
                  <p className="text-slate-500 text-[10px] font-mono">
                    Phone: {selectedReceiptOrder.customerPhone || currentUser?.phone || '+91 9876543210'}
                  </p>
                  <p className="text-slate-500 text-[10px] font-mono">
                    Email: {currentUser?.email || 'customer@foodie.com'}
                  </p>
                </div>
              </div>

              {/* 4. ITEM TAX INVOICE TABLE */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider">
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-2">Type</th>
                      <th className="py-2.5 px-2 font-mono">SAC</th>
                      <th className="py-2.5 px-2 text-center">Qty</th>
                      <th className="py-2.5 px-2 text-right">Unit Rate</th>
                      <th className="py-2.5 px-2 text-right">Taxable</th>
                      <th className="py-2.5 px-2 text-right">GST %</th>
                      <th className="py-2.5 px-3 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {selectedReceiptOrder.items?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{item.name}</td>
                        <td className="py-2.5 px-2 font-semibold">
                          <span className={item.isVeg ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                            {item.isVeg ? 'Veg' : 'Non-Veg'}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 font-mono text-slate-500 text-[10px]">996331</td>
                        <td className="py-2.5 px-2 text-center font-bold">{item.qty}</td>
                        <td className="py-2.5 px-2 text-right font-mono">₹{item.price}</td>
                        <td className="py-2.5 px-2 text-right font-mono">₹{item.price * item.qty}</td>
                        <td className="py-2.5 px-2 text-right font-mono text-slate-500">5.0%</td>
                        <td className="py-2.5 px-3 text-right font-black font-mono">₹{item.price * item.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 5. CALCULATIONS & AMOUNT IN WORDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                
                {/* Left: Amount in words & Authorized stamp */}
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      Amount Chargeable (in words)
                    </span>
                    <p className="font-bold text-slate-800 text-xs mt-0.5">
                      INR {numberToWords(selectedReceiptOrder.totalAmount)}
                    </p>
                  </div>

                  {/* Payment Info */}
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[11px] text-emerald-950 space-y-1">
                    <span className="font-black text-emerald-800 block text-[10px] uppercase tracking-wider">
                      Payment Clearance Confirmation
                    </span>
                    <div className="flex justify-between text-slate-700">
                      <span>Payment Method:</span>
                      <span className="font-bold">{selectedReceiptOrder.paymentMethod || 'UPI (Instant Net)'}</span>
                    </div>
                    <div className="flex justify-between text-slate-700 font-mono text-[10px]">
                      <span>Transaction ID:</span>
                      <span>{selectedReceiptOrder.paymentDetails?.transactionId || `TXN_CRV_${selectedReceiptOrder.id}`}</span>
                    </div>
                    <div className="flex justify-between text-slate-700 font-mono text-[10px]">
                      <span>Bank Reference (RRN):</span>
                      <span>{selectedReceiptOrder.paymentDetails?.bankRef || 'RRN984210482'}</span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-700 text-[10px] pt-0.5">
                      <span>Status:</span>
                      <span>PAID IN FULL - ELECTRONIC RECEIPT</span>
                    </div>
                  </div>
                </div>

                {/* Right: Bill Totals Breakdown */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-600 font-sans">
                    <span>Food Subtotal:</span>
                    <span className="font-bold text-slate-900">₹{selectedReceiptOrder.subtotal || selectedReceiptOrder.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-sans">
                    <span>Delivery Charges:</span>
                    <span className={selectedReceiptOrder.deliveryFee === 0 ? 'font-bold text-emerald-600' : 'font-bold text-slate-900'}>
                      {selectedReceiptOrder.deliveryFee === 0 ? 'FREE' : `₹${selectedReceiptOrder.deliveryFee || 0}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-sans">
                    <span>Platform Convenience Fee:</span>
                    <span className="font-bold text-slate-900">₹{selectedReceiptOrder.platformFee || 5}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-sans">
                    <span>Central GST (CGST 2.5%):</span>
                    <span className="font-bold text-slate-900">
                      ₹{Math.round(((selectedReceiptOrder.subtotal || selectedReceiptOrder.totalAmount) * 0.025))}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-sans">
                    <span>State GST (SGST 2.5%):</span>
                    <span className="font-bold text-slate-900">
                      ₹{Math.round(((selectedReceiptOrder.subtotal || selectedReceiptOrder.totalAmount) * 0.025))}
                    </span>
                  </div>
                  {selectedReceiptOrder.couponCode && (
                    <div className="flex justify-between text-emerald-700 font-bold font-sans">
                      <span>Coupon Discount ({selectedReceiptOrder.couponCode}):</span>
                      <span>-₹{selectedReceiptOrder.couponDiscount}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t-2 border-slate-900 flex justify-between font-black text-slate-900 text-sm">
                    <span className="font-sans">INVOICE TOTAL (INR):</span>
                    <span className="text-orange-600 text-base">₹{selectedReceiptOrder.totalAmount}</span>
                  </div>
                </div>

              </div>

              {/* 6. DIGITAL SIGNATURE & DECLARATION */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] text-slate-400">
                <div>
                  <p className="font-semibold text-slate-600">Declaration:</p>
                  <p>This is an electronically generated authentic Tax Invoice and does not require a physical signature.</p>
                  <p>All food preparation and quality standards comply with the Food Safety and Standards Act, 2006.</p>
                </div>
                <div className="border border-emerald-300 bg-emerald-50 px-3 py-1.5 rounded-lg text-emerald-800 text-right font-mono font-bold shrink-0">
                  <span className="block text-[9px] uppercase tracking-wider text-emerald-600">Authorized Digital Seal</span>
                  <span>CRAVEDASH LOGISTICS PVT LTD</span>
                </div>
              </div>

            </div>

            {/* Bottom Modal Actions (Hidden in Print) */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-end gap-3 print:hidden">
              <button
                type="button"
                onClick={() => setSelectedReceiptOrder(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrintInvoice}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PRINT MEDIA INJECTED STYLES FOR CLEAN INVOICE PRINTING */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-tax-invoice, #printable-tax-invoice * {
            visibility: visible !important;
          }
          #printable-tax-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      {/* 5. DEDICATED REAL-TIME ORDER TRACKING MODAL */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-orange-100 text-orange-800">
                    #{trackingOrder.id}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {trackingOrder.createdAt || 'Just now'}
                  </span>
                </div>
                <h3 className="font-black text-xl text-slate-900 mt-1">
                  {trackingOrder.restaurantName || 'Restaurant Partner'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTrackingOrderId(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Order Status & Estimated Time Banner */}
            <div className={`p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border ${
              trackingOrder.status === 'Delivered'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : trackingOrder.status === 'Cancelled'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : trackingOrder.status === 'Out for Delivery'
                ? 'bg-blue-50 border-blue-200 text-blue-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 ${
                  trackingOrder.status === 'Delivered'
                    ? 'bg-emerald-600'
                    : trackingOrder.status === 'Cancelled'
                    ? 'bg-rose-600'
                    : trackingOrder.status === 'Out for Delivery'
                    ? 'bg-blue-600 animate-bounce'
                    : 'bg-amber-500 animate-pulse'
                }`}>
                  {trackingOrder.status === 'Delivered' && <CheckCircle2 className="w-5 h-5" />}
                  {trackingOrder.status === 'Cancelled' && <AlertCircle className="w-5 h-5" />}
                  {trackingOrder.status === 'Out for Delivery' && <Bike className="w-5 h-5" />}
                  {trackingOrder.status === 'Preparing' && <ChefHat className="w-5 h-5" />}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">
                    Live Order Status
                  </span>
                  <h4 className="font-black text-base">
                    {trackingOrder.status === 'Delivered' ? 'Order Delivered Successfully' :
                     trackingOrder.status === 'Cancelled' ? 'Order Cancelled' :
                     trackingOrder.status === 'Out for Delivery' ? 'Out for Delivery' :
                     'Kitchen Preparing Your Food'}
                  </h4>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase font-bold opacity-75 block">Estimated Arrival</span>
                <span className="text-sm font-black flex items-center gap-1 sm:justify-end">
                  <Clock className="w-3.5 h-3.5" />
                  {trackingOrder.status === 'Delivered' ? (trackingOrder.deliveredAt ? `Delivered at ${trackingOrder.deliveredAt}` : 'Delivered on time') :
                   trackingOrder.status === 'Cancelled' ? 'Cancelled' :
                   trackingOrder.status === 'Out for Delivery' ? '10 - 15 mins remaining' :
                   (trackingOrder.estimatedDeliveryTime || '20 - 25 mins remaining')}
                </span>
              </div>
            </div>

            {/* ORDER TRACKING TIMELINE */}
            <div className="space-y-3 p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block">
                Order Tracking Timeline
              </span>

              {trackingOrder.status === 'Cancelled' ? (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Order Cancelled & Refund Initiated</span>
                  </div>
                  <p className="text-[11px] text-rose-600 pl-6">
                    This order was cancelled. 100% refund of ₹{trackingOrder.totalAmount} will be credited back to your original payment mode.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 text-center">
                  {/* Step 1: Confirmed */}
                  <div className="flex flex-col items-center space-y-1.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-black text-slate-800">Confirmed</span>
                    <span className="text-[9px] text-slate-400">Accepted</span>
                  </div>

                  {/* Step 2: Preparing */}
                  <div className="flex flex-col items-center space-y-1.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${
                      trackingOrder.status === 'Preparing'
                        ? 'bg-amber-500 text-white animate-pulse shadow-md shadow-amber-500/30'
                        : (trackingOrder.status === 'Out for Delivery' || trackingOrder.status === 'Delivered')
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      <ChefHat className="w-4 h-4" />
                    </div>
                    <span className={`text-[11px] font-black ${trackingOrder.status === 'Preparing' ? 'text-amber-700' : (trackingOrder.status === 'Out for Delivery' || trackingOrder.status === 'Delivered') ? 'text-slate-800' : 'text-slate-400'}`}>
                      Preparing
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {trackingOrder.status === 'Preparing' ? 'Cooking now' : 'Kitchen done'}
                    </span>
                  </div>

                  {/* Step 3: Out for Delivery */}
                  <div className="flex flex-col items-center space-y-1.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${
                      trackingOrder.status === 'Out for Delivery'
                        ? 'bg-blue-600 text-white animate-bounce shadow-md shadow-blue-600/30'
                        : trackingOrder.status === 'Delivered'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      <Bike className="w-4 h-4" />
                    </div>
                    <span className={`text-[11px] font-black ${trackingOrder.status === 'Out for Delivery' ? 'text-blue-700' : trackingOrder.status === 'Delivered' ? 'text-slate-800' : 'text-slate-400'}`}>
                      On The Way
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {trackingOrder.status === 'Out for Delivery' ? 'Rider heading' : trackingOrder.status === 'Delivered' ? 'Arrived' : 'Waiting pickup'}
                    </span>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="flex flex-col items-center space-y-1.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${
                      trackingOrder.status === 'Delivered'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className={`text-[11px] font-black ${trackingOrder.status === 'Delivered' ? 'text-emerald-700' : 'text-slate-400'}`}>
                      Delivered
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {trackingOrder.status === 'Delivered' ? 'Handed over' : 'Doorstep drop'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Partner Assigned Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-slate-900">{trackingOrder.deliveryPartner?.name || 'K. Suresh Kumar'}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">★ 4.9</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">{trackingOrder.deliveryPartner?.vehicle || 'Hero Splendor (TS 09 EA 4421)'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toast.info(`Calling delivery hero Suresh at +91 98490 12345... 📞`)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold transition flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>Call Rider</span>
                </button>
                <button
                  type="button"
                  onClick={() => toast.success(`Message sent to rider! 💬`)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold transition flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <MessageSquare className="w-3 h-3 text-slate-600" />
                  <span>Message</span>
                </button>
              </div>
            </div>

            {/* Destination Address */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Delivery Address</span>
                <span className="font-bold text-slate-800">{trackingOrder.deliveryAddress}</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Receiver: {trackingOrder.customerName} ({trackingOrder.customerPhone})</span>
              </div>
            </div>

            {/* Itemized Order Details */}
            <div>
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block mb-2">
                Ordered Dishes & Bill Breakdown
              </span>
              <div className="space-y-1.5 divide-y divide-slate-100 max-h-40 overflow-y-auto">
                {trackingOrder.items?.map((item, idx) => (
                  <div key={idx} className="pt-1.5 flex justify-between items-center text-xs">
                    <span className="text-slate-800 font-bold">
                      {item.qty}x {item.name}
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      ₹{item.price * item.qty}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Amount Paid ({trackingOrder.paymentMethod || 'UPI'})</span>
                  <span className="text-lg font-black text-orange-600">₹{trackingOrder.totalAmount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/order-confirmation/${trackingOrder.id}`}
                    className="px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs border border-orange-200 transition flex items-center gap-1.5"
                  >
                    <span>Full Screen Tracker</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      handleReorder(trackingOrder);
                      setTrackingOrderId(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs transition shadow-md shadow-orange-600/20 active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reorder</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. EDIT PROFILE MODAL */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsEditProfileModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Edit Customer Profile</h3>
                <p className="text-xs text-slate-400">Update your name, contact details and avatar</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Profile Image Preview & Picker */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Profile Image (UI Avatar)
                </label>
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <img
                    src={profileForm.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                    alt="Preview"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-400 shadow-sm shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <span className="text-xs font-bold text-slate-800 block">Avatar Selection</span>
                    <span className="text-[11px] text-slate-500 block">Pick a preset avatar below or paste a custom image URL</span>
                  </div>
                </div>

                {/* Preset Avatars */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block mb-2">Preset Avatars:</span>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                    {AVATAR_PRESETS.map((preset) => (
                      <button
                        type="button"
                        key={preset.id}
                        onClick={() => setProfileForm((prev) => ({ ...prev, avatar: preset.url }))}
                        className={`p-1 rounded-2xl border-2 transition cursor-pointer relative shrink-0 ${
                          profileForm.avatar === preset.url
                            ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                        title={preset.label}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        {profileForm.avatar === preset.url && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px]">
                            ✓
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom URL Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Or Image URL:
                  </label>
                  <input
                    type="url"
                    value={profileForm.avatar}
                    onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white font-medium"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    placeholder="customer@foodie.com"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white font-medium"
                  />
                </div>
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    maxLength={13}
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white font-medium"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Rider will contact on this number during delivery</span>
              </div>

              {/* Admin Specific: Restaurant / Outlet Name & Registered Address */}
              {currentUser?.role === 'Admin' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Restaurant / Outlet Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={profileForm.restaurantName}
                        onChange={(e) => setProfileForm({ ...profileForm, restaurantName: e.target.value })}
                        placeholder="e.g. The Royal Spice Kitchen"
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Restaurant Outlet Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <textarea
                        rows={2}
                        required
                        value={profileForm.address}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        placeholder="e.g. Plot 18, Software Units Layout, HITEC City, Hyderabad - 500081"
                        className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white font-medium resize-none"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Commercial outlet location where delivery riders pick up food orders
                    </span>
                  </div>
                </>
              )}

              {/* Form Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white text-xs font-black shadow-md shadow-orange-600/20 transition cursor-pointer active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. ADD / EDIT ADDRESS MODAL */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                </h3>
                <p className="text-xs text-slate-400">Accurate address ensures faster delivery with live tracking</p>
              </div>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              {/* Address Tag Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Save Address As
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {['Home', 'Work', 'Other'].map((tagOption) => (
                    <button
                      type="button"
                      key={tagOption}
                      onClick={() => setAddressForm({ ...addressForm, tag: tagOption })}
                      className={`py-2 px-3 rounded-xl border-2 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        addressForm.tag === tagOption
                          ? 'border-orange-600 bg-orange-50 text-orange-700 shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{tagOption === 'Home' ? '🏠' : tagOption === 'Work' ? '🏢' : '📍'}</span>
                      <span>{tagOption}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Flat / House / Building */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Flat / House / Floor / Building <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.flatNo}
                  onChange={(e) => setAddressForm({ ...addressForm, flatNo: e.target.value })}
                  placeholder="e.g. Flat 402, Lotus Residency"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white font-medium"
                />
              </div>

              {/* Area / Street / Sector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Area / Street / Colony <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.area}
                  onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })}
                  placeholder="e.g. Road No. 36, Jubilee Hills"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white font-medium"
                />
              </div>

              {/* Landmark (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={addressForm.landmark}
                  onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                  placeholder="e.g. Opposite Metro Pillar #124, Near City Mall"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white font-medium"
                />
              </div>

              {/* City and Pincode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="Hyderabad"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    placeholder="500033"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white font-medium"
                  />
                </div>
              </div>

              {/* Receiver Name and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Receiver's Name
                  </label>
                  <input
                    type="text"
                    value={addressForm.receiverName}
                    onChange={(e) => setAddressForm({ ...addressForm, receiverName: e.target.value })}
                    placeholder="Rahul Sharma"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Receiver's Phone
                  </label>
                  <input
                    type="tel"
                    maxLength={13}
                    value={addressForm.receiverPhone}
                    onChange={(e) => setAddressForm({ ...addressForm, receiverPhone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 bg-white font-medium"
                  />
                </div>
              </div>

              {/* Make Primary Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addressForm.isPrimary}
                    onChange={(e) => setAddressForm({ ...addressForm, isPrimary: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-600 accent-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Set this as my default delivery address
                  </span>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white text-xs font-black shadow-md shadow-orange-600/20 transition cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingAddressId ? 'Update Address' : 'Save Address'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerPortal;
