import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  Waves,
  ClipboardList,
  ReceiptText,
  Activity,
  Layers,
  MapPin,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  pendingCount?: number;
  alertsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ pendingCount = 0, alertsCount = 0 }) => {
  const navItems = [
    {
      to: '/admin',
      label: 'Control Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/admin/fleet',
      label: 'Tanker Fleet & Logistics',
      icon: Truck,
      badge: null
    },
    {
      to: '/admin/reservoirs',
      label: 'Storage & Treatment Nodes',
      icon: Waves,
      badge: null
    },
    {
      to: '/admin/requests',
      label: 'Supply Requests & Dispatch',
      icon: ClipboardList,
      badge: pendingCount > 0 ? `${pendingCount} new` : null,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      to: '/admin/billing',
      label: 'Tariffs & Revenue Ledger',
      icon: ReceiptText,
      badge: null
    },
    {
      to: '/admin/analytics',
      label: 'Leakage & Sensor Alerts',
      icon: Activity,
      badge: alertsCount > 0 ? `${alertsCount} alert` : null,
      badgeColor: 'bg-rose-100 text-rose-700'
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex shrink-0">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Admin Operations Suite
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-sky-50 text-sky-700 shadow-sm border border-sky-100 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 shrink-0 text-sky-600" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Quick Citizen Portal Link */}
        <div className="px-1">
          <NavLink
            to="/portal"
            className="flex items-center justify-between p-3 rounded-2xl bg-sky-50/70 border border-sky-100 text-sky-800 hover:bg-sky-100 transition-colors text-xs font-semibold"
          >
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Go to Citizen Portal</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
          </NavLink>
        </div>

        {/* Quick System Summary Box */}
        <div className="bg-gradient-to-br from-sky-900 to-slate-900 rounded-2xl p-4 text-white shadow-lg shadow-sky-900/10">
          <div className="flex items-center space-x-2 text-sky-300 text-xs font-semibold mb-2">
            <Layers className="w-4 h-4" />
            <span>Smart SCADA Pipeline</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed mb-3">
            Real-time telemetry synchronized with 24 municipal reservoirs and IoT flow meters.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-sky-200">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>Bangalore Urban</span>
            </span>
            <span className="text-emerald-400 font-medium">99.9% Uptime</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
        <span>AquaLogix Admin v2.4</span>
        <button
          onClick={() => alert('AquaLogix Enterprise Admin Portal - Segregated Operations Console')}
          className="hover:text-sky-600 transition-colors"
          title="About System"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
