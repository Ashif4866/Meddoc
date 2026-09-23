export type UserRole = 'ADMIN' | 'PHARMACY_MANAGER' | 'HEALTH_OFFICER' | 'SUPPLY_CHAIN_MANAGER';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  role: UserRole;
  createdAt?: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  registrationNumber: string;
  address: string;
  city: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  status: 'ACTIVE' | 'WARNING' | 'SHORTAGE_ALERT' | 'INACTIVE';
  contactNumber: string;
  _count?: {
    inventories: number;
    spikes: number;
    alerts: number;
  };
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  unit: string;
  _count?: {
    inventories: number;
    spikes: number;
    demandRecords: number;
  };
}

export interface InventoryItem {
  id: string;
  pharmacyId: string;
  medicineId: string;
  currentStock: number;
  reorderLevel: number;
  dailyAverageDemand: number;
  lastUpdated: string;
  status: 'OPTIMAL' | 'LOW_STOCK' | 'CRITICAL' | 'OVERSTOCKED';
  daysOfSupply?: number;
  pharmacy: Pharmacy;
  medicine: Medicine;
}

export type SpikeSeverity = 'NORMAL' | 'WARNING' | 'HIGH' | 'CRITICAL';
export type SpikeStatus = 'ACTIVE' | 'INVESTIGATING' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface Spike {
  id: string;
  medicineId: string;
  pharmacyId: string;
  demandIncreasePercentage: number;
  anomalyScore: number;
  severity: SpikeSeverity;
  status: SpikeStatus;
  detectedAt: string;
  explanation: string;
  medicine: Medicine;
  pharmacy: Pharmacy;
}

export interface DemandRecord {
  id: string;
  pharmacyId: string;
  medicineId: string;
  date: string;
  quantitySold: number;
  quantityRequested: number;
  historicalAverage: number;
  expectedDemand: number;
  anomalyScore: number;
  medicine?: Medicine;
  pharmacy?: Pharmacy;
}

export interface ForecastPoint {
  day: number;
  forecastDate: string;
  predictedDemand: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
  trendDirection: 'UP' | 'DOWN' | 'STABLE';
}

export interface Alert {
  id: string;
  userId?: string;
  pharmacyId?: string;
  medicineId?: string;
  type: 'SPIKE_DETECTED' | 'SHORTAGE_PREDICTED' | 'INVENTORY_CRITICAL' | 'SYNDROMIC_CLUSTER';
  title: string;
  message: string;
  severity: 'WARNING' | 'HIGH' | 'CRITICAL' | 'INFO';
  status: 'UNRESOLVED' | 'ACKNOWLEDGED' | 'RESOLVED';
  createdAt: string;
  resolvedAt?: string;
  pharmacy?: Pharmacy;
  medicine?: Medicine;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  medicineId?: string;
  pharmacyId?: string;
  confidence: number;
  insightType: 'ANOMALY_EXPLANATION' | 'SYNDROMIC_CORRELATION' | 'SHORTAGE_RISK' | 'GEOGRAPHIC_CLUSTER';
  createdAt: string;
  medicine?: Medicine;
  pharmacy?: Pharmacy;
}

export interface DashboardOverviewData {
  kpis: {
    pharmaciesMonitored: { value: number; change: string; trend: string; sparkline: number[] };
    medicinesMonitored: { value: number; change: string; trend: string; sparkline: number[] };
    activeSpikes: { value: number; change: string; trend: string; severity: string; sparkline: number[] };
    criticalAlerts: { value: number; change: string; trend: string; severity: string; sparkline: number[] };
    predictedShortages: { value: number; change: string; trend: string; severity: string; sparkline: number[] };
    aiConfidence: { value: string; change: string; trend: string; sparkline: number[] };
  };
  demandTrend: Array<{ date: string; actual: number; baseline: number; upperLimit: number; lowerLimit: number }>;
  citySummary: Array<{ city: string; activeSpikes: number; riskLevel: string; monitoredPharmacies: number }>;
  recentSpikes: Spike[];
  recentAlerts: Alert[];
  recentInsights: AIInsight[];
  systemStatus: {
    aiEngine: string;
    anomalyContaminationRate: string;
    lastSync: string;
    environment: string;
  };
}
