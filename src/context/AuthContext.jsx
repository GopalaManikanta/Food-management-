import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Seed demo users for testing (Food delivery roles: Customer, Admin, Rider)
const DEFAULT_USERS = [
  {
    id: 'user_cust_01',
    name: 'Rahul Sharma',
    email: 'customer@foodie.com',
    phone: '9876543210',
    password: 'Password@123',
    role: 'Customer',
    address: 'Flat 402, Jubilee Hills, Hyderabad - 500033',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user_admin_01',
    name: 'Vikram Oberoi',
    email: 'admin@foodie.com',
    phone: '9123456780',
    password: 'Password@123',
    role: 'Admin',
    restaurantName: 'The Royal Spice Kitchen',
    address: 'Plot 18, HITEC City, Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user_rider_01',
    name: 'Suresh Kumar',
    email: 'rider@foodie.com',
    phone: '9988776655',
    password: 'Password@123',
    role: 'Rider',
    address: 'Madhapur Main Road, Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString()
  }
];

export const AuthProvider = ({ children }) => {
  // 1. Initial registered users list from LocalStorage
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const stored = localStorage.getItem('food_delivery_registered_users');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  });

  // 2. Active logged-in user session from LocalStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('food_delivery_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Persist registered users whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('food_delivery_registered_users', JSON.stringify(registeredUsers));
    } catch (err) {
      console.error('Failed to sync registered users to localStorage:', err);
    }
  }, [registeredUsers]);

  // Persist or clear current user session in LocalStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('food_delivery_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('food_delivery_user');
      }
    } catch (err) {
      console.error('Failed to sync user session to localStorage:', err);
    }
  }, [currentUser]);

  // Login Handler (Supports Email or 10-digit Phone)
  const login = (identifier, password) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    const user = registeredUsers.find((u) => {
      const matchEmail = u.email && u.email.toLowerCase() === cleanId;
      const matchPhone = u.phone && u.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, '');
      return (matchEmail || matchPhone) && u.password === cleanPassword;
    });

    if (user) {
      const session = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '9876543210',
        role: user.role || 'Customer',
        address: user.address || 'H.No 12, Main Street',
        avatar: user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
        loggedInAt: new Date().toISOString()
      };

      setCurrentUser(session);
      return {
        success: true,
        message: `Welcome back, ${user.name}! 🍕`,
        user: session
      };
    }

    return {
      success: false,
      message: 'Invalid credentials. Please verify your email/phone and password.'
    };
  };

  // Register Handler
  const register = (userData) => {
    const emailClean = (userData.email || '').trim().toLowerCase();
    const phoneClean = (userData.phone || '').trim().replace(/\D/g, '');

    // Duplicate checks
    const duplicateEmail = registeredUsers.some(
      (u) => u.email && u.email.toLowerCase() === emailClean
    );
    if (duplicateEmail) {
      return { success: false, message: 'This email is already registered. Please log in.' };
    }

    if (phoneClean) {
      const duplicatePhone = registeredUsers.some(
        (u) => u.phone && u.phone.replace(/\D/g, '') === phoneClean
      );
      if (duplicatePhone) {
        return { success: false, message: 'This mobile number is already linked to an account.' };
      }
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name: userData.name.trim(),
      email: emailClean,
      phone: phoneClean || userData.phone || '',
      password: userData.password,
      role: userData.role || 'Customer',
      address: userData.address ? userData.address.trim() : 'Default Delivery Location',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`,
      createdAt: new Date().toISOString()
    };

    setRegisteredUsers((prev) => [newUser, ...prev]);

    // Automatically create session upon registration
    const session = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      address: newUser.address,
      avatar: newUser.avatar,
      loggedInAt: new Date().toISOString()
    };
    setCurrentUser(session);

    return {
      success: true,
      message: `Account created successfully! Welcome, ${newUser.name}! 🎉`,
      user: session
    };
  };

  // Forgot / Reset Password Handler
  const forgotPassword = (identifier, newPassword) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPhone = cleanId.replace(/\D/g, '');

    const userIndex = registeredUsers.findIndex((u) => {
      const matchEmail = u.email && u.email.toLowerCase() === cleanId;
      const matchPhone = cleanPhone && u.phone && u.phone.replace(/\D/g, '') === cleanPhone;
      return matchEmail || matchPhone;
    });

    if (userIndex === -1) {
      return {
        success: false,
        message: 'No registered account found with this email or mobile number.'
      };
    }

    const updated = [...registeredUsers];
    updated[userIndex] = {
      ...updated[userIndex],
      password: newPassword,
      updatedAt: new Date().toISOString()
    };

    setRegisteredUsers(updated);

    return {
      success: true,
      message: 'Password reset successful! You can now log in with your new password. 🔐'
    };
  };

  // Logout Handler
  const logout = () => {
    setCurrentUser(null);
    return {
      success: true,
      message: 'Logged out successfully. Have a great day! 👋'
    };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        registeredUsers,
        login,
        register,
        forgotPassword,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
