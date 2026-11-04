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
  KeyRound,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Lookup, 2: Reset
  const [targetAccount, setTargetAccount] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { forgotPassword, registeredUsers } = useAuth();
  const navigate = useNavigate();

  // Step 1 Form: Lookup
  const {
    register: registerLookup,
    handleSubmit: handleSubmitLookup,
    formState: { errors: errorsLookup, isSubmitting: isSubmittingLookup }
  } = useForm({
    defaultValues: { identifier: '' }
  });

  // Step 2 Form: Reset
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    watch: watchReset,
    formState: { errors: errorsReset, isSubmitting: isSubmittingReset }
  } = useForm({
    defaultValues: { newPassword: '', confirmPassword: '' }
  });

  const newPasswordValue = watchReset('newPassword');

  // Verify Account
  const onLookupSubmit = (data) => {
    const cleanId = (data.identifier || '').trim().toLowerCase();
    const cleanPhone = cleanId.replace(/\D/g, '');

    const found = registeredUsers.some((u) => {
      const matchEmail = u.email && u.email.toLowerCase() === cleanId;
      const matchPhone = cleanPhone && u.phone && u.phone.replace(/\D/g, '') === cleanPhone;
      return matchEmail || matchPhone;
    });

    if (!found) {
      toast.error('No account found with this email or mobile number.');
      return;
    }

    setTargetAccount(cleanId);
    setStep(2);
    toast.success('Account found! Choose your new password.');
  };

  // Reset Password
  const onResetSubmit = (data) => {
    const res = forgotPassword(targetAccount, data.newPassword);
    if (res.success) {
      toast.success(res.message);
      navigate('/login');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden select-none">
      
      {/* 100% FULL BACKGROUND IMAGE */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-all duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=85')`
        }}
      />

      {/* Dark Ambient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-tr from-black/85 via-black/65 to-black/80" />

      {/* FLOATING CURVED CARD */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[36px] sm:rounded-[44px] shadow-2xl border border-white/40 p-6 sm:p-9 text-slate-900 transition-all duration-300">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-600 text-white shadow-lg shadow-orange-500/30 mb-2">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            {step === 1 ? 'Reset Admin Password' : 'New Admin Password'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {step === 1
              ? 'Enter your registered Admin email or mobile to recover account'
              : `Creating new password for: ${targetAccount}`}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-10 bg-orange-600' : 'w-4 bg-emerald-500'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-10 bg-orange-600' : 'w-4 bg-slate-200'}`} />
        </div>

        {step === 1 ? (
          /* STEP 1: Verify Account */
          <form onSubmit={handleSubmitLookup(onLookupSubmit)} className="space-y-4" noValidate>
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
                  placeholder="e.g. admin@foodie.com or 9123456780"
                  {...registerLookup('identifier', {
                    required: 'Email or mobile number is required'
                  })}
                  className={`w-full pl-10 pr-3.5 py-3 rounded-2xl border text-sm transition focus:outline-none focus:ring-2 bg-slate-50/80 ${
                    errorsLookup.identifier
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/40'
                      : 'border-slate-200 focus:ring-orange-200 focus:border-orange-500'
                  }`}
                />
              </div>
              {errorsLookup.identifier && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {errorsLookup.identifier.message}
                </p>
              )}
            </div>

            <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/60 text-xs text-amber-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Admin account: <b>admin@foodie.com</b> (Password@123)</span>
            </div>

            <button
              type="submit"
              disabled={isSubmittingLookup}
              className="w-full mt-2 py-3.5 px-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-orange-500 via-orange-600 to-rose-600 hover:from-orange-600 hover:to-rose-700 shadow-lg shadow-orange-500/30 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              <span>Verify & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* STEP 2: Set New Password */
          <form onSubmit={handleSubmitReset(onResetSubmit)} className="space-y-4" noValidate>
            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  {...registerReset('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  className={`w-full pl-10 pr-11 py-3 rounded-2xl border text-sm transition focus:outline-none focus:ring-2 bg-slate-50/80 ${
                    errorsReset.newPassword
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/40'
                      : 'border-slate-200 focus:ring-orange-200 focus:border-orange-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-orange-600" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errorsReset.newPassword && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errorsReset.newPassword.message}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat new password"
                  {...registerReset('confirmPassword', {
                    required: 'Please confirm password',
                    validate: (val) => val === newPasswordValue || 'Passwords do not match'
                  })}
                  className={`w-full pl-10 pr-11 py-3 rounded-2xl border text-sm transition focus:outline-none focus:ring-2 bg-slate-50/80 ${
                    errorsReset.confirmPassword
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/40'
                      : 'border-slate-200 focus:ring-orange-200 focus:border-orange-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4 text-orange-600" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errorsReset.confirmPassword && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errorsReset.confirmPassword.message}</p>
              )}
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-2xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmittingReset}
                className="flex-1 py-3 px-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-orange-500 via-orange-600 to-rose-600 hover:from-orange-600 hover:to-rose-700 shadow-lg shadow-orange-500/30 transition cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save New Password</span>
              </button>
            </div>
          </form>
        )}

        {/* Back to Login */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-orange-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>
        </div>

      </div>

    </div>
  );
};

export default ForgotPassword;
