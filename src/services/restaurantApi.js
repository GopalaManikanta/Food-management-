import axios from 'axios';

// Curated realistic fallback dataset (used if network is blocked or API unavailable)
const FALLBACK_RESTAURANTS = [
  {
    id: 1,
    name: 'Paradise Royale Biryani',
    cuisine: 'Biryani & Mughlai',
    rating: 4.8,
    reviewCount: 1420,
    deliveryTime: '25-30 mins',
    deliveryCharges: 0,
    address: 'Road No 36, Jubilee Hills, Hyderabad',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    isOpen: true,
    costForTwo: 550,
    specialty: 'Special Hyderabadi Dum Biryani',
    menuHighlights: ['Nizami Chicken Dum Biryani', 'Mutton Ghee Roast', 'Mirchi Ka Salan', 'Double Ka Meetha']
  },
  {
    id: 2,
    name: 'Artisan Crust Pizza Co.',
    cuisine: 'Italian & Pizza',
    rating: 4.6,
    reviewCount: 890,
    deliveryTime: '30-35 mins',
    deliveryCharges: 40,
    address: 'Inorbit Mall Road, HITEC City, Hyderabad',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    isOpen: true,
    costForTwo: 650,
    specialty: 'Wood-Fired Truffle Margherita',
    menuHighlights: ['Truffle Burrata Pizza', 'Quattro Formaggi', 'Garlic Rosemary Bread', 'Tiramisu Cup']
  },
  {
    id: 3,
    name: 'Burger District & Co.',
    cuisine: 'American & Fast Food',
    rating: 4.5,
    reviewCount: 750,
    deliveryTime: '20-25 mins',
    deliveryCharges: 0,
    address: 'Near Cyber Towers, Madhapur, Hyderabad',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    isOpen: true,
    costForTwo: 400,
    specialty: 'Double Smash Gourmet Burger',
    menuHighlights: ['Smoky BBQ Bacon Burger', 'Truffle Parmesan Fries', 'Crispy Chicken Tenders', 'Cold Brew Shake']
  },
  {
    id: 4,
    name: 'Punjabi Rasoi Dhaba',
    cuisine: 'North Indian',
    rating: 4.7,
    reviewCount: 1100,
    deliveryTime: '25-30 mins',
    deliveryCharges: 30,
    address: 'Gachibowli Main Road, Hyderabad',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    isOpen: true,
    costForTwo: 500,
    specialty: 'Dal Makhani & Butter Naan',
    menuHighlights: ['Paneer Butter Masala', 'Amritsari Kulcha', 'Slow Cooked Dal Makhani', 'Gulab Jamun']
  },
  {
    id: 5,
    name: 'Mainland Dragon Bistro',
    cuisine: 'Chinese & Asian',
    rating: 4.4,
    reviewCount: 620,
    deliveryTime: '35-40 mins',
    deliveryCharges: 40,
    address: 'Banjara Hills Road No 10, Hyderabad',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    isOpen: false,
    costForTwo: 700,
    specialty: 'Szechuan Chilli Noodles & Dim Sums',
    menuHighlights: ['Crystal Prawn Dumplings', 'Kung Pao Chicken', 'Hakka Noodles', 'Manchow Soup']
  },
  {
    id: 6,
    name: 'Udupi Krishna Tiffin Hub',
    cuisine: 'South Indian',
    rating: 4.9,
    reviewCount: 2300,
    deliveryTime: '15-20 mins',
    deliveryCharges: 0,
    address: 'Kondapur Signal, Hyderabad',
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80',
    isOpen: true,
    costForTwo: 250,
    specialty: 'Ghee Podi Masala Dosa',
    menuHighlights: ['Crispy Medu Vada', 'Filter Coffee', 'Rava Kesari', 'Onion Uttapam']
  },
  {
    id: 7,
    name: 'The Belgian Waffle Club',
    cuisine: 'Desserts & Bakery',
    rating: 4.7,
    reviewCount: 940,
    deliveryTime: '20-25 mins',
    deliveryCharges: 25,
    address: 'Film Nagar, Jubilee Hills, Hyderabad',
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80',
    isOpen: true,
    costForTwo: 350,
    specialty: 'Triple Chocolate Overload Waffle',
    menuHighlights: ['Nutella Crunch Waffle', 'Red Velvet Dream', 'Lotus Biscoff Sundae', 'Dark Choco Shake']
  },
  {
    id: 8,
    name: 'Taco Fiesta Mexicana',
    cuisine: 'Mexican',
    rating: 4.3,
    reviewCount: 510,
    deliveryTime: '30-35 mins',
    deliveryCharges: 35,
    address: 'Financial District, Nanakramguda, Hyderabad',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',
    isOpen: true,
    costForTwo: 600,
    specialty: 'Loaded Guacamole Burrito Bowls',
    menuHighlights: ['Crispy Beef Tacos', 'Cheesy Quesadillas', 'Churros with Dulce de Leche', 'Nachos Supreme']
  },
  {
    id: 9,
    name: 'Bawarchi Grand Royal',
    cuisine: 'Biryani & Mughlai',
    rating: 4.6,
    reviewCount: 3100,
    deliveryTime: '25-30 mins',
    deliveryCharges: 0,
    address: 'RTC Cross Roads, Hyderabad',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    isOpen: true,
    costForTwo: 480,
    specialty: 'Original Mutton Dum Biryani',
    menuHighlights: ['Chicken 65', 'Boti Kebab', 'Tandoori Roti', 'Shahi Tukda']
  },
  {
    id: 10,
    name: 'Tokyo Ramen & Sushi Lab',
    cuisine: 'Asian & Japanese',
    rating: 4.8,
    reviewCount: 680,
    deliveryTime: '35-40 mins',
    deliveryCharges: 50,
    address: 'Road No 45, Jubilee Hills, Hyderabad',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    isOpen: false,
    costForTwo: 850,
    specialty: 'Tonkotsu Broth Ramen & Salmon Rolls',
    menuHighlights: ['Spicy Miso Ramen', 'Crispy Prawn Tempura', 'California Sushi Roll', 'Matcha Ice Cream']
  },
  {
    id: 11,
    name: 'Dhaba by the Bay',
    cuisine: 'North Indian',
    rating: 4.4,
    reviewCount: 790,
    deliveryTime: '30-35 mins',
    deliveryCharges: 30,
    address: 'Kavuri Hills, Madhapur, Hyderabad',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    isOpen: true,
    costForTwo: 520,
    specialty: 'Dhaba Murgh Tariwala',
    menuHighlights: ['Kadai Paneer', 'Laccha Paratha', 'Chicken Tikka', 'Sweet Lassi']
  },
  {
    id: 12,
    name: 'Green Leaf Organic Bowls',
    cuisine: 'Healthy & Salads',
    rating: 4.5,
    reviewCount: 430,
    deliveryTime: '20-25 mins',
    deliveryCharges: 0,
    address: 'Necklace Road, Hyderabad',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    isOpen: true,
    costForTwo: 420,
    specialty: 'Avocado & Quinoa Power Bowl',
    menuHighlights: ['Greek Feta Salad', 'Detox Green Smoothie', 'Hummus & Pita', 'Chia Pudding']
  }
];

const LOCAL_STORAGE_KEY = 'food_delivery_restaurants_list';

// Fetch Restaurant List from Third-Party API with Fallback
export const fetchRestaurants = async () => {
  // Check LocalStorage first for any saved edits / added restaurants
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('LocalStorage read error:', err);
  }

  // Attempt to fetch from real Third-Party API (DummyJSON Recipes)
  try {
    const response = await axios.get('https://dummyjson.com/recipes?limit=24', {
      timeout: 5000
    });

    if (response.data && Array.isArray(response.data.recipes) && response.data.recipes.length > 0) {
      const areas = ['Jubilee Hills', 'HITEC City', 'Madhapur', 'Banjara Hills', 'Gachibowli', 'Kondapur'];
      
      const apiRestaurants = response.data.recipes.map((recipe, index) => {
        const area = areas[index % areas.length];
        const rating = (3.8 + ((recipe.rating || 4.2) * 0.24)).toFixed(1);
        const isFreeDelivery = index % 3 === 0;

        return {
          id: recipe.id,
          name: `${recipe.name.split(' ')[0]} ${recipe.cuisine || 'Gourmet'} Kitchen`,
          cuisine: recipe.cuisine || 'Multi-Cuisine',
          rating: parseFloat(rating),
          reviewCount: (recipe.reviewCount || 100) * 8 + 45,
          deliveryTime: `${recipe.prepTimeMinutes || 25}-${(recipe.prepTimeMinutes || 25) + 10} mins`,
          deliveryCharges: isFreeDelivery ? 0 : 35,
          address: `Plot ${12 + index * 4}, ${area}, Hyderabad`,
          image: recipe.image || FALLBACK_RESTAURANTS[index % FALLBACK_RESTAURANTS.length].image,
          isOpen: index % 6 !== 5, // ~85% open
          costForTwo: 350 + (index % 5) * 80,
          specialty: recipe.name,
          menuHighlights: recipe.ingredients ? recipe.ingredients.slice(0, 4) : ['Chef Special Curry', 'Garlic Naan', 'Dessert']
        };
      });

      // Combine with curated local specialties for top-notch presentation
      const merged = [...FALLBACK_RESTAURANTS, ...apiRestaurants.filter(r => r.id > 12)];
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
      } catch (e) {
        console.warn('Failed to cache restaurants:', e);
      }
      return merged;
    }
  } catch (error) {
    console.warn('Third-party API failed, falling back to curated restaurant list:', error.message);
  }

  // Fallback to verified local restaurants
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(FALLBACK_RESTAURANTS));
  } catch (e) {
    console.warn('Failed to cache fallback:', e);
  }
  return FALLBACK_RESTAURANTS;
};

// Toggle Open/Closed Status for a Restaurant (Real-time update)
export const toggleRestaurantStatus = (restaurantId, currentList) => {
  const updated = currentList.map((rest) => {
    if (rest.id === restaurantId) {
      return { ...rest, isOpen: !rest.isOpen };
    }
    return rest;
  });

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to sync updated restaurant status:', e);
  }

  return updated;
};

// Add New Restaurant Partner
export const addNewRestaurantPartner = (newPartner, currentList) => {
  const newRestaurantObj = {
    id: Date.now(),
    name: newPartner.name.trim(),
    cuisine: newPartner.cuisine || 'Multi-Cuisine',
    rating: 5.0,
    reviewCount: 1,
    deliveryTime: newPartner.deliveryTime || '25-30 mins',
    deliveryCharges: parseInt(newPartner.deliveryCharges, 10) || 0,
    address: newPartner.address || 'Hyderabad',
    image: newPartner.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    isOpen: true,
    costForTwo: parseInt(newPartner.costForTwo, 10) || 450,
    specialty: newPartner.specialty || 'Chef Special Assortment',
    menuHighlights: ['Signature Platter', 'House Special Main', 'Beverage']
  };

  const updated = [newRestaurantObj, ...currentList];
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem('food_delivery_restaurant_count', updated.length.toString());
  } catch (e) {
    console.error('Failed to sync new restaurant:', e);
  }

  return updated;
};
