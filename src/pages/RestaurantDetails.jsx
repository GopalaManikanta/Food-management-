import Navbar from '../components/Navbar';
import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
import { useCart } from '../context/CartContext';
import CartDrawer from '../components/CartDrawer';
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  ShieldCheck,
  Phone,
  PlusCircle,
  X,
  UtensilsCrossed,
  CheckCircle2,
  TrendingUp,
  Flame,
  Award,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

const RestaurantDetails = () => {
  const { id } = useParams();
  const { getRestaurantById, handleToggleStatus, handleAddDishToMenu } = useRestaurant();
  const { addToCart, updateQuantity, getItemQuantity, itemCount, subtotal, setIsCartOpen } = useCart();

  const restaurant = getRestaurantById(id);

  // Active Tab: 'menu' | 'reviews' | 'operations'
  const [activeTab, setActiveTab] = useState('menu');

  // Menu Filters
  const [menuFilter, setMenuFilter] = useState('all'); // 'all' | 'veg' | 'nonveg' | 'bestseller'
  const [menuSearch, setMenuSearch] = useState('');

  // Add Dish Modal
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [newDish, setNewDish] = useState({
    name: '',
    category: 'Mains',
    price: '',
    isVeg: true,
    isBestseller: false,
    description: '',
    prepTime: '20 mins',
    image: ''
  });

  // Filtered Menu Items
  const filteredMenu = useMemo(() => {
    const list = restaurant?.menu || [];
    return list.filter((dish) => {
      // Veg/Non-Veg Filter
      if (menuFilter === 'veg' && !dish.isVeg) return false;
      if (menuFilter === 'nonveg' && dish.isVeg) return false;
      if (menuFilter === 'bestseller' && !dish.isBestseller) return false;

      // Search Query
      if (menuSearch.trim()) {
        const q = menuSearch.toLowerCase().trim();
        return (
          dish.name.toLowerCase().includes(q) ||
          dish.category.toLowerCase().includes(q) ||
          (dish.description && dish.description.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [restaurant?.menu, menuFilter, menuSearch]);

  // Group menu by categories
  const menuCategories = useMemo(() => {
    const categories = {};
    filteredMenu.forEach((dish) => {
      const cat = dish.category || 'Specialties';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(dish);
    });
    return categories;
  }, [filteredMenu]);

  // Add Dish Submit
  const handleDishSubmit = (e) => {
    e.preventDefault();
    if (!newDish.name.trim() || !newDish.price) return;

    handleAddDishToMenu(restaurant.id, newDish);
    setIsAddDishModalOpen(false);
    setNewDish({
      name: '',
      category: 'Mains',
      price: '',
      isVeg: true,
      isBestseller: false,
      description: '',
      prepTime: '20 mins',
      image: ''
    });
  };

  // If Restaurant not found
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Restaurant Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">
            The requested restaurant partner could not be located or has been removed.
          </p>
          <div className="mt-6">
            <Link
              to="/restaurants"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-md shadow-orange-600/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Restaurant Directory</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col select-none">
      
            {/* 1. PROFESSIONAL UNIFIED NAVBAR */}
      <Navbar />

      {/* Sub-bar with Back Button & Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition text-xs font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Restaurants</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link to="/dashboard" className="hover:text-slate-700">Dashboard</Link>
            <span>/</span>
            <Link to="/restaurants" className="hover:text-slate-700">Restaurants</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold truncate max-w-[200px]">{restaurant.name}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleToggleStatus(restaurant.id)}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
            restaurant.isOpen
              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${restaurant.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span>{restaurant.isOpen ? 'Set as Closed' : 'Set as Open'}</span>
        </button>
      </div>

      {/* 2. IMMERSIVE HERO SHOWCASE BANNER */}
      <div className="relative bg-slate-900 text-white overflow-hidden">
        
        {/* Backdrop Image with Dark Ambient Gradient */}
        <div className="absolute inset-0">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover opacity-35 filter blur-xs scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-black/60" />
        </div>

        {/* Content Box */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Restaurant Profile Thumbnail */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl shrink-0">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-white shadow-md ${
                restaurant.isOpen ? 'bg-emerald-600' : 'bg-rose-600'
              }`}>
                {restaurant.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>

            {/* Restaurant Titles & Meta */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-600/90 text-white backdrop-blur-md">
                  {restaurant.cuisine}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-emerald-300 border border-white/15">
                  <ShieldCheck className="w-3.5 h-3.5" /> FSSAI Certified
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
                {restaurant.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  {restaurant.address}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-orange-400" />
                  {restaurant.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Key Metrics Pill Card */}
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-white/20 flex items-center justify-around sm:justify-between gap-6 text-center shrink-0">
            <div>
              <div className="flex items-center justify-center gap-1 text-amber-400 font-black text-lg">
                <Star className="w-5 h-5 fill-amber-400" />
                <span>{restaurant.rating}</span>
              </div>
              <span className="text-[10px] text-slate-300 block font-medium">
                {restaurant.reviewCount}+ Ratings
              </span>
            </div>

            <div className="w-px h-8 bg-white/20" />

            <div>
              <div className="flex items-center justify-center gap-1 text-white font-black text-lg">
                <Clock className="w-4 h-4 text-orange-400" />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <span className="text-[10px] text-slate-300 block font-medium">Delivery Time</span>
            </div>

            <div className="w-px h-8 bg-white/20" />

            <div>
              <div className="font-black text-lg text-emerald-400">
                {restaurant.deliveryCharges === 0 ? 'FREE' : `₹${restaurant.deliveryCharges}`}
              </div>
              <span className="text-[10px] text-slate-300 block font-medium">Delivery Fee</span>
            </div>
          </div>

        </div>

      </div>

      {/* 3. SWIGGY / ZOMATO STYLE STICKY TAB BAR */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 sm:gap-6 text-xs sm:text-sm font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('menu')}
              className={`py-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'menu'
                  ? 'border-orange-600 text-orange-600 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Full Menu ({restaurant.menu?.length || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`py-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'reviews'
                  ? 'border-orange-600 text-orange-600 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Star className="w-4 h-4 fill-current" />
              <span>Reviews & Ratings ({restaurant.reviews?.length || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('operations')}
              className={`py-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'operations'
                  ? 'border-orange-600 text-orange-600 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Partner Operations</span>
            </button>
          </div>

          {/* Quick Action: Add Dish Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddDishModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-md shadow-orange-600/20 cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Add Dish</span>
            </button>
          </div>

        </div>
      </div>

      {/* 4. MAIN CONTENT AREA ACCORDING TO ACTIVE TAB */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">

        {/* TAB 1: LIVE MENU CATALOG */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            
            {/* Menu Filters & Search Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              {/* Veg / Non-Veg & Bestseller Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button
                  type="button"
                  onClick={() => setMenuFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    menuFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Items ({restaurant.menu?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setMenuFilter('bestseller')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                    menuFilter === 'bestseller'
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>Bestsellers</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMenuFilter('veg')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    menuFilter === 'veg'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-sm border-2 border-emerald-600 flex items-center justify-center p-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  </span>
                  <span>Pure Veg</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMenuFilter('nonveg')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    menuFilter === 'nonveg'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-sm border-2 border-rose-600 flex items-center justify-center p-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                  </span>
                  <span>Non-Veg</span>
                </button>
              </div>

              {/* Dish Search Input */}
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  placeholder="Search in menu..."
                  className="w-full pl-3.5 pr-8 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300 bg-slate-50"
                />
                {menuSearch && (
                  <button
                    type="button"
                    onClick={() => setMenuSearch('')}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>

            {/* Dishes by Category List */}
            {Object.keys(menuCategories).length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center shadow-2xs">
                <UtensilsCrossed className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">No dishes found</h4>
                <p className="text-xs text-slate-400 mt-0.5">Try searching for another dish or reset filters.</p>
              </div>
            ) : (
              Object.entries(menuCategories).map(([categoryName, dishes]) => (
                <div key={categoryName} className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-2xs space-y-4">
                  
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                      <span>{categoryName}</span>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {dishes.length}
                      </span>
                    </h3>
                  </div>

                  {/* Dishes Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dishes.map((dish) => (
                      <div
                        key={dish.id}
                        className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-orange-200 hover:shadow-md transition flex items-start justify-between gap-4 group"
                      >
                        {/* Dish Details */}
                        <div className="space-y-1.5 flex-1">
                          
                          <div className="flex items-center gap-2">
                            {/* Veg / Non-Veg Icon */}
                            <span className={`w-3.5 h-3.5 rounded-xs border-2 flex items-center justify-center ${
                              dish.isVeg ? 'border-emerald-600' : 'border-rose-600'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${dish.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                            </span>

                            {dish.isBestseller && (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800">
                                <Flame className="w-2.5 h-2.5 fill-current" /> Bestseller
                              </span>
                            )}
                          </div>

                          <h4 className="font-black text-sm text-slate-900 group-hover:text-orange-600 transition">
                            {dish.name}
                          </h4>

                          <div className="font-black text-sm text-slate-900">
                            ₹{dish.price}
                          </div>

                          {dish.description && (
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                              {dish.description}
                            </p>
                          )}

                          <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              <b className="text-slate-700">{dish.rating || 4.8}</b>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {dish.prepTime || '20 mins'}
                            </span>
                          </div>

                        </div>

                        {/* Dish Image & Add Control */}
                        <div className="flex flex-col items-center gap-2 shrink-0">
                          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-200 shadow-inner">
                            <img
                              src={dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}
                              alt={dish.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          </div>

                          {/* Swiggy / Zomato style ADD button or +/- counter */}
                          {restaurant.isOpen === false ? (
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">
                              Closed
                            </span>
                          ) : getItemQuantity(dish.id) > 0 ? (
                            <div className="flex items-center gap-2 bg-orange-600 text-white px-2 py-1 rounded-xl shadow-md shadow-orange-600/20">
                              <button
                                type="button"
                                onClick={() => updateQuantity(dish.id, -1)}
                                className="p-0.5 hover:bg-orange-700 rounded-md transition cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-black w-4 text-center">{getItemQuantity(dish.id)}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(dish.id, 1)}
                                className="p-0.5 hover:bg-orange-700 rounded-md transition cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => addToCart(dish, restaurant)}
                              className="px-4 py-1 rounded-xl bg-white hover:bg-orange-50 border-2 border-orange-500 text-orange-600 text-xs font-black uppercase tracking-wider transition shadow-2xs hover:shadow active:scale-95 cursor-pointer"
                            >
                              ADD +
                            </button>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              ))
            )}

          </div>
        )}

        {/* TAB 2: REVIEWS & RATINGS */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Rating Summary Card */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-4 h-fit">
              <h3 className="font-black text-base text-slate-900">Customer Ratings</h3>
              
              <div className="text-center py-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                <div className="text-4xl font-black text-orange-600">{restaurant.rating}</div>
                <div className="flex justify-center gap-1 text-amber-500 my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-orange-950 font-semibold">
                  Based on {restaurant.reviewCount} customer orders
                </span>
              </div>

              {/* Progress bars */}
              <div className="space-y-2 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-6">5 ★</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[85%]" />
                  </div>
                  <span className="w-8 text-right text-slate-400">85%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6">4 ★</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-[10%]" />
                  </div>
                  <span className="w-8 text-right text-slate-400">10%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6">3 ★</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full w-[3%]" />
                  </div>
                  <span className="w-8 text-right text-slate-400">3%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6">2 ★</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-full w-[1%]" />
                  </div>
                  <span className="w-8 text-right text-slate-400">1%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6">1 ★</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full w-[1%]" />
                  </div>
                  <span className="w-8 text-right text-slate-400">1%</span>
                </div>
              </div>
            </div>

            {/* Customer Reviews List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-black text-lg text-slate-900">Recent Customer Reviews</h3>

              {restaurant.reviews && restaurant.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-400 to-rose-500 text-white flex items-center justify-center font-bold text-xs">
                        {rev.user.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{rev.user}</h4>
                        <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-xl font-bold text-xs border border-emerald-200">
                      <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    "{rev.comment}"
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Order Completed</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: OPERATIONAL & PARTNER INFO */}
        {activeTab === 'operations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Operational Timing & Kitchen Info */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span>Operating Schedule & Location</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Daily Hours:</span>
                  <span className="font-extrabold text-slate-800">{restaurant.timing}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Kitchen Phone:</span>
                  <span className="font-extrabold text-slate-800">{restaurant.phone}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 flex justify-between items-center">
                  <span className="text-slate-400 font-bold">FSSAI License:</span>
                  <span className="font-mono font-bold text-slate-800">#{restaurant.fssai}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Delivery Radius:</span>
                  <span className="font-extrabold text-slate-800">7.5 km radius</span>
                </div>
              </div>
            </div>

            {/* Platform Partnership & Financials */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>Platform Partnership Details</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Partner Status:</span>
                  <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active Contract
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Platform Commission:</span>
                  <span className="font-extrabold text-slate-800">{restaurant.commission || '15%'}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 flex justify-between items-center">
                  <span className="text-slate-400 font-bold">General Manager:</span>
                  <span className="font-extrabold text-slate-800">{restaurant.manager || 'Vikram Oberoi'}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Estimated Cost for Two:</span>
                  <span className="font-extrabold text-slate-800">₹{restaurant.costForTwo} approx.</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* 5. MODAL: ADD DISH TO RESTAURANT */}
      {isAddDishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsAddDishModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2.5 rounded-2xl bg-orange-100 text-orange-600">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Add Dish to Menu</h3>
                <p className="text-xs text-slate-500">Adding to {restaurant.name}</p>
              </div>
            </div>

            <form onSubmit={handleDishSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tandoori Butter Roti / Paneer Tikka"
                  value={newDish.name}
                  onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newDish.category}
                    onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Breads & Rice">Breads & Rice</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="249"
                    value={newDish.price}
                    onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
              </div>

              {/* Veg / Non-Veg Toggle & Bestseller Checkbox */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={newDish.isVeg}
                    onChange={(e) => setNewDish({ ...newDish, isVeg: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>Pure Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-700">
                  <input
                    type="checkbox"
                    checked={newDish.isBestseller}
                    onChange={(e) => setNewDish({ ...newDish, isBestseller: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span>Mark Bestseller 🔥</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Freshly prepared with authentic ingredients..."
                  value={newDish.description}
                  onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddDishModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition cursor-pointer"
                >
                  Add to Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING BOTTOM BASKET BAR */}
      {itemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 sm:w-96 z-30 animate-slideUp select-none">
          <div className="bg-slate-900 text-white p-3.5 px-5 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-600 text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black">{itemCount} {itemCount === 1 ? 'item' : 'items'} in Basket</p>
                <p className="text-[11px] text-slate-300 font-bold">Subtotal: ₹{subtotal}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-orange-600/30 active:scale-95 cursor-pointer"
            >
              <span>View Basket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* SLIDE-OVER CART DRAWER */}
      <CartDrawer />

    </div>
  );
};

export default RestaurantDetails;
