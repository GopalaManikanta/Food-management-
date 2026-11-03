import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LogOut, User } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    const res = logout();
    if (res.success) {
      toast.info(res.message);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
        
        {/* User Info from Local Storage */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            Welcome, {currentUser?.name || 'User'}!
          </h2>
          <p className="text-sm text-slate-500">
            {currentUser?.email}
          </p>
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-700">
            {currentUser?.role || 'User'}
          </span>
        </div>

        {/* User details stored in Local Storage */}
        <div className="border-t border-b border-slate-100 py-4 space-y-2 text-sm text-slate-600">
          <div className="flex justify-between">
            <span className="text-slate-400">Name:</span>
            <span className="font-medium text-slate-800">{currentUser?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Email:</span>
            <span className="font-medium text-slate-800">{currentUser?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Role:</span>
            <span className="font-medium text-slate-800">{currentUser?.role}</span>
          </div>
        </div>

        {/* Logout Feature */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>

      </div>
    </div>
  );
};

export default Dashboard;
