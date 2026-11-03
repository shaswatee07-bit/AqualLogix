import React, { useState } from 'react';
import { X, Droplet, Building, MapPin, Phone, Calendar, AlertTriangle } from 'lucide-react';
import { CustomerCategory, OrderUrgency, WaterType, SupplyRequest } from '../types';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<SupplyRequest, 'id' | 'orderDate' | 'status' | 'costEstimate'>) => Promise<void>;
}

export const NewRequestModal: React.FC<NewRequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [consumerName, setConsumerName] = useState('');
  const [category, setCategory] = useState<CustomerCategory>('Residential Community');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [zone, setZone] = useState('Central Urban Core');
  const [requestedVolumeLiters, setRequestedVolumeLiters] = useState<number>(10000);
  const [urgency, setUrgency] = useState<OrderUrgency>('Standard');
  const [waterType, setWaterType] = useState<WaterType>('Potable Drinking');
  const [scheduledTime, setScheduledTime] = useState('11:00 AM');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumerName || !phone || !deliveryAddress) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        consumerName,
        category,
        phone,
        deliveryAddress,
        zone,
        requestedVolumeLiters: Number(requestedVolumeLiters),
        urgency,
        waterType,
        scheduledTime
      });
      onClose();
      // Reset form
      setConsumerName('');
      setPhone('');
      setDeliveryAddress('');
      setRequestedVolumeLiters(10000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Droplet className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Book Water Supply Order</h3>
              <p className="text-xs text-sky-100">Direct Tanker Dispatch Request</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Consumer / Organization *
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Palm Meadows HOA"
                  value={consumerName}
                  onChange={(e) => setConsumerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98450 11223"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Consumer Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CustomerCategory)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none bg-white"
              >
                <option value="Residential Community">Residential Community</option>
                <option value="Hospital & Healthcare">Hospital & Healthcare (Priority)</option>
                <option value="Commercial Park">Commercial Park</option>
                <option value="Municipal Ward">Municipal Ward (Public Relief)</option>
                <option value="Educational Institution">Educational Institution</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Municipal Zone</label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none bg-white"
              >
                <option value="Central Urban Core">Central Urban Core</option>
                <option value="South-West Zone A">South-West Zone A</option>
                <option value="North Zone B">North Zone B</option>
                <option value="East Suburb Zone C">East Suburb Zone C</option>
                <option value="West Outer Hub">West Outer Hub</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Delivery Address & Landmark *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Street address, building name, water inlet gate"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Water Type</label>
              <select
                value={waterType}
                onChange={(e) => setWaterType(e.target.value as WaterType)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none bg-white"
              >
                <option value="Potable Drinking">Potable Drinking</option>
                <option value="Treated Municipal">Treated Municipal</option>
                <option value="Industrial Grade">Industrial Grade</option>
                <option value="Recycled Greywater">Recycled Greywater</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Volume (Liters)</label>
              <select
                value={requestedVolumeLiters}
                onChange={(e) => setRequestedVolumeLiters(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none bg-white"
              >
                <option value={6000}>6,000 Liters (Mini Tanker)</option>
                <option value={9000}>9,000 Liters (Standard)</option>
                <option value={12000}>12,000 Liters (Heavy)</option>
                <option value={15000}>15,000 Liters (Large)</option>
                <option value={20000}>20,000 Liters (Jumbo)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as OrderUrgency)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none bg-white"
              >
                <option value="Standard">Standard</option>
                <option value="Priority">Priority (+20%)</option>
                <option value="Emergency Relief">Emergency Relief</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Scheduled Slot</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  placeholder="e.g. 02:00 PM - 04:00 PM"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>

            <div className="bg-sky-50 rounded-xl p-3 border border-sky-100 flex flex-col justify-center">
              <span className="text-[11px] font-medium text-sky-800">Estimated Tariff (Base + Tax)</span>
              <span className="text-lg font-bold text-sky-950">
                ₹{Math.round((requestedVolumeLiters / 1000) * (waterType === 'Potable Drinking' ? 200 : 150) * (urgency === 'Priority' ? 1.2 : 1))}
              </span>
            </div>
          </div>

          {urgency === 'Emergency Relief' && (
            <div className="flex items-center space-x-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Emergency relief requests are automatically expedited to the nearest reservoir queue.</span>
            </div>
          )}

          {/* Action Buttons */}
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
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 rounded-xl shadow-md shadow-sky-600/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Confirm & Schedule'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
