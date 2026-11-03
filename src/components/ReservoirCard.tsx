import React from 'react';
import { Waves, ArrowDownRight, ArrowUpRight, Plus, Minus } from 'lucide-react';
import { StorageNode } from '../types';

interface ReservoirCardProps {
  node: StorageNode;
  onAdjustLevel: (nodeId: string, newLevelKL: number) => Promise<void>;
}

export const ReservoirCard: React.FC<ReservoirCardProps> = ({ node, onAdjustLevel }) => {
  const percentage = Math.round((node.currentLevelKL / node.totalCapacityKL) * 100);

  const getStatusColor = () => {
    if (percentage > 50) return { bg: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800' };
    if (percentage > 25) return { bg: 'bg-amber-500', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' };
    return { bg: 'bg-rose-500', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-800' };
  };

  const statusMeta = getStatusColor();

  const handleLevelChange = (delta: number) => {
    const updated = Math.max(0, Math.min(node.totalCapacityKL, node.currentLevelKL + delta));
    onAdjustLevel(node.id, updated);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
              {node.type}
            </span>
            <h4 className="font-bold text-slate-900 text-sm mt-1">{node.name}</h4>
            <p className="text-[11px] text-slate-500">{node.zone}</p>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${statusMeta.badge}`}>
            {node.status}
          </span>
        </div>

        {/* Level Capacity Progress Gauge */}
        <div className="mt-4">
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="text-xs font-semibold text-slate-600">Storage Reserve</span>
            <span className="text-xs font-bold text-slate-800">
              {node.currentLevelKL.toLocaleString()} / {node.totalCapacityKL.toLocaleString()} KL
              <span className={`ml-1 font-black ${statusMeta.text}`}>({percentage}%)</span>
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${statusMeta.bg}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Telemetry Rates (Inflow / Outflow) */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
              <ArrowDownRight className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Inflow Rate</p>
              <p className="text-xs font-bold text-slate-800">{node.inflowRateLps} L/s</p>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-2">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Outflow Rate</p>
              <p className="text-xs font-bold text-slate-800">{node.outflowRateLps} L/s</p>
            </div>
          </div>
        </div>

        {/* Water Quality Telemetry */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Waves className="w-3.5 h-3.5 text-sky-500" /> Sensor Water Quality
          </p>
          <div className="grid grid-cols-4 gap-1 text-center bg-sky-50/50 p-2 rounded-xl border border-sky-100 text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">pH</span>
              <span className="font-bold text-slate-800">{node.waterQuality.ph}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">TDS</span>
              <span className="font-bold text-slate-800">{node.waterQuality.tds} ppm</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Turbidity</span>
              <span className="font-bold text-slate-800">{node.waterQuality.turbidity} NTU</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Chlorine</span>
              <span className="font-bold text-slate-800">{node.waterQuality.chlorine} mg/L</span>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Valve Controls */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400 text-[11px]">Simulate Pump Valve:</span>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => handleLevelChange(-1000)}
            disabled={node.currentLevelKL <= 0}
            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors disabled:opacity-30"
            title="Simulate Discharge / Pumping (-1,000 KL)"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleLevelChange(1000)}
            disabled={node.currentLevelKL >= node.totalCapacityKL}
            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg border border-slate-200 transition-colors disabled:opacity-30"
            title="Simulate Reservoir Refill (+1,000 KL)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
