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

  // Add Dish to Cart
  const addToCart = (dish, restaurant) => {
    if (!dish) return;

    // Check if adding from another restaurant
    if (activeRestaurant && restaurant && activeRestaurant.id !== restaurant.id && cartItems.length > 0) {
      const confirmReset = window.confirm(
        `Your cart contains items from "${activeRestaurant.name}". Reset your cart to add items from "${restaurant.name}"?`
      );
      if (!confirmReset) return;
      // Reset cart for new restaurant
      setCartItems([{
        id: dish.id,
        name: dish.name,
        price: dish.price,
        isVeg: dish.isVeg,
        image: dish.image,
        qty: 1
      }]);
      setActiveRestaurant(restaurant);
      toast.info(`Cart reset! Added "${dish.name}" from ${restaurant.name}`);
      return;
    }

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
          isVeg: dish.isVeg,
          image: dish.image,
          qty: 1
        }
      ];
    });

    toast.success(`Added "${dish.name}" to cart! 🛒`, { autoClose: 1500 });
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

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
    setActiveRestaurant(null);
  };

  // Get specific dish qty currently in cart
  const getItemQuantity = (dishId) => {
    const item = cartItems.find((i) => i.id === dishId);
    return item ? item.qty : 0;
  };

  // Computations
  const itemCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.qty, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cartItems]);

  // Delivery Charges: from restaurant or fallback to ₹40
  const deliveryFee = useMemo(() => {
    if (cartItems.length === 0) return 0;
    if (activeRestaurant?.deliveryCharges === 'Free' || activeRestaurant?.deliveryCharges === 0) {
      return 0;
    }
    return 35;
  }, [cartItems, activeRestaurant]);

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

    const newOrder = {
      id: orderId,
      customerName: customerName || 'Rahul Sharma',
      customerPhone: customerPhone || '+91 9876543210',
      deliveryAddress: deliveryAddress || 'Flat 402, Lotus Residency, Road No. 36, Jubilee Hills, Hyderabad',
      restaurantName: activeRestaurant?.name || 'Paradise Royale Biryani',
      restaurantId: activeRestaurant?.id || 'rest-1',
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        isVeg: item.isVeg
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
