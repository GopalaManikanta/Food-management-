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
  ChefHat
} from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

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
      navigate(from, { replace: true });
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

      {/* Dark Ambient Overlay for Contrast */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/60 to-black/75" />

      {/* FLOATING CURVED LOGIN CARD (Smooth Curve Shape Design) */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[36px] sm:rounded-[44px] shadow-2xl border border-white/40 p-6 sm:p-9 text-slate-900 transition-all duration-300">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-600 text-white shadow-lg shadow-orange-500/30 mb-3">
            <ChefHat className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Crave<span className="text-orange-600">Dash</span> Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Sign in to access Food Delivery Admin Operations
          </p>
        </div>

        {/* 1-Click Quick Admin Demo Login */}
        <div className="mb-5 p-3 rounded-2xl bg-orange-50/80 border border-orange-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-orange-950 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              1-Click Admin Demo Fill:
            </span>
            <span className="text-[10px] text-orange-600 font-semibold">Instant Test</span>
          </div>
          <button
            type="button"
            onClick={() => handleFillDemo('admin@foodie.com', 'Password@123')}
            className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-orange-600 hover:text-white border border-orange-200 text-xs font-bold text-slate-800 transition shadow-2xs text-center cursor-pointer flex items-center justify-center gap-2 group"
          >
            <ChefHat className="w-4 h-4 text-orange-600 group-hover:text-white transition" />
            <span>Fill Admin: admin@foodie.com (Vikram)</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          
          {/* Email / Mobile Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Admin Email or Mobile
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="admin@foodie.com or 9123456780"
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

          {/* Password with Show/Hide Toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition"
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
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                className={`w-full pl-10 pr-11 py-3 rounded-2xl border text-sm transition focus:outline-none focus:ring-2 bg-slate-50/80 ${
                  errors.password
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/40'
                    : 'border-slate-200 focus:ring-orange-200 focus:border-orange-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-orange-600" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
              />
              <span className="text-slate-600 font-medium">Keep me signed in</span>
            </label>
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 256-bit Secure
            </span>
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
                <span>Sign In & Order Food</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs sm:text-sm text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-orange-600 hover:text-orange-700 transition inline-flex items-center gap-1"
            >
              Sign Up <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
};

export default Login;
