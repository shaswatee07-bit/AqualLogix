import apiClient from './client';
import {
  initialTankers,
  initialStorageNodes,
  initialSupplyRequests,
  initialAlerts,
  initialInvoices,
  initialMetrics
} from './mockData';
import {
  Tanker,
  StorageNode,
  SupplyRequest,
  WaterAlert,
  Invoice,
  DashboardMetrics,
  TankerStatus,
  OrderStatus
} from '../types';

// Storage keys for persistent local demo state
const KEYS = {
  TANKERS: 'aqualogix_tankers',
  NODES: 'aqualogix_storage_nodes',
  REQUESTS: 'aqualogix_supply_requests',
  ALERTS: 'aqualogix_water_alerts',
  INVOICES: 'aqualogix_invoices',
  METRICS: 'aqualogix_metrics'
};

// Helper to initialize or retrieve local storage
const getOrInit = <T>(key: string, defaultData: T): T => {
  try {
    const existing = localStorage.getItem(key);
    if (!existing) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(existing) as T;
  } catch (err) {
    console.error(`Failed to load ${key} from storage:`, err);
    return defaultData;
  }
};

const saveItem = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save ${key} to storage:`, err);
  }
};

// Realistic network delay helper
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const waterService = {
  // --- Dashboard Metrics ---
  async getMetrics(): Promise<DashboardMetrics> {
    await delay(200);
    const tankers = getOrInit<Tanker[]>(KEYS.TANKERS, initialTankers);
    const nodes = getOrInit<StorageNode[]>(KEYS.NODES, initialStorageNodes);
    const requests = getOrInit<SupplyRequest[]>(KEYS.REQUESTS, initialSupplyRequests);
    const alerts = getOrInit<WaterAlert[]>(KEYS.ALERTS, initialAlerts);

    const activeTankersCount = tankers.filter(
      (t) => t.status === 'in_transit' || t.status === 'delivering'
    ).length;

    const totalStorageCapacityKL = nodes.reduce((sum, n) => sum + n.totalCapacityKL, 0);
    const currentStorageReserveKL = nodes.reduce((sum, n) => sum + n.currentLevelKL, 0);
    const pendingRequestsCount = requests.filter((r) => r.status === 'Pending').length;
    const activePipelineAlerts = alerts.filter((a) => a.status !== 'Resolved').length;

    const metrics: DashboardMetrics = {
      totalDistributedTodayKL: 1540.2,
      totalStorageCapacityKL,
      currentStorageReserveKL,
      activeTankersCount,
      totalTankersCount: tankers.length,
      pendingRequestsCount,
      activePipelineAlerts,
      waterQualityIndex: 96.8
    };

    saveItem(KEYS.METRICS, metrics);
    return metrics;
  },

  // --- Fleet / Tankers ---
  async getTankers(): Promise<Tanker[]> {
    await delay(250);
    return getOrInit<Tanker[]>(KEYS.TANKERS, initialTankers);
  },

  async updateTankerStatus(tankerId: string, status: TankerStatus, destination?: string): Promise<Tanker> {
    await delay(300);
    const tankers = getOrInit<Tanker[]>(KEYS.TANKERS, initialTankers);
    const index = tankers.findIndex((t) => t.id === tankerId);
    if (index === -1) throw new Error(`Tanker ${tankerId} not found`);

    tankers[index] = {
      ...tankers[index],
      status,
      destination: destination !== undefined ? destination : tankers[index].destination,
      currentLoadLiters: status === 'available' || status === 'maintenance' ? 0 : tankers[index].capacityLiters
    };

    saveItem(KEYS.TANKERS, tankers);
    return tankers[index];
  },

  // --- Storage Nodes & Reservoirs ---
  async getStorageNodes(): Promise<StorageNode[]> {
    await delay(250);
    return getOrInit<StorageNode[]>(KEYS.NODES, initialStorageNodes);
  },

  async updateNodeLevel(nodeId: string, levelKL: number): Promise<StorageNode> {
    await delay(250);
    const nodes = getOrInit<StorageNode[]>(KEYS.NODES, initialStorageNodes);
    const index = nodes.findIndex((n) => n.id === nodeId);
    if (index === -1) throw new Error(`Storage Node ${nodeId} not found`);

    const node = nodes[index];
    const newStatus =
      levelKL <= node.totalCapacityKL * 0.25
        ? 'critical'
        : levelKL <= node.totalCapacityKL * 0.45
        ? 'warning'
        : 'optimal';

    nodes[index] = {
      ...node,
      currentLevelKL: levelKL,
      status: newStatus,
      lastUpdated: 'Just now'
    };

    saveItem(KEYS.NODES, nodes);
    return nodes[index];
  },

  // --- Supply Requests / Orders ---
  async getSupplyRequests(): Promise<SupplyRequest[]> {
    await delay(250);
    return getOrInit<SupplyRequest[]>(KEYS.REQUESTS, initialSupplyRequests);
  },

  async createSupplyRequest(requestData: Omit<SupplyRequest, 'id' | 'orderDate' | 'status' | 'costEstimate'>): Promise<SupplyRequest> {
    await delay(350);
    const requests = getOrInit<SupplyRequest[]>(KEYS.REQUESTS, initialSupplyRequests);
    
    // Estimate cost: e.g. Rs 200 per 1000L
    const ratePer1000 = requestData.waterType === 'Potable Drinking' ? 200 : requestData.waterType === 'Recycled Greywater' ? 120 : 160;
    const costEstimate = Math.round((requestData.requestedVolumeLiters / 1000) * ratePer1000);

    const newRequest: SupplyRequest = {
      ...requestData,
      id: `REQ-${new Date().getFullYear()}-${String(requests.length + 90).padStart(3, '0')}`,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      costEstimate
    };

    requests.unshift(newRequest);
    saveItem(KEYS.REQUESTS, requests);
    return newRequest;
  },

  async dispatchTankerToOrder(orderId: string, tankerId: string): Promise<{ order: SupplyRequest; tanker: Tanker }> {
    await delay(300);
    const requests = getOrInit<SupplyRequest[]>(KEYS.REQUESTS, initialSupplyRequests);
    const tankers = getOrInit<Tanker[]>(KEYS.TANKERS, initialTankers);

    const orderIdx = requests.findIndex((r) => r.id === orderId);
    const tankerIdx = tankers.findIndex((t) => t.id === tankerId);

    if (orderIdx === -1) throw new Error('Order not found');
    if (tankerIdx === -1) throw new Error('Tanker not found');

    // Update order
    requests[orderIdx].status = 'Dispatched';
    requests[orderIdx].assignedTankerId = tankerId;

    // Update tanker
    tankers[tankerIdx].status = 'in_transit';
    tankers[tankerIdx].destination = requests[orderIdx].deliveryAddress;
    tankers[tankerIdx].assignedOrderId = orderId;
    tankers[tankerIdx].currentLoadLiters = Math.min(
      tankers[tankerIdx].capacityLiters,
      requests[orderIdx].requestedVolumeLiters
    );

    saveItem(KEYS.REQUESTS, requests);
    saveItem(KEYS.TANKERS, tankers);

    // Also auto-generate an invoice if one doesn't exist
    const invoices = getOrInit<Invoice[]>(KEYS.INVOICES, initialInvoices);
    const existingInv = invoices.find((inv) => inv.orderId === orderId);
    if (!existingInv) {
      const vol = requests[orderIdx].requestedVolumeLiters;
      const subtotal = requests[orderIdx].costEstimate;
      const taxAmount = Math.round(subtotal * 0.05);
      const newInvoice: Invoice = {
        id: `INV-2026-${String(invoices.length + 42).padStart(3, '0')}`,
        orderId,
        consumerName: requests[orderIdx].consumerName,
        billingPeriod: `${new Date().toLocaleString('default', { month: 'short' })} 2026 - Cycle 1`,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        volumeDeliveredLiters: vol,
        ratePer1000L: Math.round(subtotal / (vol / 1000)),
        subtotal,
        taxAmount,
        totalAmount: subtotal + taxAmount,
        paymentStatus: 'Pending'
      };
      invoices.unshift(newInvoice);
      saveItem(KEYS.INVOICES, invoices);
    }

    return { order: requests[orderIdx], tanker: tankers[tankerIdx] };
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<SupplyRequest> {
    await delay(200);
    const requests = getOrInit<SupplyRequest[]>(KEYS.REQUESTS, initialSupplyRequests);
    const index = requests.findIndex((r) => r.id === orderId);
    if (index === -1) throw new Error('Order not found');

    requests[index].status = status;
    saveItem(KEYS.REQUESTS, requests);
    return requests[index];
  },

  // --- Alerts & Pipeline Monitoring ---
  async getAlerts(): Promise<WaterAlert[]> {
    await delay(200);
    return getOrInit<WaterAlert[]>(KEYS.ALERTS, initialAlerts);
  },

  async resolveAlert(alertId: string): Promise<WaterAlert> {
    await delay(200);
    const alerts = getOrInit<WaterAlert[]>(KEYS.ALERTS, initialAlerts);
    const index = alerts.findIndex((a) => a.id === alertId);
    if (index === -1) throw new Error('Alert not found');

    alerts[index].status = 'Resolved';
    saveItem(KEYS.ALERTS, alerts);
    return alerts[index];
  },

  // --- Invoices & Billing ---
  async getInvoices(): Promise<Invoice[]> {
    await delay(250);
    return getOrInit<Invoice[]>(KEYS.INVOICES, initialInvoices);
  },

  async markInvoicePaid(invoiceId: string, paymentMethod = 'Online Portal / UPI'): Promise<Invoice> {
    await delay(300);
    const invoices = getOrInit<Invoice[]>(KEYS.INVOICES, initialInvoices);
    const index = invoices.findIndex((i) => i.id === invoiceId);
    if (index === -1) throw new Error('Invoice not found');

    invoices[index].paymentStatus = 'Paid';
    invoices[index].paymentMethod = paymentMethod;
    saveItem(KEYS.INVOICES, invoices);
    return invoices[index];
  },

  // --- Reset All Data ---
  async resetDemoData(): Promise<void> {
    localStorage.removeItem(KEYS.TANKERS);
    localStorage.removeItem(KEYS.NODES);
    localStorage.removeItem(KEYS.REQUESTS);
    localStorage.removeItem(KEYS.ALERTS);
    localStorage.removeItem(KEYS.INVOICES);
    localStorage.removeItem(KEYS.METRICS);
    await delay(100);
  }
};
