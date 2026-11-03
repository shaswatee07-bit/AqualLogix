import React from 'react';
import { Truck, Phone, Navigation, Gauge, Droplet, Check, Wrench, RotateCcw } from 'lucide-react';
import { Tanker, TankerStatus } from '../types';

interface TankerCardProps {
  tanker: Tanker;
  onUpdateStatus: (tankerId: string, status: TankerStatus) => Promise<void>;
}

export const TankerCard: React.FC<TankerCardProps> = ({ tanker, onUpdateStatus }) => {
  const getStatusBadge = (status: TankerStatus) => {
    switch (status) {
      case 'available':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold">Idle / Ready</span>;
      case 'loading':
        return <span className="bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full text-xs font-bold">Loading Bay</span>;
      case 'in_transit':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><Navigation className="w-3 h-3 animate-pulse" /> In Transit</span>;
      case 'delivering':
        return <span className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><Droplet className="w-3 h-3 animate-bounce" /> Delivering</span>;
      case 'maintenance':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-bold">In Workshop</span>;
    }
  };

  const loadPercent = Math.round((tanker.currentLoadLiters / tanker.capacityLiters) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{tanker.vehicleNumber}</h4>
              <p className="text-[11px] text-slate-500">{tanker.id} • {tanker.waterType}</p>
            </div>
          </div>
          {getStatusBadge(tanker.status)}
        </div>

        {/* Load & Fuel Indicators */}
        <div className="mt-4 space-y-3">
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
              <span className="flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-sky-500" /> Water Load
              </span>
              <span className="font-bold text-slate-800">
                {tanker.currentLoadLiters.toLocaleString()} / {tanker.capacityLiters.toLocaleString()} L ({loadPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  loadPercent > 80 ? 'bg-sky-500' : loadPercent > 30 ? 'bg-sky-400' : 'bg-slate-300'
                }`}
                style={{ width: `${loadPercent}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
              <span className="flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-amber-500" /> Fuel Level
              </span>
              <span className="font-bold text-slate-800">{tanker.fuelPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full ${
                  tanker.fuelPercent < 25 ? 'bg-rose-500' : tanker.fuelPercent < 50 ? 'bg-amber-400' : 'bg-emerald-500'
                }`}
                style={{ width: `${tanker.fuelPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Location & Driver Info */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="font-medium text-slate-500">Driver:</span>
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-slate-800">{tanker.driverName}</span>
              <a
                href={`tel:${tanker.driverPhone}`}
                className="text-sky-600 hover:text-sky-700"
                title="Call Driver"
              >
                <Phone className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="text-slate-600">
            <span className="text-slate-500 font-medium">Current Location:</span>
            <p className="text-[11px] font-medium text-slate-800 truncate mt-0.5">{tanker.currentLocation}</p>
          </div>

          {tanker.destination && (
            <div className="bg-sky-50/70 p-2 rounded-lg border border-sky-100 text-[11px] text-sky-900">
              <span className="font-bold text-sky-700">En Route to:</span> {tanker.destination}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
        {tanker.status === 'in_transit' && (
          <button
            onClick={() => onUpdateStatus(tanker.id, 'delivering')}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm"
          >
            <Droplet className="w-3.5 h-3.5" />
            <span>Start Offloading</span>
          </button>
        )}

        {tanker.status === 'delivering' && (
          <button
            onClick={() => onUpdateStatus(tanker.id, 'available')}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark Delivered & Ready</span>
          </button>
        )}

        {tanker.status === 'available' && (
          <>
            <button
              onClick={() => onUpdateStatus(tanker.id, 'loading')}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Fill at Bay</span>
            </button>
            <button
              onClick={() => onUpdateStatus(tanker.id, 'maintenance')}
              className="p-1.5 text-xs text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
              title="Send to Workshop"
            >
              <Wrench className="w-4 h-4" />
            </button>
          </>
        )}

        {tanker.status === 'loading' && (
          <button
            onClick={() => onUpdateStatus(tanker.id, 'available')}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Full & Standby</span>
          </button>
        )}

        {tanker.status === 'maintenance' && (
          <button
            onClick={() => onUpdateStatus(tanker.id, 'available')}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Complete Repair</span>
          </button>
        )}
      </div>
    </div>
  );
};
