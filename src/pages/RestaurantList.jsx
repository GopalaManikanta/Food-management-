import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
import { useCart } from '../context/CartContext';
import {
  Store,
  Search,
  Star,
  Clock,
  MapPin,
  Filter,
  ArrowUpDown,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  UtensilsCrossed,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

const RestaurantList = () => {
  const navigate = useNavigate();
  const { itemCount, subtotal, setIsCartOpen } = useCart();

  // Consume from RestaurantContext
  const {
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
    handleToggleStatus,
    handleOnboardSubmit,
    resetFilters,
    cuisines,
    itemsPerPage
  } = useRestaurant();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col select-none">
      
      {/* 1. PROFESSIONAL UNIFIED NAVBAR */}
      <Navbar />

      {/* 2. MAIN RESTAURANT LISTING CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Banner Section */}
        <div className="relative rounded-3xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 p-6 sm:p-8 text-white overflow-hidden shadow-xl">
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2 border border-white/25">
                <Store className="w-3.5 h-3.5 text-amber-200" />
                <span>Verified Partner Network</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Restaurant Partners Catalog 🏪
              </h2>
              <p className="text-sm text-orange-100 mt-1 max-w-xl">
                Browse, search, and manage verified restaurants. Click on any restaurant to view its full live menu, customer reviews, and kitchen operations.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/25 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider block text-orange-100">Total Partners</span>
                <span className="text-2xl font-black text-white">{restaurants.length}</span>
              </div>
              <button
                type="button"
                onClick={loadRestaurantData}
                disabled={isLoading}
                className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white transition cursor-pointer active:scale-95"
                title="Refresh API Data"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* 3. SEARCH & CONTROLS TOOLBAR */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
          
          {/* Top Bar: Search Input & Sort Dropdowns */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            
            {/* Search Input Box */}
            <div className="relative flex-1 max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurant name, cuisine, area (e.g. Biryani, Jubilee Hills)..."
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-slate-50 transition"
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

            {/* Controls: Rating, Status, Sort */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Rating Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="bg-transparent font-bold focus:outline-none cursor-pointer"
                >
                  <option value="0">All Ratings</option>
                  <option value="4.5">4.5+ ★ Only</option>
                  <option value="4.0">4.0+ ★ Only</option>
                  <option value="3.5">3.5+ ★ Only</option>
                </select>
              </div>

              {/* Status Filter (Open/Closed) */}
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-bold text-slate-600">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    statusFilter === 'all' ? 'bg-white text-orange-600 shadow-2xs font-black' : 'hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('open')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    statusFilter === 'open' ? 'bg-emerald-600 text-white shadow-2xs font-black' : 'hover:text-slate-900'
                  }`}
                >
                  Open Now
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('closed')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    statusFilter === 'closed' ? 'bg-rose-600 text-white shadow-2xs font-black' : 'hover:text-slate-900'
                  }`}
                >
                  Closed
                </button>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700">
                <ArrowUpDown className="w-3.5 h-3.5 text-orange-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-bold focus:outline-none cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="deliveryTime">Fastest Delivery</option>
                  <option value="deliveryCharge">Lowest Delivery Fee</option>
                </select>
              </div>

            </div>

          </div>

          {/* Cuisine Filter Pills Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Cuisines:
            </span>
            {cuisines.map((cuisine) => (
              <button
                key={cuisine}
                type="button"
                onClick={() => setSelectedCuisine(cuisine)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCuisine === cuisine
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>

        </div>

        {/* 4. ERROR STATE ALERT */}
        {errorMessage && (
          <div className="p-4 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <p className="text-xs sm:text-sm font-semibold">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={loadRestaurantData}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* 5. LOADING SKELETON STATE */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(itemsPerPage)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xs animate-pulse"
              >
                <div className="h-44 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                  <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                  <div className="flex justify-between pt-2">
                    <div className="h-4 bg-slate-200 rounded-md w-1/4" />
                    <div className="h-4 bg-slate-200 rounded-md w-1/4" />
                  </div>
                  <div className="h-8 bg-slate-200 rounded-xl w-full pt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedRestaurants.length === 0 ? (
          /* EMPTY SEARCH RESULTS STATE */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs">
            <div className="w-16 h-16 rounded-3xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-3">
              <Store className="w-8 h-8" />
            </div>
            <h3 className="font-black text-lg text-slate-900">No Restaurants Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No restaurant partners matched your search query or selected filters. Try resetting the filters.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-md shadow-orange-600/20 cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        ) : (
          /* 6. RESTAURANT CARDS GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {paginatedRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-xl hover:border-orange-200 transition-all duration-300 group flex flex-col cursor-pointer"
              >
                {/* Card Top: Image & Status Badges */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Dark gradient shadow overlay for badge readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Top Left: Open / Closed Status Pill */}
                  <div className="absolute top-3 left-3">
                    {restaurant.isOpen ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/90 text-white backdrop-blur-md shadow-md">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        Open Now
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold bg-slate-900/80 text-white backdrop-blur-md shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        Closed
                      </span>
                    )}
                  </div>

                  {/* Top Right: Rating Pill */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1 border border-white/40">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="font-black text-xs text-slate-900">{restaurant.rating}</span>
                  </div>

                  {/* Bottom Image Overlay: Delivery Fee & Time */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white font-bold">
                    <span className="flex items-center gap-1 drop-shadow-md">
                      <Clock className="w-3.5 h-3.5 text-orange-300" />
                      {restaurant.deliveryTime}
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold drop-shadow-md ${
                      restaurant.deliveryCharges === 0
                        ? 'bg-emerald-600 text-white'
                        : 'bg-black/50 text-white'
                    }`}>
                      {restaurant.deliveryCharges === 0 ? 'FREE DELIVERY' : `₹${restaurant.deliveryCharges} fee`}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Restaurant Name */}
                    <h3 className="font-black text-base text-slate-900 group-hover:text-orange-600 transition line-clamp-1">
                      {restaurant.name}
                    </h3>

                    {/* Cuisine Type */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <UtensilsCrossed className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-xs font-semibold text-slate-600 truncate">
                        {restaurant.cuisine}
                      </span>
                    </div>

                    {/* Location Address */}
                    <div className="flex items-center gap-1.5 mt-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="text-[11px] truncate text-slate-500">
                        {restaurant.address}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom: Admin Toggle Action & Details */}
                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    
                    {/* Admin Status Toggle Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(restaurant.id);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition cursor-pointer ${
                        restaurant.isOpen
                          ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                      }`}
                      title={restaurant.isOpen ? 'Set as Closed' : 'Set as Open'}
                    >
                      {restaurant.isOpen ? 'Set Closed' : 'Set Open'}
                    </button>

                    {/* View Full Menu & Details Link */}
                    <span className="text-xs font-extrabold text-orange-600 group-hover:underline flex items-center gap-0.5">
                      View Menu & Details →
                    </span>

                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* 7. PAGINATION CONTROLS */}
        {!isLoading && filteredAndSortedRestaurants.length > itemsPerPage && (
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            
            <p className="text-xs font-semibold text-slate-500">
              Showing <span className="font-bold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-bold text-slate-900">
                {Math.min(currentPage * itemsPerPage, filteredAndSortedRestaurants.length)}
              </span>{' '}
              of <span className="font-bold text-slate-900">{filteredAndSortedRestaurants.length}</span> restaurants
            </p>

            <div className="flex items-center gap-1.5">
              
              {/* Prev Button */}
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
                  currentPage === 1
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              {/* Page Number Pills */}
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
                  currentPage === totalPages
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>

          </div>
        )}

      </main>

      {/* 8. MODAL: ONBOARD NEW RESTAURANT */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsOnboardModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2.5 rounded-2xl bg-orange-100 text-orange-600">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Onboard Restaurant Partner</h3>
                <p className="text-xs text-slate-500">Register restaurant to live delivery network</p>
              </div>
            </div>

            <form onSubmit={handleOnboardSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Restaurant Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Spice Bistro"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Cuisine</label>
                  <select
                    value={newPartner.cuisine}
                    onChange={(e) => setNewPartner({ ...newPartner, cuisine: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                  >
                    {cuisines.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Time</label>
                  <input
                    type="text"
                    placeholder="25-30 mins"
                    value={newPartner.deliveryTime}
                    onChange={(e) => setNewPartner({ ...newPartner, deliveryTime: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Address / Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Road No 36, Jubilee Hills, Hyderabad"
                  value={newPartner.address}
                  onChange={(e) => setNewPartner({ ...newPartner, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 (Free Delivery)"
                    value={newPartner.deliveryCharges}
                    onChange={(e) => setNewPartner({ ...newPartner, deliveryCharges: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Specialty Dish</label>
                  <input
                    type="text"
                    placeholder="e.g. Special Dum Biryani"
                    value={newPartner.specialty}
                    onChange={(e) => setNewPartner({ ...newPartner, specialty: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOnboardModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition cursor-pointer"
                >
                  Onboard Partner
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
      
    </div>
  );
};

export default RestaurantList;
