import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Available coupons dictionary
export const AVAILABLE_COUPONS = [
  {
    code: 'WELCOME50',
    title: 'Flat ₹50 OFF',
    description: 'Welcome discount on any order',
    minSubtotal: 0,
    calculate: () => 50
  },
  {
    code: 'CRAVE100',
    title: 'Flat ₹100 OFF',
    description: 'Special feast treat on orders above ₹399',
    minSubtotal: 399,
    calculate: () => 100
  },
  {
    code: 'FEAST20',
    title: '20% OFF (up to ₹150)',
    description: '20% discount on orders above ₹299',
    minSubtotal: 299,
    calculate: (subtotal) => Math.min(150, Math.round(subtotal * 0.2))
  }
];

export const CartProvider = ({ children }) => {
  // 1. Cart Items from LocalStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cavedash_cart_items');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // 2. Active Restaurant linked to Cart
  const [activeRestaurant, setActiveRestaurant] = useState(() => {
    try {
      const stored = localStorage.getItem('cavedash_cart_restaurant');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // 3. Applied Coupon from LocalStorage
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const stored = localStorage.getItem('cavedash_cart_coupon');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // 4. Cart Slide-Over / Modal State
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to LocalStorage on every state update
  useEffect(() => {
    try {
      localStorage.setItem('cavedash_cart_items', JSON.stringify(cartItems));
      if (activeRestaurant) {
        localStorage.setItem('cavedash_cart_restaurant', JSON.stringify(activeRestaurant));
      } else {
        localStorage.removeItem('cavedash_cart_restaurant');
      }

      if (appliedCoupon) {
        localStorage.setItem('cavedash_cart_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('cavedash_cart_coupon');
      }
    } catch (err) {
      console.error('Cart sync error:', err);
    }
  }, [cartItems, activeRestaurant, appliedCoupon]);

  // Real-time Cross-tab synchronization via storage event
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cavedash_cart_items') {
        try {
          setCartItems(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {
          // ignore
        }
      }
      if (e.key === 'cavedash_cart_restaurant') {
        try {
          setActiveRestaurant(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          // ignore
        }
      }
      if (e.key === 'cavedash_cart_coupon') {
        try {
          setAppliedCoupon(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Add Dish to Cart (Supports seamless multi-item and multi-restaurant ordering without popups)
  const addToCart = useCallback((dish, restaurant) => {
    if (!dish) return;

    const restName = restaurant?.name || dish.restaurantName || activeRestaurant?.name || 'Partner Kitchen';

    // Set active restaurant smoothly
    if (restaurant && (!activeRestaurant || activeRestaurant.id !== restaurant.id)) {
      setActiveRestaurant(restaurant);
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: dish.id,
          name: dish.name,
          price: Number(dish.price) || 0,
          isVeg: dish.isVeg !== undefined ? dish.isVeg : true,
          image: dish.image,
          restaurantName: restName,
          qty: 1
        }
      ];
    });

    toast.success(`Added "${dish.name}" to basket! 🛒`, { autoClose: 1400 });
  }, [activeRestaurant]);

  // Remove Dish completely
  const removeFromCart = useCallback((dishId) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== dishId);
      if (updated.length === 0) {
        setActiveRestaurant(null);
        setAppliedCoupon(null);
      }
      return updated;
    });
    toast.info('Item removed from basket', { autoClose: 1200 });
  }, []);

  // Update item quantity (+1 or -1)
  const updateQuantity = useCallback((dishId, delta) => {
    setCartItems((prev) => {
      const updated = prev
        .map((item) => {
          if (item.id === dishId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);

      if (updated.length === 0) {
        setActiveRestaurant(null);
        setAppliedCoupon(null);
      }
      return updated;
    });
  }, []);

  // Get item quantity in cart
  const getItemQuantity = useCallback((dishId) => {
    const item = cartItems.find((i) => i.id === dishId);
    return item ? item.qty : 0;
  }, [cartItems]);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    setActiveRestaurant(null);
    setAppliedCoupon(null);
    localStorage.removeItem('cavedash_cart_items');
    localStorage.removeItem('cavedash_cart_restaurant');
    localStorage.removeItem('cavedash_cart_coupon');
    toast.info('Basket cleared! 🗑️', { autoClose: 1500 });
  }, []);

  // Financial Calculations
  const itemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.qty, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * item.qty, 0);
  }, [cartItems]);

  const deliveryFee = useMemo(() => {
    if (cartItems.length === 0) return 0;
    if (activeRestaurant?.deliveryCharges === 'Free' || subtotal >= 499) {
      return 0;
    }
    return 35;
  }, [cartItems, activeRestaurant, subtotal]);

  const platformFee = cartItems.length > 0 ? 5 : 0;
  const gstTax = useMemo(() => Math.round(subtotal * 0.05), [subtotal]);

  // Calculate Coupon Discount
  const couponDiscount = useMemo(() => {
    if (!appliedCoupon || cartItems.length === 0) return 0;
    const match = AVAILABLE_COUPONS.find((c) => c.code === appliedCoupon.code);
    if (!match) return 0;
    if (subtotal < match.minSubtotal) return 0;
    return match.calculate(subtotal);
  }, [appliedCoupon, subtotal, cartItems.length]);

  const grandTotal = useMemo(() => {
    const total = subtotal + deliveryFee + platformFee + gstTax - couponDiscount;
    return Math.max(0, total);
  }, [subtotal, deliveryFee, platformFee, gstTax, couponDiscount]);

  // Apply Coupon Handler
  const applyCoupon = useCallback((code) => {
    const cleanCode = code?.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS.find((c) => c.code === cleanCode);

    if (!coupon) {
      toast.error('Invalid coupon code. Try WELCOME50 or CRAVE100');
      return { success: false, message: 'Invalid coupon code' };
    }

    if (subtotal < coupon.minSubtotal) {
      const needed = coupon.minSubtotal - subtotal;
      toast.warning(`Add ₹${needed} more to apply coupon ${cleanCode}!`);
      return { success: false, message: `Minimum order value ₹${coupon.minSubtotal}` };
    }

    const discountVal = coupon.calculate(subtotal);
    setAppliedCoupon({
      code: coupon.code,
      title: coupon.title,
      discount: discountVal
    });
    toast.success(`🎉 Coupon ${coupon.code} applied! Saved ₹${discountVal}!`);
    return { success: true, discount: discountVal };
  }, [subtotal]);

  // Remove Coupon Handler
  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    localStorage.removeItem('cavedash_cart_coupon');
    toast.info('Coupon removed');
  }, []);

  // Place Order Handler (Saves directly to food_delivery_orders)
  const placeOrder = useCallback(({
    customerName,
    customerPhone,
    deliveryAddress,
    deliveryInstructions = '',
    paymentMethod = 'UPI',
    estimatedTime = '30-35 mins'
  }) => {
    // 1. Prevent Empty Cart Checkout Guard
    if (cartItems.length === 0) {
      toast.error('Cannot place order: Your cart is empty!');
      return { success: false, message: 'Cart is empty' };
    }

    // 2. Generate Real-time Order ID (CRV-ORD-XXXX)
    const orderId = `CRV-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const restaurantNames = [...new Set(cartItems.map((i) => i.restaurantName || activeRestaurant?.name || 'Paradise Royale Biryani'))];
    const displayRestaurantName = restaurantNames.length === 1
      ? restaurantNames[0]
      : `${restaurantNames[0]} (+${restaurantNames.length - 1} more)`;

    const arrivalDate = new Date(Date.now() + 32 * 60 * 1000);
    const estimatedArrival = arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder = {
      id: orderId,
      customerName: customerName || 'Rahul Sharma',
      customerPhone: customerPhone || '+91 9876543210',
      deliveryAddress: deliveryAddress || 'Flat 402, Lotus Residency, Road No. 36, Jubilee Hills, Hyderabad',
      deliveryInstructions: deliveryInstructions || 'Leave at door, contactless delivery',
      restaurantName: displayRestaurantName,
      restaurantId: activeRestaurant?.id || 'rest-1',
      restaurantImage: activeRestaurant?.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        isVeg: item.isVeg,
        restaurantName: item.restaurantName
      })),
      itemCount,
      totalAmount: grandTotal,
      subtotal,
      deliveryFee,
      platformFee,
      gstTax,
      couponCode: appliedCoupon?.code || null,
      couponDiscount,
      status: 'Preparing',
      paymentMethod,
      estimatedDeliveryTime: estimatedTime,
      estimatedArrival,
      deliveryPartner: {
        name: 'Suresh Kumar',
        phone: '+91 98765 43210',
        vehicle: 'Hero Splendor (TS 09 EZ 4821)',
        rating: 4.9,
        status: 'Assigned & Heading to Kitchen'
      },
      createdAt: 'Just now',
      timestamp: Date.now()
    };

    try {
      const stored = localStorage.getItem('food_delivery_orders');
      const existing = stored ? JSON.parse(stored) : [];
      const updated = [newOrder, ...(Array.isArray(existing) ? existing : [])];
      localStorage.setItem('food_delivery_orders', JSON.stringify(updated));

      // Trigger cross-component and cross-tab real-time sync event
      window.dispatchEvent(new Event('food_delivery_order_placed'));
      window.dispatchEvent(new Event('food_delivery_orders_updated'));
    } catch (e) {
      console.error('Failed to save order to localStorage:', e);
    }

    // Reset Cart and close drawer
    clearCart();
    setIsCartOpen(false);

    toast.success(`🎉 Order #${orderId} Placed Successfully! Preparing in kitchen.`);
    return { success: true, order: newOrder, orderId };
  }, [cartItems, activeRestaurant, itemCount, grandTotal, subtotal, deliveryFee, platformFee, gstTax, appliedCoupon, couponDiscount, clearCart]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        activeRestaurant,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        itemCount,
        subtotal,
        deliveryFee,
        platformFee,
        gstTax,
        grandTotal,
        appliedCoupon,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        availableCoupons: AVAILABLE_COUPONS,
        placeOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
