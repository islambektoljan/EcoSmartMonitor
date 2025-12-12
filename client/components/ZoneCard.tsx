
import React, { useState } from 'react';
import { 
  Thermometer, 
  Wind, 
  Droplets, 
  Eye, 
  Sun, 
  Flame, 
  CloudFog, 
  DoorOpen, 
  Zap,
  Power,
  Sofa,
  ChefHat,
  BedDouble,
  Bath,
  Trees,
  Lightbulb,
  AlertOctagon,
  Moon,
  Move,
  Home,
  Tv,
  Fan,
  Refrigerator,
  Coffee,
  Palette,
  Check,
  Settings,
  Trash2,
  Plus,
  X
} from 'lucide-react';
import { Zone } from '../types';

interface ZoneCardProps {
  zone: Zone;
  onToggleLight: (zoneId: string, lightId: string) => void;
  onSetBrightness: (zoneId: string, lightId: string, value: number) => void;
  onToggleAppliance: (zoneId: string, applianceId: string) => void;
  onMasterOff: (zoneId: string) => void;
  onSetColor: (color: string) => void;
  onAddDevice: (zoneId: string, type: 'light' | 'appliance', data: any) => void;
  onRemoveDevice: (zoneId: string, deviceId: string, type: 'light' | 'appliance') => void;
}

const COLORS = [
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#f43f5e', // Rose
  '#64748b', // Slate
];

const APPLIANCE_ICONS = [
  'Tv', 'Fan', 'Refrigerator', 'Coffee', 'Droplets', 'Zap'
];

const ZoneCard: React.FC<ZoneCardProps> = ({ 
  zone, 
  onToggleLight, 
  onSetBrightness,
  onToggleAppliance,
  onMasterOff,
  onSetColor,
  onAddDevice,
  onRemoveDevice
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Add Form State
  const [newDeviceData, setNewDeviceData] = useState({
    name: '',
    type: 'light' as 'light' | 'appliance',
    powerDraw: 10,
    isDimmable: false,
    icon: 'Zap'
  });

  // --- Icon Helpers ---
  const getZoneIcon = (iconName: string) => {
    const props = { className: "w-5 h-5", style: { color: zone.accentColor } };
    switch (iconName) {
      case 'Sofa': return <Sofa {...props} />;
      case 'ChefHat': return <ChefHat {...props} />;
      case 'BedDouble': return <BedDouble {...props} />;
      case 'Bath': return <Bath {...props} />;
      case 'Trees': return <Trees {...props} />;
      default: return <Home {...props} />;
    }
  };

  const getSensorIcon = (type: string) => {
    const props = { className: "w-3.5 h-3.5" };
    switch (type) {
      case 'temp': return <Thermometer {...props} />;
      case 'humidity': return <Droplets {...props} />;
      case 'motion': return <Move {...props} />;
      case 'lux': return <Sun {...props} />;
      case 'smoke': return <CloudFog {...props} />;
      case 'gas': return <Flame {...props} />;
      case 'leak': return <Droplets {...props} />;
      case 'co2': return <Wind {...props} />;
      case 'gate': return <DoorOpen {...props} />;
      case 'daylight': return <Moon {...props} />;
      default: return <Eye {...props} />;
    }
  };

  const getApplianceIcon = (iconName: string) => {
    const props = { className: "w-4 h-4" };
    switch (iconName) {
        case 'Tv': return <Tv {...props} />;
        case 'Fan': return <Fan {...props} />;
        case 'Refrigerator': return <Refrigerator {...props} />;
        case 'Coffee': return <Coffee {...props} />;
        case 'Droplets': return <Droplets {...props} />;
        default: return <Zap {...props} />;
    }
  }

  // --- Alert Logic ---
  const criticalSensors = zone.sensors.filter(s => s.status === 'critical');
  const hasCriticalAlert = criticalSensors.length > 0;
  
  // Dynamic Styles
  const borderStyle = hasCriticalAlert 
    ? { borderColor: '#ef4444' } 
    : { borderColor: zone.accentColor };
  
  const headerStyle = {
    backgroundColor: `${zone.accentColor}10` // 10 hex = ~6% opacity
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDevice(zone.id, newDeviceData.type, newDeviceData);
    setShowAddForm(false);
    // Reset form defaults
    setNewDeviceData({
      name: '',
      type: 'light',
      powerDraw: 10,
      isDimmable: false,
      icon: 'Zap'
    });
  };

  return (
    <div 
      className={`
        relative overflow-visible rounded-2xl border bg-slate-800/40 backdrop-blur-sm transition-all duration-300 flex flex-col
        ${hasCriticalAlert ? 'shadow-[0_0_15px_-3px_rgba(239,68,68,0.5)] animate-pulse' : 'hover:shadow-lg'}
      `}
      style={borderStyle}
    >
      {/* Alert Overlay */}
      {hasCriticalAlert && (
         <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10 flex items-center gap-1">
           <AlertOctagon className="w-3 h-3" /> CRITICAL
         </div>
      )}

      {/* Header */}
      <div 
        className="p-4 border-b border-slate-700/50 flex justify-between items-center rounded-t-2xl relative"
        style={headerStyle}
      >
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-900 rounded-lg shadow-sm" style={{ boxShadow: `0 0 10px ${zone.accentColor}20` }}>
            {getZoneIcon(zone.icon)}
          </div>
          <h3 className="font-bold text-white text-sm">{zone.name}</h3>
        </div>

        <div className="flex items-center gap-2">
           {/* Color Picker Toggle */}
           <div className="relative">
              <button 
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-1.5 rounded-md hover:bg-slate-900/50 text-slate-400 hover:text-white transition-colors"
                title="Change Theme Color"
              >
                <Palette className="w-3.5 h-3.5" />
              </button>

              {/* Color Picker Dropdown */}
              {showColorPicker && (
                <div className="absolute top-full right-0 mt-2 p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 flex gap-1.5 min-w-[150px] animate-in fade-in slide-in-from-top-2">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        onSetColor(color);
                        setShowColorPicker(false);
                      }}
                      className="w-5 h-5 rounded-full border border-slate-600 hover:scale-110 transition-transform relative flex items-center justify-center"
                      style={{ backgroundColor: color }}
                    >
                      {zone.accentColor === color && (
                        <Check className="w-3 h-3 text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              )}
           </div>

           {/* Settings / Edit Mode Toggle */}
           <button 
             onClick={() => setIsEditing(!isEditing)}
             className={`p-1.5 rounded-md transition-colors ${isEditing ? 'bg-indigo-500 text-white' : 'hover:bg-slate-900/50 text-slate-400 hover:text-white'}`}
             title="Manage Devices"
           >
             <Settings className="w-3.5 h-3.5" />
           </button>

          <button 
            onClick={() => onMasterOff(zone.id)}
            className="text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors bg-slate-900 px-2 py-1 rounded border border-slate-700 hover:border-slate-500"
          >
            All Off
          </button>
        </div>
      </div>

      {/* Section A: Sensors */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-none border-b border-slate-700/50 bg-slate-900/20">
        {zone.sensors.map(sensor => (
          <div 
            key={sensor.id}
            className={`
              flex items-center gap-2 px-2 py-1 rounded-md border text-xs whitespace-nowrap
              ${sensor.status === 'critical' ? 'bg-red-500/20 border-red-500/50 text-red-300' : 
                sensor.status === 'warning' ? 'bg-orange-500/20 border-orange-500/50 text-orange-300' : 
                'bg-slate-800 border-slate-700 text-slate-400'}
            `}
          >
            {getSensorIcon(sensor.type)}
            <span className="font-medium">
              {sensor.value}{sensor.unit && <span className="text-[10px] ml-0.5 opacity-70">{sensor.unit}</span>}
            </span>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-4 space-y-4 flex-1 relative">
          
          {/* Add Device Form Overlay */}
          {showAddForm && (
            <div className="absolute inset-0 z-20 bg-slate-900/95 p-4 rounded-b-2xl flex flex-col animate-in fade-in zoom-in-95">
               <div className="flex justify-between items-center mb-3">
                 <h4 className="text-sm font-bold text-white">Add New Device</h4>
                 <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
               </div>
               
               <form onSubmit={handleSubmitAdd} className="space-y-3 flex-1 overflow-y-auto">
                 {/* Type Selection */}
                 <div className="flex bg-slate-800 rounded-lg p-1">
                   <button 
                    type="button"
                    className={`flex-1 py-1 text-xs font-bold rounded-md transition-colors ${newDeviceData.type === 'light' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                    onClick={() => setNewDeviceData({...newDeviceData, type: 'light'})}
                   >
                     Light
                   </button>
                   <button 
                    type="button"
                    className={`flex-1 py-1 text-xs font-bold rounded-md transition-colors ${newDeviceData.type === 'appliance' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                    onClick={() => setNewDeviceData({...newDeviceData, type: 'appliance'})}
                   >
                     Appliance
                   </button>
                 </div>

                 {/* Name */}
                 <div>
                   <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Name</label>
                   <input 
                     type="text" 
                     required
                     className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                     value={newDeviceData.name}
                     onChange={(e) => setNewDeviceData({...newDeviceData, name: e.target.value})}
                   />
                 </div>

                 {/* Power */}
                 <div>
                   <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Power (Watts)</label>
                   <input 
                     type="number" 
                     required
                     min="1"
                     className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                     value={newDeviceData.powerDraw}
                     onChange={(e) => setNewDeviceData({...newDeviceData, powerDraw: parseInt(e.target.value) || 0})}
                   />
                 </div>

                 {/* Light Specifics */}
                 {newDeviceData.type === 'light' && (
                    <div className="flex items-center gap-2">
                       <input 
                         type="checkbox"
                         id="dimmable"
                         checked={newDeviceData.isDimmable}
                         onChange={(e) => setNewDeviceData({...newDeviceData, isDimmable: e.target.checked})}
                         className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                       />
                       <label htmlFor="dimmable" className="text-xs text-slate-300">Is Dimmable?</label>
                    </div>
                 )}

                 {/* Appliance Specifics */}
                 {newDeviceData.type === 'appliance' && (
                    <div>
                        <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Icon</label>
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                           {APPLIANCE_ICONS.map(icon => (
                              <button
                                key={icon}
                                type="button"
                                onClick={() => setNewDeviceData({...newDeviceData, icon})}
                                className={`p-2 rounded-lg border ${newDeviceData.icon === icon ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                              >
                                {getApplianceIcon(icon)}
                              </button>
                           ))}
                        </div>
                    </div>
                 )}

                 <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg text-sm mt-2 transition-colors">
                   Add Device
                 </button>
               </form>
            </div>
          )}

          {/* Section B: Lighting */}
          {zone.lights.length > 0 && (
            <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Lighting</p>
                {zone.lights.map(light => (
                <div key={light.id} className="flex flex-col gap-2 group/item">
                    {/* Row 1: Name & Toggle */}
                    <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {isEditing && (
                           <button 
                             onClick={() => onRemoveDevice(zone.id, light.id, 'light')}
                             className="text-red-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10 transition-colors"
                           >
                              <Trash2 className="w-3 h-3" />
                           </button>
                        )}
                        <div 
                          className={`w-2 h-2 rounded-full transition-colors duration-300 ${light.isOn ? 'shadow-[0_0_8px_currentColor]' : 'bg-slate-700'}`}
                          style={{ backgroundColor: light.isOn ? zone.accentColor : undefined, color: zone.accentColor }} // Use dynamic color for dot
                        ></div>
                        <span className={`text-sm font-medium ${light.isOn ? 'text-slate-200' : 'text-slate-500'}`}>{light.name}</span>
                    </div>
                    
                    <button 
                        onClick={() => onToggleLight(zone.id, light.id)}
                        className={`
                        relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                        ${light.isOn ? '' : 'bg-slate-700'}
                        `}
                        style={{ backgroundColor: light.isOn ? zone.accentColor : undefined }} // Use dynamic color for switch
                    >
                        <span
                        className={`
                            pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                            ${light.isOn ? 'translate-x-4' : 'translate-x-0'}
                        `}
                        />
                    </button>
                    </div>

                    {/* Row 2: Slider (Only if dimmable and ON) */}
                    {light.isDimmable && (
                    <div className={`transition-all duration-300 overflow-hidden ${light.isOn ? 'max-h-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="flex items-center gap-2 pl-4">
                        <Sun className="w-3 h-3 text-slate-500" />
                        <input 
                            type="range" 
                            min="1" 
                            max="100" 
                            value={light.brightness}
                            onChange={(e) => onSetBrightness(zone.id, light.id, parseInt(e.target.value))}
                            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            style={{ accentColor: zone.accentColor }} // Native accent-color property
                        />
                        </div>
                    </div>
                    )}
                </div>
                ))}
            </div>
          )}
          
          {/* Section C: Appliances */}
          {zone.appliances.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-slate-700/50">
                <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Devices</p>
                {zone.appliances.map(app => (
                    <div key={app.id} className="flex justify-between items-center group/item">
                         <div className="flex items-center gap-2">
                             {isEditing && (
                                <button 
                                  onClick={() => onRemoveDevice(zone.id, app.id, 'appliance')}
                                  className="text-red-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10 transition-colors"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                             )}
                            <div className={`p-1.5 rounded-md ${app.isOn ? 'bg-opacity-20' : 'bg-slate-800 text-slate-500'}`} style={app.isOn ? { backgroundColor: `${zone.accentColor}30`, color: zone.accentColor } : {}}>
                                {getApplianceIcon(app.icon)}
                            </div>
                            <div>
                                <span className={`text-sm font-medium block leading-none ${app.isOn ? 'text-slate-200' : 'text-slate-500'}`}>{app.name}</span>
                                <span className="text-[10px] text-slate-500 font-mono">{app.powerDraw}W</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => onToggleAppliance(zone.id, app.id)}
                            className={`
                            relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                            ${app.isOn ? '' : 'bg-slate-700'}
                            `}
                            style={{ backgroundColor: app.isOn ? zone.accentColor : undefined }}
                        >
                            <span
                            className={`
                                pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                                ${app.isOn ? 'translate-x-4' : 'translate-x-0'}
                            `}
                            />
                        </button>
                    </div>
                ))}
              </div>
          )}

          {/* Add Button (Only in Editing Mode) */}
          {isEditing && (
             <div className="pt-4 mt-2 border-t border-slate-700/50 flex justify-center">
               <button 
                 onClick={() => setShowAddForm(true)}
                 className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-full transition-colors border border-indigo-500/30"
               >
                 <Plus className="w-3 h-3" /> Add Device
               </button>
             </div>
          )}

      </div>
    </div>
  );
};

export default ZoneCard;
