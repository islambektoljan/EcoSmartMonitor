
import { ChartDataPoint, Insight, ResourceType, SensorStatus, Zone, Scenario } from './types';

// Kazakhstani Tenge Tariffs (2024/2025 Estimates - Almaty Region)
export const KZ_TARIFFS = {
  ELECTRICITY: 30.26, // KZT per kWh (Average tiered rate)
  WATER: 73.92,       // KZT per m³
  GAS: 4.30,          // KZT per m³ (Derived from ~4300.29 KZT per 1000m³)
  HEAT: 8683.00       // KZT per Gcal
};

// Configuration for Housing Type (For future logic expansion)
export const USER_HOUSING_TYPE: 'apartment' | 'house' = 'apartment';

// Cost Rates (KZT per unit)
export const RESOURCE_RATES = {
  [ResourceType.ELECTRICITY]: KZ_TARIFFS.ELECTRICITY,
  [ResourceType.WATER]: KZ_TARIFFS.WATER,
  [ResourceType.GAS]: KZ_TARIFFS.GAS,
  [ResourceType.HEAT]: KZ_TARIFFS.HEAT
};

// Data Maps for Charts
export const CHART_DATA = {
  [ResourceType.ELECTRICITY]: {
    week: [
      { name: 'Mon', value: 12.5, avg: 14 },
      { name: 'Tue', value: 11.8, avg: 14 },
      { name: 'Wed', value: 13.2, avg: 14 },
      { name: 'Thu', value: 12.1, avg: 14 },
      { name: 'Fri', value: 15.5, avg: 14 },
      { name: 'Sat', value: 19.8, avg: 16 },
      { name: 'Sun', value: 18.2, avg: 16 },
    ],
    month: [
      { name: 'Week 1', value: 98, avg: 105 },
      { name: 'Week 2', value: 112, avg: 105 },
      { name: 'Week 3', value: 104, avg: 105 },
      { name: 'Week 4', value: 89, avg: 105 },
    ]
  },
  [ResourceType.WATER]: {
    week: [
      { name: 'Mon', value: 0.32, avg: 0.35 },
      { name: 'Tue', value: 0.30, avg: 0.35 },
      { name: 'Wed', value: 0.45, avg: 0.35 }, // Laundry day?
      { name: 'Thu', value: 0.31, avg: 0.35 },
      { name: 'Fri', value: 0.38, avg: 0.35 },
      { name: 'Sat', value: 0.52, avg: 0.45 }, // Weekend
      { name: 'Sun', value: 0.48, avg: 0.45 },
    ],
    month: [
      { name: 'Week 1', value: 2.4, avg: 2.5 },
      { name: 'Week 2', value: 2.6, avg: 2.5 },
      { name: 'Week 3', value: 2.3, avg: 2.5 },
      { name: 'Week 4', value: 2.1, avg: 2.5 },
    ]
  },
  [ResourceType.GAS]: {
    week: [
      { name: 'Mon', value: 1.1, avg: 1.2 },
      { name: 'Tue', value: 0.9, avg: 1.2 },
      { name: 'Wed', value: 1.0, avg: 1.2 },
      { name: 'Thu', value: 1.3, avg: 1.2 },
      { name: 'Fri', value: 1.4, avg: 1.2 },
      { name: 'Sat', value: 1.8, avg: 1.4 }, // Cooking/Heating
      { name: 'Sun', value: 1.6, avg: 1.4 },
    ],
    month: [
      { name: 'Week 1', value: 8.5, avg: 9.0 },
      { name: 'Week 2', value: 9.2, avg: 9.0 },
      { name: 'Week 3', value: 8.8, avg: 9.0 },
      { name: 'Week 4', value: 7.5, avg: 9.0 },
    ]
  },
  [ResourceType.HEAT]: {
    week: [
      { name: 'Mon', value: 0.04, avg: 0.05 },
      { name: 'Tue', value: 0.03, avg: 0.05 },
      { name: 'Wed', value: 0.04, avg: 0.05 },
      { name: 'Thu', value: 0.05, avg: 0.05 },
      { name: 'Fri', value: 0.04, avg: 0.05 },
      { name: 'Sat', value: 0.06, avg: 0.06 },
      { name: 'Sun', value: 0.06, avg: 0.06 },
    ],
    month: [
      { name: 'Week 1', value: 0.35, avg: 0.4 },
      { name: 'Week 2', value: 0.32, avg: 0.4 },
      { name: 'Week 3', value: 0.38, avg: 0.4 },
      { name: 'Week 4', value: 0.29, avg: 0.4 },
    ]
  }
};

// Realistic Sensor Status
// Electricity: Instantaneous Power (kW) - fluctuating
// Water/Gas/Heat: Daily Cumulative Volume (m³/Gcal) - accumulating
export const INITIAL_SENSORS: SensorStatus[] = [
  {
    id: 'elec-01',
    type: ResourceType.ELECTRICITY,
    value: 2.45, // Realistic active load (AC + Computer + Lights)
    unit: 'kW',
    trend: 'stable',
    status: 'normal',
    threshold: 4.0, // Warning above 4kW instant load
  },
  {
    id: 'water-01',
    type: ResourceType.WATER,
    value: 0.32, // ~320 Liters used so far today (Family of 3-4)
    unit: 'm³',
    trend: 'up',
    status: 'normal',
    threshold: 0.5, // Alert at 500L
  },
  {
    id: 'gas-01',
    type: ResourceType.GAS,
    value: 1.15, // Heating/Cooking usage
    unit: 'm³',
    trend: 'down', // Lower than yesterday same time
    status: 'warning', // Approaching daily soft limit
    threshold: 1.2,
  },
  {
    id: 'heat-01',
    type: ResourceType.HEAT,
    value: 0.04, // Low usage (Summer/Spring profile)
    unit: 'Gcal',
    trend: 'stable',
    status: 'normal',
    threshold: 0.1,
  },
];

// Context-aware "AI" tips
export const MOCK_INSIGHTS: Insight[] = [
  {
    id: 1,
    type: 'saving',
    message: 'Electricity load is optimal. Good time to run high-energy appliances.',
    impact: 'Save ~12%',
  },
  {
    id: 2,
    type: 'alert',
    message: 'Gas usage is reaching daily average early. Check thermostat settings.',
    impact: 'Check Temp',
  },
  {
    id: 3,
    type: 'achievement',
    message: 'Water consumption is 10% lower than last week\'s average.',
    impact: 'Eco Badge',
  },
];

// --- ZONE CONTROL MOCK DATA ---
export const HOUSE_ZONES: Zone[] = [
  {
    id: 'zone-lr',
    name: 'Living Room',
    icon: 'Sofa',
    accentColor: '#8b5cf6', // Violet
    sensors: [
      { id: 's-lr-temp', type: 'temp', label: 'Temp', value: 22, unit: '°C', status: 'normal' },
      { id: 's-lr-mot', type: 'motion', label: 'Occupancy', value: 'Active', status: 'normal' },
      { id: 's-lr-lux', type: 'lux', label: 'Light', value: 450, unit: 'lx', status: 'normal' }
    ],
    lights: [
      { id: 'l-lr-main', name: 'Main Chandelier', type: 'main', isOn: true, brightness: 80, isDimmable: true, powerDraw: 60 },
      { id: 'l-lr-tv', name: 'TV Backlight', type: 'accent', isOn: false, brightness: 100, isDimmable: true, color: '#8b5cf6', powerDraw: 15 },
      { id: 'l-lr-floor', name: 'Floor Lamp', type: 'spot', isOn: true, brightness: 100, isDimmable: false, powerDraw: 12 }
    ],
    appliances: [
      { id: 'a-lr-ac', name: 'Air Conditioner', icon: 'Fan', type: 'climate', isOn: true, powerDraw: 1200 },
      { id: 'a-lr-tv', name: 'Smart TV', icon: 'Tv', type: 'media', isOn: false, powerDraw: 120 }
    ]
  },
  {
    id: 'zone-kt',
    name: 'Kitchen',
    icon: 'ChefHat',
    accentColor: '#f97316', // Orange
    sensors: [
      { id: 's-kt-smoke', type: 'smoke', label: 'Smoke', value: 'Clear', status: 'normal' },
      { id: 's-kt-gas', type: 'gas', label: 'Gas Leak', value: 'None', status: 'normal' },
      { id: 's-kt-leak', type: 'leak', label: 'Water Leak', value: 'Dry', status: 'normal' }
    ],
    lights: [
      { id: 'l-kt-spot', name: 'Ceiling Spots', type: 'main', isOn: true, brightness: 100, isDimmable: false, powerDraw: 40 },
      { id: 'l-kt-cab', name: 'Cabinet LEDs', type: 'accent', isOn: true, brightness: 60, isDimmable: true, powerDraw: 15 },
      { id: 'l-kt-tbl', name: 'Dining Table', type: 'main', isOn: false, brightness: 100, isDimmable: true, powerDraw: 25 }
    ],
    appliances: [
      { id: 'a-kt-fridge', name: 'Smart Fridge', icon: 'Refrigerator', type: 'appliance', isOn: true, powerDraw: 150 },
      { id: 'a-kt-kettle', name: 'Kettle', icon: 'Coffee', type: 'appliance', isOn: false, powerDraw: 2000 }
    ]
  },
  {
    id: 'zone-mb',
    name: 'Master Bedroom',
    icon: 'BedDouble',
    accentColor: '#ec4899', // Pink
    sensors: [
      { id: 's-mb-co2', type: 'co2', label: 'CO₂', value: 850, unit: 'ppm', status: 'normal' },
      { id: 's-mb-temp', type: 'temp', label: 'Temp', value: 21, unit: '°C', status: 'normal' },
      { id: 's-mb-hum', type: 'humidity', label: 'Humidity', value: 40, unit: '%', status: 'normal' }
    ],
    lights: [
      { id: 'l-mb-main', name: 'Main Light', type: 'main', isOn: false, brightness: 100, isDimmable: true, powerDraw: 30 },
      { id: 'l-mb-bed-l', name: 'Bedside Left', type: 'spot', isOn: false, brightness: 30, isDimmable: true, powerDraw: 8 },
      { id: 'l-mb-bed-r', name: 'Bedside Right', type: 'spot', isOn: true, brightness: 30, isDimmable: true, powerDraw: 8 },
      { id: 'l-mb-ward', name: 'Wardrobe', type: 'accent', isOn: false, brightness: 100, isDimmable: false, powerDraw: 10 }
    ],
    appliances: [
      { id: 'a-mb-humid', name: 'Humidifier', icon: 'Droplets', type: 'climate', isOn: true, powerDraw: 45 }
    ]
  },
  {
    id: 'zone-bath',
    name: 'Bathroom',
    icon: 'Bath',
    accentColor: '#06b6d4', // Cyan
    sensors: [
      { id: 's-ba-hum', type: 'humidity', label: 'Humidity', value: 65, unit: '°C', status: 'warning' },
      { id: 's-ba-leak', type: 'leak', label: 'Leak Sensor', value: 'Dry', status: 'normal' },
      { id: 's-ba-mot', type: 'motion', label: 'Motion', value: 'None', status: 'normal' }
    ],
    lights: [
      { id: 'l-ba-main', name: 'Main Light', type: 'main', isOn: false, brightness: 100, isDimmable: false, powerDraw: 20 },
      { id: 'l-ba-mir', name: 'Vanity Mirror', type: 'spot', isOn: false, brightness: 100, isDimmable: false, powerDraw: 15 }
    ],
    appliances: []
  },
  {
    id: 'zone-out',
    name: 'Outdoor / Garden',
    icon: 'Trees',
    accentColor: '#10b981', // Emerald
    sensors: [
      { id: 's-out-mot', type: 'motion', label: 'Driveway', value: 'Clear', status: 'normal' },
      { id: 's-out-day', type: 'daylight', label: 'Light Lvl', value: 'Dusk', status: 'normal' },
      { id: 's-out-gate', type: 'gate', label: 'Main Gate', value: 'Closed', status: 'normal' }
    ],
    lights: [
      { id: 'l-out-porch', name: 'Porch Light', type: 'main', isOn: true, brightness: 100, isDimmable: false, powerDraw: 15 },
      { id: 'l-out-path', name: 'Garden Path', type: 'accent', isOn: true, brightness: 100, isDimmable: false, powerDraw: 30 },
      { id: 'l-out-flood', name: 'Garage Flood', type: 'spot', isOn: false, brightness: 100, isDimmable: false, powerDraw: 50 }
    ],
    appliances: []
  }
];

export const INITIAL_SCENARIOS: Scenario[] = [
  {
    id: 'sc-good-night',
    name: 'Good Night',
    icon: 'Moon',
    description: 'Turn off all main lights, activate bedroom humidifier, dim bedside lamps.',
    actions: [
      // Living Room: All OFF
      { zoneId: 'zone-lr', deviceId: 'l-lr-main', deviceType: 'light', isOn: false },
      { zoneId: 'zone-lr', deviceId: 'l-lr-tv', deviceType: 'light', isOn: false },
      { zoneId: 'zone-lr', deviceId: 'l-lr-floor', deviceType: 'light', isOn: false },
      { zoneId: 'zone-lr', deviceId: 'a-lr-ac', deviceType: 'appliance', isOn: false },
      { zoneId: 'zone-lr', deviceId: 'a-lr-tv', deviceType: 'appliance', isOn: false },
      
      // Kitchen: All OFF
      { zoneId: 'zone-kt', deviceId: 'l-kt-spot', deviceType: 'light', isOn: false },
      { zoneId: 'zone-kt', deviceId: 'l-kt-cab', deviceType: 'light', isOn: false },
      { zoneId: 'zone-kt', deviceId: 'l-kt-tbl', deviceType: 'light', isOn: false },
      { zoneId: 'zone-kt', deviceId: 'a-kt-kettle', deviceType: 'appliance', isOn: false },
      
      // Bedroom: Set mood
      { zoneId: 'zone-mb', deviceId: 'l-mb-main', deviceType: 'light', isOn: false },
      { zoneId: 'zone-mb', deviceId: 'l-mb-ward', deviceType: 'light', isOn: false },
      { zoneId: 'zone-mb', deviceId: 'l-mb-bed-l', deviceType: 'light', isOn: true, brightness: 20 },
      { zoneId: 'zone-mb', deviceId: 'l-mb-bed-r', deviceType: 'light', isOn: true, brightness: 20 },
      { zoneId: 'zone-mb', deviceId: 'a-mb-humid', deviceType: 'appliance', isOn: true },
      
      // Bathroom: All OFF
      { zoneId: 'zone-bath', deviceId: 'l-ba-main', deviceType: 'light', isOn: false },
      { zoneId: 'zone-bath', deviceId: 'l-ba-mir', deviceType: 'light', isOn: false },

      // Outdoor: Porch ON
      { zoneId: 'zone-out', deviceId: 'l-out-porch', deviceType: 'light', isOn: true },
      { zoneId: 'zone-out', deviceId: 'l-out-path', deviceType: 'light', isOn: false },
      { zoneId: 'zone-out', deviceId: 'l-out-flood', deviceType: 'light', isOn: true },
    ]
  },
  {
    id: 'sc-movie',
    name: 'Movie Night',
    icon: 'Clapperboard',
    description: 'Dim living room lights, turn on TV accent light, set AC to comfort.',
    actions: [
      // Living Room: Mood Lighting
      { zoneId: 'zone-lr', deviceId: 'l-lr-main', deviceType: 'light', isOn: false },
      { zoneId: 'zone-lr', deviceId: 'l-lr-tv', deviceType: 'light', isOn: true, brightness: 100 },
      { zoneId: 'zone-lr', deviceId: 'l-lr-floor', deviceType: 'light', isOn: true, brightness: 30 },
      { zoneId: 'zone-lr', deviceId: 'a-lr-tv', deviceType: 'appliance', isOn: true },
      { zoneId: 'zone-lr', deviceId: 'a-lr-ac', deviceType: 'appliance', isOn: true },
      
      // Kitchen: Dim for snacks
      { zoneId: 'zone-kt', deviceId: 'l-kt-spot', deviceType: 'light', isOn: false },
      { zoneId: 'zone-kt', deviceId: 'l-kt-cab', deviceType: 'light', isOn: true, brightness: 30 },
      { zoneId: 'zone-kt', deviceId: 'l-kt-tbl', deviceType: 'light', isOn: false },

      // Rest of house: OFF
      { zoneId: 'zone-mb', deviceId: 'l-mb-main', deviceType: 'light', isOn: false },
      { zoneId: 'zone-bath', deviceId: 'l-ba-main', deviceType: 'light', isOn: false },
    ]
  },
  {
    id: 'sc-away',
    name: 'Away Mode',
    icon: 'Shield',
    description: 'Turn off all non-essential devices.',
    actions: [
      // Living Room
      { zoneId: 'zone-lr', deviceId: 'l-lr-main', deviceType: 'light', isOn: false },
      { zoneId: 'zone-lr', deviceId: 'l-lr-tv', deviceType: 'light', isOn: false },
      { zoneId: 'zone-lr', deviceId: 'l-lr-floor', deviceType: 'light', isOn: false },
      { zoneId: 'zone-lr', deviceId: 'a-lr-ac', deviceType: 'appliance', isOn: false },
      { zoneId: 'zone-lr', deviceId: 'a-lr-tv', deviceType: 'appliance', isOn: false },
      
      // Kitchen (Fridge stays as is, everything else OFF)
      { zoneId: 'zone-kt', deviceId: 'l-kt-spot', deviceType: 'light', isOn: false },
      { zoneId: 'zone-kt', deviceId: 'l-kt-cab', deviceType: 'light', isOn: false },
      { zoneId: 'zone-kt', deviceId: 'l-kt-tbl', deviceType: 'light', isOn: false },
      { zoneId: 'zone-kt', deviceId: 'a-kt-kettle', deviceType: 'appliance', isOn: false },
      
      // Bedroom
      { zoneId: 'zone-mb', deviceId: 'l-mb-main', deviceType: 'light', isOn: false },
      { zoneId: 'zone-mb', deviceId: 'l-mb-bed-l', deviceType: 'light', isOn: false },
      { zoneId: 'zone-mb', deviceId: 'l-mb-bed-r', deviceType: 'light', isOn: false },
      { zoneId: 'zone-mb', deviceId: 'l-mb-ward', deviceType: 'light', isOn: false },
      { zoneId: 'zone-mb', deviceId: 'a-mb-humid', deviceType: 'appliance', isOn: false },
      
      // Bathroom
      { zoneId: 'zone-bath', deviceId: 'l-ba-main', deviceType: 'light', isOn: false },
      { zoneId: 'zone-bath', deviceId: 'l-ba-mir', deviceType: 'light', isOn: false },
      
      // Outdoor (Security flood ON, Path OFF, Porch OFF)
      { zoneId: 'zone-out', deviceId: 'l-out-porch', deviceType: 'light', isOn: false },
      { zoneId: 'zone-out', deviceId: 'l-out-path', deviceType: 'light', isOn: false },
      { zoneId: 'zone-out', deviceId: 'l-out-flood', deviceType: 'light', isOn: true }, 
    ]
  }
];
