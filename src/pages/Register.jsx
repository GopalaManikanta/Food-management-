import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  ChefHat,
  ArrowRight
} from 'lucide-react';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Customer');

  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      confirmPassword: '',
      agreeTerms: true
    }
  });

  const passwordValue = watch('password');

  const onSubmit = (data) => {
    const res = registerAuth({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      role: selectedRole,
      password: data.password
    });

    if (res.success) {
      toast.success(res.message);
      navigate(selectedRole === 'Customer' ? '/customer' : '/dashboard');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto select-none">
      
      {/* 100% FULL BACKGROUND IMAGE */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-all duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=2000&q=85')`
        }}
      />

      {/* Dark Ambient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-tr from-black/85 via-black/65 to-black/80" />

      {/* FLOATING CURVED SIGNUP CARD */}
      <div className="relative z-10 w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-[36px] sm:rounded-[44px] shadow-2xl border border-white/40 p-6 sm:p-9 text-slate-900 my-6 transition-all duration-300">
        
        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-600 text-white shadow-lg shadow-orange-500/30 mb-2">
            <ChefHat className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Join Crave<span className="text-orange-600">Dash</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create an account to explore food delivery or manage operations
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
          
          {/* Full Name & Account Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  {...register('name', {
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Min 2 characters' }
                  })}
                  className={`w-full pl-10 pr-3 py-2.5 rounded-2xl border text-xs sm:text-sm transition focus:outline-none focus:ring-2 bg-slate-50/80 ${
                    errors.name
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/40'
                      : 'border-slate-200 focus:ring-orange-200 focus:border-orange-500'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-0.5 text-xs text-rose-600 font-medium">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Account Role *
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedRole('Customer')}
                  className={`py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1 ${
                    selectedRole === 'Customer'
                      ? 'bg-orange-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('Admin')}
                  className={`py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1 ${
                    selectedRole === 'Admin'
                      ? 'bg-orange-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              </div>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="name@foodie.com"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address'
                    }
                  })}
                  className={`w-full pl-10 pr-3 py-2.5 rounded-2xl border text-xs sm:text-sm transition focus:outline-none focus:ring-2 bg-slate-50/80 ${
                    errors.email
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/40'
                      : 'border-slate-200 focus:ring-orange-200 focus:border-orange-500'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-0.5 text-xs text-rose-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  placeholder="9876543210"
                  {...register('phone', {
                    required: 'Mobile number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Enter exactly 10 digits'
                    }
                  })}
                  className={`w-full pl-10 pr-3 py-2.5 rounded-2xl border text-xs sm:text-sm transition focus:outline-none focus:ring-2 bg-slate-50/80 ${
                    errors.phone
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/40'
                      : 'border-slate-200 focus:ring-orange-200 focus:border-orange-500'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-0.5 text-xs text-rose-600 font-medium">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Delivery Address / Headquarters */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {selectedRole === 'Customer' ? 'Delivery Address (Hyderabad)' : 'Admin Headquarters Address'}
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder={selectedRole === 'Customer' ? 'Flat 402, Lotus Residency, Road No 36, Jubilee Hills' : 'Plot 18, HITEC City, Hyderabad'}
                {...register('address')}
                className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 bg-slate-50/80"
              />
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 chars"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'At least 6 characters' }
                  })}
                  className={`w-full pl-10 pr-9 py-2.5 rounded-2xl border text-xs sm:text-sm transition focus:outline-none focus:ring-2 bg-slate-50/80 ${
                    errors.password
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/40'
                      : 'border-slate-200 focus:ring-orange-200 focus:border-orange-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-0.5 text-xs text-rose-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter"
                  {...register('confirmPassword', {
                    required: 'Please confirm password',
                    validate: (val) => val === passwordValue || 'Passwords do not match'
                  })}
                  className={`w-full pl-10 pr-9 py-2.5 rounded-2xl border text-xs sm:text-sm transition focus:outline-none focus:ring-2 bg-slate-50/80 ${
                    errors.confirmPassword
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/40'
                      : 'border-slate-200 focus:ring-orange-200 focus:border-orange-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-0.5 text-xs text-rose-600 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('agreeTerms', {
                  required: 'You must agree to the Terms of Service'
                })}
                className="mt-0.5 w-4 h-4 rounded text-orange-600 focus:ring-orange-400 border-slate-300"
              />
              <span className="text-xs text-slate-600">
                I agree to the <span className="font-bold text-slate-800">CraveDash Terms & Food Safety Policy</span>.
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="mt-0.5 text-xs text-rose-600 font-medium">{errors.agreeTerms.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 mt-2"
          >
            <span>{isSubmitting ? 'Creating Account...' : `Register as ${selectedRole}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link to Login */}
        <div className="mt-5 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-extrabold text-orange-600 hover:underline">
            Sign In here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
