import React from 'react';
import { Droplets, PhoneCall, ShieldCheck, LogOut, ArrowRight, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface CustomerNavbarProps {
  onOpenBooking: () => void;
  activeOrdersCount: number;
}

export const CustomerNavbar: React.FC<CustomerNavbarProps> = ({ onOpenBooking, activeOrdersCount }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Log out from AquaLogix Consumer Portal?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Droplets className="w-6 h-6 animate-pulse-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Aqua<span className="text-sky-600">Logix</span>
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Citizen & Consumer Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Municipal On-Demand Water Supply & Billing Services</p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center space-x-3">
          
          {/* Emergency 24x7 Hotline */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-sky-50 border border-sky-200 rounded-xl text-xs font-semibold text-sky-800">
            <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
            <span>24/7 Helpline: 1800-425-AQUA</span>
          </div>

          {/* Switch to Admin link (Only if the logged-in user is an administrator/officer) */}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 text-sky-400" />
              <span>Admin Console</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </Link>
          )}

          {/* Book Tanker Quick Action */}
          <button
            onClick={onOpenBooking}
            className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-600/20 transition-all"
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Book Tanker</span>
          </button>

          {/* Consumer Profile & Logout */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-sky-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
              {user?.name?.slice(0, 2).toUpperCase() || 'CU'}
            </div>
            <div className="hidden sm:block text-left text-xs">
              <p className="font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                {user?.name || 'Consumer'}
              </p>
              <p className="text-[10px] text-slate-500">{user?.zone || 'Bangalore'}</p>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
