# CraveDash - Food Delivery Management System

A responsive, modern Food Delivery Management Dashboard built with **React (Vite)**, **Tailwind CSS**, and **Context API**.

## 🚀 Tech Stack
- **Frontend Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router v7
- **Form Management:** React Hook Form
- **Global State Management:** Context API (AuthContext)
- **Notifications:** React Toastify
- **Storage:** Browser LocalStorage for sessions & real-time order state
- **Icons:** Lucide React

## 📦 Features
- **Authentication Module:**
  - Login with Email / 10-Digit Mobile Number
  - 1-Click Quick Admin Demo Login
  - Show / Hide Password toggle
  - Form validation with error handling
  - Registration with auto-login (Admin role)
  - 2-Step Forgot Password recovery UI
  - Protected Routes (`/dashboard` guarded)
  - Logout with session clearance
- **Interactive Dashboard:**
  - Real-time KPI Counters (Total Restaurants, Food Items, Total Orders, Active Orders, Delivered Orders, Total Customers)
  - Revenue Summary (Interactive period filters: Today, This Week, This Month, All Time)
  - Quick Action Cards (Add Food Item, Create Mock Order, Onboard Restaurant, Revenue Breakdown)
  - Recent Orders Management (Search, Filter by Active/Delivered/Cancelled, Advance Order Status in real time)
  - Clean Empty State UI when system starts at 0

## 🛠️ Run Locally
```bash
npm install
npm run dev
```
