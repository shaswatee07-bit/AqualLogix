import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CustomerNavbar } from './components/CustomerNavbar';
import { Dashboard } from './pages/Dashboard';
import { LogisticsFleet } from './pages/LogisticsFleet';
import { ReservoirsDistribution } from './pages/ReservoirsDistribution';
import { SupplyRequests } from './pages/SupplyRequests';
import { BillingInvoicing } from './pages/BillingInvoicing';
import { AnalyticsReports } from './pages/AnalyticsReports';
import { CustomerPortal } from './pages/CustomerPortal';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { waterService } from './api/waterService';
import { NewRequestModal } from './components/NewRequestModal';

// --- ADMIN OPERATIONS SUITE LAYOUT (/admin/*) ---
const AdminLayout: React.FC = () => {
  const [activeAlertsCount, setActiveAlertsCount] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  const fetchGlobalBadgeCounts = async () => {
    try {
      const [alerts, requests] = await Promise.all([
        waterService.getAlerts(),
        waterService.getSupplyRequests()
      ]);
      setActiveAlertsCount(alerts.filter((a) => a.status !== 'Resolved').length);
      setPendingRequestsCount(requests.filter((r) => r.status === 'Pending').length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGlobalBadgeCounts();
    const interval = setInterval(fetchGlobalBadgeCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleResetData = async () => {
    if (window.confirm('Reset all demo data back to default initial values?')) {
      await waterService.resetDemoData();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navbar
        activeAlertsCount={activeAlertsCount}
        onResetData={handleResetData}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          pendingCount={pendingRequestsCount}
          alertsCount={activeAlertsCount}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/fleet" element={<LogisticsFleet />} />
            <Route path="/reservoirs" element={<ReservoirsDistribution />} />
            <Route path="/requests" element={<SupplyRequests />} />
            <Route path="/billing" element={<BillingInvoicing />} />
            <Route path="/analytics" element={<AnalyticsReports />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// --- CONSUMER & CITIZEN PORTAL LAYOUT (/portal/*) ---
const ConsumerLayout: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);

  const fetchConsumerBadges = async () => {
    try {
      const requests = await waterService.getSupplyRequests();
      setActiveOrdersCount(requests.filter((r) => r.status !== 'Delivered').length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConsumerBadges();
  }, []);

  const handleCreateBooking = async (data: any) => {
    await waterService.createSupplyRequest(data);
    await fetchConsumerBadges();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <CustomerNavbar
        onOpenBooking={() => setIsBookingOpen(true)}
        activeOrdersCount={activeOrdersCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <CustomerPortal />
      </main>

      <NewRequestModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSubmit={handleCreateBooking}
      />
    </div>
  );
};

// --- ROOT REDIRECTOR ---
const HomeRedirector: React.FC = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  return <Navigate to="/portal" replace />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Authentication */}
        <Route path="/login" element={<Login />} />

        {/* Root Redirector based on user role */}
        <Route path="/" element={<HomeRedirector />} />

        {/* Customer / Citizen Portal */}
        <Route
          path="/portal/*"
          element={
            <ProtectedRoute>
              <ConsumerLayout />
            </ProtectedRoute>
          }
        />

        {/* Dedicated Admin Operations Suite */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<HomeRedirector />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
