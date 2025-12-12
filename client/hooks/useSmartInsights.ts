
import { useState, useEffect } from 'react';
import { SmartInsight, OutdoorWeather } from '../types';
import { KZ_TARIFFS } from '../constants';

interface IndoorState {
  temp: number;
  humidity: number;
  co2: number;
  windowOpen: boolean;
  heatingStatus: boolean;
}

export const useSmartInsights = (
  indoor: IndoorState,
  outdoor: OutdoorWeather,
  powerUsageKW: number
) => {
  const [insights, setInsights] = useState<SmartInsight[]>([]);

  useEffect(() => {
    const generatedInsights: SmartInsight[] = [];

    // --- 1. Critical Alerts (Priority: High) ---

    // Logic: "The Money Burner"
    // IF Window is Open AND Heating is On AND Outdoor Temp is Cold (< 15C)
    if (indoor.windowOpen && indoor.heatingStatus && outdoor.temp < 15) {
      generatedInsights.push({
        id: 'critical-money-burner',
        priority: 'critical',
        title: 'Heat Loss Detected',
        message: 'Window is open while heating is active! You are venting expensive heat.',
        action: 'Close window immediately.',
        potentialSavingsKZT: 45 // Estimated hourly loss
      });
    }

    // Logic: "The Smog Trap"
    // IF Indoor CO2 is High (> 1000) AND Outdoor Air Quality is Poor (> 35 AQI approx threshold for sensitive/moderate)
    // Note: OpenMeteo European AQI: 0-20 Good, 20-40 Fair, 40-60 Moderate, 60+ Poor.
    // Using > 35 as per prompt requirement (implies start of degradation).
    if (indoor.co2 > 1000 && outdoor.aqi > 35) {
      generatedInsights.push({
        id: 'critical-smog-trap',
        priority: 'critical',
        title: 'Smog Warning',
        message: 'Indoor CO₂ is high, but outdoor air quality is poor.',
        action: 'Keep windows closed. Use Air Purifier & HVAC recirculation.',
      });
    }

    // --- 2. Health & Comfort (Priority: Medium) ---

    // Logic: "Dry Air Warning"
    if (indoor.humidity < 30) {
      generatedInsights.push({
        id: 'warning-dry-air',
        priority: 'warning',
        title: 'Air is Too Dry',
        message: `Indoor humidity is ${indoor.humidity}% (<30%). Risk of respiratory irritation.`,
        action: 'Turn on Humidifier.',
      });
    }

    // Logic: "Mold Risk"
    if (indoor.humidity > 60 && indoor.temp > 25) {
      generatedInsights.push({
        id: 'warning-mold-risk',
        priority: 'warning',
        title: 'High Humidity & Heat',
        message: 'Conditions are favorable for mold growth.',
        action: 'Ventilate room or use AC to dehumidify.',
      });
    }

    // --- 3. Eco & Savings (Priority: Low) ---

    // Logic: "Vampire Power"
    // If power usage is high (> 1.5kW) but no specific heavy appliance logic is triggered (simulating baseline check)
    if (powerUsageKW > 1.5) {
      generatedInsights.push({
        id: 'info-vampire-power',
        priority: 'info',
        title: 'High Baseline Power',
        message: `Current load is ${powerUsageKW.toFixed(2)} kW. Possible standby devices active.`,
        action: 'Check TVs/PCs in standby.',
        potentialSavingsKZT: 2000 // Monthly estimate
      });
    }

    // Default "Good Job" insight if nothing else matches
    if (generatedInsights.length === 0) {
      generatedInsights.push({
        id: 'info-optimal',
        priority: 'info',
        title: 'System Optimal',
        message: 'Your home is running efficiently. No immediate actions required.',
        action: 'View Historical Data',
      });
    }

    setInsights(generatedInsights);

  }, [indoor, outdoor, powerUsageKW]);

  return insights;
};
