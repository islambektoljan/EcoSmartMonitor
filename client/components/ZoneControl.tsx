
import React from 'react';
import { Layers } from 'lucide-react';
import ZoneCard from './ZoneCard';
import { Zone } from '../types';

interface ZoneControlProps {
  zones: Zone[];
  onToggleLight: (zoneId: string, lightId: string) => void;
  onSetBrightness: (zoneId: string, lightId: string, value: number) => void;
  onToggleAppliance: (zoneId: string, applianceId: string) => void;
  onMasterOff: (zoneId: string) => void;
  onSetZoneColor: (zoneId: string, color: string) => void;
  onAddDevice: (zoneId: string, type: 'light' | 'appliance', data: any) => void;
  onRemoveDevice: (zoneId: string, deviceId: string, type: 'light' | 'appliance') => void;
}

const ZoneControl: React.FC<ZoneControlProps> = ({ 
  zones, 
  onToggleLight, 
  onSetBrightness, 
  onToggleAppliance,
  onMasterOff,
  onSetZoneColor,
  onAddDevice,
  onRemoveDevice
}) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl backdrop-blur-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Room & Zone Manager
          </h2>
          <p className="text-slate-400 text-sm">Monitor sensors and control lighting by zone</p>
        </div>
      </div>

      {/* Grid of Zones */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 bg-slate-900/20 flex-1 overflow-y-auto min-h-0 scrollbar-thin">
        {zones.map(zone => (
          <ZoneCard 
            key={zone.id} 
            zone={zone}
            onToggleLight={onToggleLight}
            onSetBrightness={onSetBrightness}
            onToggleAppliance={onToggleAppliance}
            onMasterOff={onMasterOff}
            onSetColor={(color) => onSetZoneColor(zone.id, color)}
            onAddDevice={onAddDevice}
            onRemoveDevice={onRemoveDevice}
          />
        ))}
      </div>
    </div>
  );
};

export default ZoneControl;
