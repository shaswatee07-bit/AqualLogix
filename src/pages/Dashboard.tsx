import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Truck,
  Waves,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '../components/StatCard';
import { TankerCard } from '../components/TankerCard';
import { NewRequestModal } from '../components/NewRequestModal';
import { DispatchModal } from '../components/DispatchModal';
import { waterService } from '../api/waterService';
import {
  DashboardMetrics,
  Tanker,
  StorageNode,
  SupplyRequest,
  WaterAlert,
  TankerStatus
} from '../types';

export const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [tankers, setTankers] = useState<Tanker[]>([]);
  const [nodes, setNodes] = useState<StorageNode[]>([]);
  const [requests, setRequests] = useState<SupplyRequest[]>([]);
  const [alerts, setAlerts] = useState<WaterAlert[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [dispatchOrder, setDispatchOrder] = useState<SupplyRequest | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [m, t, n, r, a] = await Promise.all([
        waterService.getMetrics(),
        waterService.getTankers(),
        waterService.getStorageNodes(),
        waterService.getSupplyRequests(),
        waterService.getAlerts()
      ]);
      setMetrics(m);
      setTankers(t);
      setNodes(n);
      setRequests(r);
      setAlerts(a);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
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

  const handleUpdateTankerStatus = async (tankerId: string, status: TankerStatus) => {
    await waterService.updateTankerStatus(tankerId, status);
    await loadData();
  };

  const handleDispatch = async (orderId: string, tankerId: string) => {
    await waterService.dispatchTankerToOrder(orderId, tankerId);
    await loadData();
  };

  const handleResolveAlert = async (alertId: string) => {
    await waterService.resolveAlert(alertId);
    await loadData();
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading AquaLogix Operations...</p>
        </div>
      </div>
    );
  }

  const storagePercentage = metrics
    ? Math.round((metrics.currentStorageReserveKL / metrics.totalStorageCapacityKL) * 100)
    : 72;

  const pendingOrders = requests.filter((r) => r.status === 'Pending');
  const activeAlerts = alerts.filter((a) => a.status !== 'Resolved');

  return (
    <div className="space-y-6">
      
      {/* Welcome & Command Header */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-sky-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-sky-500/20 px-3 py-1 rounded-full text-sky-200 text-xs font-semibold backdrop-blur-sm border border-sky-400/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Water Supply Grid Operating at Normal Purity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Central Water Logistics & Supply Console
          </h1>
          <p className="text-sm text-sky-100 max-w-2xl leading-relaxed">
            Monitor real-time bulk tanker movements, municipal reservoir capacities, leak alerts, and on-demand consumer distribution.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsNewRequestOpen(true)}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white text-sky-900 hover:bg-sky-50 font-bold text-sm shadow-md transition-all duration-150 transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4 text-sky-600" />
            <span>Book Water Tanker</span>
          </button>
          <Link
            to="/admin/fleet"
            className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-all"
          >
            <Truck className="w-4 h-4" />
            <span>Fleet View</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Daily Water Distributed"
          value={metrics ? metrics.totalDistributedTodayKL.toLocaleString() : '1,540'}
          unit="KL"
          icon={Droplets}
          iconColor="text-sky-600"
          bgColor="bg-sky-50"
          trend={{ value: '+8.4%', isPositive: true, label: 'vs yesterday' }}
        />

        <StatCard
          title="Active Tankers on Route"
          value={metrics ? `${metrics.activeTankersCount} / ${metrics.totalTankersCount}` : '4 / 6'}
          unit="Vehicles"
          icon={Truck}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
          trend={{ value: '67% Fleet Active', isPositive: true }}
        />

        <StatCard
          title="Reservoir Storage Reserve"
          value={metrics ? metrics.currentStorageReserveKL.toLocaleString() : '82,400'}
          unit="KL"
          icon={Waves}
          iconColor="text-emerald-600"
          bgColor="bg-emerald-50"
          trend={{ value: `${storagePercentage}% Capacity`, isPositive: storagePercentage > 50 }}
        />

        <StatCard
          title="Active Pressure Alerts"
          value={activeAlerts.length}
          unit="Sensor Events"
          icon={AlertTriangle}
          iconColor={activeAlerts.length > 0 ? 'text-rose-600' : 'text-slate-400'}
          bgColor={activeAlerts.length > 0 ? 'bg-rose-50' : 'bg-slate-100'}
          trend={{
            value: activeAlerts.length > 0 ? 'Attention Needed' : 'Normal',
            isPositive: activeAlerts.length === 0
          }}
        />
      </div>

      {/* Main Grid: Pending Requests & Reservoir Levels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Urgent & Pending Water Requests (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <span>Pending Water Dispatch Queue</span>
                {pendingOrders.length > 0 && (
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">
                    {pendingOrders.length} Waiting
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500">Orders awaiting tanker allocation and route authorization</p>
            </div>
            <Link
              to="/admin/requests"
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {pendingOrders.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                All water supply requests have been dispatched!
              </div>
            ) : (
              pendingOrders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl border border-slate-200/80 hover:border-sky-300 hover:bg-sky-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{order.consumerName}</span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          order.urgency === 'Emergency Relief'
                            ? 'bg-rose-100 text-rose-800 animate-pulse'
                            : order.urgency === 'Priority'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {order.urgency}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-sky-700">
                        <Droplets className="w-3 h-3" /> {order.requestedVolumeLiters.toLocaleString()} L ({order.waterType})
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" /> {order.zone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> Slot: {order.scheduledTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <a
                      href={`tel:${order.phone}`}
                      className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl border border-slate-200 transition-colors"
                      title="Call Consumer"
                    >
                      <PhoneCall className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => setDispatchOrder(order)}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-sky-600/20 transition-all flex items-center space-x-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Assign Tanker</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reservoir Capacity Overview Widget (1 Col) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Waves className="w-4 h-4 text-sky-600" />
                <span>Reservoir Levels</span>
              </h2>
              <Link to="/admin/reservoirs" className="text-xs font-semibold text-sky-600 hover:text-sky-700">
                SCADA View
              </Link>
            </div>

            <div className="mt-4 space-y-4">
              {nodes.slice(0, 4).map((node) => {
                const pct = Math.round((node.currentLevelKL / node.totalCapacityKL) * 100);
                return (
                  <div key={node.id} className="space-y-1.5">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                        {node.name}
                      </span>
                      <span className={`font-bold ${pct < 30 ? 'text-rose-600' : 'text-slate-700'}`}>
                        {pct}% ({node.currentLevelKL.toLocaleString()} KL)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${
                          pct < 30 ? 'bg-rose-500' : pct < 50 ? 'bg-amber-400' : 'bg-sky-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 bg-sky-50/60 rounded-2xl p-3.5 border border-sky-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Telemetry Potability Index</span>
              <span className="font-extrabold text-emerald-700">
                {metrics?.waterQualityIndex || 96.8}% (Grade A)
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Automated pH, chlorine residual, and NTU turbidity compliant with WHO drinking standards.
            </p>
          </div>
        </div>

      </div>

      {/* Active Tanker Fleet Operations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-slate-900 text-lg">Active Fleet & Tanker Logistics</h2>
            <p className="text-xs text-slate-500">Real-time status of water distribution vehicles</p>
          </div>
          <Link
            to="/admin/fleet"
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center space-x-1"
          >
            <span>Manage All Tankers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tankers.slice(0, 3).map((tanker) => (
            <TankerCard
              key={tanker.id}
              tanker={tanker}
              onUpdateStatus={handleUpdateTankerStatus}
            />
          ))}
        </div>
      </div>

      {/* Pipeline Leakage Alerts Banner */}
      {activeAlerts.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-rose-100 text-rose-700 rounded-2xl shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-rose-950 text-sm">
                    {activeAlerts[0].title}
                  </h3>
                  <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {activeAlerts[0].severity}
                  </span>
                </div>
                <p className="text-xs text-rose-800 leading-relaxed">
                  {activeAlerts[0].description} • Est. Loss: {activeAlerts[0].estimatedLossPerHourKL} KL/hr
                </p>
                <p className="text-[11px] text-rose-600 font-medium">
                  Zone: {activeAlerts[0].zone} • Reported: {activeAlerts[0].timestamp}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => handleResolveAlert(activeAlerts[0].id)}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Mark Resolved
              </button>
              <Link
                to="/admin/analytics"
                className="px-3 py-1.5 bg-white border border-rose-200 text-rose-800 hover:bg-rose-100/50 text-xs font-semibold rounded-xl transition-colors"
              >
                All Alerts
              </Link>
            </div>
          </div>
        </div>
      )}

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
