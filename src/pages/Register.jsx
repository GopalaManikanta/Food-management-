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
      role: 'Customer',
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
      role: data.role,
      password: data.password
    });

    if (res.success) {
      toast.success(res.message);
      navigate('/dashboard');
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
            Create an account to start ordering delicious food
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
                Role
              </label>
              <select
                {...register('role')}
                className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/80 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
              >
                <option value="Customer">🍔 Customer</option>
                <option value="Admin">👨‍🍳 Restaurant Admin</option>
                <option value="Rider">🛵 Delivery Rider</option>
              </select>
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
                  placeholder="name@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter valid email'
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
                  placeholder="10-digit number"
                  maxLength={10}
                  {...register('phone', {
                    required: 'Mobile is required',
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: 'Valid 10-digit number'
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

          {/* Delivery Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Delivery Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. Flat 402, Jubilee Hills, Hyderabad"
                {...register('address', {
                  required: 'Delivery address is required'
                })}
                className={`w-full pl-10 pr-3 py-2.5 rounded-2xl border text-xs sm:text-sm transition focus:outline-none focus:ring-2 bg-slate-50/80 ${
                  errors.address
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/40'
                    : 'border-slate-200 focus:ring-orange-200 focus:border-orange-500'
                }`}
              />
            </div>
            {errors.address && (
              <p className="mt-0.5 text-xs text-rose-600 font-medium">{errors.address.message}</p>
            )}
          </div>

          {/* Password & Confirm Password with Show/Hide on BOTH */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Password */}
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
                    minLength: { value: 6, message: 'Min 6 characters' }
                  })}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-2xl border text-xs sm:text-sm transition focus:outline-none focus:ring-2 bg-slate-50/80 ${
                    errors.password
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/40'
                      : 'border-slate-200 focus:ring-orange-200 focus:border-orange-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-orange-600" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-0.5 text-xs text-rose-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
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
                  placeholder="Repeat password"
                  {...register('confirmPassword', {
                    required: 'Please confirm password',
                    validate: (val) => val === passwordValue || 'Passwords do not match'
                  })}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-2xl border text-xs sm:text-sm transition focus:outline-none focus:ring-2 bg-slate-50/80 ${
                    errors.confirmPassword
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/40'
                      : 'border-slate-200 focus:ring-orange-200 focus:border-orange-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4 text-orange-600" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-0.5 text-xs text-rose-600 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600">
              <input
                type="checkbox"
                {...register('agreeTerms', { required: 'You must agree to continue' })}
                className="w-3.5 h-3.5 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
              />
              <span>I agree to CraveDash terms & privacy policy</span>
            </label>
            {errors.agreeTerms && (
              <p className="mt-0.5 text-xs text-rose-600 font-medium">{errors.agreeTerms.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-orange-500 via-orange-600 to-rose-600 hover:from-orange-600 hover:to-rose-700 shadow-lg shadow-orange-500/30 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Account & Log In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs sm:text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-orange-600 hover:text-orange-700 transition inline-flex items-center gap-1"
            >
              Sign In <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
};

export default Register;
