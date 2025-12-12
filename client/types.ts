
// Define the types of resources we monitor
export enum ResourceType {
  ELECTRICITY = 'Electricity',
  WATER = 'Water',
  GAS = 'Gas',
  HEAT = 'Heat'
}

// Structure for a single data point in the charts
export interface ChartDataPoint {
  name: string; // Time label (e.g., "Mon", "Jan")
  value: number; // Consumption value
  avg: number;   // Average baseline for comparison
}

// Structure for historical analysis
export interface HistoricalDataPoint {
  id: string;
  date: string;
  value: number;
  unit: string;
  cost: number; // Estimated cost for display in table
}

// Structure for real-time sensor status
export interface SensorStatus {
  id: string;
  type: ResourceType;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'warning' | 'critical';
  threshold: number; // Limit before warning
}

// Structure for an AI insight/tip (Legacy)
export interface Insight {
  id: number;
  type: 'saving' | 'alert' | 'achievement';
  message: string;
  impact: string; // e.g., "-10% Cost"
}

// Priority levels for the Smart Insights Engine
export type InsightPriority = 'critical' | 'warning' | 'info';

// Structure for the new Logic-Driven Insights
export interface SmartInsight {
  id: string;
  priority: InsightPriority;
  title: string;
  message: string;
  action: string;
  potentialSavingsKZT?: number;
}

// Time range selection for charts
export type TimeRange = 'week' | 'month';

// New: Outdoor Weather Data Interface
export interface OutdoorWeather {
  temp: number;
  humidity: number;
  aqi: number; // European AQI
  pm25: number;
  loading: boolean;
  error: string | null;
}

// --- Smart Device Interfaces (Legacy DeviceManager) ---
export type DeviceType = 'light' | 'climate' | 'appliance' | 'security';
export type Room = 'Living Room' | 'Kitchen' | 'Bedroom' | 'Bathroom' | 'Entrance';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  room: Room;
  isOn: boolean;
  powerDraw: number; // Watts when active
  settings?: {
    brightness?: number; // 0-100%
    temperature?: number; // Current reading
    targetTemp?: number; // Set point
    mode?: string; // e.g. 'Cool', 'Heat', 'Auto'
    status?: string; // Text status e.g., 'Locked', 'Cleaning'
    color?: string; // For RGB lights
  };
}

// --- New Zone Architecture ---
export type ZoneSensorType = 'temp' | 'humidity' | 'motion' | 'lux' | 'smoke' | 'gas' | 'leak' | 'co2' | 'gate' | 'daylight';
export type ZoneLightType = 'main' | 'accent' | 'spot';

export interface ZoneSensor {
  id: string;
  type: ZoneSensorType;
  label: string;
  value: string | number;
  unit?: string;
  status: 'normal' | 'warning' | 'critical';
}

export interface ZoneLight {
  id: string;
  name: string;
  type: ZoneLightType;
  isOn: boolean;
  brightness: number; // 0-100
  isDimmable: boolean;
  powerDraw: number; // Watts at 100% brightness
  color?: string; // Hex for UI preview
}

export interface ZoneAppliance {
  id: string;
  name: string;
  icon: string; // lucide icon name
  isOn: boolean;
  powerDraw: number; // Watts
  type: 'climate' | 'appliance' | 'security' | 'media';
}

export interface Zone {
  id: string;
  name: string;
  icon: string; // Icon name key
  accentColor: string; // Hex code for custom UI theming
  sensors: ZoneSensor[];
  lights: ZoneLight[];
  appliances: ZoneAppliance[];
}

// --- Scenarios ---
export interface ScenarioAction {
  zoneId: string;
  deviceId: string;
  deviceType: 'light' | 'appliance';
  isOn: boolean;
  brightness?: number;
}

export interface Scenario {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  description: string;
  actions: ScenarioAction[];
}
