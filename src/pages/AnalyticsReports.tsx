import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Droplets,
  ShieldAlert,
  Wrench,
  Clock,
  Gauge,
  RefreshCw
} from 'lucide-react';
import { waterService } from '../api/waterService';
import { WaterAlert } from '../types';

export const AnalyticsReports: React.FC = () => {
  const [alerts, setAlerts] = useState<WaterAlert[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await waterService.getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleResolve = async (alertId: string) => {
    await waterService.resolveAlert(alertId);
    await loadAlerts();
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity === 'all') return true;
    return a.severity === filterSeverity;
  });

  const activeAlerts = alerts.filter((a) => a.status !== 'Resolved');
  const totalWaterLostKL = alerts
    .filter((a) => a.status !== 'Resolved')
    .reduce((sum, a) => sum + a.estimatedLossPerHourKL, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <Activity className="w-7 h-7 text-sky-600" />
            <span>Grid Telemetry, Leakage & NRW Analytics</span>
          </h1>
          <p className="text-sm text-slate-500">
            Acoustic pipeline sensors, Non-Revenue Water (NRW) diagnostics, and automated anomaly responses.
          </p>
        </div>

        <button
          onClick={loadAlerts}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-sky-600 rounded-xl text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Poll IoT Sensors</span>
        </button>
      </div>

      {/* Diagnostics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Active Pipe Alerts</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{activeAlerts.length}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">Acoustic & Pressure Sensors</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Suspected Loss Rate</p>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl font-black text-amber-600">{totalWaterLostKL}</span>
              <span className="text-xs text-slate-500 font-semibold">KL / hr</span>
            </div>
            <span className="text-[11px] text-amber-700 font-medium mt-1 block">Non-Revenue Loss</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Droplets className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Average Turnaround</p>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl font-black text-sky-600">38</span>
              <span className="text-xs text-slate-500 font-semibold">Mins</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block flex items-center gap-1">
              <TrendingDown className="w-3 h-3" /> 12% faster delivery
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Grid Integrity Index</p>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl font-black text-emerald-600">94.2</span>
              <span className="text-xs text-emerald-700 font-bold">%</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Optimal hydraulic stability</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Gauge className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Acoustic & Telemetry Alerts List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-sky-600" />
              <span>Pipeline Telemetry & Acoustic Anomaly Feed</span>
            </h2>
            <p className="text-xs text-slate-500">Live sensor incidents detected by smart grid flow transmitters</p>
          </div>

          <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl">
            {['all', 'critical', 'medium', 'low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filterSeverity === sev
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No anomalies found for the selected severity.
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  alert.status === 'Resolved'
                    ? 'bg-slate-50/70 border-slate-200 opacity-70'
                    : alert.severity === 'critical'
                    ? 'bg-rose-50/60 border-rose-200'
                    : alert.severity === 'medium'
                    ? 'bg-amber-50/60 border-amber-200'
                    : 'bg-sky-50/60 border-sky-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-900 text-xs">{alert.id}</span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                        alert.severity === 'critical'
                          ? 'bg-rose-600 text-white'
                          : alert.severity === 'medium'
                          ? 'bg-amber-500 text-white'
                          : 'bg-sky-600 text-white'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{alert.title}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{alert.description}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-1">
                    <span>Zone: <strong className="text-slate-700">{alert.zone}</strong></span>
                    {alert.pipelineId && <span>Line: <strong className="font-mono text-slate-700">{alert.pipelineId}</strong></span>}
                    <span>Reported: {alert.timestamp}</span>
                    {alert.estimatedLossPerHourKL > 0 && (
                      <span className="text-rose-600 font-bold">
                        Loss Rate: ~{alert.estimatedLossPerHourKL} KL/hr
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {alert.status !== 'Resolved' ? (
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Dispatch Repair & Resolve</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Resolved</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
