import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  iconColor = 'text-sky-600',
  bgColor = 'bg-sky-50',
  trend
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{value}</span>
            {unit && <span className="text-xs font-semibold text-slate-500">{unit}</span>}
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center shrink-0`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {trend ? (
            <div className="flex items-center space-x-1">
              <span
                className={`font-semibold px-1.5 py-0.5 rounded ${
                  trend.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}
              >
                {trend.value}
              </span>
              {trend.label && <span className="text-slate-400">{trend.label}</span>}
            </div>
          ) : (
            <span className="text-slate-400">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};
