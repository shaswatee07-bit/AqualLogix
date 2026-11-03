export type WaterType = 'Potable Drinking' | 'Treated Municipal' | 'Industrial Grade' | 'Recycled Greywater';

export type TankerStatus = 'available' | 'loading' | 'in_transit' | 'delivering' | 'maintenance';

export interface Tanker {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  capacityLiters: number;
  currentLoadLiters: number;
  status: TankerStatus;
  currentLocation: string;
  destination?: string;
  assignedOrderId?: string;
  waterType: WaterType;
  fuelPercent: number;
  lastMaintenance: string;
  gpsCoordinates: { lat: number; lng: number };
}

export type StorageNodeType = 'Reservoir' | 'Treatment Plant' | 'Overhead Tank' | 'Pumping Station';

export interface WaterQuality {
  ph: number;
  tds: number; // ppm
  turbidity: number; // NTU
  chlorine: number; // mg/L
}

export interface StorageNode {
  id: string;
  name: string;
  type: StorageNodeType;
  zone: string;
  totalCapacityKL: number; // Kilo-liters
  currentLevelKL: number;
  inflowRateLps: number; // Liters per second
  outflowRateLps: number;
  status: 'optimal' | 'warning' | 'critical' | 'maintenance';
  waterQuality: WaterQuality;
  lastUpdated: string;
}

export type OrderUrgency = 'Standard' | 'Priority' | 'Emergency Relief';

export type OrderStatus = 'Pending' | 'Scheduled' | 'Dispatched' | 'Delivered' | 'Cancelled';

export type CustomerCategory = 'Residential Community' | 'Hospital & Healthcare' | 'Commercial Park' | 'Municipal Ward' | 'Educational Institution';

export interface SupplyRequest {
  id: string;
  consumerName: string;
  category: CustomerCategory;
  phone: string;
  deliveryAddress: string;
  zone: string;
  requestedVolumeLiters: number;
  urgency: OrderUrgency;
  waterType: WaterType;
  orderDate: string;
  scheduledTime: string;
  status: OrderStatus;
  assignedTankerId?: string;
  costEstimate: number;
}

export interface WaterAlert {
  id: string;
  zone: string;
  pipelineId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  status: 'Active' | 'Investigating' | 'Resolved';
  estimatedLossPerHourKL: number;
}

export interface Invoice {
  id: string;
  orderId: string;
  consumerName: string;
  billingPeriod: string;
  issueDate: string;
  dueDate: string;
  volumeDeliveredLiters: number;
  ratePer1000L: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  paymentMethod?: string;
}

export interface DashboardMetrics {
  totalDistributedTodayKL: number;
  totalStorageCapacityKL: number;
  currentStorageReserveKL: number;
  activeTankersCount: number;
  totalTankersCount: number;
  pendingRequestsCount: number;
  activePipelineAlerts: number;
  waterQualityIndex: number;
}

export type UserRole =
  | 'Consumer / Citizen'
  | 'Operations Dispatcher'
  | 'Fleet Supervisor'
  | 'Water Quality Inspector'
  | 'Municipal Administrator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  zone: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
