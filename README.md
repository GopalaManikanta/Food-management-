# CraveDash - Food Delivery Management System

A responsive, production-ready Food Delivery Management & Customer Ordering Platform built with **React 19 (Vite)**, **Tailwind CSS**, and **Context API**.

## 🚀 Tech Stack
- **Frontend Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS (v4)
- **Routing:** React Router v7
- **Form Management:** React Hook Form
- **Global State Management:** Context API (`AuthContext`, `RestaurantContext`, `CartContext`)
- **API Client:** Axios
- **Notifications:** React Toastify
- **Storage:** Browser LocalStorage for sessions, cart, and real-time order synchronization
- **Icons:** Lucide React

## 📦 Core Modules & Features

### 1. Authentication & Role-Based Access Control
- **Roles:** Dedicated `Admin` and `Customer` roles.
- **Login:** Email or 10-digit mobile number login with 1-Click Demo Fill buttons:
  - **Admin Demo:** `admin@foodie.com` / `Password@123` (Vikram Oberoi)
  - **Customer Demo:** `customer@foodie.com` / `Password@123` (Rahul Sharma)
- **Registration:** Sign up with role selection (`Customer` or `Admin`).
- **Forgot Password:** 2-step account recovery with real-time password reset.
- **Guarded Routes:** Role-specific route protection (`/dashboard` for Admin, `/customer` for Customer).

### 2. Admin Operations Dashboard (`/dashboard`)
- **Real-Time KPI Counters:** Total Restaurants, Food Items, Total Orders, Active Orders, Delivered Orders, and Unique Customers.
- **Revenue Summary & Audit:** Gross revenue, platform fee (15%), restaurant payout, and delivery partner pool with period filters (Today, This Week, This Month, All Time) and CSV export.
- **Real-time Order Processing:** Live order intake from checkout with instant kitchen dispatch.
- **Quick Actions:** Add food items, onboard restaurants, and reset state.

### 3. Restaurant Catalog (`/restaurants`)
- **Listing:** Third-party API integration with curated Hyderabad partner fallback.
- **Search & Filters:** Search by name/dishes, filter by cuisine pills, filter by minimum rating (4.5+, 4.0+, 3.5+), and open/closed status.
- **Sorting:** Popularity, rating, fastest delivery time, and lowest delivery fee.
- **Pagination:** Clean 8-card pagination.
- **Partner Onboarding:** Add new restaurants with custom cuisines, pricing, and delivery fees.

### 4. Interactive Restaurant Details (`/restaurants/:id`)
- **Hero Banner:** Restaurant banner, FSSAI verification badge, contact info, and open/closed live toggle.
- **Full Menu Catalog:** Filter dishes by Pure Veg, Non-Veg, Bestsellers, or dish search.
- **Interactive Add to Cart:** Swiggy-style `ADD +` buttons and `[-] [qty] [+]` counters directly on dish cards.
- **Customer Reviews:** 5-star rating breakdown bars and verified customer reviews.
- **Partner Operations:** Operating schedule, delivery coverage zones, and compliance details.
- **Admin Dish Creation:** Add new dishes directly to any restaurant's live menu.

### 5. Customer Portal & Live Tracking (`/customer`)
- **Live Order Progress Stepper:** Real-time 4-stage tracking (`Confirmed` ➔ `Kitchen Prep` ➔ `On the Way` ➔ `Delivered`).
- **Delivery Partner Info:** Rider name, vehicle number, and Call Rider action.
- **Order History & Reorder:** View past orders with 1-click reorder to immediately refill the cart.
- **Tax Invoice Receipt:** Itemized breakdown including GST (5%) and platform charges.
- **Saved Delivery Addresses:** Manage home and office delivery addresses.

### 6. Food Basket & Cart System
- **Floating Basket Bar:** Bottom notification bar indicating cart items and subtotal.
- **Slide-Over Drawer:** Quantity adjustments, delivery address editor, and payment methods (UPI, Card, Cash on Delivery).
- **Two-Way Real-Time Sync:** Customer orders appear instantly on the Admin Dashboard; Admin status updates reflect instantly on the Customer live tracker.

## 🛠️ Run Locally
```bash
npm install
npm run dev
```

## 🏗️ Production Build
```bash
npm run build
```
