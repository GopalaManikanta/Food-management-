import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

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

  // 3. Cart Slide-Over / Modal State
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('cavedash_cart_items', JSON.stringify(cartItems));
      if (activeRestaurant) {
        localStorage.setItem('cavedash_cart_restaurant', JSON.stringify(activeRestaurant));
      } else {
        localStorage.removeItem('cavedash_cart_restaurant');
      }
    } catch (err) {
      console.error('Cart sync error:', err);
    }
  }, [cartItems, activeRestaurant]);

  // Add Dish to Cart (Supports seamless multi-item and multi-restaurant ordering without popups)
  const addToCart = (dish, restaurant) => {
    if (!dish) return;

    const restName = restaurant?.name || dish.restaurantName || activeRestaurant?.name || 'Partner Kitchen';

    // Set or update active restaurant smoothly
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
          price: dish.price,
          isVeg: dish.isVeg !== undefined ? dish.isVeg : true,
          image: dish.image,
          restaurantName: restName,
          qty: 1
        }
      ];
    });

    toast.success(`Added "${dish.name}" to basket! 🛒`, { autoClose: 1500 });
  };

  // Remove Dish completely
  const removeFromCart = (dishId) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== dishId);
      if (updated.length === 0) {
        setActiveRestaurant(null);
      }
      return updated;
    });
  };

  // Update item quantity (+1 or -1)
  const updateQuantity = (dishId, delta) => {
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
      }
      return updated;
    });
  };

  // Get item quantity in cart
  const getItemQuantity = (dishId) => {
    const item = cartItems.find((i) => i.id === dishId);
    return item ? item.qty : 0;
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    setActiveRestaurant(null);
  };

  // Derived Financial Calculations
  const itemCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.qty, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
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
  const grandTotal = subtotal + deliveryFee + platformFee + gstTax;

  // Place Order Handler (Saves directly to food_delivery_orders)
  const placeOrder = ({ customerName, customerPhone, deliveryAddress, paymentMethod = 'UPI' }) => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return { success: false, message: 'Cart is empty' };
    }

    const orderId = `CRV-${Math.floor(1000 + Math.random() * 9000)}`;

    const restaurantNames = [...new Set(cartItems.map((i) => i.restaurantName || activeRestaurant?.name || 'Paradise Royale Biryani'))];
    const displayRestaurantName = restaurantNames.length === 1
      ? restaurantNames[0]
      : `${restaurantNames[0]} (+${restaurantNames.length - 1} more)`;

    const newOrder = {
      id: orderId,
      customerName: customerName || 'Rahul Sharma',
      customerPhone: customerPhone || '+91 9876543210',
      deliveryAddress: deliveryAddress || 'Flat 402, Lotus Residency, Road No. 36, Jubilee Hills, Hyderabad',
      restaurantName: displayRestaurantName,
      restaurantId: activeRestaurant?.id || 'rest-1',
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        isVeg: item.isVeg,
        restaurantName: item.restaurantName
      })),
      totalAmount: grandTotal,
      subtotal,
      deliveryFee,
      platformFee,
      gstTax,
      status: 'Preparing',
      paymentMethod,
      createdAt: 'Just now',
      timestamp: Date.now()
    };

    try {
      const stored = localStorage.getItem('food_delivery_orders');
      const existing = stored ? JSON.parse(stored) : [];
      const updated = [newOrder, ...(Array.isArray(existing) ? existing : [])];
      localStorage.setItem('food_delivery_orders', JSON.stringify(updated));

      // Trigger cross-component real-time sync event
      window.dispatchEvent(new Event('food_delivery_order_placed'));
    } catch (e) {
      console.error('Failed to save order to localStorage:', e);
    }

    // Reset Cart
    clearCart();
    setIsCartOpen(false);

    toast.success(`🎉 Order #${orderId} Placed Successfully! Preparing in kitchen.`);
    return { success: true, order: newOrder };
  };

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
        placeOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
