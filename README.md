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

### 5. Dedicated Swiggy/Zomato Checkout (`/checkout`)
- **Apply Coupon Code:** 1-click apply, promo input validation, active coupon chip with remove action (`WELCOME50`, `CRAVE100`, `FEAST20`, `SWIGGY50`, `PARTY30`).
- **Dynamic Discount Calculation:** Real-time recalculation of percentage vs flat savings, threshold checks, free delivery progress meter.
- **Payment Summary:** Transparent bill breakdown (Item Total, Delivery Fee, Platform Fee ₹5, Govt. Taxes GST 5%, Coupon Discount, Grand Total).
- **Card Payment UI:** Live card brand auto-detection (Visa, Mastercard, RuPay, Amex), formatted number spacing, interactive 3D virtual card preview, expiry formatting, CVV toggle.
- **UPI Payment UI:** Instant 1-tap UPI apps grid (GPay, PhonePe, Paytm, CRED, BHIM), dynamic QR Code with 5-minute countdown, custom VPA/UPI ID with quick handle chips.
- **Digital Wallets UI:** Amazon Pay, Paytm, PhonePe, CraveDash Foodie Cash, MobiKwik with live balance check against grand total.
- **Payment Success Screen:** Celebratory checkmark, Order ID, Transaction ID (`TXN_CRV_...`), Bank Reference Number (RRN), and live order tracking CTA.
- **Payment Failure Screen:** Dedicated failure screen with decline reason, error codes, money safety guarantee, preserved cart, and retry/switch-to-COD options.

### 6. Order History & Tax Invoice (`/customer`, `/orders`, `/history`)
- **View Previous Orders:** Order cards with restaurant avatar, cuisine, order ID with 1-click copy, formatted timestamp, and live status badges.
- **Smart Search:** Search by dish (e.g., Biryani, Haleem, Dosa), restaurant, order ID, or address with quick suggestion chips and clear button.
- **Filter by Status:** Dynamic status pills (All, Delivered, Out for Delivery, Preparing, Cancelled) with live order count badges and sorting options.
- **1-Click Reorder:** Instantly repopulates the basket with original dishes and quantities, opens cart drawer, and shows toast feedback.
- **Order Details Modal:** Comprehensive inspection showing status timeline, restaurant info, delivery address & notes, itemized dish table, bill summary, and verified payment info.
- **Download Invoice (UI Only):** Official Tax Invoice & Cash Memo modal with CraveDash header, FSSAI Lic No: `13622011000456`, GSTIN: `36AAACC1206M1ZT`, SAC `996331`, CGST/SGST 2.5%, amount in words, authorized digital seal, and clean print-ready CSS (`window.print()`).

### 7. Customer Profile & Delivery Addresses (`/profile`)
- **Profile Management:** View and edit full name, email, phone number, and customizable preset avatars.
- **Delivery Address Book:** Add, edit, delete, and set primary delivery addresses (Home, Work, Other) with landmark and pincode.
- **Cross-Component Sync:** Saved addresses synchronize across Checkout, Cart Drawer, and Customer Portal in real time.

### 8. Food Basket & Cart System
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
