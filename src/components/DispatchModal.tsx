import React, { useState } from 'react';
import { X, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { SupplyRequest, Tanker } from '../types';

interface DispatchModalProps {
  isOpen: boolean;
  order: SupplyRequest | null;
  tankers: Tanker[];
  onClose: () => void;
  onDispatch: (orderId: string, tankerId: string) => Promise<void>;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  isOpen,
  order,
  tankers,
  onClose,
  onDispatch
}) => {
  const [selectedTankerId, setSelectedTankerId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !order) return null;

  // Filter available tankers or those compatible
  const availableTankers = tankers.filter(
    (t) => t.status === 'available' || t.status === 'loading'
  );

  const handleDispatch = async () => {
    if (!selectedTankerId) {
      alert('Please select an available tanker.');
      return;
    }
    try {
      setLoading(true);
      await onDispatch(order.id, selectedTankerId);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to dispatch tanker.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Truck className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Dispatch Tanker</h3>
              <p className="text-xs text-emerald-100">Order ID: {order.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Details Brief */}
        <div className="p-6 space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Customer:</span>
              <span className="font-bold text-slate-800">{order.consumerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Volume Required:</span>
              <span className="font-bold text-sky-700">{order.requestedVolumeLiters.toLocaleString()} Liters ({order.waterType})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Destination:</span>
              <span className="font-semibold text-slate-700 truncate max-w-[240px]">{order.deliveryAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Urgency:</span>
              <span className={`font-bold ${order.urgency === 'Emergency Relief' ? 'text-rose-600' : 'text-slate-700'}`}>
                {order.urgency}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Fleet Tanker ({availableTankers.length} Available)
            </label>

            {availableTankers.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>No tankers are currently idle or loading. Free up a tanker in Fleet management.</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {availableTankers.map((tanker) => {
                  const isSelected = selectedTankerId === tanker.id;
                  const isSufficientCapacity = tanker.capacityLiters >= order.requestedVolumeLiters;

                  return (
                    <div
                      key={tanker.id}
                      onClick={() => setSelectedTankerId(tanker.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-500'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-800">{tanker.vehicleNumber}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 text-slate-700 font-medium">
                            {tanker.capacityLiters.toLocaleString()} L
                          </span>
                        </div>
                        <p className="text-slate-500">
                          Driver: {tanker.driverName} • Fuel: {tanker.fuelPercent}%
                        </p>
                        <p className="text-[10px] text-slate-400">Loc: {tanker.currentLocation}</p>
                      </div>

                      <div className="text-right">
                        {isSelected ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-auto" />
                        ) : (
                          <span className={`text-[11px] font-semibold ${isSufficientCapacity ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {isSufficientCapacity ? 'Capacity Match' : 'Partial Capacity'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDispatch}
              disabled={loading || !selectedTankerId || availableTankers.length === 0}
              className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Dispatching...' : 'Assign & Dispatch'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
