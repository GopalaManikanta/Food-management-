import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useMenu } from '../context/MenuContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Search,
  PlusCircle,
  Filter,
  ArrowUpDown,
  Edit,
  Trash2,
  X,
  Sparkles,
  ExternalLink,
  Clock,
  Store,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

const MenuManagement = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'Admin';

  const {
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
    categories,
    addMenuItem,
    editMenuItem,
    deleteMenuItem,
    toggleAvailability,
    resetFilters
  } = useMenu();

  const { addToCart, updateQuantity, getItemQuantity, itemCount, subtotal, setIsCartOpen } = useCart();

  // Modals State (Admin)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // item object or null
  const [deletingItem, setDeletingItem] = useState(null); // item object or null

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
    price: '',
    category: 'Biryani',
    isVeg: true,
    isAvailable: true,
    restaurantName: 'Paradise Royale Biryani',
    prepTime: '20 mins'
  });

  // Open Add Modal
  const openAddModal = () => {
    setFormData({
      name: '',
      image: '',
      description: '',
      price: '',
      category: 'Biryani',
      isVeg: true,
      isAvailable: true,
      restaurantName: 'Paradise Royale Biryani',
      prepTime: '20 mins'
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      image: item.image,
      description: item.description,
      price: item.price,
      category: item.category,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      restaurantName: item.restaurantName || 'Paradise Royale Biryani',
      prepTime: item.prepTime || '20 mins'
    });
  };

  // Handle Submit (Add or Edit)
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) return;

    if (editingItem) {
      editMenuItem(editingItem.id, formData);
      setEditingItem(null);
    } else {
      addMenuItem(formData);
      setIsAddModalOpen(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (deletingItem) {
      deleteMenuItem(deletingItem.id);
      setDeletingItem(null);
    }
  };

  // Helper for adding dish to customer cart
  const handleCustomerAddToCart = (item) => {
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        isVeg: item.isVeg,
        image: item.image
      },
      {
        id: item.restaurantName ? `rest-${encodeURIComponent(item.restaurantName)}` : 'rest-1',
        name: item.restaurantName || 'Paradise Royale Biryani'
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col select-none">
      
      {/* 1. UNIFIED NAVBAR */}
      <Navbar />

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24">
        
        {/* HERO BANNER */}
        <div className="relative rounded-3xl bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 p-6 sm:p-8 text-white overflow-hidden shadow-xl">
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{isAdmin ? 'Admin Catalog Control' : 'Live Food Delivery Hub'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                {isAdmin ? 'Menu Management 🍽️' : 'Explore Delicious Food Menu 🍽️'}
              </h1>
              <p className="text-xs sm:text-sm text-white/90 max-w-xl">
                {isAdmin
                  ? 'Organize dishes, manage real-time stock availability, edit descriptions, adjust prices, and add new menu items across your restaurant partners.'
                  : 'Craving something special? Browse chef-special dishes across top restaurant partners, add directly to your basket, and enjoy quick doorstep delivery!'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/25 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider block text-orange-100">Total Dishes</span>
                <span className="text-2xl font-black text-white">{filteredMenuItems.length}</span>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  onClick={openAddModal}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-orange-600 font-black text-xs shadow-lg hover:bg-orange-50 transition active:scale-95 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Food Item</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. SEARCH & CONTROLS TOOLBAR */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
          
          {/* Top Row: Search + Veg Filter + Availability + Price Sort */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            
            {/* Search Input Box */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food by name, category, or ingredients..."
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Veg / Non-Veg Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-bold text-slate-600">
                <button
                  type="button"
                  onClick={() => setVegFilter('all')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    vegFilter === 'all' ? 'bg-white text-orange-600 shadow-2xs font-black' : 'hover:text-slate-900'
                  }`}
                >
                  All Food
                </button>
                <button
                  type="button"
                  onClick={() => setVegFilter('veg')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                    vegFilter === 'veg' ? 'bg-emerald-600 text-white shadow-2xs font-black' : 'hover:text-slate-900'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-300" />
                  <span>Veg</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVegFilter('nonveg')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                    vegFilter === 'nonveg' ? 'bg-rose-600 text-white shadow-2xs font-black' : 'hover:text-slate-900'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-300" />
                  <span>Non-Veg</span>
                </button>
              </div>

              {/* Availability Filter */}
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
              >
                <option value="all">All Availability</option>
                <option value="available">In Stock Only</option>
                <option value="out_of_stock">Out of Stock Only</option>
              </select>

              {/* Sort by Price */}
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <ArrowUpDown className="w-3.5 h-3.5 text-orange-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-bold focus:outline-none cursor-pointer"
                >
                  <option value="default">Default Sort</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>

            </div>

          </div>

          {/* Category Carousel Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Categories:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* 4. DISHES GRID */}
        {filteredMenuItems.length === 0 ? (
          <div className="bg-white p-12 sm:p-16 rounded-3xl border border-slate-200 text-center space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-800">No Food Items Match Filters</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No items found for the selected category, veg/non-veg, or search keyword.
              </p>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="px-5 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold transition shadow-md shadow-orange-600/20 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredMenuItems.map((item) => {
              const inCartQty = getItemQuantity(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    
                    {/* Food Image with Badges */}
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Gradient Overlay for Top Badges */}
                      <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

                      {/* Veg / Non-Veg Indicator Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className={`w-5 h-5 rounded-md bg-white border-2 flex items-center justify-center shadow-xs ${
                          item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-black uppercase text-white tracking-wider">
                          {item.category}
                        </span>
                      </div>

                      {/* Stock Status Badge */}
                      {isAdmin ? (
                        <button
                          type="button"
                          onClick={() => toggleAvailability(item.id)}
                          className={`absolute top-3 right-3 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition shadow-md cursor-pointer flex items-center gap-1 ${
                            item.isAvailable
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                              : 'bg-rose-500 hover:bg-rose-600 text-white'
                          }`}
                          title="Click to toggle availability in real-time"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.isAvailable ? 'bg-white animate-pulse' : 'bg-white'}`} />
                          <span>{item.isAvailable ? 'In Stock' : 'Out of Stock'}</span>
                        </button>
                      ) : (
                        <span
                          className={`absolute top-3 right-3 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1 ${
                            item.isAvailable
                              ? 'bg-emerald-600/90 backdrop-blur-md text-white'
                              : 'bg-rose-600/90 backdrop-blur-md text-white'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.isAvailable ? 'bg-white' : 'bg-white'}`} />
                          <span>{item.isAvailable ? 'Available' : 'Out of Stock'}</span>
                        </span>
                      )}

                      {/* Price Tag Overlay at Bottom of Image */}
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-slate-900/85 backdrop-blur-md text-white font-black text-sm">
                        ₹{item.price}
                      </div>

                    </div>

                    {/* Body Content */}
                    <div className="p-4 sm:p-5 space-y-2">
                      
                      {/* Restaurant Tag */}
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-bold truncate">
                        <Store className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        <span className="truncate">{item.restaurantName}</span>
                      </div>

                      {/* Title */}
                      <Link
                        to={`/menu/${item.id}`}
                        className="block font-black text-sm text-slate-900 hover:text-orange-600 transition line-clamp-1"
                        title={item.name}
                      >
                        {item.name}
                      </Link>

                      {/* Description */}
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed min-h-[32px]">
                        {item.description || 'Freshly prepared specialty dish crafted with premium ingredients.'}
                      </p>

                      {/* Extra Meta */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.prepTime || '20 mins'}
                        </span>
                        <span className="font-bold text-amber-600">
                          ★ {item.rating || 4.8}
                        </span>
                      </div>

                    </div>

                  </div>

                  {/* Footer Action Buttons */}
                  <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                    
                    <Link
                      to={`/menu/${item.id}`}
                      className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition text-center flex items-center justify-center gap-1 shrink-0"
                    >
                      <span>Details</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </Link>

                    {/* Admin Management Buttons */}
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 transition cursor-pointer"
                          title="Edit Item"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingItem(item)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Cart Add / Quantity Counter for Both Admin & Customer */}
                    {item.isAvailable === false ? (
                      <span className="px-3 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold">
                        Unavailable
                      </span>
                    ) : inCartQty > 0 ? (
                      <div className="flex items-center gap-2 bg-orange-600 text-white px-2 py-1.5 rounded-xl shadow-md shadow-orange-600/20">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-0.5 hover:bg-orange-700 rounded-md transition cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black w-4 text-center">{inCartQty}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-0.5 hover:bg-orange-700 rounded-md transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleCustomerAddToCart(item)}
                        className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase tracking-wider transition shadow-md shadow-orange-600/20 active:scale-95 cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>ADD</span>
                      </button>
                    )}

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* 5. FLOATING BOTTOM BASKET BAR (FOR CUSTOMER) */}
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

      {/* 6. SLIDE-OVER CART DRAWER */}
      
      {/* 7. MODAL: ADD / EDIT MENU ITEM (ADMIN) */}
      {isAdmin && (isAddModalOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingItem(null);
              }}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">
                  {editingItem ? 'Edit Food Item' : 'Add New Menu Item'}
                </h3>
                <p className="text-xs text-slate-400">
                  {editingItem ? `Updating details for "${editingItem.name}"` : 'Add dish to the food delivery menu catalog'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              
              {/* Dish Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Food Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Nizami Chicken Dum Biryani"
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300 font-semibold"
                />
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="299"
                    className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Food Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ingredients, preparation style, allergen notes..."
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              {/* Restaurant & Prep Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Restaurant Partner</label>
                  <input
                    type="text"
                    value={formData.restaurantName}
                    onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                    placeholder="Paradise Royale"
                    className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prep Time</label>
                  <input
                    type="text"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                    placeholder="20 mins"
                    className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
              </div>

              {/* Veg / Non-Veg & Availability Toggles */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                
                {/* Veg Toggle */}
                <div>
                  <span className="block font-bold text-slate-700 mb-1.5">Diet Type</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isVeg: true })}
                      className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        formData.isVeg ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-300" />
                      <span>Veg</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isVeg: false })}
                      className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        !formData.isVeg ? 'bg-rose-600 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-300" />
                      <span>Non-Veg</span>
                    </button>
                  </div>
                </div>

                {/* Availability Toggle */}
                <div>
                  <span className="block font-bold text-slate-700 mb-1.5">Stock Status</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
                    className={`w-full py-1.5 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      formData.isAvailable
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-rose-600 text-white shadow-2xs'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{formData.isAvailable ? 'In Stock (Available)' : 'Out of Stock'}</span>
                  </button>
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black shadow-md shadow-orange-600/25 transition cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 8. MODAL: DELETE CONFIRMATION (ADMIN) */}
      {isAdmin && deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">Delete Menu Item?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete <b className="text-slate-800">"{deletingItem.name}"</b>? This will permanently remove it from the menu catalog.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MenuManagement;
