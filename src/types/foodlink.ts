export type StakeholderRole = 'provider' | 'delivery' | 'receiver';

export type FoodCategory =
  | 'hot_prepared'
  | 'chilled_meals'
  | 'fresh_produce'
  | 'dairy_beverages'
  | 'bakery_ambient';

export type DeliveryStage =
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'ARRIVED'
  | 'DELIVERED';

export interface GpsCoords {
  lat: number;
  lng: number;
}

export interface PassportEvent {
  step: '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10';
  title: string;
  stageName: string;
  timestamp: string;
  location: string;
  operator: string;
  tempC?: number;
  weightKg?: number;
  lidStatus?: string;
  notes?: string;
  completed: boolean;
}

export type DemoStageKey =
  | 'created'
  | 'node_connected'
  | 'pickup_confirmed'
  | 'transport_started'
  | 'transit_telemetry'
  | 'container_opened'
  | 'container_resealed'
  | 'arrived'
  | 'delivered'
  | 'received';

export interface HardwareTelemetry {
  deviceId: string;
  firmwareVersion: string;
  temperatureC: number;
  targetMinTempC: number;
  targetMaxTempC: number;
  tempStatus: 'safe' | 'warning' | 'breach';
  currentWeightKg: number;
  tareWeightKg: number;
  netFoodWeightKg: number;
  weightVerified: boolean;
  lidLatched: boolean;
  lidOpenCount: number;
  lastLidEventIso: string;
  wifiConnected: boolean;
  wifiRssiDbm: number;
  batteryPct: number;
  isCharging: boolean;
  lastPingIso: string;
  oledDisplay: {
    line1: string;
    line2: string;
    line3: string;
    line4: string;
  };
  locationName: string;
  gpsCoords?: GpsCoords;
}

export interface StakeholderProfile {
  id: string;
  role: StakeholderRole;
  name: string;
  organization: string;
  title: string;
  avatarInitials: string;
  email: string;
  phone: string;
  badgeLabel: string;
}

export interface FoodBatch {
  id: string;
  code: string;
  title: string;
  category: FoodCategory;
  categoryLabel?: string;
  provider: {
    id: string;
    name: string;
    type: string;
    address: string;
    contactPerson: string;
    phone: string;
  };
  delivery: {
    driverId: string;
    driverName: string;
    vehicle: string;
    phone: string;
    status: DeliveryStage;
  };
  receiver: {
    id: string;
    name: string;
    type: string;
    address: string;
    contactPerson: string;
    intakeWindow: string;
  };
  status: 'awaiting_pickup' | 'in_transit' | 'delivered' | 'intake_verified';
  portionsEstimated: number;
  initialWeightKg: number;
  preparedAtIso: string;
  pickupDeadlineIso: string;
  dispatchedAtIso: string;
  estimatedArrivalIso: string;
  hardware: HardwareTelemetry;
  haccpCompliant: boolean;
  tamperAlert: boolean;
  notes: string;
  passport: PassportEvent[];
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  batchId?: string;
  read: boolean;
}

export interface TelemetryLogEntry {
  id: string;
  timestamp: string;
  deviceId: string;
  tempC: number;
  weightKg: number;
  lidStatus: 'LATCHED' | 'OPEN';
  network: string;
}
