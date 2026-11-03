import React from 'react';
import { Droplets, Bell, RefreshCw, PhoneCall, ShieldCheck, LogOut, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeAlertsCount: number;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeAlertsCount, onResetData }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of AquaLogix Admin Console?')) {
      logout();
      navigate('/login');
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'HQ';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <Link to="/admin" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
            <Droplets className="w-6 h-6 animate-pulse-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Aqua<span className="text-sky-600">Logix</span>
              </span>
              <span className="bg-slate-900 text-sky-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Admin Console
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Smart Municipal & Fleet Water Supply Grid</p>
          </div>
        </Link>

        {/* Right Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Quick link to Switch to Customer Portal */}
          <Link
            to="/portal"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold rounded-xl border border-sky-200 transition-colors"
            title="Open Citizen & Consumer View"
          >
            <span>Customer Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Grid Status Badge */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secure SCADA</span>
          </div>

          {/* Alerts Notification */}
          <Link
            to="/admin/analytics"
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="View Pipeline & Grid Alerts"
          >
            <Bell className="w-5 h-5" />
            {activeAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white">
                {activeAlertsCount}
              </span>
            )}
          </Link>

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetData}
            title="Reset Mock Data to Default"
            className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-600 hover:text-sky-600 hover:bg-sky-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="font-medium">Reset Data</span>
          </button>

          {/* User Profile Info & Logout */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
              {getInitials(user?.name)}
            </div>
            <div className="hidden md:block text-left text-xs">
              <p className="font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                {user?.name || 'Operator'}
              </p>
              <p className="text-[10px] text-slate-500 leading-none">{user?.role || 'Dispatcher'}</p>
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
