import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChefHat,
  User
} from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: true
    }
  });

  const onSubmit = (data) => {
    const res = login(data.identifier, data.password);
    if (res.success) {
      toast.success(res.message);
      if (from && from !== '/dashboard' && from !== '/customer') {
        navigate(from, { replace: true });
      } else {
        navigate(res.user?.role === 'Customer' ? '/customer' : '/dashboard', { replace: true });
      }
    } else {
      toast.error(res.message);
    }
  };

  const handleFillDemo = (email, password) => {
    setValue('identifier', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
    toast.info(`Filled credentials for ${email.split('@')[0]}`, { autoClose: 2000 });
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden select-none">
      
      {/* 100% FULL BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-all duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2000&q=85')`
        }}
      />

      {/* Dark Ambient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/60 to-black/75" />

      {/* FLOATING CURVED LOGIN CARD */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[36px] sm:rounded-[44px] shadow-2xl border border-white/40 p-6 sm:p-9 text-slate-900 transition-all duration-300">
        
        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-600 text-white shadow-lg shadow-orange-500/30 mb-2">
            <ChefHat className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Crave<span className="text-orange-600">Dash</span> Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Sign in to access Admin Operations or Customer Food Hub
          </p>
        </div>

        {/* 1-Click Quick Demo Fill Buttons (Admin & Customer) */}
        <div className="mb-5 p-3 rounded-2xl bg-orange-50/80 border border-orange-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-orange-950 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              1-Click Instant Demo:
            </span>
            <span className="text-[10px] text-orange-600 font-semibold">Select Role</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('admin@foodie.com', 'Password@123')}
              className="py-2 px-2.5 rounded-xl bg-white hover:bg-orange-600 hover:text-white border border-orange-200 text-[11px] font-bold text-slate-800 transition shadow-2xs text-left cursor-pointer flex items-center gap-1.5 group"
            >
              <ChefHat className="w-3.5 h-3.5 text-orange-600 group-hover:text-white shrink-0" />
              <div className="min-w-0">
                <span className="block font-black truncate">Admin Demo</span>
                <span className="block text-[9px] text-slate-400 group-hover:text-white/80 truncate">Vikram Oberoi</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('customer@foodie.com', 'Password@123')}
              className="py-2 px-2.5 rounded-xl bg-white hover:bg-orange-600 hover:text-white border border-orange-200 text-[11px] font-bold text-slate-800 transition shadow-2xs text-left cursor-pointer flex items-center gap-1.5 group"
            >
              <User className="w-3.5 h-3.5 text-orange-600 group-hover:text-white shrink-0" />
              <div className="min-w-0">
                <span className="block font-black truncate">Customer Demo</span>
                <span className="block text-[9px] text-slate-400 group-hover:text-white/80 truncate">Rahul Sharma</span>
              </div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          
          {/* Email / Mobile Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email or Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. admin@foodie.com or 9123456780"
                {...register('identifier', {
                  required: 'Email or mobile number is required',
                  validate: (val) => {
                    const trimmed = val.trim();
                    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
                    const isPhone = /^[0-9]{10}$/.test(trimmed.replace(/\D/g, ''));
                    return isEmail || isPhone || 'Enter valid email or 10-digit number';
                  }
                })}
                className={`w-full pl-10 pr-3.5 py-3 rounded-2xl border text-sm transition focus:outline-none focus:ring-2 bg-slate-50/80 ${
                  errors.identifier
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/40'
                    : 'border-slate-200 focus:ring-orange-200 focus:border-orange-500'
                }`}
              />
            </div>
            {errors.identifier && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.identifier.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required'
                })}
                className={`w-full pl-10 pr-10 py-3 rounded-2xl border text-sm transition focus:outline-none focus:ring-2 bg-slate-50/80 ${
                  errors.password
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/40'
                    : 'border-slate-200 focus:ring-orange-200 focus:border-orange-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-400 border-slate-300"
              />
              <span className="text-xs font-semibold text-slate-600">Keep me logged in</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link to Register */}
        <div className="mt-6 text-center text-xs text-slate-500">
          New to CraveDash?{' '}
          <Link to="/register" className="font-extrabold text-orange-600 hover:underline">
            Create an Account
          </Link>
        </div>

        {/* Security Badge */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Role-Based Access Control • 256-Bit SSL Protection</span>
        </div>

      </div>
    </div>
  );
};

export default Login;
