import React, { useState, useEffect } from 'react';
import {
  Truck,
  Navigation,
  Fuel,
  Users,
  MapPin,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { TankerCard } from '../components/TankerCard';
import { waterService } from '../api/waterService';
import { Tanker, TankerStatus } from '../types';

export const LogisticsFleet: React.FC = () => {
  const [tankers, setTankers] = useState<Tanker[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadTankers = async () => {
    try {
      setLoading(true);
      const data = await waterService.getTankers();
      setTankers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTankers();
  }, []);

  const handleUpdateStatus = async (tankerId: string, status: TankerStatus) => {
    await waterService.updateTankerStatus(tankerId, status);
    await loadTankers();
  };

  const filteredTankers = tankers.filter((tanker) => {
    const matchesFilter = filterStatus === 'all' || tanker.status === filterStatus;
    const matchesSearch =
      tanker.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tanker.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tanker.currentLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const availableCount = tankers.filter((t) => t.status === 'available').length;
  const transitCount = tankers.filter((t) => t.status === 'in_transit' || t.status === 'delivering').length;
  const loadingCount = tankers.filter((t) => t.status === 'loading').length;
  const maintenanceCount = tankers.filter((t) => t.status === 'maintenance').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <Truck className="w-7 h-7 text-sky-600" />
            <span>Water Tanker Fleet & Route Dispatch</span>
          </h1>
          <p className="text-sm text-slate-500">
            Real-time GPS tracking, vehicle telemetry, driver allocation, and status management.
          </p>
        </div>

        <button
          onClick={loadTankers}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-sky-600 rounded-xl text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Fleet Summary Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Idle / Standby</p>
            <p className="text-2xl font-black text-emerald-600">{availableCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">On Delivery Route</p>
            <p className="text-2xl font-black text-blue-600">{transitCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Navigation className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Filling at Bay</p>
            <p className="text-2xl font-black text-sky-600">{loadingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Fuel className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">In Maintenance</p>
            <p className="text-2xl font-black text-amber-600">{maintenanceCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Simulated GPS Live Route Tracker Map Widget */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="font-bold text-base text-white">Live Metropolitan GPS Telemetry Grid</h3>
            </div>
            <p className="text-xs text-slate-300">Bangalore Urban Tanker Dispatches & RFID Highway Corridors</p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-sky-200 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm">
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>Active Sector: Bangalore South, North & Outer Ring Road</span>
          </div>
        </div>

        {/* Interactive Simulation Route Map Canvas */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {tankers.map((t) => (
            <div
              key={t.id}
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sky-300 text-xs">{t.vehicleNumber}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  t.status === 'in_transit' ? 'bg-blue-500/30 text-blue-300 border border-blue-400/30' :
                  t.status === 'delivering' ? 'bg-purple-500/30 text-purple-300 border border-purple-400/30' :
                  t.status === 'available' ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/30' :
                  'bg-amber-500/30 text-amber-300 border border-amber-400/30'
                }`}>
                  {t.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate">
                <span className="text-slate-400">Position:</span> {t.currentLocation}
              </p>
              {t.destination && (
                <p className="text-[11px] text-emerald-300 truncate">
                  <span className="text-slate-400">Destination:</span> {t.destination}
                </p>
              )}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/10">
                <span>Driver: {t.driverName}</span>
                <span>Fuel: {t.fuelPercent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-2xl overflow-x-auto">
          {[
            { id: 'all', label: 'All Fleet' },
            { id: 'available', label: 'Standby' },
            { id: 'in_transit', label: 'In Transit' },
            { id: 'delivering', label: 'Delivering' },
            { id: 'loading', label: 'Loading' },
            { id: 'maintenance', label: 'Maintenance' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search vehicle, driver, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>

      </div>

      {/* Tankers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTankers.map((tanker) => (
          <TankerCard
            key={tanker.id}
            tanker={tanker}
            onUpdateStatus={handleUpdateStatus}
          />
        ))}
      </div>

    </div>
  );
};
