import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'aqualogix_super_secret_water_grid_key_2026';

app.use(cors());
app.use(express.json());

// Path to persistent JSON Database file
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Token Generator & Validator helper (HMAC-SHA256 Bearer Token)
const generateToken = (payload) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
};

const verifyToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch (e) {
    return null;
  }
};

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No authorization token provided.' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired authorization token.' });
  }

  req.user = decoded;
  next();
};

// Initial seed data with authenticatable Users
const initialData = {
  users: [
    {
      id: 'USR-001',
      name: 'Vikrant Roy',
      email: 'admin@aqualogix.com',
      password: 'admin123',
      role: 'Operations Dispatcher',
      zone: 'Central Urban Core'
    },
    {
      id: 'USR-002',
      name: 'Ananya Sharma',
      email: 'fleet@aqualogix.com',
      password: 'fleet123',
      role: 'Fleet Supervisor',
      zone: 'South-West Zone A'
    },
    {
      id: 'USR-003',
      name: 'Dr. Rajesh Iyer',
      email: 'scada@aqualogix.com',
      password: 'scada123',
      role: 'Water Quality Inspector',
      zone: 'All Metropolitan Zones'
    }
  ],
  tankers: [
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
  ],
  storageNodes: [
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
  ],
  requests: [
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
  ],
  alerts: [
    {
      id: 'ALT-401',
      zone: 'East Suburb Zone C',
      pipelineId: 'PIPE-DN-450-E',
      severity: 'critical',
      title: 'Rapid Pressure Drop & Suspected Rupture',
      description: 'Pressure fell from 4.2 bar to 1.1 bar near Whitefield Satellite Hub feeder line.',
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
      description: 'Post-filtration turbidity momentarily rose during filter backwash cycle.',
      timestamp: '3 hours ago',
      status: 'Resolved',
      estimatedLossPerHourKL: 0
    }
  ],
  invoices: [
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
  ]
};

// Database helper functions
const getDatabase = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    if (!parsed.users) {
      parsed.users = initialData.users;
      saveDatabase(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Error reading DB, resetting to defaults:', err);
    return initialData;
  }
};

const saveDatabase = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing DB:', err);
  }
};

// --- AUTHENTICATION ENDPOINTS ---

// 1. Login User
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = getDatabase();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials. Check email and password.' });
  }

  const token = generateToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    zone: user.zone
  });

  const { password: _, ...userSafe } = user;
  res.json({
    token,
    user: userSafe,
    message: `Welcome back, ${user.name}`
  });
});

// 2. Register New Operator / Supervisor
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role = 'Operations Dispatcher', zone = 'Central Urban Core' } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  const db = getDatabase();
  const exists = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(409).json({ error: 'A user with this email already exists' });
  }

  const newUser = {
    id: `USR-${String(db.users.length + 1).padStart(3, '0')}`,
    name,
    email,
    password,
    role,
    zone
  };

  db.users.push(newUser);
  saveDatabase(db);

  const token = generateToken({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    zone: newUser.zone
  });

  const { password: _, ...userSafe } = newUser;
  res.status(201).json({ token, user: userSafe });
});

// 3. Current User Profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// --- OPERATIONAL REST API ENDPOINTS ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AquaLogix Secure Backend API', timestamp: new Date() });
});

// Metrics
app.get('/api/metrics', (req, res) => {
  const db = getDatabase();
  const totalCapacity = db.storageNodes.reduce((sum, n) => sum + n.totalCapacityKL, 0);
  const currentReserve = db.storageNodes.reduce((sum, n) => sum + n.currentLevelKL, 0);
  const activeTankers = db.tankers.filter(t => t.status === 'in_transit' || t.status === 'delivering').length;
  const pendingOrders = db.requests.filter(r => r.status === 'Pending').length;
  const activeAlerts = db.alerts.filter(a => a.status !== 'Resolved').length;

  res.json({
    totalDistributedTodayKL: 1540.2,
    totalStorageCapacityKL: totalCapacity,
    currentStorageReserveKL: currentReserve,
    activeTankersCount: activeTankers,
    totalTankersCount: db.tankers.length,
    pendingRequestsCount: pendingOrders,
    activePipelineAlerts: activeAlerts,
    waterQualityIndex: 96.8
  });
});

// Tankers Fleet
app.get('/api/tankers', (req, res) => {
  const db = getDatabase();
  res.json(db.tankers);
});

app.patch('/api/tankers/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, destination } = req.body;
  const db = getDatabase();
  const tanker = db.tankers.find(t => t.id === id);

  if (!tanker) return res.status(404).json({ error: 'Tanker not found' });

  tanker.status = status || tanker.status;
  if (destination !== undefined) tanker.destination = destination;
  if (status === 'available' || status === 'maintenance') {
    tanker.currentLoadLiters = 0;
  } else if (status === 'in_transit' || status === 'delivering') {
    tanker.currentLoadLiters = tanker.capacityLiters;
  }

  saveDatabase(db);
  res.json(tanker);
});

// Storage Nodes & Reservoirs
app.get('/api/storage-nodes', (req, res) => {
  const db = getDatabase();
  res.json(db.storageNodes);
});

app.patch('/api/storage-nodes/:id/level', (req, res) => {
  const { id } = req.params;
  const { currentLevelKL } = req.body;
  const db = getDatabase();
  const node = db.storageNodes.find(n => n.id === id);

  if (!node) return res.status(404).json({ error: 'Node not found' });

  node.currentLevelKL = Number(currentLevelKL);
  node.status = node.currentLevelKL <= node.totalCapacityKL * 0.25 ? 'critical' : node.currentLevelKL <= node.totalCapacityKL * 0.45 ? 'warning' : 'optimal';
  node.lastUpdated = 'Just now';

  saveDatabase(db);
  res.json(node);
});

// Supply Requests
app.get('/api/requests', (req, res) => {
  const db = getDatabase();
  res.json(db.requests);
});

app.post('/api/requests', (req, res) => {
  const db = getDatabase();
  const newOrder = {
    ...req.body,
    id: `REQ-${new Date().getFullYear()}-${String(db.requests.length + 90).padStart(3, '0')}`,
    orderDate: new Date().toISOString().split('T')[0],
    status: 'Pending',
    costEstimate: Math.round((Number(req.body.requestedVolumeLiters) / 1000) * (req.body.waterType === 'Potable Drinking' ? 200 : 150))
  };

  db.requests.unshift(newOrder);
  saveDatabase(db);
  res.status(201).json(newOrder);
});

app.post('/api/requests/:id/dispatch', (req, res) => {
  const { id } = req.params;
  const { tankerId } = req.body;
  const db = getDatabase();

  const order = db.requests.find(r => r.id === id);
  const tanker = db.tankers.find(t => t.id === tankerId);

  if (!order || !tanker) return res.status(404).json({ error: 'Order or Tanker not found' });

  order.status = 'Dispatched';
  order.assignedTankerId = tankerId;

  tanker.status = 'in_transit';
  tanker.destination = order.deliveryAddress;
  tanker.assignedOrderId = id;
  tanker.currentLoadLiters = Math.min(tanker.capacityLiters, order.requestedVolumeLiters);

  // Auto create invoice
  const existingInv = db.invoices.find(inv => inv.orderId === id);
  if (!existingInv) {
    const subtotal = order.costEstimate;
    const taxAmount = Math.round(subtotal * 0.05);
    const newInvoice = {
      id: `INV-2026-${String(db.invoices.length + 42).padStart(3, '0')}`,
      orderId: id,
      consumerName: order.consumerName,
      billingPeriod: `${new Date().toLocaleString('default', { month: 'short' })} 2026 - Cycle 1`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      volumeDeliveredLiters: order.requestedVolumeLiters,
      ratePer1000L: Math.round(subtotal / (order.requestedVolumeLiters / 1000)),
      subtotal,
      taxAmount,
      totalAmount: subtotal + taxAmount,
      paymentStatus: 'Pending'
    };
    db.invoices.unshift(newInvoice);
  }

  saveDatabase(db);
  res.json({ order, tanker });
});

app.patch('/api/requests/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = getDatabase();
  const order = db.requests.find(r => r.id === id);

  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.status = status;
  saveDatabase(db);
  res.json(order);
});

// Alerts
app.get('/api/alerts', (req, res) => {
  const db = getDatabase();
  res.json(db.alerts);
});

app.patch('/api/alerts/:id/resolve', (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  const alert = db.alerts.find(a => a.id === id);

  if (!alert) return res.status(404).json({ error: 'Alert not found' });

  alert.status = 'Resolved';
  saveDatabase(db);
  res.json(alert);
});

// Invoices & Billing
app.get('/api/invoices', (req, res) => {
  const db = getDatabase();
  res.json(db.invoices);
});

app.patch('/api/invoices/:id/pay', (req, res) => {
  const { id } = req.params;
  const { paymentMethod = 'Online Portal / UPI' } = req.body;
  const db = getDatabase();
  const invoice = db.invoices.find(i => i.id === id);

  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

  invoice.paymentStatus = 'Paid';
  invoice.paymentMethod = paymentMethod;
  saveDatabase(db);
  res.json(invoice);
});

// Reset DB
app.post('/api/reset', (req, res) => {
  saveDatabase(initialData);
  res.json({ success: true, message: 'Database reset to default seeds' });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`💧 AquaLogix Secure Backend Server Running on http://localhost:${PORT}`);
  console.log(`🔒 Authentication: Enabled (HMAC-SHA256 Token)`);
  console.log(`📁 Persistent Data Store: ${DB_FILE}`);
  console.log(`======================================================\n`);
});
