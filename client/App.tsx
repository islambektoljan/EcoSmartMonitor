
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
import { Bell, Menu, X, LayoutDashboard, BarChart3, Layers, CheckCircle2, Info } from 'lucide-react';

import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SmartHomePage from './pages/SmartHomePage';

import { useOutdoorWeather } from './hooks/useOutdoorWeather';
import { useSmartInsights } from './hooks/useSmartInsights'; 
import { INITIAL_SENSORS, HOUSE_ZONES, INITIAL_SCENARIOS } from './constants';
import { SensorStatus, ResourceType, Zone, ZoneLight, ZoneAppliance, Scenario, ScenarioAction } from './types';

// Mock API Service (Simulated Backend)
const mockFetchSensorData = async (currentSensors: SensorStatus[]): Promise<SensorStatus[]> => {
  return new Promise((resolve) => {
    const latency = Math.floor(Math.random() * 500) + 300;
    setTimeout(() => {
      const updatedSensors = currentSensors.map(sensor => {
        let newValue = sensor.value;
        let newTrend = sensor.trend;

        if (sensor.type === ResourceType.ELECTRICITY) {
           return sensor;
        } 
        
        const isUsing = Math.random() > 0.7; 
        if (isUsing) {
            const increment = Math.random() * 0.005; 
            newValue = sensor.value + increment;
            newTrend = 'up';
        } else {
            newTrend = 'stable';
        }
        
        let newStatus: SensorStatus['status'] = 'normal';
        if (newValue > sensor.threshold * 0.9) newStatus = 'warning';
        if (newValue > sensor.threshold) newStatus = 'critical';

        return {
          ...sensor,
          value: parseFloat(newValue.toFixed(3)),
          status: newStatus,
          trend: newTrend
        };
      });
      resolve(updatedSensors);
    }, latency);
  });
};

function AppContent() {
  // Global State
  const [sensors, setSensors] = useState<SensorStatus[]>(INITIAL_SENSORS);
  const [zones, setZones] = useState<Zone[]>(HOUSE_ZONES);
  const [scenarios, setScenarios] = useState<Scenario[]>(INITIAL_SCENARIOS);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  
  // Real Outdoor Data Hook
  const outdoorData = useOutdoorWeather();

  // Mock Indoor Data
  const [indoorData] = useState({
    temp: 23,
    humidity: 28,
    co2: 1100,
    windowOpen: true,
    heatingStatus: true
  });

  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Extract real-time electricity usage
  const electricitySensor = sensors.find(s => s.type === ResourceType.ELECTRICITY);
  const currentPowerUsage = electricitySensor ? electricitySensor.value : 0;

  // Smart Insights Hook
  const insights = useSmartInsights(indoorData, outdoorData, currentPowerUsage);

  // Ref for intervals
  const sensorsRef = useRef(sensors);
  useEffect(() => { sensorsRef.current = sensors; }, [sensors]);

  // --- Zone Handlers ---
  const handleToggleLight = (zoneId: string, lightId: string) => {
    setZones(prev => prev.map(zone => {
      if (zone.id !== zoneId) return zone;
      return {
        ...zone,
        lights: zone.lights.map(light => 
          light.id === lightId ? { ...light, isOn: !light.isOn } : light
        )
      };
    }));
  };

  const handleSetBrightness = (zoneId: string, lightId: string, value: number) => {
    setZones(prev => prev.map(zone => {
      if (zone.id !== zoneId) return zone;
      return {
        ...zone,
        lights: zone.lights.map(light => 
          light.id === lightId ? { ...light, brightness: value } : light
        )
      };
    }));
  };

  const handleToggleAppliance = (zoneId: string, applianceId: string) => {
    setZones(prev => prev.map(zone => {
      if (zone.id !== zoneId) return zone;
      return {
        ...zone,
        appliances: zone.appliances.map(app => 
           app.id === applianceId ? { ...app, isOn: !app.isOn } : app
        )
      };
    }));
  };

  const handleMasterOff = (zoneId: string) => {
    setZones(prev => prev.map(zone => {
      if (zone.id !== zoneId) return zone;
      return {
        ...zone,
        lights: zone.lights.map(light => ({ ...light, isOn: false })),
        appliances: zone.appliances.map(app => ({ ...app, isOn: false }))
      };
    }));
  };

  const handleSetZoneColor = (zoneId: string, color: string) => {
    setZones(prev => prev.map(zone => {
      if (zone.id !== zoneId) return zone;
      return { ...zone, accentColor: color };
    }));
  };

  const handleAddDevice = (zoneId: string, type: 'light' | 'appliance', data: any) => {
    setZones(prev => prev.map(zone => {
      if (zone.id !== zoneId) return zone;
      const newId = `${type}-${Date.now()}`;
      if (type === 'light') {
        const newLight: ZoneLight = {
          id: newId,
          name: data.name,
          type: 'main',
          isOn: false,
          brightness: 100,
          isDimmable: data.isDimmable,
          powerDraw: data.powerDraw
        };
        return { ...zone, lights: [...zone.lights, newLight] };
      } else {
        const newAppliance: ZoneAppliance = {
          id: newId,
          name: data.name,
          icon: data.icon,
          isOn: false,
          powerDraw: data.powerDraw,
          type: 'appliance'
        };
        return { ...zone, appliances: [...zone.appliances, newAppliance] };
      }
    }));
    showToast(`${type === 'light' ? 'Light' : 'Appliance'} added to ${zoneId.split('-')[1].toUpperCase()}`);
  };

  const handleRemoveDevice = (zoneId: string, deviceId: string, type: 'light' | 'appliance') => {
    setZones(prev => prev.map(zone => {
      if (zone.id !== zoneId) return zone;
      if (type === 'light') {
        return { ...zone, lights: zone.lights.filter(l => l.id !== deviceId) };
      } else {
        return { ...zone, appliances: zone.appliances.filter(a => a.id !== deviceId) };
      }
    }));
    showToast('Device removed', 'info');
  };

  // --- Scenario Handlers ---

  const handleActivateScenario = (id: string) => {
    const scenario = scenarios.find(s => s.id === id);
    if (!scenario) return;

    setZones(prevZones => {
      return prevZones.map(zone => {
        // Find actions for this specific zone
        const actionsForZone = scenario.actions.filter(a => a.zoneId === zone.id);
        if (actionsForZone.length === 0) return zone;

        // Apply actions to lights
        const newLights = zone.lights.map(light => {
          const action = actionsForZone.find(a => a.deviceId === light.id && a.deviceType === 'light');
          if (action) {
            return { 
              ...light, 
              isOn: action.isOn, 
              brightness: action.brightness !== undefined ? action.brightness : light.brightness 
            };
          }
          return light;
        });

        // Apply actions to appliances
        const newAppliances = zone.appliances.map(app => {
          const action = actionsForZone.find(a => a.deviceId === app.id && a.deviceType === 'appliance');
          if (action) {
            return { ...app, isOn: action.isOn };
          }
          return app;
        });

        return { ...zone, lights: newLights, appliances: newAppliances };
      });
    });

    showToast(`Scenario "${scenario.name}" Activated!`, 'success');
  };

  const handleCreateScenario = (name: string, icon: string, actions: ScenarioAction[]) => {
    const newScenario: Scenario = {
      id: `custom-${Date.now()}`,
      name,
      icon,
      description: `Custom scenario with ${actions.length} actions.`,
      actions
    };

    setScenarios(prev => [...prev, newScenario]);
    showToast(`Scenario "${name}" Saved!`, 'success');
  };

  const handleUpdateScenario = (id: string, name: string, icon: string, actions: ScenarioAction[]) => {
    setScenarios(prev => prev.map(s => {
      if (s.id !== id) return s;
      return {
        ...s,
        name,
        icon,
        description: `Updated scenario with ${actions.length} actions.`,
        actions
      };
    }));
    showToast(`Scenario "${name}" Updated!`, 'success');
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios(prev => prev.filter(s => s.id !== id));
    showToast('Scenario deleted', 'info');
  };

  // --- Dynamic Power Calculation ---
  useEffect(() => {
    let totalWatts = 0;
    const BASE_LOAD_WATTS = 150; 
    totalWatts += BASE_LOAD_WATTS;

    zones.forEach(zone => {
        zone.lights.forEach(light => {
            if (light.isOn) {
                const scale = light.isDimmable ? (light.brightness / 100) : 1;
                totalWatts += light.powerDraw * scale;
            }
        });
        zone.appliances.forEach(app => {
            if (app.isOn) totalWatts += app.powerDraw;
        });
    });

    const totalKW = parseFloat((totalWatts / 1000).toFixed(3));

    setSensors(prevSensors => prevSensors.map(s => {
        if (s.type === ResourceType.ELECTRICITY) {
            const trend = totalKW > s.value ? 'up' : totalKW < s.value ? 'down' : 'stable';
            let status: SensorStatus['status'] = 'normal';
            if (totalKW > s.threshold * 0.9) status = 'warning';
            if (totalKW > s.threshold) status = 'critical';

            return { ...s, value: totalKW, trend, status };
        }
        return s;
    }));
  }, [zones]);

  // Simulated Real-time Data Updates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentData = sensorsRef.current;
        const newData = await mockFetchSensorData(currentData);
        setSensors(prev => {
            const currentElec = prev.find(s => s.type === ResourceType.ELECTRICITY);
            return newData.map(s => {
                if (s.type === ResourceType.ELECTRICITY && currentElec) {
                    return currentElec;
                }
                return s;
            });
        });
      } catch (error) {
        console.error("Failed to fetch sensor data:", error);
      }
    };
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-eco-500/30">
      
      {/* Sidebar Navigation (Desktop) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        
        {/* Top Header */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
          <div className="px-6 h-16 flex items-center justify-between">
            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-4 md:hidden">
               <button onClick={() => setIsMobileMenuOpen(true)}>
                 <Menu className="text-slate-400" />
               </button>
               <span className="font-bold">EcoSmart</span>
            </div>

            {/* Desktop Spacer */}
            <div className="hidden md:block"></div>

            <div className="flex items-center gap-6">
              <button className="relative text-slate-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1 relative">
           <Routes>
             <Route 
               path="/" 
               element={
                 <DashboardPage 
                   sensors={sensors}
                   indoorData={indoorData}
                   outdoorData={outdoorData}
                   insights={insights}
                 />
               } 
             />
             <Route 
               path="/analytics" 
               element={<AnalyticsPage />} 
             />
             <Route 
               path="/control" 
               element={
                 <SmartHomePage 
                   zones={zones}
                   scenarios={scenarios}
                   onToggleLight={handleToggleLight}
                   onSetBrightness={handleSetBrightness}
                   onToggleAppliance={handleToggleAppliance}
                   onMasterOff={handleMasterOff}
                   onSetZoneColor={handleSetZoneColor}
                   onAddDevice={handleAddDevice}
                   onRemoveDevice={handleRemoveDevice}
                   onActivateScenario={handleActivateScenario}
                   onCreateScenario={handleCreateScenario}
                   onUpdateScenario={handleUpdateScenario}
                   onDeleteScenario={handleDeleteScenario}
                 />
               } 
             />
             {/* Catch-all route to redirect any unknown paths to Dashboard */}
             <Route path="*" element={<Navigate to="/" replace />} />
           </Routes>
        </main>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
            toast.type === 'success' ? 'bg-eco-500/10 border-eco-500/20 text-eco-400' : 'bg-slate-800 border-slate-700 text-white'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            <span className="font-bold text-sm">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950 md:hidden flex flex-col animate-in slide-in-from-left-full duration-200">
          <div className="p-4 flex justify-between items-center border-b border-slate-800">
             <span className="font-bold text-lg">EcoSmart</span>
             <button onClick={() => setIsMobileMenuOpen(false)}>
               <X className="w-6 h-6 text-slate-400" />
             </button>
          </div>
          <nav className="p-4 space-y-2">
            <NavLink to="/" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl ${isActive ? 'bg-eco-500/10 text-eco-400' : 'text-slate-400'}`}>
               <LayoutDashboard className="w-5 h-5" /> Dashboard
            </NavLink>
            <NavLink to="/analytics" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl ${isActive ? 'bg-eco-500/10 text-eco-400' : 'text-slate-400'}`}>
               <BarChart3 className="w-5 h-5" /> Analytics
            </NavLink>
            <NavLink to="/control" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl ${isActive ? 'bg-eco-500/10 text-eco-400' : 'text-slate-400'}`}>
               <Layers className="w-5 h-5" /> Smart Home
            </NavLink>
          </nav>
        </div>
      )}
    </div>
  );
}

// Use Router (aliased HashRouter) for reliable client-side navigation
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
