import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Droplets,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Truck,
  Activity,
  User as UserIcon,
  UserCheck,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const Login: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@aqualogix.com');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState<UserRole>('Operations Dispatcher');
  const [zone, setZone] = useState('Central Urban Core');

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        if (!name.trim()) {
          setErrorMsg('Please enter your full name.');
          setIsSubmitting(false);
          return;
        }

        const res = await register({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          zone
        });

        if (res.success) {
          navigate(from, { replace: true });
        } else {
          setErrorMsg(res.message || 'Registration failed.');
        }
      } else {
        const res = await login(email, password);
        if (res.success) {
          navigate(from, { replace: true });
        } else {
          setErrorMsg(res.message || 'Login failed. Please verify credentials.');
        }
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setIsRegistering(false);
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-sky-500/20 mb-3 animate-pulse-slow">
            <Droplets className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Aqua<span className="text-sky-400">Logix</span> Console
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {isRegistering ? 'Register New Operational Account' : 'Secure Municipal & Commercial Water Supply Grid'}
          </p>
        </div>

        <div className="mt-6 bg-slate-800/80 backdrop-blur-xl py-7 px-6 sm:px-8 shadow-2xl rounded-3xl border border-slate-700/80">
          <div className="grid grid-cols-2 p-1 bg-slate-900/80 rounded-xl border border-slate-700 mb-5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(false);
                setErrorMsg('');
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                !isRegistering
                  ? 'bg-sky-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsRegistering(true);
                setErrorMsg('');
                if (email === 'admin@aqualogix.com') setEmail('');
                if (password === 'admin123') setPassword('');
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                isRegistering
                  ? 'bg-sky-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegistering && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Authorized Email ID *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@aqualogix.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Access Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isRegistering && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    System Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Consumer / Citizen">Consumer / Citizen (Customer Portal)</option>
                    <option value="Operations Dispatcher">Operations Dispatcher (Admin Console)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Operating Zone
                  </label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Central Urban Core">Central Urban Core</option>
                    <option value="South-West Zone A">South-West Zone A</option>
                    <option value="North Zone B">North Zone B</option>
                    <option value="East Suburb Zone C">East Suburb Zone C</option>
                  </select>
                </div>
              </div>
            )}

            {!isRegistering && (
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember-me"
                    type="checkbox"
                    defaultChecked
                    className="h-3.5 w-3.5 rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-sky-500"
                  />
                  <label htmlFor="remember-me" className="text-slate-400">Remember session</label>
                </div>
                <span className="text-slate-500 text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-bit Encrypted
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 hover:from-sky-500 hover:to-blue-500 shadow-lg shadow-sky-600/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isSubmitting
                ? 'Processing...'
                : isRegistering
                ? 'Register & Access Console'
                : 'Sign In to AquaLogix'}
            </button>
          </form>

          {!isRegistering && (
            <div className="mt-6 pt-5 border-t border-slate-700/60">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                1-Click Demo Profiles (Citizen vs Admin)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillCredentials('citizen@aqualogix.com', 'citizen123')}
                  className="p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-left transition-colors group"
                >
                  <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold">
                    <Droplets className="w-3.5 h-3.5" />
                    <span>Citizen Portal</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">Book Tanker & Bills</p>
                </button>

                <button
                  type="button"
                  onClick={() => fillCredentials('admin@aqualogix.com', 'admin123')}
                  className="p-2.5 rounded-xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-left transition-colors group"
                >
                  <div className="flex items-center space-x-1.5 text-sky-400 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Console</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">Operations Dispatcher</p>
                </button>
              </div>
            </div>
          )}

          <div className="mt-5 text-center text-xs">
            {isRegistering ? (
              <p className="text-slate-400">
                Already have an operator account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setErrorMsg('');
                  }}
                  className="font-bold text-sky-400 hover:text-sky-300 underline ml-1"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p className="text-slate-400">
                Need a new operator account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setErrorMsg('');
                    if (email === 'admin@aqualogix.com') setEmail('');
                    if (password === 'admin123') setPassword('');
                  }}
                  className="font-bold text-sky-400 hover:text-sky-300 underline ml-1"
                >
                  Create New Account
                </button>
              </p>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-500">
          AquaLogix Enterprise Grid Security • HMAC-SHA256 Token Session
        </p>
      </div>
    </div>
  );
};
