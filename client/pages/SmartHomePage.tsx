
import React, { useState } from 'react';
import ZoneControl from '../components/ZoneControl';
import ScenarioManager from '../components/ScenarioManager';
import { Zone, Scenario, ScenarioAction } from '../types';
import { Layers, Clapperboard } from 'lucide-react';

interface SmartHomePageProps {
  zones: Zone[];
  scenarios: Scenario[];
  onToggleLight: (zoneId: string, lightId: string) => void;
  onSetBrightness: (zoneId: string, lightId: string, value: number) => void;
  onToggleAppliance: (zoneId: string, applianceId: string) => void;
  onMasterOff: (zoneId: string) => void;
  onSetZoneColor: (zoneId: string, color: string) => void;
  onAddDevice: (zoneId: string, type: 'light' | 'appliance', data: any) => void;
  onRemoveDevice: (zoneId: string, deviceId: string, type: 'light' | 'appliance') => void;
  onActivateScenario: (id: string) => void;
  onCreateScenario: (name: string, icon: string, actions: ScenarioAction[]) => void;
  onUpdateScenario: (id: string, name: string, icon: string, actions: ScenarioAction[]) => void;
  onDeleteScenario: (id: string) => void;
}

const SmartHomePage: React.FC<SmartHomePageProps> = (props) => {
  const [activeTab, setActiveTab] = useState<'zones' | 'scenarios'>('zones');

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col" style={{ height: 'calc(100vh - 7rem)' }}>
       <div className="mb-4 shrink-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Smart Home Control</h1>
          <p className="text-slate-400 text-sm">Manage zones, lighting, appliances, and automation.</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="bg-slate-900 p-1 rounded-xl flex border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('zones')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'zones' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            Zones
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'scenarios' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clapperboard className="w-4 h-4" />
            Scenarios
          </button>
        </div>
      </div>

      {/* Content Area - Flex Grow to fill remaining space */}
      <div className="flex-1 min-h-0 relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0">
          {activeTab === 'zones' ? (
             <ZoneControl 
               zones={props.zones}
               onToggleLight={props.onToggleLight}
               onSetBrightness={props.onSetBrightness}
               onToggleAppliance={props.onToggleAppliance}
               onMasterOff={props.onMasterOff}
               onSetZoneColor={props.onSetZoneColor}
               onAddDevice={props.onAddDevice}
               onRemoveDevice={props.onRemoveDevice}
             />
          ) : (
             <ScenarioManager 
               scenarios={props.scenarios}
               zones={props.zones}
               onActivate={props.onActivateScenario}
               onCreate={props.onCreateScenario}
               onUpdate={props.onUpdateScenario}
               onDelete={props.onDeleteScenario}
             />
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartHomePage;
