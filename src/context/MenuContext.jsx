import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

const MenuContext = createContext();

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

export const MENU_CATEGORIES = [
  'All',
  'Biryani',
  'Pizza',
  'Burger',
  'North Indian',
  'South Indian',
  'Chinese',
  'Dessert',
  'Beverages'
];

const INITIAL_MENU_ITEMS = [
  {
    id: 'food-101',
    name: 'Special Chicken Dum Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    description: 'Slow-cooked authentic Hyderabadi basmati rice with marinated chicken, saffron, and aromatic spices.',
    price: 299,
    category: 'Biryani',
    isVeg: false,
    isAvailable: true,
    restaurantName: 'Paradise Royale Biryani',
    prepTime: '25-30 mins',
    rating: 4.9
  },
  {
    id: 'food-102',
    name: 'Nizami Mutton Dum Biryani',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
    description: 'Tender lamb chunks cooked with fragrant long-grain basmati, brown onions, and pure desi ghee.',
    price: 399,
    category: 'Biryani',
    isVeg: false,
    isAvailable: true,
    restaurantName: 'Paradise Royale Biryani',
    prepTime: '30 mins',
    rating: 4.8
  },
  {
    id: 'food-103',
    name: 'Wood-Fired Truffle Margherita',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    description: 'Hand-stretched sourdough crust with San Marzano tomatoes, fresh buffalo mozzarella, and basil.',
    price: 349,
    category: 'Pizza',
    isVeg: true,
    isAvailable: true,
    restaurantName: 'Artisan Crust Pizza Co.',
    prepTime: '20 mins',
    rating: 4.7
  },
  {
    id: 'food-104',
    name: 'Smoked Pepperoni Feast Pizza',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
    description: 'Loaded with smoky artisanal pepperoni slices, aged mozzarella, chili flakes, and hot honey drizzle.',
    price: 429,
    category: 'Pizza',
    isVeg: false,
    isAvailable: true,
    restaurantName: 'Artisan Crust Pizza Co.',
    prepTime: '22 mins',
    rating: 4.6
  },
  {
    id: 'food-105',
    name: 'Double Smash Gourmet Burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    description: 'Two smashed patties with melted cheddar cheese, caramelized onions, pickles, and signature house sauce.',
    price: 249,
    category: 'Burger',
    isVeg: false,
    isAvailable: true,
    restaurantName: 'Burger District & Co.',
    prepTime: '15-20 mins',
    rating: 4.8
  },
  {
    id: 'food-106',
    name: 'Crispy Paneer Supreme Burger',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    description: 'Golden fried herb-marinated cottage cheese patty with spicy peri-peri coleslaw in a toasted brioche bun.',
    price: 209,
    category: 'Burger',
    isVeg: true,
    isAvailable: true,
    restaurantName: 'Burger District & Co.',
    prepTime: '15 mins',
    rating: 4.5
  },
  {
    id: 'food-107',
    name: 'Paneer Butter Masala & Garlic Naan',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
    description: 'Creamy tomato-cashew velvet gravy with soft paneer cubes, served with two buttery garlic naans.',
    price: 279,
    category: 'North Indian',
    isVeg: true,
    isAvailable: true,
    restaurantName: 'Punjabi Rasoi Dhaba',
    prepTime: '20 mins',
    rating: 4.8
  },
  {
    id: 'food-108',
    name: 'Slow-Cooked Dal Makhani',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    description: 'Black lentils simmered overnight on slow coal with fresh cream, unsalted white butter, and aromatic fenugreek.',
    price: 229,
    category: 'North Indian',
    isVeg: true,
    isAvailable: true,
    restaurantName: 'Punjabi Rasoi Dhaba',
    prepTime: '20 mins',
    rating: 4.9
  },
  {
    id: 'food-109',
    name: 'Ghee Podi Masala Dosa',
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80',
    description: 'Golden crisp fermented crepe generously smeared with aromatic gun powder podi and spiced potato masala.',
    price: 139,
    category: 'South Indian',
    isVeg: true,
    isAvailable: true,
    restaurantName: 'Udupi Krishna Tiffin Hub',
    prepTime: '15 mins',
    rating: 4.9
  },
  {
    id: 'food-110',
    name: 'Crispy Medu Vada & Sambar (3 Pcs)',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    description: 'Deep-fried golden lentil fritters served with piping hot drumstick sambar and fresh coconut chutney.',
    price: 109,
    category: 'South Indian',
    isVeg: true,
    isAvailable: false,
    restaurantName: 'Udupi Krishna Tiffin Hub',
    prepTime: '12 mins',
    rating: 4.7
  },
  {
    id: 'food-111',
    name: 'Szechuan Hakka Noodles',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    description: 'Wok-tossed noodles with bell peppers, shredded cabbage, spring onions, and spicy Szechuan sauce.',
    price: 219,
    category: 'Chinese',
    isVeg: true,
    isAvailable: true,
    restaurantName: 'Mainland Dragon Bistro',
    prepTime: '18 mins',
    rating: 4.4
  },
  {
    id: 'food-112',
    name: 'Steamed Crystal Chicken Dim Sums',
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80',
    description: 'Delicate translucent dumplings filled with minced chicken, ginger, and scallions, served with chili dip.',
    price: 269,
    category: 'Chinese',
    isVeg: false,
    isAvailable: true,
    restaurantName: 'Mainland Dragon Bistro',
    prepTime: '20 mins',
    rating: 4.6
  },
  {
    id: 'food-113',
    name: 'Belgian Dark Chocolate Waffle',
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=600&q=80',
    description: 'Warm crispy waffle smothered with melted Belgian dark chocolate ganache and chocolate sprinkles.',
    price: 189,
    category: 'Dessert',
    isVeg: true,
    isAvailable: true,
    restaurantName: 'The Belgian Waffle Club',
    prepTime: '15 mins',
    rating: 4.8
  },
  {
    id: 'food-114',
    name: 'Royal Mango Kulfi Falooda',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80',
    description: 'Layers of rich mango kulfi, sweet basil seeds, vermicelli, and rose syrup topped with pistachios.',
    price: 159,
    category: 'Dessert',
    isVeg: true,
    isAvailable: false,
    restaurantName: 'The Belgian Waffle Club',
    prepTime: '10 mins',
    rating: 4.7
  },
  {
    id: 'food-115',
    name: 'Hyderabadi Irani Chai & Osmania (Combo)',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    description: 'Authentic rich, creamy dum tea brewed in copper vessel, served with 4 buttery Osmania biscuits.',
    price: 69,
    category: 'Beverages',
    isVeg: true,
    isAvailable: true,
    restaurantName: 'Paradise Royale Biryani',
    prepTime: '5 mins',
    rating: 4.9
  },
  {
    id: 'food-116',
    name: 'Alphonso Mango Pulpy Shake',
    image: 'https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=600&q=80',
    description: 'Thick and chilled milkshake made with 100% Ratnagiri Alphonso mango pulp and vanilla ice cream.',
    price: 139,
    category: 'Beverages',
    isVeg: true,
    isAvailable: true,
    restaurantName: 'The Belgian Waffle Club',
    prepTime: '8 mins',
    rating: 4.6
  }
];

export const MenuProvider = ({ children }) => {
  // 1. Menu Items from LocalStorage
  const [menuItems, setMenuItems] = useState(() => {
    try {
      const stored = localStorage.getItem('food_delivery_menu_items');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_MENU_ITEMS;
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  });

  // 2. Search, Filters & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegFilter, setVegFilter] = useState('all'); // 'all' | 'veg' | 'nonveg'
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'price_low' | 'price_high'
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all' | 'available' | 'out_of_stock'

  // Persist menu items and update dashboard counter
  useEffect(() => {
    try {
      localStorage.setItem('food_delivery_menu_items', JSON.stringify(menuItems));
      localStorage.setItem('food_delivery_food_count', menuItems.length.toString());
      window.dispatchEvent(new Event('food_delivery_menu_updated'));
    } catch (e) {
      console.error('Failed to sync menu items:', e);
    }
  }, [menuItems]);

  // ADD Menu Item
  const addMenuItem = (itemData) => {
    const newItem = {
      id: `food-${Date.now()}`,
      name: itemData.name.trim(),
      image: itemData.image?.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      description: itemData.description?.trim() || '',
      price: Math.max(1, parseFloat(itemData.price) || 99),
      category: itemData.category || 'Biryani',
      isVeg: Boolean(itemData.isVeg),
      isAvailable: itemData.isAvailable !== undefined ? Boolean(itemData.isAvailable) : true,
      restaurantName: itemData.restaurantName?.trim() || 'Paradise Royale Biryani',
      prepTime: itemData.prepTime?.trim() || '20 mins',
      rating: 4.8
    };

    setMenuItems((prev) => [newItem, ...prev]);
    toast.success(`🎉 "${newItem.name}" added to menu catalog!`);
    return newItem;
  };

  // EDIT Menu Item
  const editMenuItem = (id, updatedData) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = {
            ...item,
            name: updatedData.name?.trim() || item.name,
            image: updatedData.image?.trim() || item.image,
            description: updatedData.description !== undefined ? updatedData.description.trim() : item.description,
            price: updatedData.price !== undefined ? Math.max(1, parseFloat(updatedData.price)) : item.price,
            category: updatedData.category || item.category,
            isVeg: updatedData.isVeg !== undefined ? Boolean(updatedData.isVeg) : item.isVeg,
            isAvailable: updatedData.isAvailable !== undefined ? Boolean(updatedData.isAvailable) : item.isAvailable,
            restaurantName: updatedData.restaurantName?.trim() || item.restaurantName,
            prepTime: updatedData.prepTime?.trim() || item.prepTime
          };
          return updated;
        }
        return item;
      })
    );
    toast.success('Food item updated successfully! ✏️');
  };

  // DELETE Menu Item
  const deleteMenuItem = (id) => {
    const target = menuItems.find((i) => i.id === id);
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    toast.info(`Deleted "${target?.name || 'Item'}" from menu catalog. 🗑️`);
  };

  // TOGGLE Availability Status (Real-time Available <-> Out of Stock)
  const toggleAvailability = (id) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = !item.isAvailable;
          toast[nextStatus ? 'success' : 'warn'](
            `"${item.name}" marked as ${nextStatus ? 'In Stock (Available) ✅' : 'Out of Stock ⚠️'}`
          );
          return { ...item, isAvailable: nextStatus };
        }
        return item;
      })
    );
  };

  // GET Menu Item by ID
  const getMenuItemById = (id) => {
    return menuItems.find((item) => item.id === id || String(item.id) === String(id));
  };

  // Reset Filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setVegFilter('all');
    setSortBy('default');
    setAvailabilityFilter('all');
  };

  // Filter and Sort Logic (Memoized)
  const filteredMenuItems = useMemo(() => {
    let result = [...menuItems];

    // Search Query (Food Name, Category, Description, Restaurant)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.restaurantName?.toLowerCase().includes(q)
      );
    }

    // Category Filter
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(
        (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Veg / Non-Veg Filter
    if (vegFilter === 'veg') {
      result = result.filter((item) => item.isVeg === true);
    } else if (vegFilter === 'nonveg') {
      result = result.filter((item) => item.isVeg === false);
    }

    // Availability Filter
    if (availabilityFilter === 'available') {
      result = result.filter((item) => item.isAvailable === true);
    } else if (availabilityFilter === 'out_of_stock') {
      result = result.filter((item) => item.isAvailable === false);
    }

    // Sort by Price
    if (sortBy === 'price_low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [menuItems, searchQuery, selectedCategory, vegFilter, availabilityFilter, sortBy]);

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        filteredMenuItems,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        vegFilter,
        setVegFilter,
        sortBy,
        setSortBy,
        availabilityFilter,
        setAvailabilityFilter,
        categories: MENU_CATEGORIES,
        addMenuItem,
        editMenuItem,
        deleteMenuItem,
        toggleAvailability,
        getMenuItemById,
        resetFilters
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
