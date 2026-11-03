import { Tanker, StorageNode, SupplyRequest, WaterAlert, Invoice, DashboardMetrics } from '../types';

export const initialTankers: Tanker[] = [
  {
    id: 'TNK-101',
    vehicleNumber: 'KA-04-WQ-8821',
    driverName: 'Vikram Singh',
    driverPhone: '+91 98450 12390',
    capacityLiters: 12000,
    currentLoadLiters: 12000,
    status: 'in_transit',
    currentLocation: 'Outer Ring Road, Junction 4',
    destination: 'Greenwood Valley Apartments (Ward 14)',
    assignedOrderId: 'REQ-2026-089',
    waterType: 'Potable Drinking',
    fuelPercent: 78,
    lastMaintenance: '2026-10-15',
    gpsCoordinates: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: 'TNK-102',
    vehicleNumber: 'KA-04-WQ-4412',
    driverName: 'Ramesh Patil',
    driverPhone: '+91 98450 99412',
    capacityLiters: 15000,
    currentLoadLiters: 0,
    status: 'loading',
    currentLocation: 'South Treatment Plant, Gate 2',
    destination: 'Refilling Bay 3',
    assignedOrderId: undefined,
    waterType: 'Potable Drinking',
    fuelPercent: 92,
    lastMaintenance: '2026-10-22',
    gpsCoordinates: { lat: 12.9352, lng: 77.6245 }
  },
  {
    id: 'TNK-103',
    vehicleNumber: 'KA-04-WQ-9011',
    driverName: 'Arjun Das',
    driverPhone: '+91 98711 55662',
    capacityLiters: 9000,
    currentLoadLiters: 9000,
    status: 'delivering',
    currentLocation: 'St. Jude Memorial Hospital, East Wing',
    destination: 'Emergency Reserve Tanks',
    assignedOrderId: 'REQ-2026-092',
    waterType: 'Potable Drinking',
    fuelPercent: 64,
    lastMaintenance: '2026-10-02',
    gpsCoordinates: { lat: 12.9810, lng: 77.6412 }
  },
  {
    id: 'TNK-104',
    vehicleNumber: 'KA-04-WQ-3389',
    driverName: 'Karthik Rao',
    driverPhone: '+91 94480 33410',
    capacityLiters: 20000,
    currentLoadLiters: 0,
    status: 'available',
    currentLocation: 'Central Logistics Hub, Bay 5',
    assignedOrderId: undefined,
    waterType: 'Industrial Grade',
    fuelPercent: 88,
    lastMaintenance: '2026-10-28',
    gpsCoordinates: { lat: 12.9550, lng: 77.5800 }
  },
  {
    id: 'TNK-105',
    vehicleNumber: 'KA-04-WQ-7720',
    driverName: 'Gurpreet Singh',
    driverPhone: '+91 97720 11982',
    capacityLiters: 10000,
    currentLoadLiters: 0,
    status: 'maintenance',
    currentLocation: 'Workshop Bay B',
    assignedOrderId: undefined,
    waterType: 'Treated Municipal',
    fuelPercent: 35,
    lastMaintenance: '2026-11-01',
    gpsCoordinates: { lat: 12.9600, lng: 77.5700 }
  },
  {
    id: 'TNK-106',
    vehicleNumber: 'KA-04-WQ-6518',
    driverName: 'Suresh Gowda',
    driverPhone: '+91 96112 44781',
    capacityLiters: 12000,
    currentLoadLiters: 12000,
    status: 'in_transit',
    currentLocation: 'Bellandur Flyover Bypass',
    destination: 'TechPark Block 4',
    assignedOrderId: 'REQ-2026-095',
    waterType: 'Recycled Greywater',
    fuelPercent: 82,
    lastMaintenance: '2026-10-18',
    gpsCoordinates: { lat: 12.9350, lng: 77.6800 }
  }
];

export const initialStorageNodes: StorageNode[] = [
  {
    id: 'NODE-01',
    name: 'Kaveri Main Treatment Plant & Reservoir',
    type: 'Treatment Plant',
    zone: 'South-West Zone A',
    totalCapacityKL: 50000,
    currentLevelKL: 41200,
    inflowRateLps: 340,
    outflowRateLps: 310,
    status: 'optimal',
    waterQuality: { ph: 7.2, tds: 180, turbidity: 0.8, chlorine: 1.2 },
    lastUpdated: '10 mins ago'
  },
  {
    id: 'NODE-02',
    name: 'North City Elevated Reservoir (OHT-4)',
    type: 'Overhead Tank',
    zone: 'North Zone B',
    totalCapacityKL: 12000,
    currentLevelKL: 8900,
    inflowRateLps: 110,
    outflowRateLps: 145,
    status: 'optimal',
    waterQuality: { ph: 7.4, tds: 195, turbidity: 0.9, chlorine: 1.1 },
    lastUpdated: '5 mins ago'
  },
  {
    id: 'NODE-03',
    name: 'East Tech Corridor Booster Station',
    type: 'Pumping Station',
    zone: 'East Industrial Zone',
    totalCapacityKL: 8000,
    currentLevelKL: 2400,
    inflowRateLps: 45,
    outflowRateLps: 90,
    status: 'warning',
    waterQuality: { ph: 6.9, tds: 240, turbidity: 1.4, chlorine: 0.8 },
    lastUpdated: '2 mins ago'
  },
  {
    id: 'NODE-04',
    name: 'Old Cantonment Underground Reservoir',
    type: 'Reservoir',
    zone: 'Central Urban Core',
    totalCapacityKL: 30000,
    currentLevelKL: 26800,
    inflowRateLps: 200,
    outflowRateLps: 195,
    status: 'optimal',
    waterQuality: { ph: 7.1, tds: 165, turbidity: 0.6, chlorine: 1.3 },
    lastUpdated: '12 mins ago'
  },
  {
    id: 'NODE-05',
    name: 'Whitefield Satellite Booster Hub',
    type: 'Overhead Tank',
    zone: 'East Suburb Zone C',
    totalCapacityKL: 15000,
    currentLevelKL: 3100,
    inflowRateLps: 20,
    outflowRateLps: 80,
    status: 'critical',
    waterQuality: { ph: 7.6, tds: 310, turbidity: 2.1, chlorine: 0.5 },
    lastUpdated: 'Just now'
  }
];

export const initialSupplyRequests: SupplyRequest[] = [
  {
    id: 'REQ-2026-089',
    consumerName: 'Greenwood Valley RWA',
    category: 'Residential Community',
    phone: '+91 98440 88210',
    deliveryAddress: 'Tower 4 & 5, Haralur Road, Bangalore',
    zone: 'South-East Zone',
    requestedVolumeLiters: 12000,
    urgency: 'Standard',
    waterType: 'Potable Drinking',
    orderDate: '2026-11-03',
    scheduledTime: '11:30 AM',
    status: 'Dispatched',
    assignedTankerId: 'TNK-101',
    costEstimate: 2400
  },
  {
    id: 'REQ-2026-092',
    consumerName: 'St. Jude Memorial Hospital',
    category: 'Hospital & Healthcare',
    phone: '+91 98221 11090',
    deliveryAddress: 'Emergency Ward Block, Ring Road',
    zone: 'North Zone',
    requestedVolumeLiters: 9000,
    urgency: 'Emergency Relief',
    waterType: 'Potable Drinking',
    orderDate: '2026-11-03',
    scheduledTime: '10:45 AM',
    status: 'Dispatched',
    assignedTankerId: 'TNK-103',
    costEstimate: 1800
  },
  {
    id: 'REQ-2026-095',
    consumerName: 'Apex Cloud TechPark (Facility Mgt)',
    category: 'Commercial Park',
    phone: '+91 99011 44550',
    deliveryAddress: 'Plot 12, Phase 2, EPIP Zone',
    zone: 'East Zone',
    requestedVolumeLiters: 12000,
    urgency: 'Priority',
    waterType: 'Recycled Greywater',
    orderDate: '2026-11-03',
    scheduledTime: '12:15 PM',
    status: 'Dispatched',
    assignedTankerId: 'TNK-106',
    costEstimate: 1600
  },
  {
    id: 'REQ-2026-098',
    consumerName: 'National Public High School',
    category: 'Educational Institution',
    phone: '+91 98452 77123',
    deliveryAddress: '14th Cross, Malleshwaram',
    zone: 'West Zone',
    requestedVolumeLiters: 6000,
    urgency: 'Standard',
    waterType: 'Potable Drinking',
    orderDate: '2026-11-03',
    scheduledTime: '02:00 PM',
    status: 'Pending',
    costEstimate: 1200
  },
  {
    id: 'REQ-2026-099',
    consumerName: 'Ward 87 Municipal Relief Camp',
    category: 'Municipal Ward',
    phone: '+91 94481 00982',
    deliveryAddress: 'Community Center Ground, Ward 87',
    zone: 'South Zone',
    requestedVolumeLiters: 20000,
    urgency: 'Emergency Relief',
    waterType: 'Potable Drinking',
    orderDate: '2026-11-03',
    scheduledTime: '01:30 PM',
    status: 'Pending',
    costEstimate: 4000
  }
];

export const initialAlerts: WaterAlert[] = [
  {
    id: 'ALT-401',
    zone: 'East Suburb Zone C',
    pipelineId: 'PIPE-DN-450-E',
    severity: 'critical',
    title: 'Rapid Pressure Drop & Suspected Rupture',
    description: 'Pressure fell from 4.2 bar to 1.1 bar near Whitefield Satellite Hub feeder line. Acoustic sensor indicates high volume water displacement.',
    timestamp: '18 mins ago',
    status: 'Active',
    estimatedLossPerHourKL: 45
  },
  {
    id: 'ALT-402',
    zone: 'South-West Zone A',
    pipelineId: 'PMP-KW-02',
    severity: 'medium',
    title: 'Secondary Pump Vibration Anomaly',
    description: 'Vibration harmonics exceeded normal operating threshold by 24% at Kaveri Booster Pump #2.',
    timestamp: '1 hour ago',
    status: 'Investigating',
    estimatedLossPerHourKL: 0
  },
  {
    id: 'ALT-403',
    zone: 'Central Urban Core',
    pipelineId: 'VALVE-CT-12',
    severity: 'low',
    title: 'Slight Turbidity Spike (1.4 NTU)',
    description: 'Post-filtration turbidity momentarily rose during filter backwash cycle. Automated chlorination adjusted.',
    timestamp: '3 hours ago',
    status: 'Resolved',
    estimatedLossPerHourKL: 0
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'INV-2026-041',
    orderId: 'REQ-2026-089',
    consumerName: 'Greenwood Valley RWA',
    billingPeriod: 'Nov 2026 - Cycle 1',
    issueDate: '2026-11-03',
    dueDate: '2026-11-10',
    volumeDeliveredLiters: 12000,
    ratePer1000L: 200,
    subtotal: 2400,
    taxAmount: 120,
    totalAmount: 2520,
    paymentStatus: 'Pending'
  },
  {
    id: 'INV-2026-039',
    orderId: 'REQ-2026-077',
    consumerName: 'Metro Life Diagnostic Center',
    billingPeriod: 'Oct 2026 - Cycle 4',
    issueDate: '2026-10-31',
    dueDate: '2026-11-07',
    volumeDeliveredLiters: 15000,
    ratePer1000L: 200,
    subtotal: 3000,
    taxAmount: 150,
    totalAmount: 3150,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI / Corporate NetBanking'
  },
  {
    id: 'INV-2026-038',
    orderId: 'REQ-2026-068',
    consumerName: 'Zenith Tech Tower 3',
    billingPeriod: 'Oct 2026 - Cycle 4',
    issueDate: '2026-10-29',
    dueDate: '2026-11-02',
    volumeDeliveredLiters: 25000,
    ratePer1000L: 140,
    subtotal: 3500,
    taxAmount: 175,
    totalAmount: 3675,
    paymentStatus: 'Overdue'
  }
];

export const initialMetrics: DashboardMetrics = {
  totalDistributedTodayKL: 1485.4,
  totalStorageCapacityKL: 115000,
  currentStorageReserveKL: 82400,
  activeTankersCount: 4,
  totalTankersCount: 6,
  pendingRequestsCount: 2,
  activePipelineAlerts: 2,
  waterQualityIndex: 96.4
};
