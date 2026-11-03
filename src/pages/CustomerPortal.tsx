import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Truck,
  ReceiptText,
  ShieldCheck,
  Clock,
  Phone,
  CreditCard,
  PlusCircle,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  Calendar,
  Waves,
  Navigation,
  FileCheck,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { waterService } from '../api/waterService';
import { NewRequestModal } from '../components/NewRequestModal';
import { SupplyRequest, Invoice, StorageNode } from '../types';

export const CustomerPortal: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<SupplyRequest[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [storageNodes, setStorageNodes] = useState<StorageNode[]>([]);
  const [loading, setLoading] = useState(true);

  // Active tab in portal
  const [activeTab, setActiveTab] = useState<'orders' | 'bills' | 'quality' | 'report'>('orders');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Invoice | null>(null);

  // Leak report form
  const [reportZone, setReportZone] = useState('Central Urban Core');
  const [reportDesc, setReportDesc] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [r, inv, nodes] = await Promise.all([
        waterService.getSupplyRequests(),
        waterService.getInvoices(),
        waterService.getStorageNodes()
      ]);
      setRequests(r);
      setInvoices(inv);
      setStorageNodes(nodes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateBooking = async (data: any) => {
    await waterService.createSupplyRequest(data);
    await loadData();
  };

  const handlePayInvoice = async (invoiceId: string) => {
    const updated = await waterService.markInvoicePaid(invoiceId);
    setSelectedReceipt(updated);
    await loadData();
  };

  const handleReportLeak = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDesc.trim()) return;
    setReportSuccess(true);
    setReportDesc('');
    setTimeout(() => setReportSuccess(false), 5000);
  };

  const activeDeliveries = requests.filter(
    (r) => r.status === 'Pending' || r.status === 'Dispatched'
  );
  const pastDeliveries = requests.filter((r) => r.status === 'Delivered');

  return (
    <div className="space-y-6">
      
      {/* Consumer Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-sky-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-sky-100 text-xs font-semibold backdrop-blur-sm border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Water Quality Index in your ward: 96.8% (WHO Safe Grade A)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {user?.name || 'Valued Consumer'}!
          </h1>
          <p className="text-sm text-sky-100 max-w-2xl leading-relaxed">
            Welcome to the AquaLogix Citizen Water Supply Portal. Book on-demand bulk tankers, track delivery schedules, and inspect municipal potability.
          </p>
        </div>

        <button
          onClick={() => setIsBookingOpen(true)}
          className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-white text-sky-900 hover:bg-sky-50 font-bold text-sm shadow-lg transition-all transform hover:-translate-y-0.5 shrink-0"
        >
          <PlusCircle className="w-5 h-5 text-sky-600" />
          <span>Book Water Tanker Now</span>
        </button>
      </div>

      {/* Portal Tabs Bar */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-sm flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>My Water Deliveries ({activeDeliveries.length} Active)</span>
        </button>

        <button
          onClick={() => setActiveTab('bills')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bills'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ReceiptText className="w-4 h-4" />
          <span>My Bills & Receipts</span>
        </button>

        <button
          onClick={() => setActiveTab('quality')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'quality'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Waves className="w-4 h-4" />
          <span>Ward Water Safety & Purity</span>
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'report'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Report Street Leakage / Issue</span>
        </button>
      </div>

      {/* --- TAB 1: MY DELIVERIES & LIVE TRACKING --- */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Active Deliveries */}
          <div>
            <h2 className="text-lg font-black text-slate-900 mb-3 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-sky-600" />
              <span>Current Orders & Delivery Status</span>
            </h2>

            {activeDeliveries.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">No Active Tankers En Route</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  You do not have any pending water tanker orders right now. Click the button below if you need bulk potable water.
                </p>
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-sky-500 transition-all inline-flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Book Water Tanker</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeDeliveries.map((order) => {
                  const isDispatched = order.status === 'Dispatched';

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-slate-900 text-sm">{order.id}</span>
                            <span
                              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                                order.status === 'Dispatched'
                                  ? 'bg-blue-100 text-blue-800 animate-pulse'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {order.status === 'Dispatched' ? 'En Route to Delivery' : 'Awaiting Dispatch'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Requested by: <strong className="text-slate-800">{order.consumerName}</strong> • {order.category}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-slate-400">Total Volume & Tariff</span>
                          <p className="text-base font-black text-slate-900">
                            {order.requestedVolumeLiters.toLocaleString()} L • ₹{order.costEstimate}
                          </p>
                        </div>
                      </div>

                      {/* Visual 4-Step Delivery Progress Tracker */}
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                          Live Order Progress
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          
                          {/* Step 1: Order Received */}
                          <div className="space-y-1">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-xs font-bold shadow-sm">
                              ✓
                            </div>
                            <span className="font-bold text-slate-800 block text-[11px]">Order Confirmed</span>
                            <span className="text-[10px] text-slate-400">Slot: {order.scheduledTime}</span>
                          </div>

                          {/* Step 2: Tanker Allocation & Transit */}
                          <div className="space-y-1">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold transition-colors ${
                                isDispatched ? 'bg-sky-600 text-white shadow-md animate-pulse' : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              <Truck className="w-4 h-4" />
                            </div>
                            <span className={`font-bold block text-[11px] ${isDispatched ? 'text-sky-700' : 'text-slate-400'}`}>
                              {isDispatched ? 'Dispatched / In Transit' : 'Tanker Queued'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {order.assignedTankerId ? `Tanker: ${order.assignedTankerId}` : 'Nearest bay assigning'}
                            </span>
                          </div>

                          {/* Step 3: Offloading & Complete */}
                          <div className="space-y-1">
                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center mx-auto text-xs font-bold">
                              3
                            </div>
                            <span className="font-bold text-slate-400 block text-[11px]">Delivered & Invoiced</span>
                            <span className="text-[10px] text-slate-400">Piped to underground sumps</span>
                          </div>

                        </div>
                      </div>

                      {/* Destination Details & Hotline */}
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                          <span className="text-slate-600">
                            Delivery to: <strong className="text-slate-800">{order.deliveryAddress}</strong>
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-slate-500 text-[11px]">Need delivery update?</span>
                          <a
                            href="tel:18004252782"
                            className="px-2.5 py-1 bg-white border border-slate-200 text-sky-700 hover:text-sky-800 rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-sm"
                          >
                            <Phone className="w-3 h-3" /> Call Dispatch Desk
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past Fulfilled Deliveries */}
          {pastDeliveries.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Past Fulfilled Water Deliveries</h3>
              <div className="divide-y divide-slate-100">
                {pastDeliveries.map((past) => (
                  <div key={past.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-slate-800">{past.id}</span>
                      <p className="text-[11px] text-slate-500">
                        {past.requestedVolumeLiters.toLocaleString()} L ({past.waterType}) • {past.orderDate}
                      </p>
                    </div>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Successfully Delivered
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* --- TAB 2: MY BILLS & INVOICES --- */}
      {activeTab === 'bills' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">My Water Supply Invoices</h2>
              <p className="text-xs text-slate-500">Volumetric billing for delivered bulk municipal & potable water</p>
            </div>
            <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-3 py-1 rounded-xl">
              Standard Rate: ₹200 / 1kL (Potable)
            </span>
          </div>

          <div className="space-y-3">
            {invoices.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No invoices found on record.
              </div>
            ) : (
              invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-4 rounded-2xl border border-slate-200/80 hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-900 text-xs">{inv.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          inv.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inv.paymentStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Billed Volume: <strong>{inv.volumeDeliveredLiters.toLocaleString()} Liters</strong> • Cycle: {inv.billingPeriod}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Due Date: {inv.dueDate} {inv.paymentMethod && `• Settled via ${inv.paymentMethod}`}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Total Due</span>
                      <span className="text-base font-black text-slate-900">
                        ₹{inv.totalAmount.toLocaleString()}
                      </span>
                    </div>

                    {inv.paymentStatus !== 'Paid' ? (
                      <button
                        onClick={() => handlePayInvoice(inv.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay Online / UPI</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedReceipt(inv)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>View Receipt</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* --- TAB 3: WATER PURITY & RESERVOIR SAFETY BULLETIN --- */}
      {activeTab === 'quality' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Ward Municipal Potability & Quality Bulletin</span>
                </h2>
                <p className="text-xs text-slate-500">Live IoT sensor metrics from treatment plants feeding your ward</p>
              </div>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                100% Compliant with WHO Standards
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {storageNodes.map((node) => (
                <div key={node.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-sky-600 uppercase bg-sky-100 px-2 py-0.5 rounded">
                      {node.type}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{node.name}</h3>
                    <p className="text-[11px] text-slate-500">{node.zone}</p>
                  </div>

                  <div className="grid grid-cols-4 gap-1 text-center bg-white p-2.5 rounded-xl border border-slate-200 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">pH</span>
                      <strong className="text-slate-800">{node.waterQuality.ph}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">TDS</span>
                      <strong className="text-slate-800">{node.waterQuality.tds} ppm</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Turbidity</span>
                      <strong className="text-slate-800">{node.waterQuality.turbidity} NTU</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Chlorine</span>
                      <strong className="text-slate-800">{node.waterQuality.chlorine} mg/L</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-emerald-700 font-semibold pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Safe for Domestic Use
                    </span>
                    <span className="text-slate-400 font-normal">{node.lastUpdated}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 4: REPORT STREET LEAKAGE --- */}
      {activeTab === 'report' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm max-w-2xl mx-auto space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Report Pipeline Burst or Low Pressure Grievance</span>
            </h2>
            <p className="text-xs text-slate-500">
              Help municipal engineers save water. Reported leaks alert acoustic field inspectors instantly.
            </p>
          </div>

          {reportSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Thank you! Your grievance has been recorded and assigned to the nearest repair station.</span>
            </div>
          )}

          <form onSubmit={handleReportLeak} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Neighborhood / Ward Zone *
              </label>
              <select
                value={reportZone}
                onChange={(e) => setReportZone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="Central Urban Core">Central Urban Core</option>
                <option value="South-West Zone A">South-West Zone A</option>
                <option value="North Zone B">North Zone B</option>
                <option value="East Suburb Zone C">East Suburb Zone C</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Describe the Leak or Incident *
              </label>
              <textarea
                rows={3}
                required
                value={reportDesc}
                onChange={(e) => setReportDesc(e.target.value)}
                placeholder="e.g. Water leaking from main road pipe outside Apartment gate 3 near junction..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Grievance to Municipal Desk</span>
            </button>
          </form>
        </div>
      )}

      {/* Booking Modal */}
      <NewRequestModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSubmit={handleCreateBooking}
      />

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">Official Water Supply Receipt</h3>
              <p className="text-xs text-slate-500 font-mono">Invoice #{selectedReceipt.id}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Consumer:</span>
                <span className="font-bold text-slate-800">{selectedReceipt.consumerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Volume Supplied:</span>
                <span className="font-bold text-slate-800">{selectedReceipt.volumeDeliveredLiters.toLocaleString()} Liters</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-600">PAID</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="font-semibold text-slate-800">{selectedReceipt.paymentMethod || 'Online Gateway'}</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span className="font-bold text-slate-900">Amount Settled:</span>
                <span className="font-black text-sky-700 text-base">₹{selectedReceipt.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
