import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  PlusCircle,
  Search,
  Filter,
  Truck,
  Phone,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { NewRequestModal } from '../components/NewRequestModal';
import { DispatchModal } from '../components/DispatchModal';
import { waterService } from '../api/waterService';
import { SupplyRequest, Tanker, OrderStatus } from '../types';

export const SupplyRequests: React.FC = () => {
  const [requests, setRequests] = useState<SupplyRequest[]>([]);
  const [tankers, setTankers] = useState<Tanker[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Modals
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [dispatchOrder, setDispatchOrder] = useState<SupplyRequest | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [r, t] = await Promise.all([
        waterService.getSupplyRequests(),
        waterService.getTankers()
      ]);
      setRequests(r);
      setTankers(t);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRequest = async (data: any) => {
    await waterService.createSupplyRequest(data);
    await loadData();
  };

  const handleDispatch = async (orderId: string, tankerId: string) => {
    await waterService.dispatchTankerToOrder(orderId, tankerId);
    await loadData();
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    await waterService.updateOrderStatus(orderId, status);
    await loadData();
  };

  const filteredRequests = requests.filter((r) => {
    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'pending'
        ? r.status === 'Pending'
        : activeTab === 'dispatched'
        ? r.status === 'Dispatched'
        : activeTab === 'delivered'
        ? r.status === 'Delivered'
        : true;

    const matchesUrgency = urgencyFilter === 'all' || r.urgency === urgencyFilter;

    const matchesSearch =
      r.consumerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery);

    return matchesTab && matchesUrgency && matchesSearch;
  });

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <ClipboardList className="w-7 h-7 text-sky-600" />
            <span>Water Supply Orders & Consumer Requests</span>
          </h1>
          <p className="text-sm text-slate-500">
            Process bulk water supply bookings, assign emergency tankers, and manage scheduled routes.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-sky-600 rounded-xl transition-colors shadow-sm"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsNewRequestOpen(true)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Supply Booking</span>
          </button>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Tabs */}
        <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {[
            { id: 'all', label: 'All Orders', count: requests.length },
            { id: 'pending', label: 'Pending Dispatch', count: pendingCount, highlight: true },
            { id: 'dispatched', label: 'Dispatched / In Transit', count: requests.filter((r) => r.status === 'Dispatched').length },
            { id: 'delivered', label: 'Delivered', count: requests.filter((r) => r.status === 'Delivered').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  tab.highlight && tab.count > 0 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Urgency dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 focus:ring-2 focus:ring-sky-500 outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="Standard">Standard</option>
            <option value="Priority">Priority</option>
            <option value="Emergency Relief">Emergency Relief</option>
          </select>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, name, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>
        </div>

      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Consumer & Contact</th>
                <th className="py-3.5 px-4">Volume & Grade</th>
                <th className="py-3.5 px-4">Zone & Destination</th>
                <th className="py-3.5 px-4">Slot & Urgency</th>
                <th className="py-3.5 px-4">Status & Tanker</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No water supply orders matched your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900">{req.id}</span>
                      <p className="text-[10px] text-slate-400">{req.orderDate}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800">{req.consumerName}</span>
                      <p className="text-[10px] text-slate-500">{req.category}</p>
                      <a
                        href={`tel:${req.phone}`}
                        className="text-[11px] text-sky-600 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3" /> {req.phone}
                      </a>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-slate-900">
                        {req.requestedVolumeLiters.toLocaleString()} Liters
                      </span>
                      <p className="text-[10px] text-slate-500">{req.waterType}</p>
                      <p className="text-[11px] font-semibold text-emerald-700">₹{req.costEstimate}</p>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {req.zone}
                      </span>
                      <p className="text-[11px] text-slate-500 truncate" title={req.deliveryAddress}>
                        {req.deliveryAddress}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" /> {req.scheduledTime}
                      </span>
                      <span
                        className={`inline-block mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          req.urgency === 'Emergency Relief'
                            ? 'bg-rose-100 text-rose-800 animate-pulse'
                            : req.urgency === 'Priority'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {req.urgency}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          req.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : req.status === 'Dispatched'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {req.status}
                      </span>
                      {req.assignedTankerId && (
                        <p className="text-[10px] text-slate-500 mt-1 font-mono">
                          Tanker: {req.assignedTankerId}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {req.status === 'Pending' && (
                        <button
                          onClick={() => setDispatchOrder(req)}
                          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all inline-flex items-center gap-1"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Dispatch</span>
                        </button>
                      )}

                      {req.status === 'Dispatched' && (
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'Delivered')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Done</span>
                        </button>
                      )}

                      {req.status === 'Delivered' && (
                        <span className="text-emerald-600 font-bold text-xs inline-flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Fulfilled
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <NewRequestModal
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
        onSubmit={handleCreateRequest}
      />

      <DispatchModal
        isOpen={!!dispatchOrder}
        order={dispatchOrder}
        tankers={tankers}
        onClose={() => setDispatchOrder(null)}
        onDispatch={handleDispatch}
      />

    </div>
  );
};
