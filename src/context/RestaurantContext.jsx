import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  fetchRestaurants,
  toggleRestaurantStatus,
  addNewRestaurantPartner,
  FALLBACK_RESTAURANTS
} from '../services/restaurantApi';
import { toast } from 'react-toastify';

const RestaurantContext = createContext();

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};

export const ITEMS_PER_PAGE = 8;

export const CUISINES = [
  'All',
  'Biryani & Mughlai',
  'Italian & Pizza',
  'American & Fast Food',
  'North Indian',
  'Chinese & Asian',
  'South Indian',
  'Desserts & Bakery',
  'Mexican',
  'Healthy & Salads'
];

// Helper to provide realistic rich menu for restaurants that don't have custom dishes yet
const generateDefaultMenu = (cuisine) => {
  return [
    {
      id: 'm1',
      name: `Signature Chef's Special ${cuisine.split(' ')[0]} Platter`,
      category: 'Bestseller',
      price: 380,
      isVeg: false,
      rating: 4.9,
      isBestseller: true,
      description: 'Handcrafted signature house special prepared with premium spices, slow cooked to perfection.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
      prepTime: '20 mins'
    },
    {
      id: 'm2',
      name: 'Crispy Gourmet Appetizer Box',
      category: 'Starters',
      price: 260,
      isVeg: true,
      rating: 4.7,
      isBestseller: true,
      description: 'Golden fried savory bites served with house special tangy dips and fresh herbs.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
      prepTime: '15 mins'
    },
    {
      id: 'm3',
      name: 'Royal Heritage Slow Cooked Main',
      category: 'Main Course',
      price: 340,
      isVeg: false,
      rating: 4.8,
      isBestseller: false,
      description: 'Traditional slow cooked recipe with rich velvety gravy, best paired with bread or aromatic rice.',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80',
      prepTime: '25 mins'
    },
    {
      id: 'm4',
      name: 'Artisan Oven Baked Bread / Rice',
      category: 'Breads & Rice',
      price: 75,
      isVeg: true,
      rating: 4.6,
      isBestseller: false,
      description: 'Freshly baked artisan bread brushed with herb infused butter.',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80',
      prepTime: '10 mins'
    },
    {
      id: 'm5',
      name: 'Decadent Sweet Indulgence',
      category: 'Desserts',
      price: 160,
      isVeg: true,
      rating: 4.9,
      isBestseller: true,
      description: 'Rich artisanal dessert crafted with cream, roasted nuts, and aromatic flavors.',
      image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=400&q=80',
      prepTime: '5 mins'
    }
  ];
};

const DEFAULT_REVIEWS = [
  {
    id: 'r1',
    user: 'Divya Sen',
    rating: 5,
    date: 'Yesterday',
    comment: 'Exceptional food quality! Piping hot delivery, perfectly packed without any spill. 10/10 would order again.',
    verified: true
  },
  {
    id: 'r2',
    user: 'Kavya Rao',
    rating: 5,
    date: '3 days ago',
    comment: 'The flavours are genuine and authentic. Truly one of the best spots in Hyderabad for foodies.',
    verified: true
  },
  {
    id: 'r3',
    user: 'Nikhil Joshi',
    rating: 4,
    date: '1 week ago',
    comment: 'Great portion size and timely delivery. Consistent quality throughout our recent team orders.',
    verified: true
  }
];

export const RestaurantProvider = ({ children }) => {
  // 1. Core Data States
  const [restaurants, setRestaurants] = useState(() => {
    try {
      const stored = localStorage.getItem('food_delivery_restaurants');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn(e);
    }
    return FALLBACK_RESTAURANTS;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // 2. Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [minRating, setMinRating] = useState('0'); // '0', '3.5', '4.0', '4.5'
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'rating', 'deliveryTime', 'deliveryCharge'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'open', 'closed'

  // 3. Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // 4. Modal States
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);

  // Form State for Onboarding
  const [newPartner, setNewPartner] = useState({
    name: '',
    cuisine: 'Biryani & Mughlai',
    address: '',
    deliveryTime: '25-30 mins',
    deliveryCharges: '0',
    costForTwo: '500',
    specialty: '',
    image: ''
  });

  // Fetch Restaurants from API
  const loadRestaurantData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchRestaurants();
      // Ensure each restaurant has rich menu, reviews, timings
      const enriched = data.map((r) => ({
        ...r,
        menu: r.menu && r.menu.length > 0 ? r.menu : generateDefaultMenu(r.cuisine),
        reviews: r.reviews && r.reviews.length > 0 ? r.reviews : DEFAULT_REVIEWS,
        timing: r.timing || '11:00 AM - 11:30 PM (Mon - Sun)',
        fssai: r.fssai || '13621014000452',
        phone: r.phone || '+91 98490 87654',
        manager: r.manager || 'Vikram Oberoi',
        commission: r.commission || '15%'
      }));
      setRestaurants(enriched);
    } catch (err) {
      console.error('Failed to load restaurants:', err);
      setErrorMessage('Could not load restaurant partners. Please check your connection and retry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurantData();
  }, []);

  useEffect(() => {
    try {
      if (restaurants && restaurants.length > 0) {
        localStorage.setItem('food_delivery_restaurants', JSON.stringify(restaurants));
        localStorage.setItem('food_delivery_restaurant_count', restaurants.length.toString());
        window.dispatchEvent(new Event('food_delivery_restaurants_updated'));
      }
    } catch (e) {
      console.warn(e);
    }
  }, [restaurants]);

  // Filter and Sort Logic (Memoized)
  const filteredAndSortedRestaurants = useMemo(() => {
    let result = [...restaurants];

    // Search Query (Name, Cuisine, Address, Specialty)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.cuisine.toLowerCase().includes(query) ||
          r.address.toLowerCase().includes(query) ||
          (r.specialty && r.specialty.toLowerCase().includes(query))
      );
    }

    // Cuisine Filter
    if (selectedCuisine !== 'All') {
      result = result.filter((r) =>
        r.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase())
      );
    }

    // Rating Filter
    if (parseFloat(minRating) > 0) {
      result = result.filter((r) => r.rating >= parseFloat(minRating));
    }

    // Open/Closed Status Filter
    if (statusFilter === 'open') {
      result = result.filter((r) => r.isOpen);
    } else if (statusFilter === 'closed') {
      result = result.filter((r) => !r.isOpen);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'popular') {
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      }
      if (sortBy === 'deliveryTime') {
        const timeA = parseInt(a.deliveryTime, 10) || 30;
        const timeB = parseInt(b.deliveryTime, 10) || 30;
        return timeA - timeB;
      }
      if (sortBy === 'deliveryCharge') {
        return (a.deliveryCharges || 0) - (b.deliveryCharges || 0);
      }
      return 0;
    });

    return result;
  }, [restaurants, searchQuery, selectedCuisine, minRating, sortBy, statusFilter]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCuisine, minRating, sortBy, statusFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredAndSortedRestaurants.length / ITEMS_PER_PAGE) || 1;
  const paginatedRestaurants = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedRestaurants.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedRestaurants, currentPage]);

  // Action: Get restaurant by ID (supports string or number id)
  const getRestaurantById = (id) => {
    return restaurants.find((r) => r.id.toString() === id.toString()) || null;
  };

  // Action: Toggle Restaurant Open/Closed Status
  const handleToggleStatus = (restId) => {
    const updated = toggleRestaurantStatus(restId, restaurants);
    setRestaurants(updated);
    const target = updated.find((r) => r.id === restId);
    if (target) {
      if (target.isOpen) {
        toast.success(`"${target.name}" is now OPEN for orders! 🟢`);
      } else {
        toast.info(`"${target.name}" marked as CLOSED for today. 🔴`);
      }
    }
  };

  // Action: Add New Dish to a specific Restaurant Menu
  const handleAddDishToMenu = (restaurantId, dishData) => {
    const updated = restaurants.map((r) => {
      if (r.id.toString() === restaurantId.toString()) {
        const newDishObj = {
          id: `dish_${Date.now()}`,
          name: dishData.name.trim(),
          category: dishData.category || 'Mains',
          price: parseFloat(dishData.price) || 299,
          isVeg: Boolean(dishData.isVeg),
          rating: 5.0,
          isBestseller: Boolean(dishData.isBestseller),
          description: dishData.description || 'Delicious chef special preparation.',
          image: dishData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
          prepTime: dishData.prepTime || '20 mins'
        };
        const updatedMenu = [newDishObj, ...(r.menu || [])];
        return { ...r, menu: updatedMenu };
      }
      return r;
    });

    setRestaurants(updated);
    try {
      localStorage.setItem('food_delivery_restaurants_list', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to sync updated menu:', e);
    }
    toast.success(`"${dishData.name}" added to menu catalog! 🍲`);
  };

  // Action: Onboard New Restaurant Partner
  const handleOnboardSubmit = (e) => {
    e.preventDefault();
    if (!newPartner.name.trim()) {
      toast.error('Please enter restaurant name');
      return;
    }
    const updated = addNewRestaurantPartner(newPartner, restaurants);
    setRestaurants(updated);
    setIsOnboardModalOpen(false);
    toast.success(`🎉 "${newPartner.name}" onboarded successfully!`);
    setNewPartner({
      name: '',
      cuisine: 'Biryani & Mughlai',
      address: '',
      deliveryTime: '25-30 mins',
      deliveryCharges: '0',
      costForTwo: '500',
      specialty: '',
      image: ''
    });
  };

  // Action: Reset All Filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCuisine('All');
    setMinRating('0');
    setStatusFilter('all');
    setSortBy('popular');
  };

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        isLoading,
        errorMessage,
        searchQuery,
        setSearchQuery,
        selectedCuisine,
        setSelectedCuisine,
        minRating,
        setMinRating,
        sortBy,
        setSortBy,
        statusFilter,
        setStatusFilter,
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedRestaurants,
        filteredAndSortedRestaurants,
        isOnboardModalOpen,
        setIsOnboardModalOpen,
        newPartner,
        setNewPartner,
        loadRestaurantData,
        getRestaurantById,
        handleToggleStatus,
        handleAddDishToMenu,
        handleOnboardSubmit,
        resetFilters,
        cuisines: CUISINES,
        itemsPerPage: ITEMS_PER_PAGE
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};
