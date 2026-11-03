import React, { useState, useEffect } from 'react';
import {
  Waves,
  ShieldCheck,
  Activity,
  Droplet,
  Zap,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { ReservoirCard } from '../components/ReservoirCard';
import { waterService } from '../api/waterService';
import { StorageNode } from '../types';

export const ReservoirsDistribution: React.FC = () => {
  const [nodes, setNodes] = useState<StorageNode[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNodes = async () => {
    try {
      setLoading(true);
      const data = await waterService.getStorageNodes();
      setNodes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNodes();
  }, []);

  const handleAdjustLevel = async (nodeId: string, newLevelKL: number) => {
    await waterService.updateNodeLevel(nodeId, newLevelKL);
    await loadNodes();
  };

  const totalCap = nodes.reduce((acc, n) => acc + n.totalCapacityKL, 0);
  const totalCur = nodes.reduce((acc, n) => acc + n.currentLevelKL, 0);
  const totalInflow = nodes.reduce((acc, n) => acc + n.inflowRateLps, 0);
  const totalOutflow = nodes.reduce((acc, n) => acc + n.outflowRateLps, 0);
  const reservePct = totalCap > 0 ? Math.round((totalCur / totalCap) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <Waves className="w-7 h-7 text-sky-600" />
            <span>Storage Reservoirs & SCADA Distribution Nodes</span>
          </h1>
          <p className="text-sm text-slate-500">
            Real-time level telemetry, inlet/outlet flow hydraulics, water potability sensors, and pump controls.
          </p>
        </div>

        <button
          onClick={loadNodes}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-sky-600 rounded-xl text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync SCADA Telemetry</span>
        </button>
      </div>

      {/* Grid Highlights Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Reserve Capacity</p>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{totalCur.toLocaleString()}</span>
            <span className="text-xs text-slate-500">/ {totalCap.toLocaleString()} KL</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-2">
            <div
              className="bg-sky-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${reservePct}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-sky-700 mt-1 block">{reservePct}% Overall Capacity</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Cumulative Inflow Rate</p>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-black text-emerald-600">{totalInflow}</span>
              <span className="text-xs text-slate-500">Liters / sec</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> River & Canal Inflow Stable
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Cumulative Outflow Rate</p>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-black text-blue-600">{totalOutflow}</span>
              <span className="text-xs text-slate-500">Liters / sec</span>
            </div>
            <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1 mt-1">
              <TrendingDown className="w-3 h-3" /> Municipal Feeder Discharges
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Water Quality Index</p>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-black text-teal-600">96.8</span>
              <span className="text-xs text-teal-700 font-bold">/ 100</span>
            </div>
            <span className="text-[11px] text-teal-700 font-medium flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% WHO Potable
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Droplet className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Reservoirs Grid with Valve Adjusters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-600" />
            <span>Monitored Storage Nodes ({nodes.length})</span>
          </h2>
          <span className="text-xs text-slate-500">
            Click +/- on cards to simulate manual valve inflows and discharges
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nodes.map((node) => (
            <ReservoirCard
              key={node.id}
              node={node}
              onAdjustLevel={handleAdjustLevel}
            />
          ))}
        </div>
      </div>

    </div>
  );
};
