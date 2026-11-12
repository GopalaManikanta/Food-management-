import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Seed demo users for both Admin and Customer roles
const DEFAULT_USERS = [
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
    id: 'user_customer_01',
    name: 'Rahul Sharma',
    email: 'customer@foodie.com',
    phone: '9876543210',
    password: 'Password@123',
    role: 'Customer',
    address: 'Flat 402, Lotus Residency, Road No. 36, Jubilee Hills, Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
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
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasAdmin = parsed.some((u) => u.email === 'admin@foodie.com');
          const hasCustomer = parsed.some((u) => u.email === 'customer@foodie.com');
          let merged = [...parsed];
          if (!hasAdmin) merged.push(DEFAULT_USERS[0]);
          if (!hasCustomer) merged.push(DEFAULT_USERS[1]);
          return merged;
        }
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
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.role === 'Admin' || parsed.role === 'Customer')) {
          return parsed;
        }
      }
      return {
        id: DEFAULT_USERS[0].id,
        name: DEFAULT_USERS[0].name,
        email: DEFAULT_USERS[0].email,
        phone: DEFAULT_USERS[0].phone,
        role: DEFAULT_USERS[0].role,
        address: DEFAULT_USERS[0].address,
        restaurantName: DEFAULT_USERS[0].restaurantName,
        avatar: DEFAULT_USERS[0].avatar,
        loggedInAt: new Date().toISOString()
      };
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

  // Login Handler (Supports Email or 10-digit Phone for Admin or Customer)
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
        address: user.address || (user.role === 'Admin' ? 'Plot 18, Software Units Layout, HITEC City, Hyderabad - 500081' : 'Flat 402, Lotus Residency, Road No. 36, Jubilee Hills, Hyderabad'),
        restaurantName: user.restaurantName || (user.role === 'Admin' ? 'The Royal Spice Kitchen' : ''),
        avatar: user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
        loggedInAt: new Date().toISOString()
      };

      setCurrentUser(session);
      return {
        success: true,
        message: `Welcome back, ${session.role === 'Admin' ? 'Admin ' : ''}${user.name}! ${session.role === 'Admin' ? '👨‍🍳' : '👋'}`,
        user: session
      };
    }

    return {
      success: false,
      message: 'Invalid credentials. Please verify your email/phone and password.'
    };
  };

  // Register Handler (Supports Customer and Admin role)
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

    const assignedRole = userData.role === 'Admin' ? 'Admin' : 'Customer';

    const newUser = {
      id: `${assignedRole.toLowerCase()}_${Date.now()}`,
      name: userData.name.trim(),
      email: emailClean,
      phone: phoneClean || userData.phone || '',
      password: userData.password,
      role: assignedRole,
      address: userData.address ? userData.address.trim() : (assignedRole === 'Admin' ? 'Admin Operations HQ, Hyderabad' : 'Flat 402, Jubilee Hills, Hyderabad'),
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

  // Quick Role Switcher (Admin <-> Customer)
  const switchRole = (targetRole) => {
    if (!currentUser) return;
    const nextRole = targetRole || (currentUser.role === 'Admin' ? 'Customer' : 'Admin');
    const demoUser = DEFAULT_USERS.find((u) => u.role === nextRole) || DEFAULT_USERS[0];
    
    const updated = {
      ...currentUser,
      role: nextRole,
      name: demoUser.name,
      email: demoUser.email,
      phone: demoUser.phone,
      address: demoUser.address,
      restaurantName: demoUser.restaurantName,
      avatar: demoUser.avatar
    };
    setCurrentUser(updated);
    toast.info(`Switched to ${nextRole} View! 🔄`);
    return updated;
  };

  // Update Profile Handler (Name, Email, Phone, Avatar, Address)
  const updateUserProfile = (updatedData) => {
    if (!currentUser) return { success: false, message: 'No active user session found.' };

    const updatedUser = {
      ...currentUser,
      ...updatedData
    };

    setCurrentUser(updatedUser);

    // Sync registeredUsers array
    setRegisteredUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id || (u.email && u.email.toLowerCase() === currentUser.email?.toLowerCase())) {
          return { ...u, ...updatedData };
        }
        return u;
      })
    );

    // Persist immediately in localStorage
    try {
      localStorage.setItem('food_delivery_user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('food_delivery_user_updated'));
    } catch (e) {
      console.error('Failed to sync updated user to localStorage:', e);
    }

    return {
      success: true,
      message: 'Profile updated successfully! ✨',
      user: updatedUser
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
        switchRole,
        updateUserProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
