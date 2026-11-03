import React, { useState, useEffect } from 'react';
import {
  ReceiptText,
  CreditCard,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Download,
  Search,
  Filter,
  RefreshCw,
  Clock
} from 'lucide-react';
import { waterService } from '../api/waterService';
import { Invoice } from '../types';

export const BillingInvoicing: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<Invoice | null>(null);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await waterService.getInvoices();
      setInvoices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleMarkPaid = async (invoiceId: string) => {
    const updated = await waterService.markInvoicePaid(invoiceId);
    setSelectedReceipt(updated);
    await loadInvoices();
  };

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaid = invoices
    .filter((inv) => inv.paymentStatus === 'Paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPending = invoices
    .filter((inv) => inv.paymentStatus === 'Pending' || inv.paymentStatus === 'Overdue')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = statusFilter === 'all' || inv.paymentStatus.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.consumerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <ReceiptText className="w-7 h-7 text-sky-600" />
            <span>Water Supply Billing & Revenue Management</span>
          </h1>
          <p className="text-sm text-slate-500">
            Generate digital water invoices, track receivables, and manage municipal volumetric tariffs.
          </p>
        </div>

        <button
          onClick={loadInvoices}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-sky-600 rounded-xl text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Revenue Billed</p>
            <p className="text-2xl font-black text-slate-900 mt-1">₹{totalBilled.toLocaleString()}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">Current Billing Cycle</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Collections Received</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">₹{totalPaid.toLocaleString()}</p>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {Math.round((totalPaid / (totalBilled || 1)) * 100)}% Settled
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Outstanding Due</p>
            <p className="text-2xl font-black text-amber-600 mt-1">₹{totalPending.toLocaleString()}</p>
            <span className="text-[11px] text-amber-700 font-medium mt-1 block">Awaiting Bank Transfer / UPI</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tariff Rules Quick Bar */}
      <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-slate-700">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-sky-900 uppercase tracking-wide">Volumetric Tariff Rates:</span>
          <span>Potable: ₹200 / 1kL</span>
          <span className="text-slate-300">•</span>
          <span>Municipal: ₹160 / 1kL</span>
          <span className="text-slate-300">•</span>
          <span>Recycled: ₹120 / 1kL</span>
        </div>
        <span className="text-[11px] font-semibold text-sky-800 bg-sky-100 px-2.5 py-1 rounded-lg">
          Emergency Public Relief: Fully Subsidized
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl">
          {['all', 'pending', 'paid', 'overdue'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === status
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Invoice No</th>
                <th className="py-3.5 px-4">Customer & Order</th>
                <th className="py-3.5 px-4">Dates</th>
                <th className="py-3.5 px-4">Delivered Volume</th>
                <th className="py-3.5 px-4">Breakdown</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {inv.id}
                      <p className="text-[10px] text-slate-400 font-sans">{inv.billingPeriod}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800">{inv.consumerName}</span>
                      <p className="text-[10px] text-slate-500 font-mono">Ref: {inv.orderId}</p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <p>Issued: {inv.issueDate}</p>
                      <p className="text-[10px] text-slate-400">Due: {inv.dueDate}</p>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {inv.volumeDeliveredLiters.toLocaleString()} L
                      <p className="text-[10px] text-slate-400 font-normal">@ ₹{inv.ratePer1000L}/kL</p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <p>Subtotal: ₹{inv.subtotal}</p>
                      <p className="text-[10px] text-slate-400">GST (5%): ₹{inv.taxAmount}</p>
                    </td>

                    <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                      ₹{inv.totalAmount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          inv.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.paymentStatus === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {inv.paymentStatus}
                      </span>
                      {inv.paymentMethod && (
                        <p className="text-[10px] text-slate-400 mt-0.5">{inv.paymentMethod}</p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {inv.paymentStatus !== 'Paid' ? (
                        <button
                          onClick={() => handleMarkPaid(inv.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all inline-flex items-center gap-1"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Record Payment</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedReceipt(inv)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1"
                        >
                          <ReceiptText className="w-3.5 h-3.5" />
                          <span>View Receipt</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">Payment Receipt</h3>
              <p className="text-xs text-slate-500 font-mono">Invoice #{selectedReceipt.id}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-800">{selectedReceipt.consumerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Volume Supplied:</span>
                <span className="font-bold text-slate-800">{selectedReceipt.volumeDeliveredLiters.toLocaleString()} Liters</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Payment Status:</span>
                <span className="font-bold text-emerald-600">PAID</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Payment Method:</span>
                <span className="font-semibold text-slate-800">{selectedReceipt.paymentMethod || 'Online Gateway / UPI'}</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span className="font-bold text-slate-900">Total Settled:</span>
                <span className="font-black text-sky-700 text-base">₹{selectedReceipt.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
