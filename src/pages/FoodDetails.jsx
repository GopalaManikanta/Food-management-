import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMenu } from '../context/MenuContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ArrowLeft,
  UtensilsCrossed,
  Clock,
  Store,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  ShieldCheck,
  Star,
  AlertCircle,
  X,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'Admin';

  const { getMenuItemById, editMenuItem, deleteMenuItem, toggleAvailability, categories } = useMenu();
  const { addToCart, updateQuantity, getItemQuantity, itemCount, subtotal, setIsCartOpen } = useCart();

  const item = getMenuItemById(id);

  // Edit Modal State (Admin)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [formData, setFormData] = useState(() => ({
    name: item?.name || '',
    image: item?.image || '',
    description: item?.description || '',
    price: item?.price || '',
    category: item?.category || 'Biryani',
    isVeg: item?.isVeg !== undefined ? item.isVeg : true,
    isAvailable: item?.isAvailable !== undefined ? item.isAvailable : true,
    restaurantName: item?.restaurantName || 'Paradise Royale Biryani',
    prepTime: item?.prepTime || '20 mins'
  }));

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col select-none">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Food Item Not Found</h2>
              <p className="text-xs text-slate-500 mt-1">
                The requested menu dish could not be found or has been removed from the catalog.
              </p>
            </div>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-md shadow-orange-600/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Menu Catalog</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Open Edit Modal with fresh data (Admin)
  const handleOpenEdit = () => {
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
    setIsEditModalOpen(true);
  };

  // Submit Edit (Admin)
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) return;
    editMenuItem(item.id, formData);
    setIsEditModalOpen(false);
  };

  // Confirm Delete (Admin)
  const handleConfirmDelete = () => {
    deleteMenuItem(item.id);
    navigate('/menu');
  };

  // Customer Add to Cart
  const handleCustomerAddToCart = () => {
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

  const inCartQty = getItemQuantity(item.id);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col select-none">
      
      {/* 1. UNIFIED NAVBAR */}
      <Navbar />

      {/* 2. MAIN DETAILS */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24">
        
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-600 transition bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu Catalog</span>
          </Link>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenEdit}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs border border-orange-200 transition cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Dish</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* HERO CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0">
          
          {/* Left: Food Image */}
          <div className="relative h-72 sm:h-96 md:h-full bg-slate-100 overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            
            {/* Diet Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className={`w-6 h-6 rounded-md bg-white border-2 flex items-center justify-center shadow-md ${
                item.isVeg ? 'border-emerald-600' : 'border-rose-600'
              }`}>
                <span className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
              </span>
              <span className="px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-xs font-black uppercase text-white tracking-wider">
                {item.category}
              </span>
            </div>

            {/* Price Badge */}
            <div className="absolute bottom-4 left-4 px-4 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-md text-white font-black text-xl shadow-lg">
              ₹{item.price}
            </div>
          </div>

          {/* Right: Details & Status Controls */}
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              
              {/* Partner Tag & Availability */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-orange-600">
                  <Store className="w-4 h-4 shrink-0" />
                  <span>{item.restaurantName}</span>
                </div>

                {/* Real-time Status Badge */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  item.isAvailable
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {item.isAvailable ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                  <span>{item.isAvailable ? 'In Stock (Available)' : 'Out of Stock'}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {item.name}
              </h1>

              {/* Meta row */}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-orange-600" />
                  <span>{item.prepTime || '20 mins'}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{item.rating || 4.8} (Verified Reviews)</span>
                </span>
                <span>•</span>
                <span className="text-emerald-700 font-bold">
                  {item.isVeg ? '🌱 Pure Vegetarian' : '🍗 Non-Vegetarian'}
                </span>
              </div>

              {/* Description */}
              <div className="pt-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1">
                  Description & Flavor Notes
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description || 'Deliciously prepared using fresh authentic ingredients, traditional culinary techniques, and balanced seasoning for a restaurant-grade taste.'}
                </p>
              </div>

              {/* Ordering Section (Customer & Admin) */}
                  {(
                <div className="pt-3">
                  {item.isAvailable === false ? (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
                      ⚠️ Currently Out of Stock. Orders for this dish are temporarily paused.
                    </div>
                  ) : inCartQty > 0 ? (
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-orange-50 border border-orange-200">
                      <div>
                        <span className="text-xs font-black text-orange-900 block">Item in Your Basket</span>
                        <span className="text-[11px] text-orange-700 font-medium">{inCartQty} portion{inCartQty > 1 ? 's' : ''} added (₹{inCartQty * item.price})</span>
                      </div>
                      <div className="flex items-center gap-3 bg-orange-600 text-white px-3 py-2 rounded-xl shadow-md shadow-orange-600/25">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-orange-700 rounded-md transition cursor-pointer"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-black w-5 text-center">{inCartQty}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-orange-700 rounded-md transition cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCustomerAddToCart}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white text-sm font-black shadow-xl shadow-orange-600/30 transition transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span>Add to Basket • ₹{item.price}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Admin Quick Status Toggle Button */}
              {isAdmin && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-slate-800">Real-Time Stock Availability</span>
                    <span className={`text-[11px] font-bold ${item.isAvailable ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.isAvailable ? 'Currently accepting orders' : 'Orders paused'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleAvailability(item.id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-2 shadow-xs ${
                      item.isAvailable
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
                    }`}
                  >
                    {item.isAvailable ? (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span>Click to Mark as Out of Stock</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Click to Restock (Mark In Stock)</span>
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>

            {/* Quality & Compliance Banner */}
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Standard FSSAI Compliance & Daily Fresh Preparation Verified</span>
            </div>

          </div>

        </div>

        {/* Nutritional & Kitchen Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dietary Standard</span>
            <span className="text-sm font-black text-slate-900">{item.isVeg ? '100% Pure Veg' : 'Non-Veg Recipe'}</span>
            <p className="text-[11px] text-slate-500">Cooked in dedicated kitchen section</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Prep Time</span>
            <span className="text-sm font-black text-slate-900">{item.prepTime || '20 mins'}</span>
            <p className="text-[11px] text-slate-500">Fast prep for delivery riders</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Menu Category</span>
            <span className="text-sm font-black text-slate-900">{item.category}</span>
            <p className="text-[11px] text-slate-500">Catalogued under {item.category}</p>
          </div>
        </div>

      </main>

      {/* 3. FLOATING BOTTOM BASKET BAR (FOR CUSTOMER) */}
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

      {/* 4. SLIDE-OVER CART DRAWER */}
      
      {/* 5. MODAL: EDIT FOOD ITEM (ADMIN) */}
      {isAdmin && isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                <Edit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Edit Food Details</h3>
                <p className="text-xs text-slate-400">Update pricing, description, and status for "{item.name}"</p>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Food Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">Food Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Restaurant Partner</label>
                  <input
                    type="text"
                    value={formData.restaurantName}
                    onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prep Time</label>
                  <input
                    type="text"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
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

                <div>
                  <span className="block font-bold text-slate-700 mb-1.5">Availability</span>
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
                    <span>{formData.isAvailable ? 'In Stock' : 'Out of Stock'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black shadow-md shadow-orange-600/25 transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: DELETE CONFIRMATION (ADMIN) */}
      {isAdmin && isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">Delete Menu Item?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to permanently delete <b className="text-slate-800">"{item.name}"</b>?
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
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

export default FoodDetails;
