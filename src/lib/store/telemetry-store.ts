import { MOCK_BATCHES } from '@/data/mockData';
import { FoodBatch, PassportEvent, DeliveryStage } from '@/types/foodlink';

export interface TelemetryRecord {
  id: string;
  batchId: string;
  deviceId: string;
  temperature: number;
  weight: number;
  netWeight: number;
  lidOpen: boolean;
  timestamp: string;
  location?: string;
  rssiDbm?: number;
  batteryPct?: number;
  isDemo?: boolean;
}

export interface ContainerLidEvent {
  id: string;
  batchId: string;
  deviceId: string;
  type: 'OPENED' | 'SEALED';
  timestamp: string;
  timeFormatted: string;
}

export interface DeviceRecord {
  deviceId: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE' | 'ALERT' | 'STANDBY';
  assignedBatchId?: string;
  firmwareVersion: string;
  batteryPct: number;
  wifiConnected: boolean;
  wifiRssiDbm: number;
  lastSyncIso: string;
  sensors: {
    temperature: 'Connected' | 'Error' | 'Disconnected';
    weight: 'Connected' | 'Error' | 'Disconnected';
    lid: 'Connected' | 'Error' | 'Disconnected';
    wifi: 'Connected' | 'Error' | 'Disconnected';
  };
  specs: {
    mcu: string;
    tempSensor: string;
    loadCell: string;
    lidSensor: string;
    display: string;
    power: string;
  };
}

export interface DemoStepDefinition {
  index: number;
  stepNumber: '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10';
  title: string;
  stageName: string;
  description: string;
  batchStatus: 'awaiting_pickup' | 'in_transit' | 'delivered' | 'intake_verified';
  deliveryStage: DeliveryStage;
  temperature: number;
  netWeight: number;
  grossWeight: number;
  lidLatched: boolean;
  location: string;
  eta: string;
  operator: string;
  notes: string;
}

export const DEMO_STEPS: DemoStepDefinition[] = [
  {
    index: 0,
    stepNumber: '01',
    title: 'FOOD PREPARED',
    stageName: 'Origin Kitchen Cooking',
    description: 'Hot vegetable biryani cooking completed and portions staged in commercial trays.',
    batchStatus: 'awaiting_pickup',
    deliveryStage: 'ASSIGNED',
    temperature: 68.5,
    netWeight: 4.20,
    grossWeight: 6.40,
    lidLatched: true,
    location: 'Central Catering Kitchen #3',
    eta: '01:15 PM',
    operator: 'Elena Rostova (Lead Chef)',
    notes: 'Cooking completed. Divided into 25 food-grade thermal containers.',
  },
  {
    index: 1,
    stepNumber: '02',
    title: 'PACKED',
    stageName: 'Container Handshake & Tare',
    description: 'Food transferred into insulated transport container. Tare weight locked at 2.20 kg.',
    batchStatus: 'awaiting_pickup',
    deliveryStage: 'ASSIGNED',
    temperature: 66.8,
    netWeight: 4.20,
    grossWeight: 6.40,
    lidLatched: true,
    location: 'Central Catering Bay 4 Staging',
    eta: '01:15 PM',
    operator: 'Elena Rostova (Chef)',
    notes: 'Smart container tare calibrated at 2.20 kg. Food net mass confirmed at 4.20 kg.',
  },
  {
    index: 2,
    stepNumber: '03',
    title: 'FOODLINK NODE CONNECTED',
    stageName: 'Hardware Node Initialized',
    description: 'ESP32 Node 01 paired with batch FL-DEMO-001. DS18B20 & HX711 sensors online.',
    batchStatus: 'awaiting_pickup',
    deliveryStage: 'ACCEPTED',
    temperature: 65.4,
    netWeight: 4.20,
    grossWeight: 6.40,
    lidLatched: true,
    location: 'Central Catering Loading Dock',
    eta: '01:15 PM',
    operator: 'FL-NODE-001 (Firmware v1.2.4)',
    notes: 'Node 01 booted. OLED synced. 1-Wire temperature probe reading 65.4°C.',
  },
  {
    index: 3,
    stepNumber: '04',
    title: 'PICKED UP',
    stageName: 'Courier Custody Transfer',
    description: 'Courier Marcus Vance signs physical transfer and loads container into Transport Van #2.',
    batchStatus: 'in_transit',
    deliveryStage: 'PICKED_UP',
    temperature: 64.2,
    netWeight: 4.20,
    grossWeight: 6.40,
    lidLatched: true,
    location: 'Central Catering Bay 4 Dock',
    eta: '01:10 PM',
    operator: 'Marcus Vance (Dedicated Courier)',
    notes: 'Courier accepted physical custody. Magnetic seal verified latched.',
  },
  {
    index: 4,
    stepNumber: '05',
    title: 'TRANSPORT STARTED',
    stageName: 'Corridor Transit Departure',
    description: 'Vehicle departs onto West End Ave transit corridor toward Lower East Side.',
    batchStatus: 'in_transit',
    deliveryStage: 'IN_TRANSIT',
    temperature: 63.8,
    netWeight: 4.20,
    grossWeight: 6.40,
    lidLatched: true,
    location: 'West End Ave Corridor',
    eta: '01:05 PM',
    operator: 'Metro Logistics Van #2',
    notes: 'Transit underway. Cellular/Wi-Fi gateway uplink verified.',
  },
  {
    index: 5,
    stepNumber: '06',
    title: 'TEMPERATURE MONITORED',
    stageName: 'En Route Active Logging',
    description: 'Continuous thermal tracking confirms temperature stays within hot-hold range (>60°C).',
    batchStatus: 'in_transit',
    deliveryStage: 'IN_TRANSIT',
    temperature: 62.4,
    netWeight: 4.20,
    grossWeight: 6.40,
    lidLatched: true,
    location: 'Canal St & Broadway Waypoint',
    eta: '12:58 PM',
    operator: 'Autonomous Node 01 Logger',
    notes: 'Core probe 62.4°C. Safe hot-holding threshold maintained.',
  },
  {
    index: 6,
    stepNumber: '07',
    title: 'CONTAINER EVENT',
    stageName: 'Lid Audit & Reseal',
    description: 'Container opened briefly for courier seal check, then hermetically resealed.',
    batchStatus: 'in_transit',
    deliveryStage: 'IN_TRANSIT',
    temperature: 61.9,
    netWeight: 4.18,
    grossWeight: 6.38,
    lidLatched: true,
    location: 'Bowery Approach Corridor',
    eta: '12:55 PM',
    operator: 'Reed Switch & Marcus Vance',
    notes: 'Lid unlatched 12:48 PM, resealed 12:50 PM. Discrepancy within normal tolerance.',
  },
  {
    index: 7,
    stepNumber: '08',
    title: 'ARRIVED',
    stageName: 'Destination Receiving Dock',
    description: 'Courier vehicle arrives at Downtown Community Shelter delivery entrance.',
    batchStatus: 'in_transit',
    deliveryStage: 'ARRIVED',
    temperature: 61.2,
    netWeight: 4.18,
    grossWeight: 6.38,
    lidLatched: true,
    location: '88 Bowery St Shelter Entrance',
    eta: 'Arrived (0 mins)',
    operator: 'Marcus Vance & Sarah Jenkins',
    notes: 'Dock arrival confirmed. Staged for intake verification.',
  },
  {
    index: 8,
    stepNumber: '09',
    title: 'DELIVERED',
    stageName: 'Dock Physical Handover',
    description: 'Container unloaded and handed to shelter kitchen staff for digital passport inspection.',
    batchStatus: 'delivered',
    deliveryStage: 'DELIVERED',
    temperature: 60.8,
    netWeight: 4.18,
    grossWeight: 6.38,
    lidLatched: true,
    location: 'Downtown Shelter Receiving Kitchen',
    eta: 'Delivered',
    operator: 'Marcus Vance (Courier)',
    notes: 'Physical custody handed over. Awaiting final digital acceptance.',
  },
  {
    index: 9,
    stepNumber: '10',
    title: 'RECEIVED',
    stageName: 'Intake Inspection & Acceptance',
    description: 'Shelter coordinator Sarah Jenkins inspects Food Passport, verifies weight and temp, confirms acceptance.',
    batchStatus: 'intake_verified',
    deliveryStage: 'DELIVERED',
    temperature: 60.5,
    netWeight: 4.18,
    grossWeight: 6.38,
    lidLatched: true,
    location: 'Downtown Community Shelter Kitchen',
    eta: 'Complete',
    operator: 'Sarah Jenkins (Coordinator)',
    notes: 'Final acceptance certified. Temperature 60.5°C verified. Food Passport sealed.',
  },
];

interface StorageShape {
  devices: Record<string, DeviceRecord>;
  telemetryLogs: TelemetryRecord[];
  lidEvents: ContainerLidEvent[];
  batches: FoodBatch[];
  demoCurrentStep: number;
}

const globalForTelemetry = global as unknown as {
  __foodlink_store?: StorageShape;
};

function createDemoBatch(currentStepIndex: number): FoodBatch {
  const stepDef = DEMO_STEPS[currentStepIndex] || DEMO_STEPS[0];
  const now = Date.now();

  const passportEvents: PassportEvent[] = DEMO_STEPS.map((s, idx) => ({
    step: s.stepNumber,
    title: s.title,
    stageName: s.stageName,
    timestamp: idx <= currentStepIndex ? `${12 + Math.floor(idx * 5 / 60)}:${(15 + (idx * 5) % 60).toString().padStart(2, '0')} PM` : 'Pending milestone',
    location: s.location,
    operator: s.operator,
    tempC: s.temperature,
    weightKg: s.netWeight,
    lidStatus: s.lidLatched ? 'LATCHED' : 'OPEN',
    notes: s.notes,
    completed: idx <= currentStepIndex,
  }));

  return {
    id: 'batch_fl_demo_001',
    code: 'FL-DEMO-001',
    title: 'Hot Vegetable Korma & Basmati Portions',
    category: 'hot_prepared',
    categoryLabel: 'HOT HOLD (>60°C)',
    provider: {
      id: 'prov_central',
      name: 'Central Catering Services',
      type: 'Commercial Kitchen',
      address: 'Industrial District Bay 4, West End',
      contactPerson: 'Elena Rostova',
      phone: '+1 555-0192',
    },
    delivery: {
      driverId: 'drv_01',
      driverName: 'Marcus Vance',
      vehicle: 'Transport Van #2 (EV)',
      phone: '+1 555-0284',
      status: stepDef.deliveryStage,
    },
    receiver: {
      id: 'rcv_downtown',
      name: 'Downtown Community Shelter',
      type: 'Shelter & Kitchen',
      address: '88 Bowery St, Lower East Side',
      contactPerson: 'Sarah Jenkins',
      intakeWindow: '12:30 PM - 01:30 PM',
    },
    status: stepDef.batchStatus,
    portionsEstimated: 25,
    initialWeightKg: 4.20,
    preparedAtIso: new Date(now - 60 * 60 * 1000).toISOString(),
    pickupDeadlineIso: new Date(now + 30 * 60 * 1000).toISOString(),
    dispatchedAtIso: new Date(now - 30 * 60 * 1000).toISOString(),
    estimatedArrivalIso: stepDef.eta,
    haccpCompliant: true,
    tamperAlert: false,
    notes: 'DEMO MODE SCENARIO: Hot hold meal redistribution verified with ESP32 Node 01.',
    hardware: {
      deviceId: 'FL-NODE-001',
      firmwareVersion: 'v1.2.4-esp32',
      temperatureC: stepDef.temperature,
      targetMinTempC: 60.0,
      targetMaxTempC: 75.0,
      tempStatus: stepDef.temperature >= 60.0 ? 'safe' : 'warning',
      currentWeightKg: stepDef.grossWeight,
      tareWeightKg: 2.20,
      netFoodWeightKg: stepDef.netWeight,
      weightVerified: true,
      lidLatched: stepDef.lidLatched,
      lidOpenCount: currentStepIndex >= 6 ? 1 : 0,
      lastLidEventIso: new Date(now - 5 * 60 * 1000).toISOString(),
      wifiConnected: true,
      wifiRssiDbm: -62,
      batteryPct: 84,
      isCharging: false,
      lastPingIso: new Date().toISOString(),
      locationName: stepDef.location,
      gpsCoords: { lat: 40.7188, lng: -74.0012 },
      oledDisplay: {
        line1: 'FOODLINK NODE 01',
        line2: 'FL-DEMO | KORMA',
        line3: `TEMP: ${stepDef.temperature.toFixed(1)}C [OK]`,
        line4: `NET: ${stepDef.netWeight.toFixed(2)}kg LATCH:OK`,
      },
    },
    passport: passportEvents,
  };
}

function initStore(): StorageShape {
  if (globalForTelemetry.__foodlink_store) {
    if (typeof globalForTelemetry.__foodlink_store.demoCurrentStep !== 'number' || isNaN(globalForTelemetry.__foodlink_store.demoCurrentStep)) {
      globalForTelemetry.__foodlink_store.demoCurrentStep = 5;
    }
    return globalForTelemetry.__foodlink_store;
  }

  const devices: Record<string, DeviceRecord> = {
    'FL-NODE-001': {
      deviceId: 'FL-NODE-001',
      name: 'FOODLINK NODE 01',
      status: 'ONLINE',
      assignedBatchId: 'FL-0024',
      firmwareVersion: 'v1.2.4-esp32',
      batteryPct: 84,
      wifiConnected: true,
      wifiRssiDbm: -62,
      lastSyncIso: new Date().toISOString(),
      sensors: {
        temperature: 'Connected',
        weight: 'Connected',
        lid: 'Connected',
        wifi: 'Connected',
      },
      specs: {
        mcu: 'ESP32-WROOM-32D (240MHz Dual Core, 4MB Flash)',
        tempSensor: 'DS18B20 1-Wire Digital Thermal Probe (±0.5°C accuracy)',
        loadCell: '4-Strain Gauge Bridge + HX711 24-bit Low-Noise ADC',
        lidSensor: 'Hermetic Magnetic Reed Switch (SPST-NO)',
        display: '0.96" SSD1306 128x64 I2C OLED Monochrome',
        power: '3.7V 2500mAh LiPo Cell with TP4056 USB-C Charging',
      },
    },
    'FL-NODE-002': {
      deviceId: 'FL-NODE-002',
      name: 'FOODLINK NODE 02',
      status: 'STANDBY',
      assignedBatchId: 'FL-0025',
      firmwareVersion: 'v1.2.4-esp32',
      batteryPct: 92,
      wifiConnected: true,
      wifiRssiDbm: -58,
      lastSyncIso: new Date().toISOString(),
      sensors: {
        temperature: 'Connected',
        weight: 'Connected',
        lid: 'Connected',
        wifi: 'Connected',
      },
      specs: {
        mcu: 'ESP32-WROOM-32D (240MHz Dual Core, 4MB Flash)',
        tempSensor: 'DS18B20 1-Wire Digital Thermal Probe (±0.5°C accuracy)',
        loadCell: '4-Strain Gauge Bridge + HX711 24-bit Low-Noise ADC',
        lidSensor: 'Hermetic Magnetic Reed Switch (SPST-NO)',
        display: '0.96" SSD1306 128x64 I2C OLED Monochrome',
        power: '3.7V 2500mAh LiPo Cell with TP4056 USB-C Charging',
      },
    },
    'FL-NODE-003': {
      deviceId: 'FL-NODE-003',
      name: 'FOODLINK NODE 03',
      status: 'ONLINE',
      assignedBatchId: 'FL-0022',
      firmwareVersion: 'v1.2.2-esp32',
      batteryPct: 76,
      wifiConnected: true,
      wifiRssiDbm: -68,
      lastSyncIso: new Date().toISOString(),
      sensors: {
        temperature: 'Connected',
        weight: 'Connected',
        lid: 'Connected',
        wifi: 'Connected',
      },
      specs: {
        mcu: 'ESP32-WROOM-32D (240MHz Dual Core, 4MB Flash)',
        tempSensor: 'DS18B20 1-Wire Digital Thermal Probe (±0.5°C accuracy)',
        loadCell: '4-Strain Gauge Bridge + HX711 24-bit Low-Noise ADC',
        lidSensor: 'Hermetic Magnetic Reed Switch (SPST-NO)',
        display: '0.96" SSD1306 128x64 I2C OLED Monochrome',
        power: '3.7V 2500mAh LiPo Cell with TP4056 USB-C Charging',
      },
    },
    'FL-NODE-004': {
      deviceId: 'FL-NODE-004',
      name: 'FOODLINK NODE 04',
      status: 'ONLINE',
      assignedBatchId: 'FL-0027',
      firmwareVersion: 'v1.2.4-esp32',
      batteryPct: 88,
      wifiConnected: true,
      wifiRssiDbm: -54,
      lastSyncIso: new Date().toISOString(),
      sensors: {
        temperature: 'Connected',
        weight: 'Connected',
        lid: 'Connected',
        wifi: 'Connected',
      },
      specs: {
        mcu: 'ESP32-WROOM-32D (240MHz Dual Core, 4MB Flash)',
        tempSensor: 'DS18B20 1-Wire Digital Thermal Probe (±0.5°C accuracy)',
        loadCell: '4-Strain Gauge Bridge + HX711 24-bit Low-Noise ADC',
        lidSensor: 'Hermetic Magnetic Reed Switch (SPST-NO)',
        display: '0.96" SSD1306 128x64 I2C OLED Monochrome',
        power: '3.7V 2500mAh LiPo Cell with TP4056 USB-C Charging',
      },
    },
  };

  const now = Date.now();
  const telemetryLogs: TelemetryRecord[] = [
    {
      id: 'tel_001',
      batchId: 'FL-0024',
      deviceId: 'FL-NODE-001',
      temperature: 7.8,
      weight: 6.4,
      netWeight: 4.2,
      lidOpen: false,
      timestamp: new Date(now - 45 * 60 * 1000).toISOString(),
      location: 'Central Catering Dock Bay 4',
      rssiDbm: -60,
      batteryPct: 86,
      isDemo: false,
    },
    {
      id: 'tel_002',
      batchId: 'FL-0024',
      deviceId: 'FL-NODE-001',
      temperature: 7.7,
      weight: 6.4,
      netWeight: 4.2,
      lidOpen: false,
      timestamp: new Date(now - 35 * 60 * 1000).toISOString(),
      location: 'West End Ave Corridor',
      rssiDbm: -63,
      batteryPct: 85,
      isDemo: false,
    },
    {
      id: 'tel_003',
      batchId: 'FL-0024',
      deviceId: 'FL-NODE-001',
      temperature: 7.5,
      weight: 6.4,
      netWeight: 4.2,
      lidOpen: false,
      timestamp: new Date(now - 25 * 60 * 1000).toISOString(),
      location: 'Canal St & Broadway Intersection',
      rssiDbm: -62,
      batteryPct: 85,
      isDemo: false,
    },
    {
      id: 'tel_004',
      batchId: 'FL-0024',
      deviceId: 'FL-NODE-001',
      temperature: 7.4,
      weight: 6.4,
      netWeight: 4.2,
      lidOpen: false,
      timestamp: new Date(now - 15 * 60 * 1000).toISOString(),
      location: 'Broadway Transit Corridor',
      rssiDbm: -62,
      batteryPct: 84,
      isDemo: false,
    },
    {
      id: 'tel_005',
      batchId: 'FL-0024',
      deviceId: 'FL-NODE-001',
      temperature: 7.4,
      weight: 6.38,
      netWeight: 4.18,
      lidOpen: false,
      timestamp: new Date(now - 2 * 60 * 1000).toISOString(),
      location: 'Broadway Transit Corridor & Canal St',
      rssiDbm: -62,
      batteryPct: 84,
      isDemo: false,
    },
  ];

  const lidEvents: ContainerLidEvent[] = [
    {
      id: 'lid_001',
      batchId: 'FL-0024',
      deviceId: 'FL-NODE-001',
      type: 'SEALED',
      timestamp: new Date(now - 44 * 60 * 1000).toISOString(),
      timeFormatted: '12:05 PM',
    },
  ];

  const baseBatches: FoodBatch[] = JSON.parse(JSON.stringify(MOCK_BATCHES));
  const demoBatch = createDemoBatch(5); // start at in-transit telemetry step
  const allBatches = [demoBatch, ...baseBatches];

  const store: StorageShape = {
    devices,
    telemetryLogs,
    lidEvents,
    batches: allBatches,
    demoCurrentStep: 5,
  };

  globalForTelemetry.__foodlink_store = store;
  return store;
}

export const telemetryStore = {
  getStore(): StorageShape {
    return initStore();
  },

  getBatches(): FoodBatch[] {
    const store = initStore();
    return store.batches;
  },

  getBatch(batchIdOrCode: string): FoodBatch | undefined {
    const store = initStore();
    const q = batchIdOrCode.toLowerCase();
    return store.batches.find(
      (b) => b.code.toLowerCase() === q || b.id.toLowerCase() === q
    );
  },

  createBatch(batchData: Partial<FoodBatch>): FoodBatch {
    const store = initStore();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const code = `FL-2026-${rand}`;
    const newBatch: FoodBatch = {
      id: `batch_${rand}`,
      code,
      title: batchData.title || 'Prepared Surplus Portions',
      category: batchData.category || 'hot_prepared',
      categoryLabel: batchData.categoryLabel || 'HOT HOLD',
      provider: batchData.provider || {
        id: 'prov_curr',
        name: 'Central Catering Services',
        type: 'Commercial Kitchen',
        address: 'Industrial District Bay 4',
        contactPerson: 'Elena Rostova',
        phone: '+1 555-0192',
      },
      delivery: batchData.delivery || {
        driverId: 'drv_pending',
        driverName: 'Dispatched Courier #08',
        vehicle: 'Transport Van #2 (EV)',
        phone: '+1 555-0284',
        status: 'ASSIGNED',
      },
      receiver: batchData.receiver || {
        id: 'rcv_sel',
        name: 'Downtown Community Shelter',
        type: 'Shelter & Kitchen',
        address: '88 Bowery St, Lower East Side',
        contactPerson: 'Sarah Jenkins',
        intakeWindow: '12:30 PM - 02:00 PM',
      },
      status: 'awaiting_pickup',
      portionsEstimated: batchData.portionsEstimated || 25,
      initialWeightKg: batchData.initialWeightKg || 4.20,
      preparedAtIso: new Date().toISOString(),
      pickupDeadlineIso: batchData.pickupDeadlineIso || '01:30 PM',
      dispatchedAtIso: '',
      estimatedArrivalIso: '01:45 PM',
      haccpCompliant: true,
      tamperAlert: false,
      notes: batchData.notes || 'Created via FoodLink operator console.',
      hardware: {
        deviceId: 'FL-NODE-001',
        firmwareVersion: 'v1.2.4-esp32',
        temperatureC: 65.4,
        targetMinTempC: 60.0,
        targetMaxTempC: 75.0,
        tempStatus: 'safe',
        currentWeightKg: (batchData.initialWeightKg || 4.20) + 2.20,
        tareWeightKg: 2.20,
        netFoodWeightKg: batchData.initialWeightKg || 4.20,
        weightVerified: true,
        lidLatched: true,
        lidOpenCount: 0,
        lastLidEventIso: new Date().toISOString(),
        wifiConnected: true,
        wifiRssiDbm: -60,
        batteryPct: 88,
        isCharging: false,
        lastPingIso: new Date().toISOString(),
        locationName: 'Central Catering Staging',
        oledDisplay: {
          line1: 'FOODLINK NODE 01',
          line2: `${code} | FOOD`,
          line3: 'TEMP: 65.4 C [OK]',
          line4: 'NET: 4.20kg LATCH:OK',
        },
      },
      passport: [
        {
          step: '01',
          title: 'FOOD PREPARED',
          stageName: 'Commercial Kitchen Preparation',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          location: 'Central Catering Kitchen #3',
          operator: 'Elena Rostova',
          tempC: 68.0,
          weightKg: batchData.initialWeightKg || 4.20,
          notes: 'Batch portioned into thermal containers.',
          completed: true,
        },
        {
          step: '02',
          title: 'PACKED',
          stageName: 'Container Tare Verification',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          location: 'Central Catering Loading Bay',
          operator: 'Elena Rostova',
          weightKg: batchData.initialWeightKg || 4.20,
          lidStatus: 'LATCHED',
          notes: 'Tare 2.20 kg locked. Net load calibrated.',
          completed: true,
        },
        {
          step: '03',
          title: 'FOODLINK NODE CONNECTED',
          stageName: 'ESP32 Node Handshake',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          location: 'Central Catering Loading Bay',
          operator: 'FL-NODE-001',
          tempC: 65.4,
          weightKg: batchData.initialWeightKg || 4.20,
          lidStatus: 'LATCHED',
          notes: 'Node online. Digital passport initiated.',
          completed: true,
        },
        {
          step: '04',
          title: 'PICKED UP',
          stageName: 'Courier Custody Transfer',
          timestamp: 'Awaiting Pickup',
          location: 'Central Catering Dock',
          operator: 'Pending Courier',
          completed: false,
        },
        {
          step: '05',
          title: 'TRANSPORT STARTED',
          stageName: 'Corridor Transit',
          timestamp: 'Pending Departure',
          location: 'Transit Corridor',
          operator: 'Pending',
          completed: false,
        },
        {
          step: '06',
          title: 'TEMPERATURE MONITORED',
          stageName: 'Active Telemetry',
          timestamp: 'Pending Telemetry',
          location: 'Transit Corridor',
          operator: 'Node 01 Logger',
          completed: false,
        },
        {
          step: '07',
          title: 'CONTAINER EVENT',
          stageName: 'Lid Audit',
          timestamp: 'Pending',
          location: 'Transit Corridor',
          operator: 'Reed Switch',
          completed: false,
        },
        {
          step: '08',
          title: 'ARRIVED',
          stageName: 'Destination Dock',
          timestamp: 'Pending Arrival',
          location: 'Receiving Dock',
          operator: 'Pending',
          completed: false,
        },
        {
          step: '09',
          title: 'DELIVERED',
          stageName: 'Physical Handover',
          timestamp: 'Pending Handover',
          location: 'Receiving Depot',
          operator: 'Pending',
          completed: false,
        },
        {
          step: '10',
          title: 'RECEIVED',
          stageName: 'Receiver Acceptance',
          timestamp: 'Pending Intake',
          location: 'Shelter Kitchen',
          operator: 'Pending',
          completed: false,
        },
      ],
    };

    store.batches.unshift(newBatch);
    return newBatch;
  },

  // ----------------------------------------------------
  // DEMO MODE SCENARIO ENGINE (FL-DEMO-001)
  // ----------------------------------------------------
  getDemoCurrentStep(): number {
    const store = initStore();
    return store.demoCurrentStep;
  },

  getDemoState(): {
    currentStepIndex: number;
    totalSteps: number;
    step: DemoStepDefinition;
    batch: FoodBatch;
    allSteps: DemoStepDefinition[];
  } {
    const store = initStore();
    const stepIdx = store.demoCurrentStep;
    const batch = createDemoBatch(stepIdx);

    // Update in store batches array
    const existingIdx = store.batches.findIndex((b) => b.code === 'FL-DEMO-001');
    if (existingIdx >= 0) {
      store.batches[existingIdx] = batch;
    } else {
      store.batches.unshift(batch);
    }

    return {
      currentStepIndex: stepIdx,
      totalSteps: DEMO_STEPS.length,
      step: DEMO_STEPS[stepIdx],
      batch,
      allSteps: DEMO_STEPS,
    };
  },

  setDemoStep(stepIndex: number): {
    currentStepIndex: number;
    step: DemoStepDefinition;
    batch: FoodBatch;
  } {
    const store = initStore();
    const clamped = Math.max(0, Math.min(DEMO_STEPS.length - 1, stepIndex));
    store.demoCurrentStep = clamped;
    const batch = createDemoBatch(clamped);

    const existingIdx = store.batches.findIndex((b) => b.code === 'FL-DEMO-001');
    if (existingIdx >= 0) {
      store.batches[existingIdx] = batch;
    } else {
      store.batches.unshift(batch);
    }

    // Also record a telemetry log for this demo step
    const stepDef = DEMO_STEPS[clamped];
    this.recordTelemetry({
      batchId: 'FL-DEMO-001',
      deviceId: 'FL-NODE-001',
      temperature: stepDef.temperature,
      weight: stepDef.grossWeight,
      lidOpen: !stepDef.lidLatched,
      timestamp: new Date().toISOString(),
      location: stepDef.location,
      isDemo: true,
    });

    return {
      currentStepIndex: clamped,
      step: stepDef,
      batch,
    };
  },

  advanceDemo(): {
    currentStepIndex: number;
    step: DemoStepDefinition;
    batch: FoodBatch;
  } {
    const store = initStore();
    const cur = typeof store.demoCurrentStep === 'number' && !isNaN(store.demoCurrentStep) ? store.demoCurrentStep : 0;
    const next = (cur + 1) % DEMO_STEPS.length;
    return this.setDemoStep(next);
  },

  resetDemo(): {
    currentStepIndex: number;
    step: DemoStepDefinition;
    batch: FoodBatch;
  } {
    return this.setDemoStep(0);
  },

  // ----------------------------------------------------
  // STANDARD METHODS
  // ----------------------------------------------------
  getDevices(): DeviceRecord[] {
    const store = initStore();
    return Object.values(store.devices);
  },

  getDevice(deviceId: string): DeviceRecord | undefined {
    const store = initStore();
    const normalized = deviceId.toUpperCase().replace(/\s+/g, '-');
    return (
      store.devices[normalized] ||
      store.devices[`FL-${normalized}`] ||
      store.devices[deviceId] ||
      Object.values(store.devices).find(
        (d) => d.deviceId.toLowerCase() === deviceId.toLowerCase() || d.name.toLowerCase().includes(deviceId.toLowerCase())
      )
    );
  },

  getTelemetryForBatch(batchId: string): TelemetryRecord[] {
    const store = initStore();
    const cleanId = batchId.toUpperCase();
    return store.telemetryLogs.filter(
      (log) => log.batchId.toUpperCase() === cleanId || log.batchId.toUpperCase().includes(cleanId)
    );
  },

  getTelemetryForDevice(deviceId: string): TelemetryRecord[] {
    const store = initStore();
    const cleanId = deviceId.toUpperCase();
    return store.telemetryLogs.filter(
      (log) => log.deviceId.toUpperCase() === cleanId || log.deviceId.toUpperCase().includes(cleanId)
    );
  },

  getLidEventsForBatch(batchId: string): ContainerLidEvent[] {
    const store = initStore();
    const cleanId = batchId.toUpperCase();
    return store.lidEvents.filter((evt) => evt.batchId.toUpperCase() === cleanId);
  },

  recordTelemetry(payload: {
    batchId: string;
    deviceId: string;
    temperature: number;
    weight: number;
    lidOpen: boolean;
    timestamp?: string;
    location?: string;
    rssiDbm?: number;
    batteryPct?: number;
    isDemo?: boolean;
  }): {
    telemetry: TelemetryRecord;
    lidEventCreated?: ContainerLidEvent;
    weightAlert?: boolean;
    tempAlert?: boolean;
  } {
    const store = initStore();
    const nowIso = payload.timestamp || new Date().toISOString();
    const tareWeight = 2.20;
    const netWeight = Math.max(0, payload.weight - tareWeight);

    const prevLogs = store.telemetryLogs.filter(
      (l) => l.deviceId === payload.deviceId || l.batchId === payload.batchId
    );
    const lastLog = prevLogs.length > 0 ? prevLogs[prevLogs.length - 1] : null;

    let lidEventCreated: ContainerLidEvent | undefined;
    if (lastLog && lastLog.lidOpen !== payload.lidOpen) {
      const eventType = payload.lidOpen ? 'OPENED' : 'SEALED';
      const timeStr = new Date(nowIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      lidEventCreated = {
        id: `lid_${Date.now()}`,
        batchId: payload.batchId,
        deviceId: payload.deviceId,
        type: eventType,
        timestamp: nowIso,
        timeFormatted: timeStr,
      };
      store.lidEvents.push(lidEventCreated);

      const targetBatch = store.batches.find(
        (b) => b.code.toUpperCase() === payload.batchId.toUpperCase() || b.id === payload.batchId
      );
      if (targetBatch) {
        const passportEvent: PassportEvent = {
          step: '07',
          title: `CONTAINER ${eventType}`,
          stageName: `Automated Sensor Event • ${payload.deviceId}`,
          timestamp: timeStr,
          location: payload.location || targetBatch.hardware.locationName || 'Transit Corridor',
          operator: `${payload.deviceId} Reed Switch`,
          tempC: payload.temperature,
          weightKg: Number(netWeight.toFixed(2)),
          lidStatus: payload.lidOpen ? 'OPEN' : 'LATCHED',
          notes: payload.lidOpen
            ? 'Container seal opened during transit. Monitored for closure.'
            : 'Container resealed. Hermetic latch confirmed.',
          completed: true,
        };
        targetBatch.passport.push(passportEvent);
      }
    }

    const telemetry: TelemetryRecord = {
      id: `tel_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      batchId: payload.batchId,
      deviceId: payload.deviceId,
      temperature: Number(payload.temperature.toFixed(2)),
      weight: Number(payload.weight.toFixed(2)),
      netWeight: Number(netWeight.toFixed(2)),
      lidOpen: payload.lidOpen,
      timestamp: nowIso,
      location: payload.location,
      rssiDbm: payload.rssiDbm ?? -62,
      batteryPct: payload.batteryPct ?? 84,
      isDemo: payload.isDemo,
    };

    store.telemetryLogs.push(telemetry);

    const dev = this.getDevice(payload.deviceId);
    if (dev) {
      dev.lastSyncIso = nowIso;
      dev.status = 'ONLINE';
      if (payload.batteryPct !== undefined) dev.batteryPct = payload.batteryPct;
      if (payload.rssiDbm !== undefined) dev.wifiRssiDbm = payload.rssiDbm;
      dev.assignedBatchId = payload.batchId;
    }

    const targetBatch = store.batches.find(
      (b) => b.code.toUpperCase() === payload.batchId.toUpperCase() || b.id === payload.batchId
    );
    if (targetBatch) {
      targetBatch.hardware.temperatureC = telemetry.temperature;
      targetBatch.hardware.currentWeightKg = telemetry.weight;
      targetBatch.hardware.netFoodWeightKg = telemetry.netWeight;
      targetBatch.hardware.lidLatched = !telemetry.lidOpen;
      targetBatch.hardware.lastPingIso = nowIso;
      if (payload.location) {
        targetBatch.hardware.locationName = payload.location;
      }
    }

    const weightAlert = targetBatch ? Math.abs(netWeight - targetBatch.initialWeightKg) > 0.25 : false;

    return {
      telemetry,
      lidEventCreated,
      weightAlert,
      tempAlert: payload.temperature > 75.0 || payload.temperature < 50.0,
    };
  },
};
